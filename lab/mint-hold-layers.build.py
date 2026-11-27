"""The mint hold's multiplane: frame 1111 cut into the layers of its own drawing.

Run with a Python containing numpy and opencv. Writes two files beside this one:
- mint-hold-plate.jpg: the terrain with Athena's hair, the fighters and the column
  removed (a smooth push-pull fill from the surrounding painting, no invented detail).
- mint-hold-masks.png: R Athena's hair, G the fighters, B the column's light, A the
  holes the plate fills. The page takes every colour from the film's own frame; only
  the holes use the plate.

The shot (frames 1096-1126) is a locked camera. The hair is one cel throughout while
the background is re-graded from teal to beige, so the hair is keyed on frame 1097
(teal behind it) and carried to frame 1111 unchanged. Fighters are hand traced.
"""
import hashlib, json, pathlib, subprocess, time
import cv2
import numpy as np

cv2.setNumThreads(1)
HERE = pathlib.Path(__file__).resolve().parent
FILM = HERE.parent / 'app/saint-seiya.mp4'
W, H = 960, 540
HOLD, KEY = 1111, 1097
X0, X1, Y0, Y1 = 82, 878, 3, 537  # the picture's active area; the rest is pillarbox


def frame(n):
    raw = subprocess.check_output(['ffmpeg', '-hide_banner', '-loglevel', 'error', '-threads', '1', '-i', str(FILM),
        '-vf', f'select=eq(n\\,{n})', '-fps_mode', 'passthrough', '-frames:v', '1', '-f', 'rawvideo', '-pix_fmt', 'bgr24', '-'])
    return np.frombuffer(raw, np.uint8).reshape(H, W, 3)


def components(mask, keep):
    n, labels, stats, _ = cv2.connectedComponentsWithStats(mask, connectivity=8)
    out = np.zeros_like(mask)
    for i in range(1, n):
        if keep(stats[i]): out[labels == i] = 255
    return out


def pushpull(c, w):
    """Fill w == 0 from w == 1 through an image pyramid: smooth, no copied patches."""
    if min(c.shape[:2]) <= 3:
        m = (c * w[..., None]).sum((0, 1)) / max(float(w.sum()), 1e-6)
        return np.broadcast_to(m, c.shape).astype(np.float32)
    c2, w2 = cv2.pyrDown(c * w[..., None]), cv2.pyrDown(w)
    f2 = pushpull(c2 / np.maximum(w2, 1e-6)[..., None], np.minimum(w2 * 3.0, 1.0))
    up = cv2.pyrUp(f2, dstsize=(c.shape[1], c.shape[0]))
    return c * w[..., None] + up * (1 - w[..., None])


start = time.monotonic()
hold, key = frame(HOLD), frame(KEY)
yy, xx = np.mgrid[:H, :W]
content = (xx >= X0) & (xx < X1) & (yy >= Y0) & (yy < Y1)

# The fighters: two figures beside the column, traced on frame 1111's source pixels.
fighters = np.zeros((H, W), np.uint8)
cv2.fillPoly(fighters, [
    np.array([(204, 186), (222, 174), (240, 180), (244, 230), (246, 300), (238, 334), (214, 334), (204, 300), (198, 240)]),
    np.array([(284, 176), (306, 168), (322, 182), (330, 230), (348, 300), (352, 344), (326, 350), (300, 350), (286, 330), (280, 250)]),
], 255)
# The column: its core and glow, down to where the strands cross it.
column = (((xx >= 204) & (xx <= 320) & (yy < 400)) * 255).astype(np.uint8)

# Athena's hair, keyed where the background is teal, then held for frame 1111.
hsv = cv2.cvtColor(key, cv2.COLOR_BGR2HSV).astype(int)
hue, sat, val = hsv[..., 0], hsv[..., 1], hsv[..., 2]
hold_val = cv2.cvtColor(hold, cv2.COLOR_BGR2HSV)[..., 2].astype(int)
zone = ~((xx < 600) & (yy < 360 - (xx - 82) * (220 / 560)))  # upper left is terrain only
colour = ((((hue <= 42) | (hue >= 170)) & (sat > 25) & (val > 70)) | ((hue >= 106) & (hue <= 150) & (val > 25))) & content & zone
inner = (xx >= X0 + 4) & (xx < X1 - 4) & (yy >= Y0 + 4) & (yy < Y1 - 4)  # the picture's dark edge is not ink
ink = (val <= 55) & (hold_val <= 95) & inner & zone & (yy > 250)  # dark in both frames: the same outline
n, labels, stats, _ = cv2.connectedComponentsWithStats((colour | ink).astype(np.uint8), connectivity=8)
keep = np.zeros(n, bool)
keep[np.unique(labels[colour])] = True
for i in range(1, n):  # long thin ink strokes are strands even when no colour touches them
    w, h = stats[i, cv2.CC_STAT_WIDTH], stats[i, cv2.CC_STAT_HEIGHT]
    if max(w, h) > 60 and stats[i, cv2.CC_STAT_AREA] < 0.25 * w * h: keep[i] = True
keep[0] = False
hair = (keep[labels] * 255).astype(np.uint8)
hair[fighters > 0] = 0
hair = components(hair, lambda s: s[cv2.CC_STAT_AREA] >= 60)
hair = 255 - components(255 - hair, lambda s: s[cv2.CC_STAT_AREA] >= 90)  # close codec pinholes

# The plate: the terrain where nothing covers it; holes filled from around them.
hole = cv2.dilate(((hair > 0) | (fighters > 0) | (column > 0)).astype(np.uint8) * 255,
                  cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (13, 13)))
# Only uncovered terrain inside the picture is known; the fill also carries it past the
# picture's edges, where the camera's parallax can look.
known = ((hole == 0) & content & (xx >= X0 + 3) & (xx < X1 - 3) & (yy >= Y0 + 3) & (yy < Y1 - 3)).astype(np.float32)
plate = np.clip(pushpull(hold.astype(np.float32), known), 0, 255).astype(np.uint8)

soft = lambda m, s: cv2.GaussianBlur(m, (0, 0), s)
hair_a = soft(cv2.dilate(hair, np.ones((3, 3), np.uint8)), 1.3)
# The fighters and the column keep only what differs from the rock behind them (a difference matte against the
# plate inside their traced regions), so their cards carry the figures and the light, not a patch of rock.
lab = lambda img: cv2.cvtColor(img, cv2.COLOR_BGR2LAB).astype(np.float32)
differs = np.sqrt(((lab(hold) - lab(plate)) ** 2).sum(-1))
brighter = hold.astype(np.float32).mean(-1) - plate.astype(np.float32).mean(-1)
fight_a = (soft(fighters, 2.0).astype(np.float32) * np.clip((soft(differs, 1.0) - 7) / 22, 0, 1)).astype(np.uint8)
col_a = (soft(column, 3.0).astype(np.float32) * np.clip((soft(brighter, 1.5) - 8) / 40, 0, 1)).astype(np.uint8)
col_a = np.where(fighters > 0, 0, col_a).astype(np.uint8)
hole_a = soft(hole, 2.0)
# Where her hair lifted off, the rock lies in its shadow; the column and the fighters cast none.
SHADOW = 0.58
shade = (soft(cv2.dilate(hair, np.ones((13, 13), np.uint8)), 4.0).astype(np.float32) / 255
         * (1 - soft(((fighters > 0) | (column > 0)).astype(np.uint8) * 255, 6.0).astype(np.float32) / 255))
plate = np.clip(plate.astype(np.float32) * (1 - (1 - SHADOW) * shade[..., None]), 0, 255).astype(np.uint8)
masks = np.stack([col_a, fight_a, hair_a, hole_a], -1)  # BGRA in OpenCV: B column, G fighters, R hair, A holes

# The page's composite at the reference camera must give back the frame itself.
a = lambda m: (m.astype(np.float32) / 255)[..., None]
f, p = hold.astype(np.float32), plate.astype(np.float32)
comp = f * (1 - a(hole_a)) + p * a(hole_a)
comp += np.clip(f - p, 0, None) * a(col_a) * a(hole_a)
comp = comp * (1 - a(fight_a)) + f * a(fight_a)
comp = comp * (1 - a(hair_a)) + f * a(hair_a)
err = np.abs(comp - f)[Y0:Y1, X0:X1]

cv2.imwrite(str(HERE / 'mint-hold-plate.jpg'), plate, [cv2.IMWRITE_JPEG_QUALITY, 90])
cv2.imwrite(str(HERE / 'mint-hold-masks.png'), masks, [cv2.IMWRITE_PNG_COMPRESSION, 9])
meta = {'frame': HOLD, 'key': KEY, 'width': W, 'height': H, 'content': [X0, Y0, X1 - X0, Y1 - Y0],
        'channels': {'r': 'athena-hair', 'g': 'fighters', 'b': 'column', 'a': 'holes'},
        'sourceSha256': hashlib.sha256(FILM.read_bytes()).hexdigest(),
        'method': 'hair keyed on the same cel over teal (1097); fighters hand traced; plate push-pull filled; colours from the film',
        'hairCoverage': round(float((hair > 0)[Y0:Y1, X0:X1].mean()), 4),
        'referenceError': {'mean': round(float(err.mean()), 3), 'p99': round(float(np.percentile(err, 99)), 2)}}
(HERE / 'mint-hold-layers.json').write_text(json.dumps(meta, indent=2) + '\n')
print(json.dumps({**meta['referenceError'], 'hair': meta['hairCoverage'], 'seconds': round(time.monotonic() - start, 2)}))

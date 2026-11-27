# A seat's tool, outside the repo. Her Oct 27 poses hold an egg; her hands are drawn round it and the egg is drawn in front of them. Find that egg as
# an ellipse (her saturated gold in, her skin, hair, dress and black line out), then stand the dodecahedron egg the image model drew (egg-d, keyed off
# its magenta ground, with its own outline) over it, turned to the egg's axis and just large enough to cover it whole. Nothing else of her changes.
# Usage: fit3.py <egg-d.png> <pose-in.png> <pose-out.png> [--grow 1.05] [--glow 0.5] [--ellipse cx,cy,a,b,deg] [--noglow]
# HER HANDS WIN: the new egg is painted where the old egg was, and over air, dress and hair inside its outline; never over her skin or her hands' black
# line, so a finger that lay over the old egg lies over the new one.
import sys, math, json
import numpy as np
from collections import deque
from PIL import Image, ImageFilter, ImageDraw

def largest(mask):
    H, W = mask.shape; seen = np.zeros_like(mask, bool); best = []
    for y0 in range(0, H, 3):
        for x0 in range(0, W, 3):
            if mask[y0, x0] and not seen[y0, x0]:
                q = deque([(x0, y0)]); seen[y0, x0] = True; comp = [(x0, y0)]
                while q:
                    x, y = q.popleft()
                    for nx, ny in ((x + 1, y), (x - 1, y), (x, y + 1), (x, y - 1)):
                        if 0 <= nx < W and 0 <= ny < H and mask[ny, nx] and not seen[ny, nx]: seen[ny, nx] = True; q.append((nx, ny)); comp.append((nx, ny))
                if len(comp) > len(best): best = comp
    out = np.zeros_like(mask, bool)
    for x, y in best: out[y, x] = True
    return out

def key_egg(path):
    """egg-d off its flat magenta ground: the ground is what a flood from the picture's edge reaches through flat magenta only, so the hot pink of its
    seams, inside its dark outline, stays the egg's."""
    im = np.array(Image.open(path).convert('RGB')).astype(int); r, g, b = im[..., 0], im[..., 1], im[..., 2]; H, W = r.shape
    flat = (r > 215) & (b > 215) & (g < 70)
    out = np.zeros_like(flat, bool); q = deque()
    for x in range(W):
        for y in (0, H - 1):
            if flat[y, x] and not out[y, x]: out[y, x] = True; q.append((x, y))
    for y in range(H):
        for x in (0, W - 1):
            if flat[y, x] and not out[y, x]: out[y, x] = True; q.append((x, y))
    while q:
        x, y = q.popleft()
        for nx, ny in ((x + 1, y), (x - 1, y), (x, y + 1), (x, y - 1)):
            if 0 <= nx < W and 0 <= ny < H and flat[ny, nx] and not out[ny, nx]: out[ny, nx] = True; q.append((nx, ny))
    body = largest(~out)
    a = Image.fromarray((body * 255).astype('uint8')).filter(ImageFilter.MinFilter(5))                 # the magenta fringe off its rim
    res = Image.fromarray(np.dstack([im, np.array(a).astype(int)]).astype('uint8'))
    ys, xs = np.nonzero(np.array(a) > 128); return res.crop((xs.min(), ys.min(), xs.max() + 1, ys.max() + 1))

def classes(pose):
    a = np.array(pose).astype(float) / 255; r, g, b, al = a[..., 0], a[..., 1], a[..., 2], a[..., 3]
    mx = a[..., :3].max(axis=2); mn = a[..., :3].min(axis=2); v = mx; d = np.maximum(mx - mn, 1e-6); s = np.where(mx > 0, d / np.maximum(mx, 1e-6), 0)
    hue = np.where(mx == r, ((g - b) / d) % 6, np.where(mx == g, (b - r) / d + 2, (r - g) / d + 4)) * 60
    seen = al > .8
    gold = seen & (hue >= 28) & (hue <= 62) & (s > .58) & (v > .40)                                    # her saturated gold: the shell's plates
    seam = seen & (hue >= 14) & (hue <= 50) & (s > .5) & (v <= .40) & (v > .12)                        # its dark brown seams and outline
    lit = seen & (hue >= 36) & (hue <= 68) & (v > .93) & (s > .12)                                     # its lit seams and gloss
    hers = ~(gold | seam | lit)                                                                        # her skin, hair, dress, black line, the air
    return gold, seam, lit, hers

def inside(shape, cx, cy, a, b, th):
    H, W = shape; yy, xx = np.mgrid[0:H, 0:W]; c, s_ = math.cos(th), math.sin(th)
    u = (xx - cx) * c + (yy - cy) * s_; w = -(xx - cx) * s_ + (yy - cy) * c                            # w along the long axis
    return (u / b) ** 2 + (w / a) ** 2 <= 1

def find(pose):
    gold, seam, lit, hers = classes(pose); core = largest(np.array(Image.fromarray((gold * 255).astype('uint8')).filter(ImageFilter.MaxFilter(5))) > 127) & gold
    ys, xs = np.nonzero(core); P = np.stack([xs - xs.mean(), ys - ys.mean()], 1).astype(float); w, V = np.linalg.eigh(np.cov(P.T)); m = V[:, 1]
    th = math.atan2(-m[0], m[1]); p = [xs.mean(), ys.mean(), 2 * math.sqrt(w[1]), 2 * math.sqrt(w[0]), th]   # th: the long axis off the picture's down
    near = np.array(Image.fromarray((core * 255).astype('uint8')).filter(ImageFilter.MaxFilter(41))) > 127
    good = (gold & near).astype(float) + 0.4 * ((seam | lit) & near); bad = hers.astype(float) * 1.6
    def score(q): i = inside(gold.shape, *q); return (good * i).sum() - (bad * i).sum()
    best = score(p); step = [6, 6, 6, 6, 0.2]
    for _ in range(60):
        moved = False
        for k in range(5):
            for sgn in (1, -1):
                q = list(p); q[k] += sgn * step[k]
                if q[2] < q[3]: continue
                sc = score(q)
                if sc > best: best, p, moved = sc, q, True
        if not moved:
            step = [x / 2 for x in step]
            if step[0] < 0.4: break
    return p, core

def hsv_of(A_):
    mx = A_[..., :3].max(axis=2); mn = A_[..., :3].min(axis=2); dd = np.maximum(mx - mn, 1e-6)
    hue = np.where(mx == A_[..., 0], ((A_[..., 1] - A_[..., 2]) / dd) % 6, np.where(mx == A_[..., 1], (A_[..., 2] - A_[..., 0]) / dd + 2, (A_[..., 0] - A_[..., 1]) / dd + 4)) * 60
    return hue, np.where(mx > 0, dd / np.maximum(mx, 1e-6), 0), mx
def grow_mask(m, n): return np.array(Image.fromarray((m * 255).astype('uint8')).filter(ImageFilter.MaxFilter(2 * n + 1))) > 0
def main():
    args = sys.argv[1:]; opt = {'grow': 1.05, 'glow': 0.5, 'ellipse': None, 'cut': None, 'seeds': None}; noglow = '--noglow' in args; flood = '--flood' in args; shellmode = '--shell' in args
    for f in ('--noglow', '--flood', '--shell'):
        if f in args: args.remove(f)
    for k_ in list(opt):
        if '--' + k_ in args: i = args.index('--' + k_); opt[k_] = args[i + 1]; del args[i:i + 2]
    grow = float(opt['grow']); glow = float(opt['glow']); eggp, src, dst = args[:3]
    egg = key_egg(eggp); pose = Image.open(src).convert('RGBA'); W, H = pose.size
    if opt['ellipse']: cx, cy, a, b, deg = [float(v) for v in opt['ellipse'].split(',')]; th = math.radians(deg); ang = deg
    else:
        (cx, cy, a, b, th), core = find(pose); ang = (math.degrees(th) + 90) % 180 - 90                # its lit side stays up: never stood on its head
        if abs(a - b) < 0.12 * a: ang = max(-12, min(12, ang))
    SS = 4; EW, EH = egg.size
    tall = 2 * a * grow; wide = min(max(tall * EW / EH, 2 * b * grow * 0.99), tall * EW / EH * 1.08)
    e = egg.resize((max(1, round(wide * SS)), max(1, round(tall * SS))), Image.LANCZOS).rotate(-ang, Image.BICUBIC, expand=True)
    layer = Image.new('RGBA', (W * SS, H * SS), (0, 0, 0, 0)); layer.paste(e, (round(cx * SS - e.size[0] / 2), round(cy * SS - e.size[1] / 2)), e)
    if opt['cut']:   # the egg alone, whole, at twice her pose's pixels: what falls from her hands, lying exactly over the egg she holds
        two = layer.resize((W * 2, H * 2), Image.LANCZOS); ys, xs = np.nonzero(np.array(two)[..., 3] > 8); x0, y0 = xs.min() // 2 * 2, ys.min() // 2 * 2; x1, y1 = -(-(xs.max() + 1) // 2) * 2, -(-(ys.max() + 1) // 2) * 2
        two.crop((x0, y0, x1, y1)).save(opt['cut'], optimize=True); print(json.dumps({'cut_box_in_pose_px': [int(x0 // 2), int(y0 // 2), int((x1 - x0) // 2), int((y1 - y0) // 2)], 'asset_px': [int(x1 - x0), int(y1 - y0)]}))
    layer = layer.resize((W, H), Image.LANCZOS); L = np.array(layer); al = L[..., 3] > 128
    O = np.array(pose); A_ = O.astype(float) / 255; hue, sat, mx = hsv_of(A_); seen = A_[..., 3] > .5
    eggish = seen & (hue >= 12) & (hue <= 70) & (sat > .47) & (mx > .10)                              # the old egg, its seams, its outline, its glow
    if not noglow: eggish |= seen & (hue >= 34) & (hue <= 72) & (sat > .18) & (mx > .5)              # and its pale yellow glow, past her skin's hue
    zone = inside((H, W), cx, cy, a + 16, b + 16, th); old = eggish & zone
    skin = seen & ~eggish & (hue >= 6) & (hue <= 36) & (sat > .10) & (sat <= .47) & (mx > .55)
    black = seen & (mx < .16)
    if flood:   # a pose whose glow lights her hands: her hands' black line bounds them, so the egg is what its centre reaches without crossing black
        ok = ~black & inside((H, W), cx, cy, a + 8, b + 8, th); shell = np.zeros_like(ok); q = deque([(int(cy), int(cx))]); shell[int(cy), int(cx)] = True
        while q:
            y, x = q.popleft()
            for ny, nx in ((y, x - 1), (y, x + 1), (y - 1, x), (y + 1, x)):
                if 0 <= ny < H and 0 <= nx < W and ok[ny, nx] and not shell[ny, nx]: shell[ny, nx] = True; q.append((ny, nx))
        g_, s_2, l_, h_ = classes(pose); paint = al & shell; old = (g_ | s_2) & shell; hand = ~shell; skin = hand & ~black
    elif opt['seeds']:   # her hands named by a point inside each: a hand is what that point reaches without crossing her black line or the old thing's gold
        g_, s_2, l_, h_ = classes(pose); stop = black | g_ | s_2 | (seen & (hue >= 42) & (hue <= 72) & (mx > .9) & (sat > .26)) | (seen & (mx > .95) & (sat < .15)) | ~inside((H, W), cx, cy, a + 40, b + 40, th); hand = np.zeros_like(stop); q = deque()
        for xy in opt['seeds'].split(';'):
            x, y = [int(v) for v in xy.split(',')]; hand[y, x] = True; q.append((y, x)); print('seed', xy, 'black' if black[y, x] else 'ok', file=sys.stderr)
        while q:
            y, x = q.popleft()
            for ny, nx in ((y, x - 1), (y, x + 1), (y - 1, x), (y + 1, x)):
                if 0 <= ny < H and 0 <= nx < W and not stop[ny, nx] and not hand[ny, nx]: hand[ny, nx] = True; q.append((ny, nx))
        hand = grow_mask(~grow_mask(~hand, 3), 3) & hand                                               # a hand is broad: the old thing's thin pale seams, reached through a gap, are not hers
        skin = hand.copy(); hand = hand | (black & grow_mask(hand, 2)); paint = al & ~hand
        old = (g_ | s_2 | (seen & (hue >= 12) & (hue <= 72) & (sat > .47) & (mx > .10))) & inside((H, W), cx, cy, a + 22, b + 22, th) & ~hand
    elif shellmode:   # the egg stands only where the old shell itself was: its saturated gold and brown seams, closed over, its gloss filled in
        g_, s_2, l_, h_ = classes(pose); shell = (g_ | s_2) & inside((H, W), cx, cy, a + 6, b + 6, th); shell = ~grow_mask(~grow_mask(shell, 3), 3)
        hole = ~shell; seen_ = np.zeros_like(hole); q = deque([(0, 0)]); seen_[0, 0] = True
        while q:
            y, x = q.popleft()
            for ny, nx in ((y, x - 1), (y, x + 1), (y - 1, x), (y + 1, x)):
                if 0 <= ny < H and 0 <= nx < W and hole[ny, nx] and not seen_[ny, nx]: seen_[ny, nx] = True; q.append((ny, nx))
        shell = ~seen_; paint = al & shell; old = shell; hand = ~shell; skin = hand & ~black
    else:
        hand = (skin | (black & grow_mask(skin, 2))) & ~old                                            # her skin and the black line that bounds it
        # a hand comes in from outside the egg: skin that is an island inside the old egg is the egg's gloss, not hers
        far = ~inside((H, W), cx, cy, a + 4, b + 4, th); reach = hand & far; q = deque(zip(*np.nonzero(reach & grow_mask(~far, 2))))
        while q:
            y, x = q.popleft()
            for ny, nx in ((y, x - 1), (y, x + 1), (y - 1, x), (y + 1, x)):
                if 0 <= ny < H and 0 <= nx < W and hand[ny, nx] and not reach[ny, nx]: reach[ny, nx] = True; q.append((ny, nx))
        hand = reach; small = hand & ~far; opened = grow_mask(~grow_mask(~small, 1), 1) & small; hand = (hand & far) | opened
        paint = al & ~hand
    P = O.copy(); todo = old & ~paint; done = ~old; left = int(todo.sum())
    for _ in range(80):
        ys, xs = np.nonzero(todo)
        if not len(ys): break
        nxt = []
        for y, x in zip(ys, xs):
            for ny, nx in ((y, x - 1), (y, x + 1), (y - 1, x), (y + 1, x)):
                if 0 <= ny < H and 0 <= nx < W and done[ny, nx] and P[ny, nx, 3] > 0 and (hand[ny, nx] or not paint[ny, nx]) and P[ny, nx, :3].max() > 40: nxt.append((y, x, ny, nx)); break
        if not nxt: break
        for y, x, ny, nx in nxt: P[y, x] = P[ny, nx]
        for y, x, ny, nx in nxt: done[y, x] = True; todo[y, x] = False
    out = Image.fromarray(P)
    sil = Image.fromarray((paint * 255).astype('uint8')); halo = np.array(sil.filter(ImageFilter.MaxFilter(9)).filter(ImageFilter.GaussianBlur(2.2))).astype(float) / 255
    halo = np.where(paint, 0, halo) * glow * (P[..., 3] > 0) * ~black
    G = np.zeros((H, W, 4), 'uint8'); G[..., 0] = 255; G[..., 1] = 208; G[..., 2] = 84; G[..., 3] = (halo * 255).astype('uint8'); out.alpha_composite(Image.fromarray(G))
    L[~paint, 3] = 0; out.alpha_composite(Image.fromarray(L))
    # where the egg now meets her skin with no line between them, its own dark line
    R_ = np.array(out); edge = paint & grow_mask(skin & ~paint, 1) & al; R_[edge, :3] = (58, 30, 14); out = Image.fromarray(R_); out.save(dst, optimize=True)
    print(json.dumps({'pose': src.split('/')[-1], 'centre': [round(cx, 1), round(cy, 1)], 'half': [round(a, 1), round(b, 1)], 'turn_deg': round(ang, 1), 'egg_px': [round(wide, 1), round(tall, 1)],
                      'old_egg_px_refilled': left, 'egg_px_under_her_hands': int((al & hand).sum())}))
main()

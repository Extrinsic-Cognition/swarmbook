"""Reproducible source mattes, no generated pixels or runtime CV.

Run with a Python containing numpy/opencv. The two locked-camera shots are
partitioned at EVERY source frame. R=Athena/hair, G=fighters, B=terrain.
These are assisted colour/region mattes, not recovered hidden geometry.
"""
import hashlib, json, pathlib, subprocess, time
import cv2
import numpy as np

cv2.setNumThreads(1)
HERE = pathlib.Path(__file__).resolve().parent
FILM = HERE.parent / 'app/saint-seiya.mp4'
W, H, COLS = 320, 180, 16
SPANS = [(886, 1006), (1096, 1127)]

def frames(a, b):
    raw = subprocess.check_output(['ffmpeg', '-hide_banner', '-loglevel', 'error', '-threads', '1',
        '-i', str(FILM), '-vf', f'select=between(n\\,{a}\\,{b-1}),scale={W}:{H}',
        '-fps_mode', 'passthrough', '-threads', '1', '-f', 'rawvideo', '-pix_fmt', 'bgr24', '-'])
    return np.frombuffer(raw, np.uint8).reshape(-1, H, W, 3)

def matte(bgr, returning):
    hsv = cv2.cvtColor(bgr, cv2.COLOR_BGR2HSV)
    hue, sat, val = [hsv[:,:,i] for i in range(3)]
    yy, xx = np.mgrid[:H,:W]
    # The foreground's blue/gold under the column is a different colour model
    # from its lavender in the first shot. Never interpolate across the closeup.
    if returning:
        hair = (((hue > 105) & (hue < 150) & (sat > 30)) |
                ((hue > 15) & (hue < 39) & (sat > 35) & (val > 130)))
        roi = (xx > 210) | ((yy > 129 - .16*xx) & (xx > 29))
        # The column crosses the hair in projection but is not a strand.
        gold = ((hue > 15) & (hue < 39) & (sat > 35) & (val > 130)).astype(np.uint8)
        beam = cv2.morphologyEx(gold, cv2.MORPH_OPEN, np.ones((15,1),np.uint8)) > 0
        hair &= ~(beam & (xx < 150))
    else:
        hair = ((hue > 125) & (hue < 175) & (sat > 23)) | ((hue < 35) & (val > 155) & (xx > 198))
        roi = (xx > 195) | ((yy > 85) & (xx > 35))
    hair = (hair & roi).astype(np.uint8)*255
    # Reject detached colour speckles, and repair only tiny enclosed codec
    # holes. The open spaces between long strands remain transparent.
    count, labels, stats, _ = cv2.connectedComponentsWithStats(hair)
    for label in range(1,count):
        if stats[label,cv2.CC_STAT_AREA] < 9:
            hair[labels == label] = 0
    count, labels, stats, _ = cv2.connectedComponentsWithStats(255-hair)
    for label in range(1,count):
        if stats[label,cv2.CC_STAT_AREA] <= 16:
            hair[labels == label] = 255
    # Include the ink boundary around the measured coloured strands, while
    # preserving the gaps between them (no convex hull / filled hair curtain).
    near = cv2.dilate(hair, np.ones((3,3),np.uint8)) > 0
    hair[near & (val < 88) & roi] = 255
    hair = cv2.GaussianBlur(hair,(3,3),0.45)
    # Hand traced envelope of the two distant figures at 29.6 and 36.9 seconds.
    p = [(269,240),(274,217),(285,207),(298,196),(300,179),(310,181),(315,167),(322,180),
         (340,179),(343,201),(349,229),(356,269),(376,326),(360,338),(332,338),(323,353),
         (312,338),(300,339),(290,322),(280,333),(265,302),(263,272)]
    if returning:
        p = [(x-49,y+4) for x,y in p]
    fight = np.zeros((H,W),np.uint8)
    cv2.fillPoly(fight,[np.round(np.array(p)/3).astype(np.int32)],255)
    fight = cv2.GaussianBlur(fight,(3,3),0.45)
    fight = np.minimum(fight,255-hair)
    terrain = 255-hair-fight
    return np.stack([hair,fight,terrain],axis=-1)

start = time.monotonic()
tiles = []
spans = []
for a,b in SPANS:
    spans.append({'first':a,'end':b,'offset':len(tiles)})
    tiles.extend(matte(frame,a>1000) for frame in frames(a,b))
partition_error = max(int(np.abs(tile.astype(int).sum(2)-255).max()) for tile in tiles)
assert partition_error == 0, 'Every source pixel must belong to the three-layer partition'
rows = (len(tiles)+COLS-1)//COLS
atlas = np.zeros((H*rows,W*COLS,3),np.uint8)
for i,tile in enumerate(tiles):
    atlas[(i//COLS)*H:(i//COLS+1)*H,(i%COLS)*W:(i%COLS+1)*W] = tile
out = HERE/'athena-layer-mattes.png'
cv2.imwrite(str(out),cv2.cvtColor(atlas,cv2.COLOR_RGB2BGR),[cv2.IMWRITE_PNG_COMPRESSION,9])
meta = {'width':W,'height':H,'columns':COLS,'rows':rows,'frames':len(tiles),'fps':[30000,1001],
        'spans':spans,'channels':['athena-hair','fighters','terrain'],'sourceSha256':hashlib.sha256(FILM.read_bytes()).hexdigest(),
        'method':'source colour and hand traced fighter regions; no inpainted or hidden surfaces',
        'partitionError':partition_error}
(HERE/'athena-layer-mattes.json').write_text(json.dumps(meta,indent=2)+'\n')
print(json.dumps({'frames':len(tiles),'bytes':out.stat().st_size,'seconds':round(time.monotonic()-start,2)}))

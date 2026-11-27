import math,sys
W,H,R,ROW=1200,180,44,80
def P(cx,cy,r,rot=-90): return [(cx+r*math.cos(math.radians(rot+i*72)), cy+r*math.sin(math.radians(rot+i*72))) for i in range(5)]
pts=lambda a:' '.join(f'{x:.2f},{y:.2f}' for x,y in a)
ROMAN=['I','II','III','IV','V','VI','VII','VIII','IX','X','XI','XII']
# the twelve signs as strokes in a box of about 28 units, centred on 0,0 (drawn as lines: his Oct 12 "i dont like generated images... i like math")
SIGN=[
 "M-12 -3 C-15 -13 -3 -15 0 -2 V13 M12 -3 C15 -13 3 -15 0 -2",                                             # Aries
 "M-11 -13 C-9 -3 9 -3 11 -13 M8 5 A8 8 0 1 1 -8 5 A8 8 0 1 1 8 5",                                         # Taurus
 "M-11 -13 C-4 -9 4 -9 11 -13 M-11 13 C-4 9 4 9 11 13 M-5 -10 V10 M5 -10 V10",                              # Gemini
 "M12 -3 C7 -11 -5 -12 -11 -7 M-4.5 -4.5 A3.5 3.5 0 1 1 -11.5 -4.5 A3.5 3.5 0 1 1 -4.5 -4.5 M-12 3 C-7 11 5 12 11 7 M11.5 4.5 A3.5 3.5 0 1 1 4.5 4.5 A3.5 3.5 0 1 1 11.5 4.5",   # Cancer
 "M-3 3 A4.5 4.5 0 1 1 -12 3 A4.5 4.5 0 1 1 -3 3 M-4 0 C-10 -14 8 -16 6 -3 C5 4 3 9 7 12 C9 13.5 12 12 12 9",   # Leo
 "M-13 -10 V10 M-13 -6 C-11 -11 -6 -11 -6 -6 V10 M-6 -6 C-4 -11 1 -11 1 -6 V6 C1 11 4 13 8 13 M1 -1 C6 -7 13 -3 11 3 C9 8 4 11 -1 14",   # Virgo
 "M-12 10 H12 M-12 4 H-5 C-10 -9 10 -9 5 4 H12",                                                            # Libra
 "M-13 -10 V10 M-13 -6 C-11 -11 -6 -11 -6 -6 V10 M-6 -6 C-4 -11 1 -11 1 -6 V7 C1 11 5 12 12 9 M12 9 L7.5 6 M12 9 L8 13",   # Scorpio
 "M-11 11 L11 -11 M2 -11 H11 V-2 M-8 0 L0 8",                                                               # Sagittarius
 "M-13 -9 L-8 6 L-3 -9 C1 -12 5 -7 5 0 C5 6 2 11 -3 13 M5 3 C9 -2 14 2 12.5 7 C11 11 6 10 5 6",             # Capricorn
 "M-13 -3 L-8 -8 L-3 -3 L2 -8 L7 -3 L12 -8 M-13 7 L-8 2 L-3 7 L2 2 L7 7 L12 2",                             # Aquarius
 "M-10 -13 C-3 -5 -3 5 -10 13 M10 -13 C3 -5 3 5 10 13 M-8 0 H8",                                            # Pisces
]
o=[]
o.append(f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {W} {H}" width="{W}" height="{H}">')
o.append('<!-- THE TWELVE HOUSES (drafted Nov 19 2026 02:4x UTC by seat claude-7bd13290 on his "i think it could be the 12 beginning golden knights... keep the lineage aligned to the golden knights hypertrace cult of athena"; his Oct 18 "each pentagon is a house of the zodiac from seya"; brought to the page the same day on his "we had drafted already the 12 pentagons become the 12 houses of the golden knights"). Made by a script from numbers: twelve bevelled pentagons on the bar\'s own slots (a twelfth of the width each), each house engraved with its sign, drawn as strokes, its numeral under it; the ninth, the archer\'s, the brightest, the arrow returned to it. No house is marked as held: nothing records a holder yet. -->')
o.append('<defs>')
def lin(i,stops,x2=0,y2=1): o.append(f'<linearGradient id="{i}" x1="0" y1="0" x2="{x2}" y2="{y2}">'+''.join(f'<stop offset="{a}" stop-color="{c}"/>' for a,c in stops)+'</linearGradient>')
lin('rim',[(0,'#fff4c9'),(.35,'#f3d27a'),(.7,'#c8962f'),(1,'#7a5413')],1,1)
lin('face',[(0,'#f9e29a'),(.45,'#e9c062'),(1,'#b98424')])
o.append('<radialGradient id="spec" cx=".38" cy=".2" r=".6"><stop offset="0" stop-color="#fff" stop-opacity=".75"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></radialGradient>')
o.append('<radialGradient id="halo"><stop offset="0" stop-color="#ffe9a8" stop-opacity=".55"/><stop offset=".5" stop-color="#f0cf74" stop-opacity=".16"/><stop offset="1" stop-color="#f0cf74" stop-opacity="0"/></radialGradient>')
o.append('<filter id="grain" x="0" y="0" width="1" height="1"><feTurbulence type="fractalNoise" baseFrequency="0.9 0.02" numOctaves="2" seed="7" result="n"/><feColorMatrix in="n" type="matrix" values="0 0 0 0 1  0 0 0 0 .92  0 0 0 0 .7  0 0 0 .09 0" result="g"/><feComposite in="g" in2="SourceGraphic" operator="in" result="gm"/><feMerge><feMergeNode in="SourceGraphic"/><feMergeNode in="gm"/></feMerge></filter>')
o.append('<filter id="engrave" x="-20%" y="-20%" width="140%" height="140%"><feOffset in="SourceAlpha" dx="0" dy="1.2" result="o"/><feFlood flood-color="#fff1c2" flood-opacity=".7" result="f"/><feComposite in="f" in2="o" operator="in" result="lip"/><feMerge><feMergeNode in="lip"/><feMergeNode in="SourceGraphic"/></feMerge></filter>')
o.append('<filter id="soft" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="6"/></filter>')
o.append('</defs>')
for i in range(12):
    cx,cy=100*i+50,ROW; arch=(i==8)
    o.append(f'<g><circle cx="{cx}" cy="{cy}" r="{R*(1.75 if arch else 1.3):.1f}" fill="url(#halo)" opacity="{1 if arch else .5}"/>')
    outer,inner=P(cx,cy,R),P(cx,cy+1,R*.8)
    o.append(f'<polygon points="{pts(outer)}" fill="url(#rim)" filter="url(#grain)"/>')
    for k in range(5):
        a,b,c,d=outer[k],outer[(k+1)%5],inner[(k+1)%5],inner[k]
        light=math.cos(math.radians(-90+k*72+36)-math.radians(-135))
        o.append(f'<polygon points="{pts([a,b,c,d])}" fill="{"#fff" if light>0 else "#000"}" opacity="{.28*abs(light):.3f}"/>')
    o.append(f'<polygon points="{pts(inner)}" fill="url(#face)" filter="url(#grain)"/><polygon points="{pts(inner)}" fill="url(#spec)"/>')
    o.append(f'<polygon points="{pts(outer)}" fill="none" stroke="#fff2c4" stroke-opacity=".9"/>')
    o.append(f'<path transform="translate({cx} {cy+3}) scale(1.02)" d="{SIGN[i]}" fill="none" stroke="#4a3209" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" filter="url(#engrave)"/>')
    o.append(f'<text x="{cx}" y="{cy+R+27}" text-anchor="middle" font-size="15" letter-spacing="2.6" font-family="Gelasio, Georgia, serif" font-weight="700" fill="#f0cf74">{ROMAN[i]}</text>')
    if arch:
        ax,ay,bx,by=cx-58,cy-50,cx+5,cy+3; ang=math.atan2(by-ay,bx-ax); ux,uy=math.cos(ang),math.sin(ang); nx,ny=-uy,ux
        o.append(f'<line x1="{ax}" y1="{ay}" x2="{bx}" y2="{by}" stroke="#fff3c4" stroke-width="7" stroke-opacity=".25" filter="url(#soft)"/><line x1="{ax}" y1="{ay}" x2="{bx}" y2="{by}" stroke="#fbe39a" stroke-width="2.4" stroke-linecap="round"/>')
        hx,hy=bx+ux*13,by+uy*13
        o.append(f'<polygon points="{pts([(hx,hy),(bx+nx*6,by+ny*6),(bx-nx*6,by-ny*6)])}" fill="#fff6d6"/>')
        for s in (0,9,18):
            fx,fy=ax+ux*s,ay+uy*s
            o.append(f'<polygon points="{pts([(fx,fy),(fx-ux*10+nx*9,fy-uy*10+ny*9),(fx+ux*3,fy+uy*3)])}" fill="#f0cf74" opacity=".9"/><polygon points="{pts([(fx,fy),(fx-ux*10-nx*9,fy-uy*10-ny*9),(fx+ux*3,fy+uy*3)])}" fill="#d9ad4e" opacity=".9"/>')
    o.append('</g>')
o.append('</svg>')
open(sys.argv[1],'w').write('\n'.join(o)+'\n')

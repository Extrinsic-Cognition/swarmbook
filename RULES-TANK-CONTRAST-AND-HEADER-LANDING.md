# RULES TANK CONTRAST AND HEADER

- **Branch:** `lane/rules-tank-contrast-and-header`
- **Cost:** 0 net JS lines (`seals-tank.js`: +4/-4), 1 CSS line (`holy.css`: +1/-1).
- **What changed:**
  - `embertide-app/ui/intro/dyson-society/app/seals-tank.js`: draw fuel-tank SOL balances, status note, and lit gold seal checkmarks in dark ink (`INK.ink` `#2B2620` / `INK.bronze` `#8A6B3F`) instead of ivory `DARK` (`#FBF6EA`) over cream `PAPER` (`#FBF8F1`).
  - `embertide-app/ui/intro/dyson-society/app/holy.css`: remove `!important` from `main > header::before` initial transparent background so `@keyframes holy-glass` actually animates into frosted dark glass (`rgba(7,6,11,.88)` + `blur(12px)`) on scroll instead of letting page content bleed through the sticky header.
- **Visual check:** Captured `rules.html` at `scrollY=460` (`1280x800`) before and after; confirmed `0.1958 SOL` / `0.2995 SOL` / `0.2 SOL` readable and header opaque on scroll.

#!/bin/bash
# the-houses-pour-holds-until-it-lands.sh (seat claude-552ca914, Nov 12 2026): HIS presses for THE HOUSE'S POUR HOLDS UNTIL IT LANDS, one script.
# Run it from the Mac that publishes optimism.fit (the old Mac: its tree holds the films the build needs). No seat runs it.
#   <this script>           the whole press: 1 the lane on main, 2 migration 0023, 3 the build and the deploy, 4 the live files against main;
#                           then it says whether the address he already holds still opens the door
#   <this script> token     only a new one-time token and its address (the old address was lost, or its secret was removed)
#   <this script> read      only reads: what the fee wallet holds, the deposits' list (one ask of each)
#   <this script> remove    after the fill: the secret taken off the Worker (the door answers 404 to everyone again)
# It reads no key. It prints no secret but, in token mode alone, ONE line: the address to open, which carries the one-time token because he
# must open it. The door it opens moves only the fee wallet's own USDC, only into the Worker's own treasury (worker/space-router-deposit.mjs house).
# Every grep here is -F or a plain -E alternation: no pattern holds a ^ or another letter a grep may read as its own.
set -u
C=d84cfb8ef1da6a7ede5b53f3bdc2761ebbd2788c; NAME=SPACE_ROUTER_HOUSE_DEPOSIT_TOKEN; SITE=https://optimism.fit
H="$HOME/code-ec/house"; S="$H/embertide-app/ui/intro/dyson-society"; ME="$S/the-houses-pour-holds-until-it-lands.sh"; WR="npx --yes wrangler@4.151.0"; CFG="--config wrangler.optimism-fit.jsonc"
MODE="${1:-all}"
cd "$S" 2>/dev/null || { echo "STOPPED: the house is not here ($S)."; exit 1; }
stop() { echo; echo "STOPPED: $1 Nothing more was done. Tell Claude: $2."; exit 1; }
chain() {   # reads only, one ask each: the door's public terms, what the fee wallet holds of its USDC (the door's own watch), the deposits' list
  T=$(curl -s --max-time 20 "$SITE/space-router/v1/deposit"); FEE=$(printf %s "$T" | sed -n 's/.*"fee":"\([1-9A-HJ-NP-Za-km-z]*\)".*/\1/p'); TRE=$(printf %s "$T" | sed -n 's/.*"treasury":"\([1-9A-HJ-NP-Za-km-z]*\)".*/\1/p')
  [ -n "$FEE" ] && [ -n "$TRE" ] || stop "the live door did not answer its terms." "the door is down"
  HELD=$(curl -s --max-time 20 "$SITE/space-router/v1/deposit?flask=$FEE" | sed -n 's/.*"amount":"\([0-9]*\)".*/\1/p')
  [ -n "$HELD" ] || echo "  (the door's node did not answer this one read; the door itself asks it three times)"
  echo "  the fee wallet $FEE holds ${HELD:-?} base units of USDC (1 USDC = 1000000)"; echo "  the treasury's account: $TRE"
  echo "  the deposits' list: $(curl -s --max-time 20 "$SITE/space-router/v1/drops?after=0" | cut -c1-300)"
}
token() {   # a new one-time token: 32 random bytes, base64url, 43 letters; to the Worker by a pipe; shown once, in the address below
  K=$(openssl rand -base64 32 | tr '+/' '-_' | tr -d '=\n'); [ "${#K}" -eq 43 ] || stop "no token could be made (openssl)." "no token"
  OUT=$(printf %s "$K" | $WR secret put "$NAME" $CFG 2>&1); RC=$?; printf '%s\n' "$OUT" | grep -E "Success|rror" | cut -c1-200
  [ "$RC" -eq 0 ] || { K=; stop "the secret was not put." "the secret was not put"; }
}
how() {
  echo "Press Fill your tank. The door shows no code and no address: one line, The house pours its USDC into your flask., then Pouring., then"
  echo "the fill (about 20 s), then Paint your Lyssajudron. If it says The chain did not answer. Asking again., leave it open: it asks by itself."
  echo "If the page was closed, open the same address again in the same browser: it goes on from where the deposit stands, and sends nothing twice."
  echo "The step on, if you left the page before pressing it, in the same browser: $SITE/app/warm.html?door=deposit&then=making"
  echo "After the fill: $ME remove   (the secret off the Worker)"
}
case "$MODE" in
  read) chain; exit 0 ;;
  remove) $WR secret delete "$NAME" $CFG; echo "Tell Claude: removed."; exit 0 ;;
  token|all) ;;
  *) echo "usage: $ME [token|read|remove]"; exit 1 ;;
esac
echo "== the lane on main"
git -C "$H" merge-base --is-ancestor "$C" main 2>/dev/null || stop "lane/the-houses-pour-holds-until-it-lands is not on main yet." "not landed"
grep -qF "SQL.again" worker/space-router-deposit.mjs && [ -f worker/migrations/0023_the_pour_holds.sql ] && grep -qF "return void housed(say)" app/dl-kit-deposit.js && grep -qF "HOUSE_SAYS" app/dl-kit-deposit.mjs || stop "the served tree does not hold the door's mend, its migration and the page's half." "stuck"
git -C "$H" diff --quiet HEAD -- embertide-app/ui/intro/dyson-society/worker embertide-app/ui/intro/dyson-society/app/dl-kit-deposit.js embertide-app/ui/intro/dyson-society/app/dl-kit-deposit.mjs || stop "the served tree's Worker or door differs from main's commit." "the tree is edited"
echo "on main: $(git -C "$H" rev-parse --short main)"
if [ "$MODE" = token ]; then
  echo; echo "== a new one-time token, as the Worker's secret (by a pipe; not shown here)"; token
  echo; echo "OPEN THIS ONE ADDRESS, in the browser that should own the flask (the one you keep: the flask's key lives in that browser alone):"
  echo; echo "  $SITE/app/after-the-mint.html?side=flask#house=$K"; echo; K=; unset K
  echo "It is shown once and holds the one-time token: do not paste it anywhere. An address made before this one no longer opens the door."; how; exit 0
fi
echo; echo "== 1 of 3: migration 0023 (wrangler names what it applies and may ask: answer yes)"
$WR d1 migrations apply optimism-fit-premint --remote $CFG || stop "the migration was not applied." "the migration failed"
echo; echo "== 2 of 3: the site built from main, its films to the bucket, the deploy"
bash -c 'set -o pipefail; node tools/build-optimism-fit.mjs | sed -n 1,2p | cut -c1-200 && node tools/media-to-r2.mjs | tail -1 && npx --yes wrangler@4.151.0 deploy --config wrangler.optimism-fit.jsonc 2>&1 | grep -E "Uploaded|Deployed|Current Version|rror"' || stop "the build or the deploy failed. The live door is the one before." "stuck at the deploy"
echo; echo "== 3 of 3: the live files against main"
sleep 5; ok=0; n=0
for f in app/dl-kit-deposit.js app/dl-kit-deposit.mjs app/space-router-deposit.mjs; do
  n=$((n+1)); l=$(curl -s --max-time 20 "$SITE/$f" | shasum -a 256 | cut -c1-12); m=$(shasum -a 256 "$S/$f" | cut -c1-12)
  if [ "$l" = "$m" ]; then ok=$((ok+1)); echo "  same: $f"; else echo "  DIFFERENT: $f (live $l, main $m)"; fi
done
[ "$ok" -eq "$n" ] || stop "the live site is not this main ($ok of $n the same)." "not all there"
echo
if $WR secret list $CFG 2>/dev/null | grep -qF "$NAME"; then
  echo "PUBLISHED. The secret is still on the Worker and no deposit was kept, so THE ADDRESS YOU ALREADY HOLD STILL WORKS if you kept it:"
  echo "open it again, in the same browser as before. If you did not keep it: $ME token"
else
  echo "PUBLISHED. The secret is not on the Worker, so the old address opens nothing. For a new one: $ME token"
fi
how

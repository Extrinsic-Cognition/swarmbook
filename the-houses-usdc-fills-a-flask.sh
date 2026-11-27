#!/bin/bash
# the-houses-usdc-fills-a-flask.sh (seat claude-552ca914, Nov 12 2026): HIS presses for THE HOUSE'S USDC FILLS A FLASK, one script.
# Run it from the Mac that publishes optimism.fit (the old Mac: its tree holds the films the build needs). No seat runs it.
#   ./the-houses-usdc-fills-a-flask.sh          the whole press: 1 the lane on main, 2 the chain read, 3 a new one-time token as the
#                                               Worker's secret, 4 migration 0022, 5 the build and the deploy, 6 the live read, 7 the ONE
#                                               address to open
#   ./the-houses-usdc-fills-a-flask.sh token    only a new token and its address (the first was lost, or spent on a send the chain refused)
#   ./the-houses-usdc-fills-a-flask.sh read     only reads: what the fee wallet holds, the deposits' list
#   ./the-houses-usdc-fills-a-flask.sh remove   after the deposit: the secret taken off the Worker (the door answers 404 to everyone again)
# It reads no key and prints no secret but ONE line: the address to open, which carries the one-time token because he must open it. The
# token is made in this shell's memory, goes to the Worker by a pipe (never a file, never an argument of a process) and is spent by its
# first deposit. The door it opens moves only the fee wallet's own USDC, only into the Worker's own treasury (worker/space-router-deposit.mjs house).
set -u
C=eede02c5518db5e70692945a5627fcd13a11bfd3; NAME=SPACE_ROUTER_HOUSE_DEPOSIT_TOKEN; SITE=https://optimism.fit
H="$HOME/code-ec/house"; S="$H/embertide-app/ui/intro/dyson-society"; WR="npx --yes wrangler@4.151.0"; CFG="--config wrangler.optimism-fit.jsonc"
MODE="${1:-all}"
cd "$S" 2>/dev/null || { echo "STOPPED: the house is not here ($S)."; exit 1; }
stop() { echo; echo "STOPPED: $1 Nothing more was done. Tell Claude: $2."; exit 1; }
chain() {   # reads only: the door's public terms, what the fee wallet holds of its USDC (the door's own watch), the deposits' list
  T=$(curl -s --max-time 20 "$SITE/space-router/v1/deposit"); FEE=$(printf %s "$T" | sed -n 's/.*"fee":"\([1-9A-HJ-NP-Za-km-z]*\)".*/\1/p'); TRE=$(printf %s "$T" | sed -n 's/.*"treasury":"\([1-9A-HJ-NP-Za-km-z]*\)".*/\1/p')
  [ -n "$FEE" ] && [ -n "$TRE" ] || stop "the live door did not answer its terms." "the door is down"
  HELD=; for i in 1 2 3 4 5 6; do HELD=$(curl -s --max-time 20 "$SITE/space-router/v1/deposit?flask=$FEE" | sed -n 's/.*"amount":"\([0-9]*\)".*/\1/p'); [ -n "$HELD" ] && break; sleep 5; done
  # A READ THAT FAILS IS NOT AN EMPTY WALLET (Nov 20 2026, his run at 08:43 UTC: the door's node failed the read, the script printed "?" and stopped with
  # "the fee wallet holds no USDC ... Tell Claude: nothing there" while the chain held 600412645): six asks 5 s apart; none answered says so, never zero
  [ -n "$HELD" ] || stop "the chain could not be read just now (six asks of the door, none answered). Nothing was touched: run this again in a minute." "the chain was not read"
  echo "  the fee wallet $FEE holds $HELD base units of USDC (1 USDC = 1000000)"; echo "  the treasury's account: $TRE"
  echo "  the deposits' list: $(curl -s --max-time 20 "$SITE/space-router/v1/drops?after=0" | cut -c1-300)"
}
token() {   # a new one-time token: 32 random bytes, base64url, 43 letters; to the Worker by a pipe; shown once, in the address below
  K=$(openssl rand -base64 32 | tr '+/' '-_' | tr -d '=\n'); [ "${#K}" -eq 43 ] || stop "no token could be made (openssl)." "no token"
  OUT=$(printf %s "$K" | $WR secret put "$NAME" $CFG 2>&1); RC=$?; printf '%s\n' "$OUT" | grep -E "Success|rror" | cut -c1-200
  [ "$RC" -eq 0 ] || { K=; stop "the secret was not put." "the secret was not put"; }
}
address() {
  echo; echo "OPEN THIS ONE ADDRESS, in the browser that should own the flask (the one you keep: the flask's key lives in that browser alone):"
  echo; echo "  $SITE/app/warm.html?door=deposit#house=$K"; echo
  # THE POUR OPENS WHERE IT IS READ (Nov 20 2026): the tree page this address named (after-the-mint.html?side=flask) became Swarmbook's front and holds
  # no Fill your tank; the mint page's deposit door reads #house= at its load and asks at once (rehearsed live that day with a made-up token: the door's
  # line, then the server's refusal of the token, nothing sent)
  echo "It is shown once and holds the one-time token: do not paste it anywhere but that browser's address bar. Opening it pours at once, with"
  echo "no press: the door says one line (The house pours its USDC into your flask.), then Pouring., then the fill (about 20 s); it shows no code"
  echo "and no address, and asks again by itself if the chain does not answer. Keep the tab open until the door says the flask holds the amount."
  echo "The step on, in the same browser, is: $SITE/app/warm.html?door=deposit&then=making"
  echo "After the fill: $S/the-houses-usdc-fills-a-flask.sh remove   (this takes the secret off the Worker)"
  K=; unset K
}
case "$MODE" in
  read) chain; exit 0 ;;
  remove) $WR secret delete "$NAME" $CFG; echo "Tell Claude: removed."; exit 0 ;;
  token|all) ;;
  *) echo "usage: $0 [token|read|remove]"; exit 1 ;;
esac
echo "== the lane on main"
git -C "$H" merge-base --is-ancestor "$C" main 2>/dev/null || stop "lane/the-houses-usdc-fills-a-flask is not on main yet." "not landed"
grep -qF "$NAME" worker/space-router-deposit.mjs && [ -f worker/migrations/0022_the_houses_deposit.sql ] && grep -qF 'HOUSE = /^#house=' app/dl-kit-deposit.js || stop "the served tree does not hold the door, its migration and the page's half." "stuck"
git -C "$H" diff --quiet HEAD -- embertide-app/ui/intro/dyson-society/worker embertide-app/ui/intro/dyson-society/app/dl-kit-deposit.js || stop "the served tree's Worker or door differs from main's commit." "the tree is edited"
echo "on main: $(git -C "$H" rev-parse --short main)"
echo; echo "== the chain, read"; chain
case "$HELD" in 0) stop "the fee wallet holds no USDC: there is nothing to deposit." "nothing there" ;; esac
if [ "$MODE" = token ]; then echo; echo "== a new one-time token, as the Worker's secret"; token; address; exit 0; fi
echo; echo "== 1 of 4: a new one-time token, as the Worker's secret (by a pipe; not shown here)"; token
echo; echo "== 2 of 4: migration 0022 (wrangler names what it applies and may ask: answer yes)"
$WR d1 migrations apply optimism-fit-premint --remote $CFG || stop "the migration was not applied." "the migration failed"
echo; echo "== 3 of 4: the site built from main, its films to the bucket, the deploy"
bash -c 'set -o pipefail; node tools/build-optimism-fit.mjs | sed -n 1,2p | cut -c1-200 && node tools/media-to-r2.mjs | tail -1 && npx --yes wrangler@4.151.0 deploy --config wrangler.optimism-fit.jsonc 2>&1 | grep -E "Uploaded|Deployed|Current Version|rror"' || stop "the build or the deploy failed. The secret is set and opens nothing on the old Worker." "stuck at the deploy"
echo; echo "== 4 of 4: the live site against main"
sleep 5; ok=0; n=0
for f in app/dl-kit-deposit.js app/dl-kit-deposit.mjs app/space-router-deposit.mjs; do
  n=$((n+1)); l=$(curl -s --max-time 20 "$SITE/$f" | shasum -a 256 | cut -c1-12); m=$(shasum -a 256 "$S/$f" | cut -c1-12)
  if [ "$l" = "$m" ]; then ok=$((ok+1)); echo "  same: $f"; else echo "  DIFFERENT: $f (live $l, main $m)"; fi
done
d=$(curl -s --max-time 20 -o /dev/null -w '%{http_code}' -X POST -H 'content-type: application/json' -d '{"house":"not-the-token"}' "$SITE/space-router/v1/deposit"); echo "  the door, asked with no token: $d (404 is right: it answers a stranger as a door that is not there)"
$WR secret list $CFG 2>/dev/null | grep -qF "$NAME" && echo "  the secret's name is on the Worker" || echo "  NOT SEEN: the secret's name on the Worker"
if [ "$ok" -ne "$n" ] || [ "$d" != 404 ]; then K=; stop "the live site is not this main ($ok of $n the same, the door $d). The token was not shown; run 'token' once it is." "not all there"; fi
address

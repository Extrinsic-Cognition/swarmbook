# Bundled browser SDKs

These are the exact versions already pinned by the mint page, copied without
modification on October 15, 2026. The page now loads them from this directory.
They are self-contained browser bundles; neither needs another JavaScript
download. Live chain RPC and payment services remain network integrations.

| File | Package | License | Bytes | SHA-256 |
| --- | --- | --- | --- | --- |
| `solana-web3-1.95.8.iife.min.js` | `@solana/web3.js@1.95.8` | MIT | 459,805 | `a759deca1b65df140e8dda5ad8645c19579536bf822e5c0c7e4adb7793a5bd08` |
| `tweetnacl-1.0.3.fast.min.js` | `tweetnacl@1.0.3` | Unlicense | 32,110 | `3ec535c004aeeb225785d8e93fb33bf99f52e399bd7dfc01969b5629baea5131` |
| `solana-web3-1.95.8.LICENSE.txt` | `@solana/web3.js@1.95.8` | MIT | 1,060 | `c181f3e6911f515d2b5d18513f8e24fba252c36856978fa80b01249fa813453f` |
| `tweetnacl-1.0.3.LICENSE.txt` | `tweetnacl@1.0.3` | Unlicense | 1,210 | `88d9b4eb60579c191ec391ca04c16130572d7eedc4a86daa58bf28c6e14c9bcd` |

Sources:

- [Solana web3 browser bundle](https://unpkg.com/@solana/web3.js@1.95.8/lib/index.iife.min.js).
  The prior [jsDelivr URL](https://cdn.jsdelivr.net/npm/@solana/web3.js@1.95.8/lib/index.iife.min.js)
  was fetched independently and verified byte-identical. The wallet's existing
  SHA-384 integrity value remains unchanged:
  `sha384-ujeTtvHxhu2g5lnu14Roii2ajvVKJ74KQ6eo6GGfAi0IrKZ1YkF8N68Iw5VmIJO0`.
- [Solana web3 license](https://unpkg.com/@solana/web3.js@1.95.8/LICENSE).
- [TweetNaCl browser bundle](https://cdn.jsdelivr.net/npm/tweetnacl@1.0.3/nacl-fast.min.js).
- [TweetNaCl license](https://cdn.jsdelivr.net/npm/tweetnacl@1.0.3/LICENSE).

The packages' published metadata confirmed both versions and licenses. Original
license notices inside the bundles are preserved. TweetNaCl's optional Node
`crypto` branch is not used in the browser. The web3 bundle retains its upstream
source-map comment; the debug map is not a runtime dependency and is not bundled.
Use a new versioned filename and refresh the asset manifest when upgrading.

The bundled TweetNaCl file adds a final LF to the upstream bytes for repository text hygiene. Its repository size is 32,111 bytes and SHA-256 is `2a9d00a0dd33f601b6851ef8a95b52e3aa489b1a7b7837a6a1e35cee301df4b0`; the upstream integrity entry above records the original download. JavaScript content is otherwise unchanged.

## Reactor's kit, for her portrait's painter (November 11, 2026)

Loaded by `../dl-her-portrait-frame.html` and by nothing else: a frame with no origin (`sandbox="allow-scripts"`), so this code never shares a
page with a wallet, a tank key or the site's storage. Unlike the two bundles above, the JavaScript is not an upstream file copied as it is: the
packages ship modules with bare imports and React bindings, so it is one esbuild bundle of the model's class alone.

| File | Package | License | Bytes | SHA-256 |
| --- | --- | --- | --- | --- |
| `reactor-x2-1.0.0.min.js` | `@reactor-models/x2@1.0.0` on `@reactor-team/js-sdk@3.0.2` | MIT, Apache-2.0 | 239855 | `d536b7bcaf65d14fb2275b034fcc39ddf273be70f8f2cbb060c66c7b7c26309c` |
| `reactor_wasm_bg.wasm` | `@reactor-team/js-sdk@3.0.2`, its own file unchanged | Apache-2.0 | 651458 | `cc0d3fc29dc0ef96a1d13807fdae834bf7ef467628d54e390ba6871abbc274af` |
| `reactor-x2-1.0.0.LICENSE.txt` | both | MIT, Apache-2.0 | 2002 | `0f9662e0df14855a7c7b89cc70ea7253262803cd7a275e0c23a19728ff4b5c3f` |

How the bundle is made again (esbuild 0.28.2; the entry is one line, `export { X2Model } from "@reactor-models/x2";`; the shim answers the SDK's
React imports with no-ops, since only the imperative class is used):

    esbuild kit.js --bundle --minify --format=esm --platform=browser --alias:react=./shim/react.js --alias:react/jsx-runtime=./shim/react.js \
      --alias:react-dom=./shim/react.js "--external:*.wasm" --outfile=reactor-x2-1.0.0.min.js

The bundle asks for `reactor_wasm_bg.wasm` beside itself, so the wasm keeps its name. Both are answered to the frame only with
`Access-Control-Allow-Origin: *` (the site build writes that header for `/app/vendor/reactor*`). The pass the frame is given is minted by the
Worker (`worker/space-router-portrait.mjs`); the key never reaches a browser.

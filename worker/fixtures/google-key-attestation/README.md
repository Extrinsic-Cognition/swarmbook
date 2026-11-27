# Google's key attestation, as Google publishes it (read Nov 1 2026, for android-attest.test.mjs alone; the Worker reads none of it)

- `tee-cert0..3.der`, `strongbox-cert0..3.der`: the EC sample chains of github.com/google/android-key-attestation (`src/test/resources/der/
  algorithm_EC_SecurityLevel_TEE` and `_StrongBox`, Apache License 2.0): a real phone's key, its intermediates and the root it names. The TEE chain ends in
  Google's RSA root key (its 2016 certificate); its key description holds the challenge "abc", attestation 3, the TEE, an unlocked boot.
- `roots.json`: https://android.googleapis.com/attestation/root as it answered: Google's two roots (the RSA 4096 one, 2022 certificate, and Key Attestation CA1,
  ECDSA P-384, 2025 to 2035). On the Worker they are his hand's (SPACE_ROUTER_WISH_ROOT), never the code's.

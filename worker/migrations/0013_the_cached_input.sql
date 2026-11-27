-- 0013_the_cached_input.sql · THE ORACLE COUNTS THE CACHE (Oct 30 2026, worker/space-router.mjs; the law: app/space-router-oracle.mjs cachedOf). The input
-- tokens the provider read from its cache, beside tokens_in and tokens_out: the chat wire's usage.prompt_tokens_details.cached_tokens, Anthropic's
-- cache_read_input_tokens; NULL when it says neither. The house's calls are 97 to 99.6 % input, and this is how much of it the cache paid for. The signed
-- receipt carries the same number (tokens_cached).
ALTER TABLE sr_ledger ADD COLUMN tokens_cached INTEGER;

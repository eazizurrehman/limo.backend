# Pre-Commit Scripts

Keeps the project structure in sync.

## Portability

1. Copy the `.config` folder.
2. Copy `lib/utils.sh`.
3. Install `biome`.
4. Install `lefthook`.
5. Run:
   ```sh
   git config --unset-all --local core.hooksPath
   pnpx lefthook install
   ```
6. Add scripts:
   ```json
   "ts:check": "./.config/ts:check.sh",
   "biome:check": "./.config/biome:check.sh",
   "biome:migrate": "./.config/biome:migrate.sh",
   "file:size:check": "./.config/file:size:check.sh"
   ```

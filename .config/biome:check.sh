
#!/bin/bash

. "$PWD/lib/utils.sh"

require_cmd biome

CONFIG_PATH="$PWD/.config/biome.json"

require_file "$CONFIG_PATH"

biome check --config-path "$CONFIG_PATH" --write --no-errors-on-unmatched --files-ignore-unknown=true
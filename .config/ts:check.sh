#!/bin/bash

. "$PWD/lib/utils.sh"

require_cmd tsc

tsc --noEmit

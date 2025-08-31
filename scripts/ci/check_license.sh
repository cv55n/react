#!/bin/bash

set -e

# certifique-se de que não introduzimos referências acidentais para as patentes
EXPECTED='scripts/ci/check_license.sh'
ACTUAL=$(git grep -l PATENTS)

if [ "$EXPECTED" != "$ACTUAL" ]; then
    echo "patentes surgiram em alguns arquivos novos?"

    diff -u <(echo "$EXPECTED") <(echo "$ACTUAL") || true

    exit 1
fi
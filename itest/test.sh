#!/usr/bin/env bash

set -e

cd "$(dirname "${0}")"

for i in */package.json; do
  (cd "$(dirname ${i})" && yarn test)
done

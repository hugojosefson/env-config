#!/usr/bin/env bash

set -e

cd "$(dirname "${0}")"

for i in */package.json; do
  dir="$(dirname ${i})"
  echo ""
  echo ""
  echo "============================================"
  echo "${dir}"
  echo "--------------------------------------------"
  (cd "${dir}" && yarn && yarn upgrade --latest && yarn test)
done

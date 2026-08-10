#!/usr/bin/env bash

set -e

echo "== Typecheck =="
yarn workspace @fms/auth-service typecheck

echo "== Lint =="
yarn workspace @fms/auth-service lint

echo "== Test =="
yarn workspace @fms/auth-service test

echo "== Build =="
yarn workspace @fms/auth-service build

echo "== Foundation verification passed =="
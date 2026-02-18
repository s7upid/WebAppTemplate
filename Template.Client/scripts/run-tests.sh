#!/usr/bin/env bash
# Shell script for running Jest tests on macOS/Linux

MODE="${1:-run}"

case "$MODE" in
    watch)
        npx jest --config jest.config.ts --watch
        ;;
    coverage)
        npx jest --config jest.config.ts --coverage
        ;;
    *)
        npx jest --config jest.config.ts
        ;;
esac

#!/usr/bin/env bash
export CYPRESS_COVERAGE=true
export NODE_ENV=development
npx vite --mode coverage --port 3000

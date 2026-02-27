#!/usr/bin/env bash
set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"
cd "$ROOT_DIR"

read -rp "Enter migration name: " MigrationName

dotnet ef migrations add "$MigrationName" \
    --project ./Template.Data \
    --startup-project ./Template.Server \
    --context Template.Data.Data.ApplicationDbContext

echo
echo "Migration \"$MigrationName\" created."

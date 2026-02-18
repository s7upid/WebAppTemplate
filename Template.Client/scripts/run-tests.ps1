# PowerShell script for running Jest tests on Windows
# Handles UTF-8 encoding for proper test output

param(
    [string]$mode = "run"
)

# Set UTF-8 encoding
[Console]::OutputEncoding = [System.Text.Encoding]::UTF8
chcp 65001 | Out-Null

$ErrorActionPreference = "Continue"

switch ($mode) {
    "watch" {
        npx jest --config jest.config.ts --watch
    }
    "coverage" {
        npx jest --config jest.config.ts --coverage
    }
    default {
        npx jest --config jest.config.ts
    }
}

exit $LASTEXITCODE

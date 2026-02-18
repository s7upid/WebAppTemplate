@echo off 
set CYPRESS_COVERAGE=true 
set NODE_ENV=development 
npx vite --mode coverage --port 3000 

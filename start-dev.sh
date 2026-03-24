#!/bin/sh
cd /Users/jenwarren/GitHub/job-triage-prototype
exec /Users/jenwarren/GitHub/site/.claude/worktrees/determined-mendel/.flox/run/aarch64-darwin.site.dev/bin/node \
  /Users/jenwarren/GitHub/job-triage-prototype/node_modules/.bin/vite \
  --port 5173

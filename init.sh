#!/bin/bash
# Start local dev server
# Option 1: Node (preferred)
if command -v npx &> /dev/null; then
  npx serve . -p 8080
# Option 2: Python
elif command -v python3 &> /dev/null; then
  python3 -m http.server 8080
else
  echo "Install Node.js or Python to run the local server"
fi

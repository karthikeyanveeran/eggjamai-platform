#!/bin/bash
echo "Starting application..."
echo "PORT: $PORT"
echo "PWD: $(pwd)"
echo "Files: $(ls -la)"
uvicorn main_railway:app --host 0.0.0.0 --port 8000
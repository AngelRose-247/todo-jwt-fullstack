#!/usr/bin/env bash
set -o errexit

if command -v npm &> /dev/null; then
    cd ../frontend
    npm install
    npm run build
    cd ../backend
fi

pip install --no-cache-dir -r requirements.txt
python manage.py collectstatic --no-input || true
python manage.py migrate
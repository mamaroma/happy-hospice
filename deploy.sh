#!/usr/bin/env bash
# Deploy static site to VPS
set -euo pipefail

REMOTE="${REMOTE:-root@78.17.53.28}"
DEST="${DEST:-/var/www/happypansionat}"
ROOT="$(cd "$(dirname "$0")" && pwd)"

rsync -avz --delete \
  --exclude '.git/' \
  --exclude '.idea/' \
  --exclude '.DS_Store' \
  --exclude '/backlog/' \
  --exclude '/bugri_new/' \
  --exclude '/documents/' \
  --exclude '/google-sheets/' \
  --exclude '/news/' \
  --exclude '/qualification/' \
  --exclude '/stuff_pics/' \
  --exclude '/Услуги/' \
  --exclude '/sverdlovskaya 14:2/' \
  --exclude '/logo_max.png' \
  --exclude '/logo_new.png' \
  --exclude '/newest_logo.png' \
  --exclude '/README.md' \
  --exclude '/.gitignore' \
  --exclude '/deploy.sh' \
  "$ROOT/" "$REMOTE:$DEST/"

ssh "$REMOTE" "chown -R www-data:www-data '$DEST' && find '$DEST' -name .DS_Store -delete"
echo "Deployed to $REMOTE:$DEST"

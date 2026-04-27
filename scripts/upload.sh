#!/bin/bash
set -e

# ── Defaults ──
TAB=""
NAME=""
VERSION=""
ANDROID=""
SIZE=""
CHANGELOG=""
FILE=""
ITEMID=""
CREATOR="xCaptaiN09"
REPO="xCaptaiN09/rmx3031-archive"
BRANCH="main"
FILE_PATH="public/index.json"

# ── Subject mapping ──
get_subject() {
  case "$1" in
    roms)     echo "android;rom;realme;rmx3031" ;;
    kernels)  echo "android;kernel;realme;rmx3031" ;;
    recovery) echo "android;recovery;twrp;realme;rmx3031" ;;
    firmware) echo "android;firmware;realme;rmx3031" ;;
    modules)  echo "android;module;magisk;realme;rmx3031" ;;
    ota)      echo "android;ota;realme;x7max" ;;
    ota_cn)   echo "android;ota;realme;gtneo" ;;
    ota_cnf)  echo "android;ota;realme;gtneoflash" ;;
    sptool)   echo "android;sp-flash-tool;realme;rmx3031" ;;
    other)    echo "android;realme;rmx3031" ;;
    *)        echo "android;realme;rmx3031" ;;
  esac
}

# ── Parse arguments ──
while [[ $# -gt 0 ]]; do
  case "$1" in
    --tab)       TAB="$2"; shift 2 ;;
    --name)      NAME="$2"; shift 2 ;;
    --version)   VERSION="$2"; shift 2 ;;
    --android)   ANDROID="$2"; shift 2 ;;
    --size)      SIZE="$2"; shift 2 ;;
    --changelog) CHANGELOG="$2"; shift 2 ;;
    --file)      FILE="$2"; shift 2 ;;
    --itemid)    ITEMID="$2"; shift 2 ;;
    *) echo "Unknown option: $1"; exit 1 ;;
  esac
done

# ── Validate ──
if [[ -z "$TAB" || -z "$NAME" || -z "$FILE" ]]; then
  echo "❌ Missing required arguments: --tab, --name, --file"
  echo ""
  echo "Usage:"
  echo "  ./upload.sh --tab roms --name \"Axion AOSP 2.5\" --file axion.zip [options]"
  echo ""
  echo "Options:"
  echo "  --tab        Tab key (roms, kernels, recovery, etc.) *required*"
  echo "  --name       Display name                    *required*"
  echo "  --file       File to upload                  *required*"
  echo "  --version    Version string (e.g. 2.5)"
  echo "  --android    Android version (e.g. 16)"
  echo "  --size       File size (e.g. 6.59GB)"
  echo "  --changelog  Changelog text"
  echo "  --itemid     Internet Archive item ID (auto-generated if omitted)"
  exit 1
fi

if [[ ! -f "$FILE" ]]; then
  echo "❌ File not found: $FILE"
  exit 1
fi

if [[ -z "$GH_TOKEN" ]]; then
  echo "❌ GH_TOKEN not set. Add it to GitHub → Settings → Codespaces → Secrets"
  exit 1
fi

if [[ -z "$IA_ACCESS_KEY" || -z "$IA_SECRET_KEY" ]]; then
  echo "❌ IA_ACCESS_KEY or IA_SECRET_KEY not set. Add to Codespace Secrets."
  exit 1
fi

# ── Generate item ID if not provided ──
if [[ -z "$ITEMID" ]]; then
  SLUG=$(echo "$NAME" | tr '[:upper:]' '[:lower:]' | sed 's/[^a-z0-9]/-/g' | sed 's/--*/-/g' | sed 's/^-//;s/-$//')
  ITEMID="rmx3031-${SLUG}"
fi

# ── Today's date ──
DATE=$(date +%Y-%m-%d)

# ── Step 1: Upload to Internet Archive ──
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "  RMX3031 Upload Script"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "📦 File:      $FILE"
echo "📁 Tab:       $TAB"
echo "📝 Name:      $NAME"
echo "🆔 Item ID:   $ITEMID"
echo "📅 Date:      $DATE"
echo ""

SUBJECT=$(get_subject "$TAB")

echo "⬆️  Uploading to Internet Archive..."
ia upload "$ITEMID" "$FILE" \
  --metadata="title:$NAME" \
  --metadata="mediatype:software" \
  --metadata="subject:$SUBJECT" \
  --metadata="creator:$CREATOR" \
  --retries=3

echo "✅ Upload to Internet Archive complete!"

# ── Step 2: Build the URL ──
FILENAME=$(basename "$FILE")
URL="https://archive.org/download/${ITEMID}/${FILENAME}"

# ── Step 3: Update index.json via GitHub API ──
echo ""
echo "📝 Updating index.json..."

RESPONSE=$(curl -s -H "Authorization: Bearer $GH_TOKEN" \
  -H "Accept: application/vnd.github+json" \
  "https://api.github.com/repos/${REPO}/contents/${FILE_PATH}?ref=${BRANCH}")

SHA=$(echo "$RESPONSE" | jq -r '.sha')
ENCODED_CONTENT=$(echo "$RESPONSE" | jq -r '.content')

if [[ "$SHA" == "null" || -z "$SHA" ]]; then
  echo "❌ Failed to fetch index.json from GitHub"
  exit 1
fi

# Decode current JSON
CURRENT_JSON=$(echo "$ENCODED_CONTENT" | base64 -d)

# Build new entry
ENTRY=$(jq -n \
  --arg name "$NAME" \
  --arg date "$DATE" \
  --arg url "$URL" \
  --arg changelog "$CHANGELOG" \
  --arg version "$VERSION" \
  --arg android "$ANDROID" \
  --arg size "$SIZE" \
  '{
    name: $name,
    date: $date,
    url: $url,
    changelog: $changelog
  }
  | if $version != "" then . + {version: $version} else . end
  | if $android != "" then . + {android: $android} else . end
  | if $size != "" then . + {size: $size} else . end')

# Append to correct tab
UPDATED_JSON=$(echo "$CURRENT_JSON" | jq --arg tab "$TAB" --argjson entry "$ENTRY" '.[$tab] += [$entry]')

# Encode and commit
UPDATED_ENCODED=$(echo "$UPDATED_JSON" | base64 -w 0)
COMMIT_MSG="Add $NAME to $TAB"

COMMIT_RESPONSE=$(curl -s -X PUT \
  -H "Authorization: Bearer $GH_TOKEN" \
  -H "Accept: application/vnd.github+json" \
  "https://api.github.com/repos/${REPO}/contents/${FILE_PATH}" \
  -d "$(jq -n \
    --arg msg "$COMMIT_MSG" \
    --arg content "$UPDATED_ENCODED" \
    --arg sha "$SHA" \
    --arg branch "$BRANCH" \
    '{message: $msg, content: $content, sha: $sha, branch: $branch}')")

NEW_SHA=$(echo "$COMMIT_RESPONSE" | jq -r '.content.sha')

if [[ "$NEW_SHA" == "null" || -z "$NEW_SHA" ]]; then
  echo "❌ Failed to update index.json"
  exit 1
fi

echo "✅ index.json updated!"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "  ✅ All done!"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "  🌐 URL: $URL"
echo "  📊 Site rebuilds in ~60s"
echo "  🔗 https://rmx3031-archive.pages.dev"
echo ""

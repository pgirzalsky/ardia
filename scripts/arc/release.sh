#!/usr/bin/env bash
# Builds the fork (origin/arc-style-spacing) as "Ardia Arc", publishes it as a GitHub release
# of pgirzalsky/ardia and updates the Sparkle feed, so installed copies update themselves.
#   scripts/arc/release.sh            build + publish only when the branch has a new commit
#   scripts/arc/release.sh --force    build + publish regardless
#   scripts/arc/release.sh --no-publish   build and package only
# Needs: Xcode, pnpm, pod, gh (logged in as pgirzalsky), and the Sparkle key in the login
# Keychain under the account "ardia-arc" (Sparkle's generate_keys --account ardia-arc).
set -euo pipefail

# Run from a private copy: the build checks out other commits, which may rewrite this file.
if [ -z "${ARC_COPIED:-}" ]; then
  tmp=$(mktemp -t ardia-arc-release); cp "$0" "$tmp"; ARC_COPIED=1 exec bash "$tmp" "$@"
fi

export LANG=en_US.UTF-8 LC_ALL=en_US.UTF-8
export PATH="$HOME/.nvm/versions/node/v22.17.1/bin:/opt/homebrew/bin:/usr/local/bin:$PATH"

FORK=pgirzalsky/ardia
BRANCH=arc-style-spacing
BUNDLE_ID=com.pgirzalsky.ardia.arc
APP_NAME="Ardia Arc"
FEED="https://github.com/$FORK/releases/latest/download/appcast.xml"
SPARKLE_ACCOUNT=ardia-arc
PUBLIC_KEY=pwnwmkKBU2ycLqRZE41NGuAfDdhYGjvJcMImQuW7etI=
SOURCE="${ARC_SOURCE:-$HOME/Developer/ardia}"
TREE="${ARC_TREE:-$HOME/Developer/ardia-arc-build}"
STATE="$HOME/Library/Application Support/ardia-arc-build"
mkdir -p "$STATE"

force=0 publish=1
for a in "$@"; do case "$a" in --force) force=1 ;; --no-publish) publish=0 ;; esac; done

exec > >(tee -a "$STATE/release.log") 2>&1
echo "== $(date '+%F %T') =="

# one build at a time
lock="$STATE/lock"
if ! mkdir "$lock" 2>/dev/null; then
  pid=$(cat "$lock/pid" 2>/dev/null || true)
  if [ -n "$pid" ] && kill -0 "$pid" 2>/dev/null; then echo "already running ($pid)"; exit 0; fi
  rm -rf "$lock"; mkdir "$lock"
fi
echo $$ > "$lock/pid"; trap 'rm -rf "$lock"' EXIT

cd "$SOURCE"
git fetch -q origin "$BRANCH"
sha=$(git rev-parse "origin/$BRANCH")
last=$(cat "$STATE/last-sha" 2>/dev/null || true)
if [ "$force" = 0 ] && [ "$sha" = "$last" ]; then echo "nothing new ($sha)"; exit 0; fi
echo "building $sha"

# a separate worktree so the day-to-day checkout is never touched
if [ ! -d "$TREE" ]; then git worktree add --detach "$TREE" "$sha"; fi
cd "$TREE"
git checkout -q --detach "$sha"
git clean -fdq -e build-release -e node_modules -e Pods -e build-ardiacore

build=$(git rev-list --count HEAD)
version=$(sed -n 's/.*MARKETING_VERSION = "\{0,1\}\([^";]*\).*/\1/p' apps/browser/macos/Ardia.xcodeproj/project.pbxproj | head -1)
echo "version $version build $build"

pnpm install --frozen-lockfile
( cd apps/browser/macos && pod install )

cd apps/browser
xcodebuild -workspace macos/Ardia.xcworkspace -scheme Ardia-macOS -derivedDataPath build-release \
  -destination 'platform=macOS,arch=arm64' -quiet -configuration Release -xcconfig macos/AdHoc.xcconfig \
  PRODUCT_BUNDLE_IDENTIFIER="$BUNDLE_ID" CURRENT_PROJECT_VERSION="$build"

src=build-release/Build/Products/Release/Ardia.app
out="$STATE/dist/$build"; rm -rf "$out"; mkdir -p "$out"
app="$out/$APP_NAME.app"
ditto "$src" "$app"

plist="$app/Contents/Info.plist"
pb() { /usr/libexec/PlistBuddy -c "$1" "$plist"; }
pb "Set :SUFeedURL $FEED"
pb "Set :SUPublicEDKey $PUBLIC_KEY"
pb "Set :CFBundleIdentifier $BUNDLE_ID"
pb "Set :CFBundleVersion $build"
pb "Add :CFBundleDisplayName string $APP_NAME" 2>/dev/null || pb "Set :CFBundleDisplayName $APP_NAME"
# the fork's own icon (Assets.car's AppIcon would win over the .icns, so drop CFBundleIconName)
cp "$TREE/scripts/arc/AppIcon.icns" "$app/Contents/Resources/AppIcon.icns"
pb "Delete :CFBundleIconName" 2>/dev/null || true
pb "Set :CFBundleIconFile AppIcon"
codesign --force --deep --sign - "$app"
codesign --verify --deep --strict "$app"

zip="$out/Ardia-Arc-$build.zip"
ditto -c -k --sequesterRsrc --keepParent "$app" "$zip"
sign=$("$SOURCE/apps/browser/macos/Pods/Sparkle/bin/sign_update" --account "$SPARKLE_ACCOUNT" "$zip")
echo "signed: $sign"
minos=$(/usr/libexec/PlistBuddy -c 'Print :LSMinimumSystemVersion' "$plist" 2>/dev/null || echo 13.0)
tag="arc-$build"
cat > "$out/appcast.xml" <<XML
<?xml version="1.0" encoding="utf-8"?>
<rss version="2.0" xmlns:sparkle="http://www.andymatuschak.org/xml-namespaces/sparkle">
  <channel>
    <title>$APP_NAME</title>
    <item>
      <title>$APP_NAME $version ($build)</title>
      <pubDate>$(LC_ALL=C date -u '+%a, %d %b %Y %H:%M:%S +0000')</pubDate>
      <sparkle:version>$build</sparkle:version>
      <sparkle:shortVersionString>$version</sparkle:shortVersionString>
      <sparkle:minimumSystemVersion>$minos</sparkle:minimumSystemVersion>
      <enclosure url="https://github.com/$FORK/releases/download/$tag/Ardia-Arc-$build.zip" type="application/octet-stream" $sign/>
    </item>
  </channel>
</rss>
XML

if [ "$publish" = 0 ]; then echo "built, not published: $out"; exit 0; fi
git -C "$SOURCE" fetch -q origin "$BRANCH"
gh release create "$tag" "$zip" "$out/appcast.xml" --repo "$FORK" --target "$sha" --latest \
  --title "$APP_NAME $version ($build)" \
  --notes "Built from \`$BRANCH\` at $sha. Installed copies pick this up through Sparkle."
echo "$sha" > "$STATE/last-sha"
echo "published $tag"

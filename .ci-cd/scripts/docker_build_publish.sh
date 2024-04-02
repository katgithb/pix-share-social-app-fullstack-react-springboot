: "${USERNAME:?USERNAME not set or empty}"
: "${REPO:?REPO not set or empty}"
: "${TAG:?TAG not set or empty}"

set -e

docker buildx create --use

docker buildx build \
--push \
--platform=linux/amd64,linux/arm64 \
--tag "${USERNAME}/${REPO}:${TAG}" \
--tag "${USERNAME}/${REPO}:latest" \
"${@:2}" \
"$1"
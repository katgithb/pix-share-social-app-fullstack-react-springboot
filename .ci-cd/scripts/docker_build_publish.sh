#!/bin/bash

# Validate input variables
function validate_args() {
  for arg in "$@"; do
    if [ -z "${!arg}" ]; then
      echo "ERROR: $arg not set or empty"
      exit 1
    fi
  done
}

validate_args USERNAME REPO TAG

docker buildx create --use

docker buildx build \
--platform=linux/amd64,linux/arm64 \
-t "${USERNAME}/${REPO}:${TAG}" \
-t "${USERNAME}/${REPO}:latest" \
--push \
"${@:2}" \
"$1"
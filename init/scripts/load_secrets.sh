#!/bin/sh
set -e

# Load all files from secrets dir into env vars
for filename in /run/secrets/* ; do
  var_name=${filename##*/}
  # Convert var_name to upper snake case
  var_name=$(echo "${var_name}" | tr '-' '_' | tr '[:lower:]' '[:upper:]')

  export "${var_name}"="$(cat "$filename")"
done

# Start main process
exec "$@"
#!/bin/bash
set -e

# Replace placeholder with actual password from secret
sed "s/PLACEHOLDER_ELASTIC_PASSWORD/$(cat /run/secrets/els_password)/g" \
    /tmp/filebeat.yml.template > /usr/share/filebeat/filebeat.yml

# Start filebeat with provided arguments
exec /usr/share/filebeat/filebeat "$@"
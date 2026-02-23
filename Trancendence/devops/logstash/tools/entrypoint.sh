#!/bin/bash
set -e
# Secret als Env lesen (Pfad fix, aber intern)
sed "s/PLACEHOLDER_LOGSTASH_PASSWORD/$(cat /run/secrets/logstash_password)/g" \
    /tmp/logstash.conf.template > /usr/share/logstash/pipeline/logstash.conf

if [ -f /run/secrets/els_password ]; then
  export ELASTIC_PASSWORD="$(cat /run/secrets/els_password)"
fi
exec logstash -f /usr/share/logstash/pipeline/logstash.conf
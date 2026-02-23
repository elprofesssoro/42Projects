#!/bin/bash
set -e

export ELASTIC_PASSWORD="$(cat /run/secrets/els_password)"
echo " pwd: $ELASTIC_PASSWORD"
export KIBANA_PASSWORD="$(cat /run/secrets/kibana_password)"
echo " pwd: $KIBANA_PASSWORD"
export XPACK_SECURITY_ENCRYPTIONKEY="$(cat /run/secrets/kibana_encryption_key1)"
export XPACK_ENCRYPTEDSAVEDOBJECTS_ENCRYPTIONKEY="$(cat /run/secrets/kibana_encryption_key2)"
export XPACK_REPORTING_ENCRYPTIONKEY="$(cat /run/secrets/kibana_encryption_key3)"

#wait for Elastic_search do be "alive"
until curl -f -k -u elastic:"${ELASTIC_PASSWORD}" https://els:9200/_security/user/elastic; 
do
	sleep 5
done

#Set password for kibana_system user (built-in user)
echo "Setting password for kibana_system user..."
curl -s -k -u elastic:"${ELASTIC_PASSWORD}" -X POST "https://els:9200/_security/user/kibana_system/_password" \
	-H "Content-Type: application/json" \
	-d "{\"password\":\"${KIBANA_PASSWORD}\"}"

export ELASTICSEARCH_USERNAME="kibana_system"
export ELASTICSEARCH_PASSWORD="${KIBANA_PASSWORD}"
echo " pwd: $ELASTICSEARCH_PASSWORD"

/usr/local/bin/kibana-docker "$@" &

# Wait until Kibana ready:
until curl -fk https://localhost:5601/api/status | grep -q '"level":"available"'; do
    echo "Waiting for Kibana API up..."
    sleep 5
done

# Saved Objects importieren!
echo "Importiere Saved Objects..."
curl -fk -u elastic:"${ELASTIC_PASSWORD}" \
     -H "kbn-xsrf: true" \
     -F "file=@/import/kibana_objects.ndjson" \
     -X POST https://localhost:5601/api/saved_objects/_import?overwrite=true

# Kibana im Vordergrund halten!
wait %1
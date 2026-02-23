#!/bin/bash
set -e #->stop if there is a error

# get pwd from secret if existing
if [ -f /run/secrets/els_password ]; then
export ELASTIC_PASSWORD="$(cat /run/secrets/els_password)"
fi

#-----Cert Generation-----#
# CERTS_DIR="/usr/share/elasticsearch/config/certs"
# mkdir -p "$CERTS_DIR"

# if [[ ! -f "$CERTS_DIR/ca/ca.crt" ]]; then
# 	echo "Generiere Certificats.."
# 	/usr/share/elasticsearch/bin/elasticsearch-certutil ca --pem --silent --out "$CERTS_DIR/ca.zip"
# 	unzip "$CERTS_DIR/ca.zip" -d "$CERTS_DIR"
# 	rm "$CERTS_DIR/ca.zip"

# 	CERTS_DNS="localhost,els,elasticsearch,$(hostname)"
# 	CERTS_IP="127.0.0.1,$(hostname -i)"
# 	#node singnen 

# 	/usr/share/elasticsearch/bin/elasticsearch-certutil cert --pem --silent   \
# 		--ca-cert "$CERTS_DIR/ca/ca.crt" --ca-key "$CERTS_DIR/ca/ca.key"\
# 		--name elasticsearch --dns "$CERTS_DNS" --ip "$CERTS_IP"  \
# 		-out "$CERTS_DIR/elastic.zip"

# 	unzip "$CERTS_DIR/elastic.zip" -d "$CERTS_DIR"
# 	rm "$CERTS_DIR/elastic.zip"

# 	#logstash cert
# 	/usr/share/elasticsearch/bin/elasticsearch-certutil cert --pem --silent   \
# 		--ca-cert "$CERTS_DIR/ca/ca.crt" --ca-key "$CERTS_DIR/ca/ca.key"\
# 		--name logstash --dns "localhost,logstash" \
# 		-out "$CERTS_DIR/logstash.zip"

# 	unzip "$CERTS_DIR/logstash.zip" -d "$CERTS_DIR"
# 	rm "$CERTS_DIR/logstash.zip"

# 	/usr/share/elasticsearch/bin/elasticsearch-certutil cert --pem --silent \
# 		--ca-cert "$CERTS_DIR/ca/ca.crt" --ca-key "$CERTS_DIR/ca/ca.key" \
# 		--name kibana --dns "kibana,localhost" \
# 		-out "$CERTS_DIR/kibana.zip"

# 	unzip "$CERTS_DIR/kibana.zip" -d "$CERTS_DIR"
# 	rm "$CERTS_DIR/kibana.zip"

# find /usr/share/elasticsearch/config/certs -type f -name "*.key" -exec chmod 600 {} \;
# echo "Certs ready: $CERTS_DIR"
# else
# echo "Certs existieren bereits."
# fi

# els starting in backround 
echo "Starting Elasticsearch..."
/usr/local/bin/docker-entrypoint.sh elasticsearch &

ES_PID=$! # -> saves the process id to wait for it at the end

echo "Waiting for ES..."
echo " ${ELASTIC_PASSWORD}"
until curl -k -fs -u elastic:"$ELASTIC_PASSWORD" https://localhost:9200/_cluster/health | grep -q '"status":"yellow\|green"'; do
  sleep 5
done
echo "ES ready!"
#-----Creating Logstash_writer Role-----#
echo "Creating Logstash role/user if missing..."
EXISTS=$(curl -ks -u elastic:"${ELASTIC_PASSWORD}" -w "%{http_code}" https://localhost:9200/_security/role/logstash_writer -o /dev/null -s)
if [ "$EXISTS" != "200" ]; then
  curl -ks -u elastic:"${ELASTIC_PASSWORD}" -X POST https://localhost:9200/_security/role/logstash_writer \
    -H "Content-Type: application/json" \
    -d '{
      "cluster": ["monitor", "manage_index_templates", "manage_ilm"],
      "indices": [{"names": ["logstash-*", "ecs-logstash-*", "logs-docker-*", "logs-*"], "privileges": ["write", "create", "create_index", "manage", "manage_ilm", "auto_configure", "all"]}]
    }'
fi
#user erstellen
curl -ks -u elastic:"${ELASTIC_PASSWORD}" \
-X POST "https://localhost:9200/_security/user/filebeat_user" \
-H "Content-Type: application/json" \
-d "{
	\"password\": \"$(cat /run/secrets/filebeat_password)\",
	\"roles\": [\"beats_system\", \"kibana_admin\"]
}"

curl -ks -u elastic:"${ELASTIC_PASSWORD}" \
-X POST "https://localhost:9200/_security/user/logstash_user" \
-H "Content-Type: application/json" \
-d "{
	\"password\": \"$(cat /run/secrets/logstash_password)\",
	\"roles\": [\"logstash_system\", \"logstash_writer\"]
}"


#policy
echo "Creating ILM Policy for log retention..."
curl -ks -u elastic:"${ELASTIC_PASSWORD}" \
-X PUT "https://localhost:9200/_ilm/policy/logs-policy" \
-H "Content-Type: application/json" \
-d '{
	"policy": {
	"phases": {
		"hot": {
		"actions": {
			"rollover": {
			"max_age": "1d",
			"max_primary_shard_size": "50gb"
			}
		}
		},
		"delete": {
		"min_age": "7d",
		"actions": {
			"delete": {}
		}
		}
	}
	}
}'

echo "Creating index template with ILM policy..."
curl -ks -u elastic:"${ELASTIC_PASSWORD}" \
-X PUT "https://localhost:9200/_index_template/logs-template" \
-H "Content-Type: application/json" \
-d '{
	"index_patterns": ["system-logs-*", "filebeat-*", "logstash-*"],
	"template": {
	"settings": {
		"number_of_shards": 1,
		"number_of_replicas": 0,
		"index.lifecycle.name": "logs-policy",
		"index.lifecycle.rollover_alias": "logs"
	}
	}
}'

echo "ILM Policy and Index Template created successfully!"

echo "els entryscript is done"
# 5. Warte auf ES-Prozess
wait $ES_PID
FROM docker.elastic.co/kibana/kibana:8.15.0

USER root
COPY tools/kibana_script.sh /usr/local/bin/kibana_entry.sh
COPY saved_objects/kibana_objects.ndjson /import/kibana_objects.ndjson
RUN chmod +x /usr/local/bin/kibana_entry.sh

USER kibana

HEALTHCHECK --interval=30s --timeout=10s --retries=3 \
  CMD ["sh", "-c", "curl -fk https://localhost:5601/api/status || exit 1"]

ENTRYPOINT ["/usr/local/bin/kibana_entry.sh"]
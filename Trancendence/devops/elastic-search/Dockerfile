FROM docker.elastic.co/elasticsearch/elasticsearch:8.15.0

USER root
RUN apt-get update && apt-get install -y curl unzip && rm -rf /var/lib/apt/lists/*

COPY tools/entrypoint.sh /usr/local/bin/els_entry.sh
RUN chmod +x /usr/local/bin/els_entry.sh
USER elasticsearch

HEALTHCHECK --interval=30s --timeout=10s --retries=3 \
  CMD ["sh", "-c", "curl -fs -u elastic:${cat /run/secrets/els_password} https://localhost:9200/_cluster/health?wait_for_status=yellow&timeout=5s || exit 1"]


ENTRYPOINT [ "/usr/local/bin/els_entry.sh" ]
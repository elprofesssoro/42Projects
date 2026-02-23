# FROM docker.elastic.co/beats/filebeat:8.15.0

# USER root
# COPY filebeat.yml.template /tmp/filebeat.yml.template
# RUN sed "s/PLACEHOLDER_ELASTIC_PASSWORD/$(cat /run/secrets/els_password)/g" \
#     /tmp/filebeat.yml.template > /usr/share/filebeat/filebeat.yml && \
#     rm /tmp/filebeat.yml.template
# USER filebeat

# HEALTHCHECK --interval=30s --timeout=5s --retries=3 \
#   CMD ["sh", "-c", "pgrep filebeat || exit 1"]

FROM docker.elastic.co/beats/filebeat:8.15.0

USER root
COPY filebeat.yml.template /tmp/filebeat.yml.template
COPY entrypoint.sh /usr/local/bin/entrypoint.sh
RUN chmod +x /usr/local/bin/entrypoint.sh

USER filebeat

HEALTHCHECK --interval=30s --timeout=5s --retries=3 \
  CMD ["sh", "-c", "pgrep filebeat || exit 1"]

ENTRYPOINT ["/usr/local/bin/entrypoint.sh"]
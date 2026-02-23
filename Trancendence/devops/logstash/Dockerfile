FROM docker.elastic.co/logstash/logstash:8.15.0

USER root
RUN rm -rf /usr/share/logstash/pipeline && \
    mkdir -p /usr/share/logstash/pipeline && \
    chown -R logstash:logstash /usr/share/logstash/pipeline && \
    chmod 755 /usr/share/logstash/pipeline
COPY tools/logstash.conf.template /tmp/logstash.conf.template
COPY tools/entrypoint.sh /usr/local/bin/logstash_entry.sh
RUN chmod 755 /usr/local/bin/logstash_entry.sh
COPY tools/logstash.yml /usr/share/logstash/config/
USER logstash


HEALTHCHECK --interval=30s --timeout=5s --retries=3 \ 
	CMD ["sh", "-c", "curl -f http://localhost:9600/_node/stats || exit 1" ]

ENTRYPOINT [ "/usr/local/bin/logstash_entry.sh" ]
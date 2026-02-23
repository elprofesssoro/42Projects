FROM otel/opentelemetry-collector:latest

HEALTHCHECK --interval=30s --timeout=5s --retries=3 \
  CMD curl -f http://localhost:13133/ || exit 1

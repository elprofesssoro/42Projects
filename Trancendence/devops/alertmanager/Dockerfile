FROM prom/alertmanager:latest

HEALTHCHECK --interval=30s --timeout=10s --retries=3 \
  CMD ["sh", "-c", "wget --spider -q http://localhost:9093/-/healthy || exit 1"]
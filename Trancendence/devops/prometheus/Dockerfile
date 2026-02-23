FROM prom/prometheus:latest

HEALTHCHECK --interval=30s --timeout=5s --retries=3 \
  CMD ["sh", "-c", "wget --spider -q http://localhost:9090/-/healthy || exit 1"]
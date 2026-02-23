FROM grafana/grafana:latest

USER root
RUN apk add --no-cache curl openssl
USER grafana

HEALTHCHECK --interval=30s --timeout=5s --retries=3 \
	CMD ["sh", "-c", "curl -k -f https://localhost:3000/api/health || exit 1" ]
FROM debian:bullseye

RUN apt update && apt install -y nginx openssl

RUN mkdir -p /etc/nginx/tools && \
    openssl req -x509 -nodes -days 365 \
        -subj "/C=EU/ST=None/L=None/O=Inception/CN=localhost" \
        -newkey rsa:2048 \
        -keyout /etc/nginx/tools/nginx.key \
        -out /etc/nginx/tools/nginx.crt


COPY conf/nginx.conf /etc/nginx/nginx.conf
COPY tools/setup.html /var/www/html/setup.html
CMD ["nginx", "-g", "daemon off;"]


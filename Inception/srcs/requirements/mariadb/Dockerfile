FROM debian:bullseye

RUN apt update && apt install -y  mariadb-server && mkdir -p /var/lib/mysql

COPY tools/entrypoint.sh /usr/local/bin
RUN chmod +x /usr/local/bin/entrypoint.sh
COPY conf/server.cnf /etc/mysql/mariadb.conf.d/server.cnf
EXPOSE 3306


ENTRYPOINT ["/usr/local/bin/entrypoint.sh"]

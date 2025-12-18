#!/bin/bash

MDB_PASSWORD=$(cat /run/secrets/db_password)
MDB_ROOT_PASSWORD=$(cat /run/secrets/db_root_password)

echo "Starting MariaDB entrypoint"
echo "PASSWORD: ${MDB_PASSWORD}"
echo "ROOT: ${MDB_ROOT_PASSWORD}"
mkdir -p /run/mysqld
chown -R mysql:mysql /run/mysqld

if [ ! -d "/var/lib/mysql/mysql" ]; then
	echo "Initializing database"
	mariadb-install-db --user=mysql --ldata=/var/lib/mysql
fi

su -s /bin/sh mysql -c "mysqld --skip-networking &"
sleep 5

mariadb -e "CREATE DATABASE IF NOT EXISTS ${MDB_NAME};"
mariadb -e "CREATE USER IF NOT EXISTS '${MDB_USER}'@'%' IDENTIFIED BY '${MDB_PASSWORD}';"
mariadb -e "GRANT ALL PRIVILEGES ON ${MDB_NAME}.* TO '${MDB_USER}'@'%';"
mariadb -e "FLUSH PRIVILEGES;"

mysqladmin shutdown

exec su -s /bin/sh mysql -c "mysqld"

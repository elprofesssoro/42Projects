#!/bin/sh
set -e

MDB_PASSWORD=$(cat /run/secrets/db_password)
WP_ADMIN_PASSWORD=$(cat /run/secrets/wp_admin_password)
WP_USER_PASSWORD=$(cat /run/secrets/wp_user_password)

echo "Debug: DB Host is mariadb:3306"
echo "Debug: DB Name is $MDB_NAME"
echo "Debug: DB User is $MDB_USER"

until mariadb -h mariadb -u "$MDB_USER" -p"$MDB_PASSWORD" -e "SELECT 1;" >/dev/null 2>&1; do
    echo "Waiting for MariaDB..."
    sleep 2
done

if [ ! -f /var/www/html/wp-config.php ]; then
    echo "Downloading WordPress"
    wp core download --path=/var/www/html --allow-root

    echo "Creating wp-config"
    wp config create \
        --path=/var/www/html \
        --dbname="$MDB_NAME" \
        --dbuser="$MDB_USER" \
        --dbpass="$MDB_PASSWORD" \
        --dbhost="mariadb:3306" \
        --allow-root

    echo "Installing WordPress"
    wp core install \
        --path=/var/www/html \
        --url="$WP_URL" \
        --title="$WP_TITLE" \
        --admin_user="$WP_ADMIN" \
        --admin_password="$WP_ADMIN_PASSWORD" \
        --admin_email="$WP_ADMIN_EMAIL" \
        --skip-email \
        --allow-root
	
    echo "Creating Guest User..."
	
    wp user create \
    	"$WP_USER" "$WP_USER_EMAIL" \
    	--user_pass="$WP_USER_PASSWORD" \
    	--role=author \
    	--path=/var/www/html \
    	--allow-root

    echo "Setting Up Theme..."

    # Install and activate a specific theme
    wp theme install twentytwentytwo --activate --allow-root --path=/var/www/html
    # Create post
    wp post create --post_type=post --post_title="Hello 42" --post_status=publish --allow-root --path=/var/www/html
fi

mkdir -p /run/php
rm -f /var/www/html/setup.html
echo "Starting PHP-FPM..."
exec php-fpm7.4 -F


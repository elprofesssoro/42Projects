---

# 🛠 DEV_DOC.md

# Developer Documentation

This document explains how to set up, build, and maintain the Inception project as a developer.

---

## 1. Environment Configuration

Contains non-sensitive configuration:
Domain name
Database name
Database user
WordPress metadata

---

## 2. Secrets Configuration

Sensitive values are stored in Docker secrets:

Secret File		Purpose
db_password.txt		MariaDB user password
db_root_password.txt	MariaDB root password
wp_admin_password.txt	WordPress admin password
wp_user_password.txt	WordPress user password

Secrets are mounted at runtime:
/run/secrets/<secret_name>

They are read inside container entrypoint scripts.

---

## 3. Building and Running the Project

make is equivalent to: docker compose build; docker compose up -d
make down stops containers
make fclean removes containers and volumes

## 4. Managing Containers

List containers
docker ps -a

List volumes
docker volume ls

Access a container shell
docker exec -it <container> sh

---

## 5. Volumes and Data Persistence

The project uses Docker volumes:

Volume	Stores
mdb	MariaDB database files
wp	WordPress core files and uploads

Volumes persist data even after container restarts.

Location (managed by Docker):
/var/lib/docker/volumes/

---

## 6. Networking

All services are connected to a private Docker bridge network

Only NGINX exposes a port to the host (443)

MariaDB and WordPress are inaccessible from outside

This design improves security and isolation.


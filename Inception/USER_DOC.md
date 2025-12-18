# User Documentation

This document explains how to use the Inception project as an end user or system administrator.

---

## 1. Provided Services

This project deploys a secure WordPress website using Docker containers.  
The infrastructure consists of the following services:

- **NGINX**
  - Acts as a reverse proxy
  - Handles HTTPS (TLS 1.2 / TLS 1.3)
  - Exposes the website on port 443

- **WordPress (PHP-FPM)**
  - Provides the website and administration interface
  - Communicates with the database internally

- **MariaDB**
  - Stores WordPress data (users, posts, configuration)
  - Is not exposed outside the Docker network

All services communicate through a private Docker network.

---

## 2. Starting and Stopping the Project

All commands must be executed from the project root.

### Start
make
### Stop 
make down
### Fully clean
make fclean

---

## 3. Accessing the website

Open in browser: https://idvinov.42.fr

To open WordPress Admin panel: https://idvinov.42.fr/wp-admin

---

## 4. Credentials Management

Non-sensitive configuration: stored in .env
Sensitive data (passwords): stored in Docker secrets inside the secrets/ directory

## 5. Checking Service Status

Check running containers: docker ps
View container logs: docker logs <container_name>
View volumes: docker volume ls



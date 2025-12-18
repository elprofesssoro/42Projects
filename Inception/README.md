# Inception

*This project has been created as part of the 42 curriculum by idvinov.*

# Description
The goal of this project is to design and deploy a complete WordPress infrastructure using Docker containers that communicate with each other.

The infrastructure consists of:
- MariaDB — a database used to store all WordPress data
- WordPress — running with PHP-FPM
- NGINX — a reverse proxy server configured with TLS

Each service runs in its own container and is orchestrated using Docker Compose, following strict security and isolation rules defined by the project.

# Instructions
- Linux VM
- Make
- Docker
- Docker compose
## Build and Run
To build and start containers: make (it calls build and up instructions)
To stop containers: make down
To fully clean containers: make fclean
Once started, the infrastructure is accessible only through https://localhost orhttps://idvinov.42.fr on port 443 (https default port)

# Resources
https://medium.com/@ssterdev/inception-42-project-part-ii-19a06962cf3b
https://github.com/Forstman1/inception-42
https://docs.docker.com/compose/

# Project Design and Docker Architecture
Docker is a powerful tool that allows multiple services to run in isolated environments while sharing the same host kernel. This makes containers lightweight, fast, and efficient compared to traditional virtual machines.

Each service in this project is built from its own dedicated Dockerfile and orchestrated 

# Virtual Machines vs Docker
Virtual machines simulate an entire operating system, including a separate kernel, which results in higher resource usage.

Docker containers, on the other hand, share the host system’s kernel while isolating processes and dependencies. This makes Docker more lightweight, faster to start, and better suited for microservice-based architectures.

# Secrets vs Environment Variables
Environment variables are used for non-sensitive configuration values, while Docker secrets are used to store confidential data such as passwords. This prevents accidental exposure of sensitive information in the Git repository or Docker images.

# Docker Network vs Host Network
A dedicated Docker network is used to allow containers to communicate securely with each other while remaining isolated from the host network. Internal services such as MariaDB and WordPress are not exposed externally, and only NGINX acts as the entry point.

# Docker Volumes vs Bind Mounts
Docker volumes are managed entirely by Docker and are independent of the host filesystem structure. This ensures data persistence, portability, and compliance with the project requirements, unlike bind mounts which depend directly on host paths.

# AI Usage
AI tools were used as a learning aid to:
- clarify Docker and Docker Compose concepts
- understand container networking and volumes
- review configuration choices and security considerations

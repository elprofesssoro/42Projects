all: build up

build:
	@echo "Building Docker containers..."
	docker-compose -f ./srcs/docker-compose.yml build

up:
	@echo "Starting Docker containers..."
	docker-compose -f ./srcs/docker-compose.yml up -d

down:
	@echo "Stopping Docker containers..."
	docker-compose -f ./srcs/docker-compose.yml down

clean:
	@echo "Stopping Docker containers..."
	docker-compose -f ./srcs/docker-compose.yml down

fclean:
	@echo "Cleaning Docker containers..."
	docker-compose -f ./srcs/docker-compose.yml down -v

re: fclean all

.PHONY: all build up clean fclean re down

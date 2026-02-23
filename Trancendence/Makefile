USER_HOME = $(HOME)
DATA_PATH = $(USER_HOME)/Documents/transcendence/data

DEVOPS_FILE = ./devops/docker-compose.devops.yml
GAME_FILE   = ./game/docker-compose.backend.yml

all: up

# Start game only (recommended while fixing websocket/https)
up:
	@echo "==> Starting GAME only (no devops) ..."
	@docker-compose -f ./game/docker-compose.backend.yml up -d --build


# Start everything (after game is stable)
up_all:
	@echo "==> Starting DEVOPS ..."
	@docker compose -f $(DEVOPS_FILE) up -d --build
	@echo "==> Starting GAME ..."
	@docker compose -f $(GAME_FILE) up -d --build

# Devops only
devops:
	@docker compose -f $(DEVOPS_FILE) up -d --build

# Game only
game:
	@docker compose -f $(GAME_FILE) up -d --build


# Game without frontend (if you ever add profiles or split compose)
# currently just starts game as-is
nofront:
	@docker compose -f $(GAME_FILE) up -d --build

down:
	@docker compose -f $(DEVOPS_FILE) down || true
	@docker compose -f $(GAME_FILE) down || true

clear:
	@docker-compose -f $(DEVOPS_FILE) down -v || true
	@docker-compose -f $(GAME_FILE) down -v || true

logs:
	@docker compose -f $(GAME_FILE) logs -f --tail=200

status:
	@docker ps

re: down up
re_all: down up_all

.PHONY: all up up_all down clear status logs re re_all game devops nofront

This project has been created as part of the 42 curriculum by [lfabel], [idvinov], [vvelikov].

## Description
ft_transcendence is a full-stack web application that recreates Pong as a real-time multiplayer game platform with social features, authentication, chat, and advanced monitoring/logging.
The goal is to build an e-sports style hub that showcases microservices architecture, modern web frameworks, and production-grade DevOps practices.
Key features include live Pong matches, user profiles with avatars and friends, game statistics and leaderboards, real-time chat, a secured public API, and observability via ELK and Prometheus/Grafana.
Here we would like to point out that due the small scale of the project and the number of people in our team, we didin't have a very specific roles but rather tried to build and work together by imeplemntenting features in sequantial order. Thus we worked on front and backend together for a better performance and collaboration! Nevertheless, due to the requirements in the project for specificly divided roles and describtion of them, we have decided to add some "roles of implementation".

<details>
<summary>Team Information</summary>
  
### Team Information

#### [lfabel] – Tech Lead / DevOps
Responsible for overall architecture, microservices design, Docker/docker-compose setup, reverse proxy configuration, and observability stack (ELK, Prometheus, Grafana).

#### [idvinov, vvelikov] – Backend & Realtime Developer
Implements authentication and user management, public API, WebSocket gateway, and backend business logic for game and chat.

#### [vvelikov] – Frontend & Game Developer
Builds the SPA frontend, Pong game UI/logic, real-time UX integrations, and statistics/leaderboard pages.

Project Management
The team organized work using short weekly planning sessions and daily check-ins to distribute tasks and track progress.
Tasks and bugs were managed in a kanban-style board (e.g., GitHub Projects / Issues), with each card linked to a branch and pull request.
Communication happened mainly over a shared chat (e.g., Discord/Slack), with voice calls for pair programming, architecture discussions, and debugging sessions.

#### [idvinov] – Quality Assurance
Tests the application to make sure everything works correctly. Checks user features, API endpoints, and real-time functionality for bugs and performance issues. Reports problems to developers, writes test scripts for important features like login, game play, and chat.

</details>
<details>
<summary>Technical Stack</summary>

## Technical Stack

#### Frontend:
- Framework: React (JavaScript) as a Single Page Application.
- Styling: CSS
- Realtime: WebSockets (e.g., Socket.io client) for game state, chat, and live updates.

#### Backend:
- Framework: Express.js (Node.js) for a modular, testable microservice-style backend.
- Communication: REST APIs and WebSockets between services and clients.
- Auth: JWT-based authentication.

#### Database:
- PostgreSQL as the main relational database for users, games, matches, friends, and statistics.
- Chosen for strong consistency, good relational modeling.

#### Other Technologies:
- Docker & docker-compose for containerized deployment of all services (frontend, backend, DB, ELK, Prometheus, Grafana, reverse proxy).
- Nginx as reverse proxy and TLS termination point.
- ELK (Elasticsearch, Logstash, Kibana) for centralized logging.
- Prometheus & Grafana for metrics, dashboards, and alerting.

#### Justification of major choices
- Microservices + Express.js + React provide clear separation of concerns and scalability.
- PostgreSQL matches structured data (users, matches, stats) and supports complex queries.
- ELK/Prometheus/Grafana match production-ready monitoring/logging expectations and the DevOps objectives of the project.
</details>

<details>

<summary>Database Schema</summary>

## Database Schema

### users


| Field         | Type           | Attributes                           | Description                       |
|---------------|----------------|--------------------------------------|-----------------------------------|
| id            | UUID           | PRIMARY KEY                          |                                   |
| username      | VARCHAR(64)    | UNIQUE, NOT NULL                     | Username                          |
| email         | VARCHAR(128)   | UNIQUE, NOT NULL                     | Email address                     |
| password_hash | VARCHAR(128)   | NOT NULL                             | Password hash                     |
| avatar_url    | TEXT           |                                      | Avatar URL                        |
| status        | VARCHAR(16)    | NOT NULL                             | e.g. 'online', 'offline'          |
| created_at    | TIMESTAMP      | DEFAULT CURRENT_TIMESTAMP            | Creation time                     |

### friends

| Field      | Type    | Attributes                            | Description                  |
|------------|---------|---------------------------------------|------------------------------|
| id         | UUID    | PRIMARY KEY                           |                              |
| user_id    | UUID    | REFERENCES users(id) ON DELETE CASCADE| User                         |
| friend_id  | UUID    | REFERENCES users(id) ON DELETE CASCADE| Friend                       |
| created_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP           | Creation time of friendship  |

### games

| Field      | Type        | Attributes                   | Description                  |
|------------|-------------|------------------------------|------------------------------|
| id         | UUID        | PRIMARY KEY                  |                              |
| type       | VARCHAR(32) | NOT NULL                     | e.g. 'pong'                  |
| created_at | TIMESTAMP   | DEFAULT CURRENT_TIMESTAMP    |                              |

### matches

| Field          | Type      | Attributes                              | Description          |
|----------------|-----------|-----------------------------------------|----------------------|
| id             | UUID      | PRIMARY KEY                             |                      |
| game_id        | UUID      | REFERENCES games(id) ON DELETE CASCADE  | Game                 |
| player1_id     | UUID      | REFERENCES users(id) ON DELETE CASCADE  | Player 1             |
| player2_id     | UUID      | REFERENCES users(id) ON DELETE CASCADE  | Player 2             |
| score_player1  | INTEGER   | NOT NULL                                | Score player 1       |
| score_player2  | INTEGER   | NOT NULL                                | Score player 2       |
| winner_id      | UUID      | REFERENCES users(id)                    | Winner               |
| played_at      | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP               | Date played          |

### statistics

| Field     | Type     | Attributes                              | Description          |
|-----------|----------|-----------------------------------------|----------------------|
| id        | UUID     | PRIMARY KEY                             |                      |
| user_id   | UUID     | REFERENCES users(id) ON DELETE CASCADE  | User                 |
| wins      | INTEGER  | DEFAULT 0                               | Wins                 |
| losses    | INTEGER  | DEFAULT 0                               | Losses               |
| rank      | INTEGER  | DEFAULT 0                               | Rank                 |
| level     | INTEGER  | DEFAULT 1                               | Level                |

### messages

| Field       | Type      | Attributes                              | Description                  |
|-------------|-----------|-----------------------------------------|------------------------------|
| id          | UUID      | PRIMARY KEY                             |                              |
| sender_id   | UUID      | REFERENCES users(id) ON DELETE CASCADE  | Sender                       |
| receiver_id | UUID      | REFERENCES users(id)                    | Receiver (or Channel)        |
| content     | TEXT      | NOT NULL                                | Message                      |
| created_at  | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP               | Created time                 |

</details>

<details>
<summary>Features List</summary>

## Features List

#### Multiplayer Pong Game – [vvelikov]
Real-time 2D Pong game where two players can play live matches with clear win/lose conditions.

#### Standard User Management & Authentication – [idvinov]
Registration/login, profile page, updating profile info, avatar upload, and default avatar when none is provided.

#### Game Statistics & Match History (Minor) – [vvelikov]
Track user wins, losses, ranking, level and show match history (opponents, date, result).

#### Public API (Major) – [vvelikov, idvinov]
Secured API key, rate limiting, basic documentation, at least these endpoints (adapt path):
GET /api/games
POST /api/games
PUT /api/games/:id
DELETE /api/games/:id
GET /api/users/:id

#### Allow users to interact with other users - [vvelikov]
Basic chat, friends system and profile system

#### Advanced Permissions System - [vvelikov, idvinov]
different roles, with different views and user managment(delete etc.)

#### Advanced Search functions - [vvelikov]
filters, sorting, and pagination.

#### Realtime Features (Major) – [vvelikov, idvinov]
WebSocket-based updates for game state, chat messages, and online status; graceful connect/disconnect handling.

#### CI/CD Pipeline (Minor) – [lfabel]
Enables automated build and deployment for all services.

#### ELK Log Management (Major) – [lfabel]
Centralized application and access logs in Elasticsearch, processing via Logstash, visualization via Kibana, retention/archiving policies, and secured access.

#### Prometheus & Grafana Monitoring (Major) – [lfabel]
Metrics collection from backend/services, exporters configured, custom dashboards for performance and game metrics, alerting rules, and secured Grafana access.

#### Backend as Microservices (Major) – [lfabel]
Loosely coupled services (e.g., auth, game, chat, stats) with clear interfaces and single responsibility; communication via REST and WebSockets/message broker (if used).

#### Framework Usage (Major) – [idvinov], [vvelikov]
React for frontend SPA; Express.js for backend services; both used fully (routing, controllers, services, components, state).

#### Support for additional Browsers - [vvelikov]
Full compability with nearly all browsers

#### Advanced Search function - [vvelikov]
allows user to filter and search
</details>

<details>
<summary>Modules</summary
                        
## Modules
#### Major Modules (2 pts each):
Infrastructure for log management using ELK (Elasticsearch, Logstash, Kibana).
Monitoring system with Prometheus and Grafana.
Backend as microservices.
Complete web-based real-time game (Pong).
Standard user management and authentication.
Public API with secured API key and rate limiting.
Allow users to interact (chat, profiles, friends).
Real-time features via WebSockets or similar.
Use a framework for both frontend (React) and backend (Express.js).
Advanced Permission System.


#### Minor Modules (1 pt each):
CI/CD Pipeline.
Game statistics and match history.
Support for additional Browsers.
Advanced Search.

Total: 24 points
</details>

<details>
<summary>How each Module was implemented</summary
                                          
## How each Module was Implemented:

#### ELK:
Application and access logs are shipped to Logstash, normalized, then stored in Elasticsearch; Kibana dashboards display request rates, errors, and important events; index lifecycle policies handle retention and archiving; access secured via credentials/reverse proxy.

#### Prometheus & Grafana:
Prometheus scrapes metrics from backend/services and exporters; Grafana shows dashboards for system, app, and game metrics; alert rules trigger notifications on service failures or abnormal latency; healthchecks via blackbox & cadvisor.

#### Microservices Backend:
Separate services (e.g., auth-service, game-service, chat-service, social-service, tournament-service) each run in their own container with their own responsibilities and APIs.

#### Web-based Game:
Pong game implemented with HTML5 canvas/React components, synced over WebSockets; server-side authoritative game loop ensures fairness; scores and results persisted in DB.

#### User Management & Auth
Users can register/login, update profile info, upload avatars, add friends, and see online status; tokens or sessions manage access; profile page shows key info and stats.

#### Public API
REST endpoints expose selected resources; API key required, with rate limiting and documentation.

#### User Interaction (Chat/Friends/Profile):
Chat UI, friends list and requests, profile view; all tied into the same SPA with real-time updates.

#### Realtime Features:
WebSockets used for chat, game state, and presence; reconnect logic handles disconnects gracefully; broadcasting uses rooms/channels to limit unnecessary traffic.

#### Frameworks:
React handles routing, state, and components; Express.js organizes modules/controllers/services, providing structured backend architecture.

#### Game Statistics & Match History:
Statistics updated after each match; dedicated pages show history and achievements, plus leaderboards.

#### Advanced Searching:
Users can filter, sort, and paginate lists such as matches, players, and tournaments in both frontend and backend

#### Standart User management and authentication:
Registration, login, profile editing, avatar upload, and JWT-based authentication are handled by the auth_service and related frontend pages.

#### Support for additional Browser:
The React SPA is tested and compatible with all major browsers.

#### Advanced Permission System:
Role-based access control is implemented in backend middleware, allowing different views and actions for admins and regular users.
</details>
<details>
<summary>Individual Contributions</summary
                                          
**Individual Contributions**

[lfabel]
Designed overall architecture and microservices layout.
Implemented Docker/docker-compose configuration for all services.
Set up ELK stack, log pipelines, retention, and security.
Set up Prometheus and Grafana, dashboards, and alerting.
Implemented health check endpoints.

Challenges: networking between containers, log formats, and metric labels; solved via iterative configuration and local load testing, permissions on the school pc.

[vvelikov, idvinov]
Implemented authentication, user registration/login, JWT handling, and profile updates.
Implemented friends system and online status.
Built WebSocket gateway and backend chat logic.
Implemented the public API controllers and route protection.

Challenges: ensuring consistent real-time updates and token handling; solved by centralizing auth logic and using middleware/guards.

[vvelikov]
Implemented the Pong game frontend and game mechanics.
Integrated WebSockets on the frontend for game and chat.
Built statistics, match history, and leaderboard pages.
Worked on responsive UI and UX for the SPA.

*Challenges:* synchronizing game state between clients and keeping smooth performance; solved by server-authoritative logic and interpolation on the client.
</details>

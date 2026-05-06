### Hashing

A one-way process of obfuscating the data. Once done, the original data cannot be retrieved, but it can be verified.

Storing passwords in plain text is bad. We want to treat security like layers of onion. Just because someone can't get into our server doesn't mean we shouldn't protect the data within.

Hashing allows us to check if the password is correct without us ever seeing the original value.

bcrypt.js is a popular library which allows us implementation of hashing on our server

Bcrypt will run its own hashing algorithm and take a salt to generate a hash.

Salt is a random data appended to the end of the hash (multiple times) to prevent rainbow table attacks.

# Docker

Allows us to containerize our application so that it's packaged and doesn't cause issues when deployed on different machine configurations.

See lesson for difference between a VM and a container

### Files

`server/Dockerfile`
- Builds the backend image
- Installs server dependencies
- Exposes port `4000`
- Starts the API with `npm start`

`client/Dockerfile`
- Builds the frontend image
- Installs client dependencies
- Exposes port `5173`
- Starts Vite with `npm run dev -- --host 0.0.0.0`

`docker-compose.yml`
- Starts the full stack together
- Creates these services: `db`, `server`, `client`
- Creates the named volume `postgres_data` for Postgres persistence

### Dockerfile Line Explanations

`server/Dockerfile`

```dockerfile
FROM node:25.3.0
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 4000
CMD [ "npm", "start" ]
```

- `FROM node:25.3.0` - uses the Node.js 25.3.0 base image so the container already has Node and npm installed.
- `WORKDIR /app` - sets `/app` as the working directory inside the container. Later commands run from this folder.
- `COPY package*.json ./` - copies `package.json` and `package-lock.json` into the container first, so dependency installation can be cached.
- `RUN npm install` - installs server dependencies inside the image.
- `COPY . .` - copies the rest of the server source code into the container.
- `EXPOSE 4000` - documents that the app inside the container listens on port `4000`. This does not publish the port by itself.
- `CMD [ "npm", "start" ]` - tells the container what command to run when it starts.

`client/Dockerfile`

```dockerfile
FROM node:25.3.0
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 5173
CMD [ "npm", "run", "dev", "--", "--host", "0.0.0.0" ]
```

- `FROM node:25.3.0` - uses the same Node base image for the frontend container.
- `WORKDIR /app` - makes `/app` the active folder inside the container.
- `COPY package*.json ./` - copies package manifest files before app code.
- `RUN npm install` - installs client dependencies inside the image.
- `COPY . .` - copies the frontend source code into the container.
- `EXPOSE 5173` - documents that the Vite dev server listens on port `5173` inside the container.
- `CMD [ "npm", "run", "dev", "--", "--host", "0.0.0.0" ]` - starts the Vite dev server and binds it to `0.0.0.0` so it is reachable from outside the container.

### Docker Compose Line Explanations

```yaml
services:
  db:
    image: postgres:17
    container_name: pern_db
    restart: always
    environment:
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: dbLocal
      POSTGRES_DB: supercarstore
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data
  server:
    build: ./server
    container_name: pern_server
    ports:
      - "4000:4000"
    env_file:
      - ./server/.env
    environment:
      HOST: 0.0.0.0
      PORT: 4000
    depends_on:
      - db
    volumes:
      - ./server:/app
      - /app/node_modules
  client:
    build: ./client
    container_name: pern_client
    ports:
      - "5173:5173"
    depends_on:
      - server
    volumes:
      - ./client:/app
      - /app/node_modules

volumes:
  postgres_data:
```

- `services:` - starts the list of containers Docker Compose should create.
- `db:` - names the Postgres service `db`. Other services can reach it by this name on the Compose network.
- `image: postgres:17` - pulls and uses the official Postgres 17 image instead of building a custom one.
- `container_name: pern_db` - gives the running database container a fixed name.
- `restart: always` - tells Docker to restart the database container automatically if it stops.
- `environment:` - starts a block of environment variables passed into the container.
- `POSTGRES_USER: postgres` - creates the default Postgres user named `postgres`.
- `POSTGRES_PASSWORD: dbLocal` - sets the password for that Postgres user.
- `POSTGRES_DB: supercarstore` - creates the database named `supercarstore` on first startup.
- `ports:` - starts the list of port mappings between your machine and the container.
- `"5432:5432"` - maps port `5432` on your machine to port `5432` inside the container. Left side is the host port, right side is the container port.
- `volumes:` - starts the list of storage mounts for that service.
- `postgres_data:/var/lib/postgresql/data` - stores Postgres data in the named volume `postgres_data` so the database survives container recreation.
- `server:` - names the backend API service `server`.
- `build: ./server` - tells Compose to build the backend image from the `server` folder.
- `container_name: pern_server` - gives the API container a fixed name.
- `"4000:4000"` - maps port `4000` on your machine to port `4000` inside the server container.
- `env_file:` - loads environment variables from a file.
- `./server/.env` - points Compose to the backend env file.
- `HOST: 0.0.0.0` - overrides the backend host so Express listens on all network interfaces inside the container.
- `PORT: 4000` - tells the backend to listen on port `4000`.
- `depends_on:` - defines service startup order.
- `- db` - starts the `db` service before starting `server`.
- `./server:/app` - bind mounts the local `server` folder into `/app` in the container so local code changes are reflected inside the container.
- `/app/node_modules` - keeps container-installed `node_modules` inside the container instead of replacing them with the host folder.
- `client:` - names the frontend service `client`.
- `build: ./client` - tells Compose to build the frontend image from the `client` folder.
- `container_name: pern_client` - gives the frontend container a fixed name.
- `"5173:5173"` - maps port `5173` on your machine to port `5173` inside the client container.
- `- server` under `depends_on` - starts the backend before the frontend container starts.
- `./client:/app` - bind mounts the local client folder into the container.
- `/app/node_modules` - preserves the container's own frontend dependencies.
- `volumes:` at the bottom - declares named volumes available to the whole Compose project.
- `postgres_data:` - creates the named volume used by the database service.

### Run From

Run Docker commands from the project root:

```bash
cd ..
```

That directory contains:

```text
docker-compose.yml
client/Dockerfile
server/Dockerfile
```

### Dockerfile Commands

Build only the backend image:

```bash
docker build -t supercar-server ./server
```

Build only the frontend image:

```bash
docker build -t supercar-client ./client
```

Run only the backend container:

```bash
docker run --rm -p 4000:4000 --env-file ./server/.env supercar-server
```

Run only the frontend container:

```bash
docker run --rm -p 5173:5173 supercar-client
```

List local images:

```bash
docker images
```

Remove a local image:

```bash
docker rmi supercar-server
docker rmi supercar-client
```

### Docker Compose Commands

Build and start the full stack:

```bash
docker compose up --build
```

Start the stack without rebuilding:

```bash
docker compose up
```

Start the stack in the background:

```bash
docker compose up -d
```

Stop the stack and remove containers/networks:

```bash
docker compose down
```

Stop the stack and also remove the Postgres volume:

```bash
docker compose down -v
```

Rebuild images without starting containers:

```bash
docker compose build
```

Restart one service:

```bash
docker compose restart server
docker compose restart client
docker compose restart db
```

View running services:

```bash
docker compose ps
```

View logs for all services:

```bash
docker compose logs
```

Follow logs live:

```bash
docker compose logs -f
```

Follow logs for one service:

```bash
docker compose logs -f server
docker compose logs -f client
docker compose logs -f db
```

Open a shell in a running container:

```bash
docker compose exec server sh
docker compose exec client sh
docker compose exec db sh
```

Run a one-off command in the server container:

```bash
docker compose run --rm server npm install
```

### Ports

- `client` -> `http://localhost:5173`
- `server` -> `http://localhost:4000`
- `db` -> `localhost:5432`

### Notes

- `docker compose up --build` is the safest command after changing either Dockerfile.
- `docker compose down -v` deletes the database volume, so use it only when you want a fresh Postgres instance.
- The server loads environment values from `server/.env`, but Compose overrides `HOST` to `0.0.0.0` and keeps `PORT` on `4000`.

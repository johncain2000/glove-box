#### This app is structured into two separate folders, client and server. Each folder needs to be setup and ran separately.

## Environment Dev

### Node Version
```
nvm use
```

### Create .env based on example in etc/environment.example
```
source .env
need to set proper environmental variables for client and server
client: vue_backend_url
server: vue_backend_url, jwt_key, jwt_expires_in, mongo_db_uri
Windows use $env:JWT_EXPIRES_IN="2d" to set env variables in
powershell before running for dev... will use docker containers for prod
```

## Client folder
### Project setup
```
npm install
```

#### Compiles and hot-reloads for development
```
npm run serve
```

#### Compiles and minifies for production
```
npm run build
```

#### Lints and fixes files
```
npm run lint
```

## Server folder
### Project setup
```
npm install
```

#### Start server
```
npm start
```

## Environment Prod (Docker)

```
docker build -t vue-node-image .

docker run -d -it -p  443:443 --name vue-node-ui vue-node-image
```
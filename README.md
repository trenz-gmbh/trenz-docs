# trenz-docs

[![Node.js CI](https://github.com/trenz-gmbh/trenz-docs/actions/workflows/node.js.yml/badge.svg)](https://github.com/trenz-gmbh/trenz-docs/actions/workflows/node.js.yml)
[![Docker Image CI](https://github.com/trenz-gmbh/trenz-docs/actions/workflows/docker-image.yml/badge.svg)](https://github.com/trenz-gmbh/trenz-docs/actions/workflows/docker-image.yml)

## Project setup

```
npm install
```

### Compiles and hot-reloads for development

```
npm run serve
```

### Compiles and minifies for production

```
npm run build
```

### Lints and fixes files

```
npm run lint
```

## Deployment

To deploy a trenz-docs wiki, follow these steps:

1. create a `docker-compose.yml` or copy the one from this repository and replace the ports:
   ```docker-compose.yml
   version: '3.4'
 
   services:
     frontend:
       image: ghcr.io/trenz-gmbh/trenz-docs:latest
       ports:
         - "<FRONTEND PORT>:80"
       restart: unless-stopped
       depends_on:
         - api
       volumes:
         - ./webapp-settings.local.json:/usr/share/nginx/html/webapp-settings.json
     api:
       image: ghcr.io/trenz-gmbh/trenz-docs-api:latest
       environment:
         - ASPNETCORE_ENVIRONMENT=${ASPNETCORE_ENVIRONMENT:-Production}
         - Meilisearch__Url=http://meilisearch:7700
         - Meilisearch__ApiKey=${MEILISEARCH_API_KEY:-masterKey}
       ports:
         - "<API PORT>:80"
       restart: unless-stopped
       depends_on:
         - meilisearch
       volumes:
         - ./appsettings.local.json:/app/appsettings.local.json
     meilisearch:
       image: getmeili/meilisearch:latest
       ports:
         - "7700:7700"
       environment:
         - MEILI_MASTER_KEY=${MEILISEARCH_API_KEY:-masterKey}
         - MEILI_NO_ANALYTICS=true
       restart: unless-stopped
       volumes:
         - meili_data:/data
 
   volumes:
     meili_data:
   ```

2. add a `appsettings.local.json` file to specify which repositories to use as sources:
   ```json
   {
     "Sources": [
       {
         "Name": "My internal wiki",
         "Type": "git",
         "Url": "https://path/to/my/git/repo.git",
         "Username": "trenz-docs",
         "Password": "$3cr3t"
       }
     ]
   }
   ```

3. add a `webapp-settings.local.json` and add your customer-facing api endpoint:
   ```json 
   {
     "name": "<YOUR DOCS NAME>",
     "theme": {
       "primary": "80,120,200",
       "primary-foreground": "255,255,255"
     },
     "api": {
       "baseUrl": "https://<YOUR API DOMAIN>/api/"
     },
     "useAuth": false
   }
   ```

4. run:
   ```bash
   docker-compose up -d
   ```

5. access your new wiki hosted at:
   ```bash
   http://localhost:<FRONTEND PORT>
   ```

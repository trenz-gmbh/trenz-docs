# wikidown

[![Node.js CI](https://github.com/trenz-gmbh/wikidown/actions/workflows/node.js.yml/badge.svg)](https://github.com/trenz-gmbh/wikidown/actions/workflows/node.js.yml)

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

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).

## Deployment

To deploy a wikidown wiki, follow these steps:

1. clone this repository to the target server:
   ```bash
   git clone https://github.com/trenz-gmbh/wikidown my-wiki
   cd my-wiki
   ```

2. add a `appsettings.local.json` file to specify which repositories to use as sources:
   ```json
   {
     "Sources": [
       {
         "Name": "My internal wiki",
         "Type": "git",
         "Url": "https://path/to/my/git/repo.git",
         "Username": "wikidown",
         "Password": "$3cr3t"
       }
     ]
   }
   ```

3. optionally: add a `.env` file:
   ```env
   APP_PORT=5050
   ```

4. run:
   ```bash
   docker-compose up -d
   ```

5. access your new wiki at [localhost:5050](http://localhost:5050/)

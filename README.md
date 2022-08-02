# trenz-docs

[![Node.js CI](https://github.com/trenz-gmbh/trenz-docs/actions/workflows/node.js.yml/badge.svg)](https://github.com/trenz-gmbh/trenz-docs/actions/workflows/node.js.yml)

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

To deploy a trenz-docs wiki, follow these steps:

1. clone this repository to the target server:
   ```bash
   git clone https://github.com/trenz-gmbh/trenz-docs my-wiki
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
         "Username": "trenz-docs",
         "Password": "$3cr3t"
       }
     ]
   }
   ```

3. optionally: add a `.env` (or `.env.local`) file:
   ```env
   VUE_APP_API_BASE=https://localhost:7262/api/
   VUE_APP_PRIMARY_COLOR='#8af'
   VUE_APP_PRIMARY_FOREGROUND_COLOR='#000'
   ```

4. run:
   ```bash
   docker-compose up -d
   ```

5. access your new wiki at [localhost:5050](http://localhost:5050/)

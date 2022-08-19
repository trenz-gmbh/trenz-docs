FROM node:lts-alpine as build

WORKDIR /app

# add node binaries to path
ENV PATH /app/node_modules/.bin:$PATH

# install dependencies and build tools
COPY package*.json ./
RUN npm install --silent

# build app
COPY . .
RUN npm run build:prod

FROM nginx:alpine as final

# copy app
COPY --from=build /app/dist /usr/share/nginx/html

# replace nginx config
RUN rm /etc/nginx/conf.d/default.conf
COPY nginx/nginx.conf /etc/nginx/conf.d

# start nginx
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]

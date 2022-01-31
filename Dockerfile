FROM node:14 as node_base
WORKDIR /app
COPY package.json ./

FROM node_base as base_install
RUN npm install

FROM base_install as base_copy
COPY . .
EXPOSE 3000

CMD ["npm", "run", "dev"]

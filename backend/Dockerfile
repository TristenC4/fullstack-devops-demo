FROM node:20-bookworm

WORKDIR /app

RUN apt-get update && apt-get install -y python3 make g++ && rm -rf /var/lib/apt/lists/*

COPY package*.json ./
RUN npm_config_build_from_source=true npm install

COPY . .

EXPOSE 3001

CMD ["node", "server.js"]

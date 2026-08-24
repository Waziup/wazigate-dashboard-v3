FROM node:alpine3.19 as production
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm install --force
COPY . .
RUN npm run build
EXPOSE 5173
CMD ["npm", "run", "preview"]

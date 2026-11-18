FROM node:alpine3.19 as production
WORKDIR /app
COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile
COPY . .
RUN yarn build
EXPOSE 5173
CMD ["yarn", "preview"]

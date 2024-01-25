# # Stage 1
# #before you build the image, change the VITE_WAZIGATE_API_URL to the correct url
# FROM node:20.11.0-alpine3.19 AS build
# WORKDIR /app
# COPY package.json package-lock.json ./
# RUN npm install
# COPY . .
# ENV VITE_WAZIGATE_API_URL=http://localhost
# RUN npm run build

# #Stage 2
# FROM nginx:1.19.6-alpine AS production
# COPY custom.conf /etc/nginx/conf.d/default.conf
# COPY --from=build /app/dist /usr/share/nginx/html
# EXPOSE 5173
# CMD ["nginx", "-g", "daemon off;"]

#State 2.a
FROM node:alpine3.19 as production
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm install
COPY . .
ENV VITE_WAZIGATE_API_URL=http://localhost
RUN npm run build
EXPOSE 5173
CMD ["npm", "run", "preview"]
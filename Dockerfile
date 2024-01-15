# Stage 1
#before you build the image, change the VITE_WAZIGATE_API_URL to the correct url
FROM node:20.11.0-alpine3.19 AS build
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm install
COPY . .
ENV VITE_WAZIGATE_API_URL=http://localhost
RUN npm run build

#Stage 2
FROM nginx:1.19.6-alpine AS production
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
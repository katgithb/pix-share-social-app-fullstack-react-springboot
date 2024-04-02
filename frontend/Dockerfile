FROM node:18-alpine
ARG api_base_url
ARG api_version
WORKDIR /app
COPY package*.json .
RUN npm i --silent
COPY . .
RUN echo "VITE_API_BASE_URL=${api_base_url}" >> .env
RUN echo "VITE_API_VERSION=${api_version}" >> .env
EXPOSE 5173
CMD ["npm", "run", "dev"]
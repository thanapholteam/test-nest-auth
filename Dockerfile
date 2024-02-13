FROM node:18-alpine AS node

WORKDIR /app
COPY . ./

FROM node AS prod-deps
RUN npm install --omit=dev --frozen-lockfile
RUN npx prisma generate

FROM node AS build
RUN npm install --frozen-lockfile
RUN npm run build

FROM node
COPY --from=prod-deps /app/node_modules /app/node_modules
COPY --from=build /app/dist /app/dist

ENV NODE_ENV=production

CMD ["npm", "run", "start:prod" ]
ARG IMG=node:18-alpine
FROM {IMG} AS builder
WORKDIR /app
COPY package.json .
COPY yarn.lock .
RUN yarn --frozen-lockfile
COPY . .
RUN yarn build

FROM {IMG}
WORKDIR /app
COPY --from=builder /app/build build/
COPY --from=builder /app/node_modules node_modules/
COPY package.json .
EXPOSE 3000
ENV NODE_ENV=production
CMD [ "node", "build" ]

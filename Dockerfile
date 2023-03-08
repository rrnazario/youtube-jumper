FROM alpine as builder

ENV NODE_ENV build

WORKDIR /home/node

COPY ./youtube-jumper-api /home/node

RUN apk add --no-cache \
        npm

RUN npm ci && npm run build && npm prune --production

# ---

FROM alpine as production

ENV NODE_ENV production

USER root

WORKDIR /home/node

COPY --from=builder /home/node/package*.json /home/node/
COPY --from=builder /home/node/node_modules/ /home/node/node_modules/
COPY --from=builder /home/node/dist/ /home/node/dist/

CMD ["node", "dist/main.js"]
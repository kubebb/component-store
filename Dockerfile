FROM 172.22.96.119/front-end/component-store:base-0.1 as builder
LABEL maintainer="zhangpc<zhang.pengcheng3@neolink.com>"

ENV NODE_ENV production

ADD packages/bff-server /usr/src/app/packages/bff-server
ADD packages/portal /usr/src/app/packages/portal

WORKDIR /usr/src/app
# package files
RUN nr build

FROM 172.22.96.119/front-end/component-store:base-0.1-prod

COPY --from=builder /usr/src/app/packages/bff-server/configs ./configs
COPY --from=builder /usr/src/app/packages/bff-server/dist ./dist
COPY --from=builder /usr/src/app/packages/bff-server/public ./public
COPY --from=builder /usr/src/app/packages/portal/dist/component-store-public ./public/component-store-public

EXPOSE 8066

CMD ["node", "dist/main"]

FROM 172.22.96.119/front-end/component-store-base:base-dev as builder

COPY . /usr/src/app/

ENV NODE_OPTIONS --max_old_space_size=10240

# package files
RUN cp config/api.sample.ts config/api.ts && \
  npm run build && \
  mv dist/component-store-public /tmp/component-store-public && \
  if ls .gitdiff 1>/dev/null 2>&1; then \
    mv .gitdiff /tmp/component-store-public/; \
  fi && \
  if ls .gitversion 1>/dev/null 2>&1; then \
    mv .gitversion /tmp/component-store-public/; \
  fi

FROM 172.22.96.119/tenx_containers/busybox:tenx
COPY --from=builder /tmp/component-store-public /build-files/component-store-public

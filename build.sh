#!/bin/bash
set -e

image="172.22.50.223/dev-branch/component-store:main"

# 1.构建基础镜像
./update_base_image.sh

# 2.构建静态文件镜像
docker build -t $image .

docker push $image

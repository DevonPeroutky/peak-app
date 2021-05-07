#!/bin/bash
# RUN FROM PROJECT ROOT

export DATABASE_URL="postgres://postgres:postgres@localhost/my_app_dev"
export SECRET_KEY_BASE=$(mix phx.gen.secret)

echo "Running build.sh"
sh ./build.sh

echo "Running release.sh"
sh ./release.sh


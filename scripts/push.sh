#!/bin/bash

git add .

if [[ -n "$1" ]]; then
  git commit -asm "$1"
else
  git commit -as
fi

branch=$(git rev-parse --abbrev-ref HEAD)
upstream=$(git remote -v | grep upstream | awk '{print $1}')

git push origin $branch

if [[ -n "$upstream" ]]; then
  git push upstream $branch
fi


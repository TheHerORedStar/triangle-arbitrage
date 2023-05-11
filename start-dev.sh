#!/usr/bin/env bash

# checks if branch has something pending
function parse_git_dirty() {
  git diff --quiet --ignore-submodules HEAD 2>/dev/null; [ $? -eq 1 ]
}

# gets the current git branch
function parse_git_branch() {
  git branch --no-color 2> /dev/null | sed -e '/^[^*]/d' -e "s/* \(.*\)/\1$(parse_git_dirty)/"
}

# get last commit hash prepended with @ (i.e. @8a323d0)
function parse_git_hash() {
  git rev-parse --short HEAD 2> /dev/null
}

# DEMO
GIT_BRANCH=$(parse_git_branch)$(parse_git_hash)
echo ${GIT_BRANCH}

sudo docker build \
	-t dev-be:local \
	-f Dockerfile .
sudo docker rm -f dev-be 2> /dev/null || true
sudo docker run \
	--network=host \
	--restart=unless-stopped \
	--name=dev-be \
	-e GIT_COMMIT="$(parse_git_hash)" \
	-e GIT_BRANCH="$(parse_git_branch)" \
	-d dev-be:local
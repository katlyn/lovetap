FROM node:20-alpine AS base
ENV PNPM_HOME="/pnpm" PATH="$PNPM_HOME:$PATH"
ENV VITE_API_BASE_URL="/"
ENV HTTP_HOST="0.0.0.0" HTTP_PORT="80"
RUN corepack enable
COPY . /usr/src/lovetap
WORKDIR /usr/src/lovetap

# Install dev dependencies
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile
RUN pnpm nx run-many --target=build

# Prune dev dependencies so only prod deps are included
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --prod --frozen-lockfile

WORKDIR /usr/src/lovetap/apps/backend
EXPOSE 80
CMD [ "pnpm", "start" ]

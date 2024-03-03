# Monorepo Full Stack Airbnb Clone with React.js, Nest.js, Tailwind, Prisma, MongoDB.

## Prerequisites

**[Node version 18.x.x](https://nodejs.org/)**  
**[@nestjs/cli version 10.x.x](https://nestjs.com/)**

## Setting up the project

### Cloning the repository

```shell
git clone https://github.com/psuarezdev/airbnb_clone.git
```

### Install packages

```shell
npm i
```

### Environment variables

```js
# https://pris.ly/d/connection-strings
DATABASE_URL=

JWT_SECRET=
JWT_REFRESH_SECRET=
```

# Setup Prisma
```shell
npx prisma db push
```

### Start the app

```shell
npm run dev
```
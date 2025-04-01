# Book-app

=======
<h1 align="center">Welcome to LitRwanda Application 👋</h1>

> Book Library web application using Next.js 13 and GraphQL

### 🏠 [Homepage](https://github.com/mabc224/book-library-react-nextjs-graphql#readme)

## Prerequisites

- node >=16.17.x
- npm >=8.15.x

## Install

```sh
npm install
```

## Usage
Specifies your postgres database connection (via an environment variable) by putting it in `.env` file

Then, run the prisma to create tables with seed data

```sh
npm run prisma:migrate:deploy
```

Seed Database

```sh
npx prisma db seed
```

Then, run the development server:

```sh
npm run dev
```

Open [http://localhost:8888](http://localhost:8888) with your browser to see the result.

    Default credentials: 
        username: user0
        password: password

## About Application

The application have the following features:
- [x] User authentication and authorization using JSON Web Tokens (JWT).
- [x] A file upload feature for uploading and storing book cover images.
- [ ] Webapp is multilingual, you can choose any language on top of
English for demo purposes.
- [x] The application support server side rendering (SSR).
- [x] The application have a clean and responsive design. Tailwind is in use
- [ ] Unit tests for the main functionality of the application using a
testing framework such as Jest.
- [x] The application use Apollo Client to handle all GraphQL operations
and Apollo Server for creating GraphQL API.
- [x] Use a data storage solution such as PostgreSQL to persist the
data.
- [x] A notification feature for sending real-time notifications to users.
- [ ] Use a real-time technology such as WebSockets or GraphQL subscriptions
for the notification feature.

## Author

👤 **Bella Melissa Ineza**

* Github: [@belladev250](https://github.com/belladev250/Book-app)

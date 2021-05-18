## Authentication-TS

Template created for user creation and authentication via JWT for Nodejs applications with TS, PostgresSQL, Redis and typeORM.

This authentication system is based on Access and Refresh tokens. The logic behind this system is that when a user login, the server will generate two different tokens: One for general consumption of API (low expiration time) and one to renew this first token.
Tokens will be blacklisted when users logof

### Refresh Tokens:

The Refresh Token will be sent whenever a user login and will have an expiration time of 24h. It'll be used to renew the access token. For security reasons, as far as I know the best place to store this Token is in memory.

### Access Tokens:

The Access token is the one that will be used in every request that the client make. It'll have a short expiration time of 30 minutes and can be store as an HTTPOnly cookie.

### Server-side Protection:

PS: Not implemented yet.
Server will have a blacklist for tokens that belonged to users that loged out and in the future, will blacklist tokens with unusual behavior.
The server will use CORS policy to block all requests to **/refresh_token** that aren't from allowed origins. Configure allowed origins at **auth.js -> allowedOrigins[]**

### Requirements:

- Postgres and Redis (Can be used with Docker).
- This project uses the standard database created by postgres "postgres".
- Database user is 'postgres' and password is 'password'. Change at will.

```shell
docker run -d --name authentication-postgres -p 5432:5432 -e POSTGRES_PASSWORD=password postgres
docker run --name redis-blacklist -p 6379:6379 -d redis
```

- Run one of these commands to install all dependencies:

```typescript
    yarn
    // or
    npm install
```

- To run the project, use yarn/npm dev:server

## Usage:

### User creation:

Route added to create new users.

```json
  "uri": "/users"
  "method": "POST",
  "headers": {"Content-Type": "application/json"}
  "body": {
    "name": "Full name",
    "email": "youremail@mail.com",
    "password": "yourpassword"
  }
```

**Response**

```json
{
  "name": "Full name",
  "email": "youremail@mail.com",
  "id": "fc9bf168-dae5-47eb-a731-6891a33b3eec",
  "created_at": "2021-05-16T01:03:58.318Z",
  "updated_at": "2021-05-16T01:03:58.318Z"
}
```

**Errors**

```json
{
  "status": "error",
  "message": "Email address already used"
}
```

```json
{
  "status": "error",
  "message": "Missing parameters"
}
```

### Get all users (require authorization with ACCESS TOKEN)

Route created just to test authentication. This route require that access token is passed on request headers with Bearer Token

```json
  "uri": "/users"
  "method": "GET",
  "headers": {
    "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE2MjExMTY1ODQsImV4cCI6MTYyMTExNjYxNCwic3ViIjoiZTI5MGUzZDYtODRlZS00ZTk2LWJjZmItOWUzYTZiNjBkMTUzIn0.ojfzYiuP4mdvpxFl3g_JVL1k_fuPVqYiWxFd_9NZyK0"
  }
```

**Response**

```json
[
  {
    "name": "Full name",
    "email": "youremail@mail.com",
    "id": "fc9bf168-dae5-47eb-a731-6891a33b3eec",
    "created_at": "2021-05-16T01:03:58.318Z",
    "updated_at": "2021-05-16T01:03:58.318Z"
  }
]
```

**Errors**

```json
{
  "status": "error",
  "message": "JWT token is missing"
}
```

```json
{
  "status": "error",
  "message": "Invalid JWT Token"
}
```

### User login:

Route that allows user login. Returns user's data (-password) and access and refresh token.

```json
  "uri": "/sessions"
  "method": "POST",
  "headers": {"Content-Type": "application/json"}
  "body": {
    "email": "youremail@mail.com",
    "password": "yourpassword"
  }
```

**Response**

```json
{
  "user": {
    "id": "e290e3d6-84ee-4e96-bcfb-9e3a6b60d153",
    "name": "User full name",
    "email": "yo",
    "created_at": "2021-05-16T00:04:24.947Z",
    "updated_at": "2021-05-16T00:04:24.947Z"
  },
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE2MjExMTY1ODQsImV4cCI6MTYyMTExNjYxNCwic3ViIjoiZTI5MGUzZDYtODRlZS00ZTk2LWJjZmItOWUzYTZiNjBkMTUzIn0.ojfzYiuP4mdvpxFl3g_JVL1k_fuPVqYiWxFd_9NZyK0",
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE2MjExMTY1ODQsImV4cCI6MTYyMTIwMjk4NCwic3ViIjoiZTI5MGUzZDYtODRlZS00ZTk2LWJjZmItOWUzYTZiNjBkMTUzIn0.2MVcoj7z7C2ytWcJErR8jN4RWHLWo3grNP_r8mhQYmE"
}
```

**Errors**

```json
{
  "status": "error",
  "message": "'Incorrect email/password combination'"
}
```

### Renew Access Token (require authentication with REFRESH TOKEN)

This route should be used to renew a access token. The client should inform refresh token to create a new access.

```json
  "uri": "/sessions/refresh-token"
  "method": "GET",
  "headers": {
    "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE2MjExMTY1ODQsImV4cCI6MTYyMTExNjYxNCwic3ViIjoiZTI5MGUzZDYtODRlZS00ZTk2LWJjZmItOWUzYTZiNjBkMTUzIn0.ojfzYiuP4mdvpxFl3g_JVL1k_fuPVqYiWxFd_9NZyK0"
  }
```

**Response**

```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE2MjExMTY1ODQsImV4cCI6MTYyMTExNjYxNCwic3ViIjoiZTI5MGUzZDYtODRlZS00ZTk2LWJjZmItOWUzYTZiNjBkMTUzIn0.ojfzYiuP4mdvpxFl3g_JVL1k_fuPVqYiWxFd_9NZyK0"
}
```

**Errors**

```json
{
  "status": "error",
  "message": "JWT token is missing"
}
```

```json
{
  "status": "error",
  "message": "Invalid JWT Token"
}
```

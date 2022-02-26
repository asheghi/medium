# Todos

## Back-End
- [ ] unit Testing for Apis (router/service)
- [ ] Express Request Validator
- [ ] Express Rate Limiter
- [ ] Express Common Security Measures
- [ ] load routes, services dynamically based on the folder structure
- [x] proper cache headers for SSR only pages, to decrease server load
- [ ] Customization Features
- [x] Stateless, move file storage, database out
- [x] issue: build in another directory, move the result to dist
  - when a build starts, it removes the dist folder and assets are no longer available
- [x] Docker-Compose file for deployment:
  - blog image from GCR
  - Postgres image
  - minio image



## Front-End
### common
- [x] add cypress
- [ ] refactoring components,styles

### home page
- [ ] unit tests
- [ ] more coverage cypress test

### admin: manage posts
- [ ] design a header
- [ ] design a context menu for posts
- [ ] re-design list of posts
- [ ] delete post confirmation
- [ ] unit tests

### admin: edit post
- [ ] context menu of post
- [ ] unit test

### login page
 - [ ] redirect issue after successful login

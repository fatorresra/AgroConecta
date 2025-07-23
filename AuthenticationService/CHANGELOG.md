# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/)
and this project adheres to [Semantic Versioning](https://semver.org/).

## [0.1.6] - 2025-07-14
### Added
- `/metrics` endpoint that displays the information of the endpoints on Prometheus format

## [0.1.5] - 2025-07-10
### Changed
- Renamed endpoint `GET /user/<user_id>` to `GET /users/<user_id>` to follow RESTful conventions using plural nouns.

## [0.1.4] - 2025-07-10
### Added
- `/auth/user/<user_id>` endpoint for retrieving the user information by its `user_id`.

## [0.1.3] - 2025-06-11
### Added
- `/auth/validate-token` endpoint for JWT validation.

## [0.1.2] - 2025-06-09

### Added
- `/auth/login` endpoint with JWT generation.
- `TokenHandler` class for managing JWT creation.
- JWT included in login response.
- Automatic setting of `last_login_at` timestamp upon login.

### Fixed
- Fixed `datetime` serialization issues in login response.
- Typing corrections for JWT payload and response structure.

---

## [0.1.1] - 2025-06-09

### Added
- `/auth/register` endpoint for user registration.
- `AuthService` implementation with password hashing using `argon2-cffi`.
- Local JSON repository (`LocalDBUserRepository`) to simulate a database.

### Changed
- Refactored the project structure to follow hexagonal architecture.

### Fixed
- Error handling when the request `Content-Type` is not `application/json`.

---

## [0.1.0] - 2025-06-09

### Added
- First working version of the authentication service.

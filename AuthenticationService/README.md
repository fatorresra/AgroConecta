# AuthenticationService

## Overview
The Authentication Service is responsible for managing user authentication and authorization across the SOFEA ecosystem. Its primary role is to ensure secure access by issuing and validating JWT tokens, which other services rely on to identify and authorize users.

The system exposes five main endpoints:
- `POST /auth/login`:  
  Allows a user to log in to the system using an `email` and `password`.  
  On successful authentication, a JWT token is returned along with basic user information.

- `POST /auth/register`:  
  Allows a user to create an account by providing their `name`, `email`, `password`, and `role`.  
  The password is securely hashed before being stored. On success, the user’s public information is returned.

- `GET /auth/validate-token`:  
  Enables other services to verify the validity of a JWT token sent in the `Authorization` header.  
  If valid and the user exists, the service responds with the user’s ID and a `valid: true` flag.

- `GET /auth/users/<user_id>`:
  Retrieves the public information of a user given their unique identifier.

- `DELETE /__test__/database`:
  Deletes the test database. This enpoint will be only available if the app environment is for testing. This will be configured in the following steps.

---
## ⚙️ System Architecture
This service follows a **Hexagonal Architecture (Ports and Adapters)** pattern. It is designed to isolate the core business logic from external concerns such as frameworks, databases, and communication protocols.

#### Key Architectural Components

- **Application Layer**:  
  Contains the core use cases and service interfaces. Business logic is implemented here, independent of frameworks or infrastructure.

- **Adapters (Input/Output)**:  
  - **Input Adapters**: Handle HTTP requests using Flask and expose routes via a REST API.
  - **Output Adapters**: Responsible for persistence, unique ID generation, password hashing, and JWT token handling. Examples include:
    - `LocalDBUserRepository`: In-memory user storage (can be replaced by a real DB implementation). Switches between a test and a development database.
    - `Argon2CffiHasher`: Secure password hashing.
    - `UUIDIder`: Generates unique user identifiers.
    - `JWTHandler`: Encodes and decodes JWT tokens.

- **Service Communication**:  
  - The `validate-token` endpoint enables secure interaction with other microservices by providing a token validation mechanism.
  - Communication is designed to be stateless using JWT.

## 🚀 Setup and Usage

### 📦 Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/SwEng2-2025i-nutrias/AuthenticationService.git
   cd AuthenticationService
   ```

2. Install the dependencies:
   ```bash
   pip install -r requirements.txt
   ```

3. To enable JWT authentication, create a `.env` file in the root directory of your project and add a `JWT_KEY` variable.

  ``` env
    JWT_KEY=your_jwt_key

  ```

   This key will be used to sign and verify JWT tokens.

   > ⚠️ **Important Notes:**
   > - Use a strong, unique string for the value of `JWT_KEY`.
   > - Keep this key secret and **never share it publicly**.
   > - Even thoughthe `.env` file is already in your `.gitignore`, avoid committing it to version control by modifying it.

4. To configure the environment for development or testing, add to the `.env` file a `APP_ENV` variable.

  ``` env
    APP_ENV="development" # or 'test' when running automated tests
  ```

  > This will ensure that the test_db will be used in the automated tests, leaving intact the main database

5. Run the Flask server:
   ```bash
   python app.py
   ```

> The API will run locally at:  
**http://127.0.0.1:5001**

---

### 📮 API Endpoints

#### 🔹 Register a User

- **POST** `/auth/register`
- **Body Example**:
  ```json
  {
    "email": "samuevarga@gmail.com",
    "password": "samuevarga",
    "name": "Samuel",
    "role": "farmer"
  }
    ```
- **Curl Command**:
    ```bash
  curl -X POST http://127.0.0.1:5000/auth/register \
     -H "Content-Type: application/json" \
     -d '{"email": "samuevarga@gmail.com", "password": "samuevarga", "name": "Samuel", "role": "farmer"}'
     ```

#### 🔹 Login a User

- **POST** `/auth/login`
- **Body Example**:
  ```json
  {
    "email": "samuevarga@gmail.com",
    "password": "samuevarga"
  }

    ```
- **Curl Command**:
  ```bash
  curl -X POST http://127.0.0.1:5000/auth/login \
     -H "Content-Type: application/json" \
     -d '{"email": "samuevarga@gmail.com", "password": "samuevarga"}'
  ```

#### 🔸 Validate a Token

- **GET** `/auth/validate-token`
- **Headers**
    - ```Authorization: Bearer <your_jwt_token>```
- **Curl Command**:
  ```bash
  curl -X GET http://127.0.0.1:5000/auth/validate-token \
     -H "Authorization: Bearer <your_jwt_token>"
  ```


#### 🔹 Get a User by ID

- **GET** `/auth/users/<user_id>`

- **Path Parameter**:
  - `user_id`: The unique identifier of the user.

- **Curl Command**:
  ```bash
  curl -X GET http://127.0.0.1:5000/auth/users/9d97e728-f219-4a8b-b084-5b20e1c1f785
  ```

#### 🔸 Clear Test Database

- **DELETE** `/__test__/database`

- **Description**:  
  Deletes all test users from the JSON database used in testing mode.  
  This endpoint only works when the `APP_ENV` is set to `"test"` and is intended exclusively for integration testing.

- **Curl Command**:
  ```bash
  curl -X DELETE http://127.0.0.1:5000/__test__/database
  ```

> ⚠️ **Important:** This endpoint is only available in test mode and should not be exposed in production environments.


---

### 📘 API Documentation

Once the server is running, you can access the interactive API documentation via Swagger UI at:

👉 **http://127.0.0.1:5001/apidocs/**

### 📈 Observability and Metrics

This service exposes performance and runtime metrics in a [Prometheus](https://prometheus.io/) compatible format. These metrics help monitor and analyze:

- Total number of HTTP requests
- Latency per endpoint
- Errors grouped by method and HTTP status code
- Python runtime and garbage collection (GC) statistics

#### 🔸 Metrics Endpoint

- **GET** `/metrics`  
- **Description**:  
  Exposes runtime metrics collected from the Flask application and Python environment in Prometheus format.

> ⚠️ This endpoint is **only available when the `FLASK_DEBUG` environment variable is set to `"false"`**.  
> When `debug=True`, Flask spawns multiple processes or threads, which can prevent proper metric exposure.

---

#### ✅ How to Enable Metrics

1. In your `.env` file, set the following environment variable:

```env
FLASK_DEBUG=false
```

2. Run the application:

```bash
python app.py
```

3. Visit the metrics endpoint in your browser or let Prometheus scrape it from:

```
http://localhost:5001/metrics
```

---

#### 🛠️ Prometheus Integration (Optional)

To integrate with a local [Prometheus](https://prometheus.io/) instance, add this job to your `prometheus.yml` configuration:

```yaml
scrape_configs:
  - job_name: 'auth_service'
    static_configs:
      - targets: ['localhost:5001']
```

Prometheus will then automatically collect metrics from this service.

---

### 📊 Recommended: Use Grafana for Visualization

While Prometheus is great for storage and querying, [Grafana](https://grafana.com/) can be used to build beautiful dashboards on top of the collected metrics.

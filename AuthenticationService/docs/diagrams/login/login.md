flowchart TB
    A["Frontend: POST Request to /auth/login"] --> B["Auth Controller (Input Adapter): Extract user data: email, password"]
    B --> C{"Auth Controller (Input Adapter): Are both fields present?"}
    C -- No --> Z1["Auth Controller (Input Adapter): Return 400 (Bad Request): Missing email or password"]
    Z1 --> End["End"]

    C -- Yes --> D["Auth Service (Input Port): Retrieve user by email"]
    D --> E{"UserRepository (User Output Adapter): User exists?"}
    E -- No --> Z2["Auth Controller (Input Adapter): Return 401 (Unauthorized): Invalid credentials"]
    Z2 --> End

    E -- Yes --> F["Password Hasher (Hasher Output Adapter): Verify password"]
    F --> G{"Password is valid?"}
    G -- No --> Z3["Auth Controller (Input Adapter): Return 401 (Unauthorized): Invalid credentials"]
    Z3 --> End

    G -- Yes --> H["Auth Service (Input Port): Set current timestamp as last login"]
    H --> I["Token Manager (Token Output Adapter): Generate JWT token"]
    I --> J["Auth Controller (Input Adapter): Return 200 (OK): User logged in with token"]
    J --> End

    %% Color styles
    style A fill:#BBDEFB
    style B fill:#C8E6C9
    style C fill:#C8E6C9
    style Z1 fill:#C8E6C9
    style D fill:#FFF9C4
    style E fill:#FFE0B2
    style Z2 fill:#C8E6C9
    style F fill:#FFE0B2
    style G fill:#FFE0B2
    style Z3 fill:#C8E6C9
    style H fill:#FFF9C4
    style I fill:#FFE0B2
    style J fill:#C8E6C9

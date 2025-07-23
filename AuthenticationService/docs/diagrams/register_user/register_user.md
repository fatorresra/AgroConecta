flowchart TB
    A["Frontend: POST Request to /auth/register"] --> B["Auth Controller (Input Adapter): Extract user data: email, password, name, role"]
    B --> C{"Auth Controller (Input Adapter): Are all fields present?"}
    C -- No --> Z1["Auth Controller (Input Adapter): Return 400 (Bad Request): Missing required fields"]
    Z1 --> End["End"]
    C -- Yes --> D["Auth Service (Input Port): Check if user already exists by email"]
    D --> E{"UserRepository (User Output Adapter): User exists?"}
    E -- Yes --> Z2["Auth Controller: Return 400 (Bad Request): User already exists"]
    Z2 --> End
    E -- No --> F["Password Hasher (Hasher Output Adapter): Hash the password"]
    F --> G["Unique ID Generator (UUID Output Adapter): Generate unique user ID"]
    G --> H["Auth Service (Input Port): Get current timestamp"]
    H --> I["Auth Service (Input Port): Create User entity (Domain Object)"]
    I --> J["UserRepository (User Output Adapter): Save user in repository (Database)"]
    J --> K["Auth Controller (Input Adapter): Return 201 (Created): User created with public data"]
    K --> End

    style A fill:#BBDEFB
    style B fill:#C8E6C9
    style C fill:#C8E6C9
    style Z1 fill:#C8E6C9
    style D fill:#FFF9C4
    style E fill:#FFE0B2
    style Z2 fill:#C8E6C9
    style F fill:#FFE0B2
    style G fill:#FFE0B2
    style H fill:#FFF9C4
    style I fill:#FFF9C4
    style J fill:#FFE0B2
    style K fill:#C8E6C9

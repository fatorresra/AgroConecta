from domain.ports.ports import AuthInputPort, AuthOutputPort
from domain.ports.password_hasher import PasswordHasherOutputPort
from domain.ports.unique_ider import UniqueIderOutputPort
from domain.ports.token_handler import TokenManagerOutputPort
from domain.entities.user import User

# Datetime is used to set the creation timestamp
from datetime import datetime

class AuthService(AuthInputPort):
    def __init__(self, repo: AuthOutputPort, hasher: PasswordHasherOutputPort, unique_ider: UniqueIderOutputPort, token_handler: TokenManagerOutputPort):
        
        self.repo = repo
        self.hasher = hasher
        self.unique_ider = unique_ider
        self.token_handler = token_handler

    def register_user(self, email: str, password: str, name: str, role: str)->User:
        """
        Registers a new user with the provided details.
        """

        # Find if the user already exists
        existing_user = self.repo.get_user_by_email(email)
        if existing_user:
            raise ValueError("User already exists with this email.")
        
        # Hash the password
        hashed_password = self.hasher.hash_password(password)

        # Generate a unique ID for the user
        unique_id = self.unique_ider.generate_unique_id()

        # Obtain the current time for the user creation timestamp
        creation_time = datetime.now()

        # Create a new user entity
        user = User(
            id=unique_id,
            email=email,
            password_hash=hashed_password,
            name=name,
            role=role,
            created_at=creation_time
        )

        # Save the user to the repository
        self.repo.save_user(user)

        # Return the user object
        return user
    
    def login_user(self, email: str, password: str) -> User:
        # Obtain the user by email
        user = self.repo.get_user_by_email(email)
        if not user:
            raise ValueError("User does not exist with this email.")
        
        # Verify the password
        if not self.hasher.verify_password(password, user.password_hash):
            raise ValueError("Invalid password.")
        
        # Update the last login time
        user.last_login_at = datetime.now()

        return user

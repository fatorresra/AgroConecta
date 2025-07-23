from abc import ABC, abstractmethod

# Output port for the domain layer of the application.
class PasswordHasherOutputPort(ABC):
    @abstractmethod
    def hash_password(self, password: str) -> str:
        """
        Hashes the provided password.
        """
        pass

    @abstractmethod
    def verify_password(self, password: str, hashed_password: str) -> bool:
        """
        Verifies if the provided password matches the hashed password.
        """
        pass
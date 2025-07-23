from argon2 import PasswordHasher
from domain.ports.password_hasher import PasswordHasherOutputPort

class Argon2CffiHasher(PasswordHasherOutputPort):
    def __init__(self):
        self.hasher = PasswordHasher()

    def hash_password(self, password: str) -> str:
        """
        Hashes the provided password using Argon2.
        """
        return self.hasher.hash(password)
    
    def verify_password(self, password: str, hashed_password: str) -> bool:
        """
        Verifies if the provided password matches the hashed password.
        """
        try:
            self.hasher.verify(hashed_password, password)
            return True
        except Exception:
            return False


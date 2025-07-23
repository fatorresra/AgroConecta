from datetime import datetime

class User:

    # Represents a user in the system.
    def __init__(self, id:str, email:str, password_hash:str, name:str, role:str, created_at:datetime, last_login_at:datetime|None=None):
        self.id = id
        self.email = email
        self.password_hash = password_hash
        self.name = name
        self.role = role
        self.created_at = created_at
        self.last_login_at = last_login_at

    # Converts the User object to a dictionary representation.
    def to_dict(self) -> dict[str, str]:
        # Serialize the User object to a dictionary.

        # The date fields are converted to ISO format for JSON serialization.
        created_at_str = self.created_at.isoformat()

        data = {
            "id": self.id,
            "email": self.email,
            "password_hash": self.password_hash,
            "name": self.name,
            "role": self.role,
            "created_at": created_at_str,
        }

        if self.last_login_at:
            data["last_login_at"] = self.last_login_at.isoformat()

        return data
    
    def public_to_dict(self) -> dict[str, str]:
        """
        Returns a public representation of the user, excluding sensitive information.
        """

        data = {
            "id": self.id,
            "email": self.email,
            "name": self.name,
            "role": self.role,
            "created_at": self.created_at.isoformat()
        }

        if self.last_login_at:
            data["last_login_at"] = self.last_login_at.isoformat()

        return data
    
    # Creates a User object from a dictionary representation.
    @classmethod
    def from_dict(cls, data: dict[str, str]):
        
        id = data["id"]
        email = data["email"]
        password_hash = data["password_hash"]
        name = data["name"]
        role = data["role"]
        created_at = datetime.fromisoformat(data["created_at"])
        last_login_at = datetime.fromisoformat(data["last_login_at"]) if data.get("last_login_at") else None

        
        user = cls(id, email, password_hash, name, role, created_at, last_login_at)

        return  user
    
    def update_password(self, new_password_hash: str):
        """
        Updates the user's password hash.
        """
        self.password_hash = new_password_hash
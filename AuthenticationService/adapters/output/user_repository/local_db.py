import json
from pathlib import Path
from domain.ports.ports import AuthOutputPort
from domain.entities.user import User

import os

DB_FILE = Path(__file__).parent / 'db.json'

# If the environment variable is test, use a different database file
if os.getenv('APP_ENV') == 'test':
    DB_FILE = Path(__file__).parent / 'test_db.json'

class LocalDBUserRepository(AuthOutputPort):
    def _load_db(self)->list[dict[str, str]]:
        try:
            with open(DB_FILE, 'r') as file:
                return json.load(file)
        except FileNotFoundError:
            return []
        
    def _save_db(self, db:list[dict[str, str]])->None:
        with open(DB_FILE, 'w') as file:
            json.dump(db, file, indent=2)

    def save_user(self, user: User) -> None:
        """
        Saves the user to the local JSON database.
        """
        db = self._load_db()
        db.append(user.to_dict())
        self._save_db(db)

    def get_user_by_email(self, email: str) -> User | None:
        """
        Retrieves a user by their email from the local JSON database.
        Returns None if the user does not exist.
        """
        db = self._load_db()
        for user_data in db:
            if user_data['email'] == email:
                return User.from_dict(user_data)
        return None
    
    def update_user(self, user: User) -> None:
        """
        Updates the user in the local JSON database.
        """
        db = self._load_db()
        for i, user_data in enumerate(db):
            if user_data['id'] == user.id:
                db[i] = user.to_dict()
                self._save_db(db)
                return
        raise ValueError("User not found in the database.")
    
    def get_user_by_id(self, user_id: str) -> User | None:
        """
        Retrieves a user by their unique ID from the local JSON database.
        Returns None if the user does not exist.
        """
        db = self._load_db()
        for user_data in db:
            if user_data['id'] == user_id:
                return User.from_dict(user_data)
        return None
    
    def delete_database(self) -> None:
        """
        Deletes the entire user database by removing the JSON file.
        """
        self._save_db([])  # Clear the database by saving an empty list
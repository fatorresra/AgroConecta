from domain.ports.token_handler import TokenManagerOutputPort

from datetime import datetime, timedelta
from jwt import encode, decode
from dotenv import load_dotenv
import os
# Load environment variables from .env file
load_dotenv(override=True)
JWT_KEY = os.getenv("JWT_KEY")
EXP_TIME = 3600  # Token expiration time in seconds (1 hour)

class JWTHandler(TokenManagerOutputPort):
    def generate_token(self, payload: dict[str, str]) -> str:
        """
        Generate a JWT token with the given payload.
        
        Args:
            payload (dict[str, str]): The payload to include in the token.
        
        Returns:
            str: The generated JWT token.
        """

        data = payload.copy()
        data["exp"] = str(datetime.now() + timedelta(seconds=EXP_TIME))

        return encode(payload, JWT_KEY, algorithm="HS256")
    
    def verify_token(self, token: str) -> dict[str, str]:
        """
        Verify a JWT token and return the payload.
        
        Args:
            token (str): The JWT token to verify.
        
        Returns:
            dict[str, str]: The payload contained in the token.
        
        Raises:
            jwt.ExpiredSignatureError: If the token has expired.
            jwt.InvalidTokenError: If the token is invalid.
        """
        return decode(token, JWT_KEY, algorithms=["HS256"])

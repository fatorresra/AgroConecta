from abc import ABC, abstractmethod

from abc import ABC, abstractmethod

class TokenManagerOutputPort(ABC):
    @abstractmethod
    def generate_token(self, payload: dict[str, str]) -> str:
        pass

    @abstractmethod
    def verify_token(self, token: str) -> dict[str, str]:
        pass

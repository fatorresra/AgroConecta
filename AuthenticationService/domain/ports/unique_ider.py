from abc import ABC, abstractmethod

# Output port for the domain layer of the application.
class UniqueIderOutputPort(ABC):
    @abstractmethod
    def generate_unique_id(self) -> str:
        """
        Generates a unique identifier.
        """
        pass
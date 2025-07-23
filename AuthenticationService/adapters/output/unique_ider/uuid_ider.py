from domain.ports.unique_ider import UniqueIderOutputPort
import uuid

class UUIDIder(UniqueIderOutputPort):
    def generate_unique_id(self) -> str:
        """
        Generates a unique identifier using UUID4.
        """
        return str(uuid.uuid4())

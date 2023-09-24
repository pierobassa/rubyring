from typing import TypeVar, Generic, List, Optional

T = TypeVar('T')
ID = TypeVar('ID')

class IDao(Generic[T, ID]):
    def create(self, obj: T) -> T:
        """
        Creates a new object in the database.

        Parameters:
        obj (T): The object to create.

        Returns:
        T: The created object.
        """
        raise NotImplementedError

    def read(self, id: ID) -> Optional[T]:
        """
        Reads an object from the database.

        Parameters:
        id (ID): The ID of the object to read.

        Returns:
        Optional[T]: The read object, or None if the object does not exist.
        """
        raise NotImplementedError

    def update(self, obj: T) -> T:
        """
        Updates an existing object in the database.

        Parameters:
        obj (T): The object to update.

        Returns:
        T: The updated object.
        """
        raise NotImplementedError

    def delete(self, id: ID) -> None:
        """
        Deletes an object from the database.

        Parameters:
        id (ID): The ID of the object to delete.

        Returns:
        None
        """
        raise NotImplementedError

    def list(self) -> List[T]:
        """
        Lists all objects in the database.

        Returns:
        List[T]: A list of all objects in the database.
        """
        raise NotImplementedError

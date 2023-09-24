from typing import List, Optional
from exception.exceptions import RingAlreadyExistsError
from db.dao.IDao import IDao
from db.database import ring_collection
from db.helpers import ring_helper
from bson.objectid import ObjectId


class RingsDao(IDao[dict, str]):
    async def create(self, ring_data: dict) -> dict:
        """
        Creates a new Ring in the database.

        Parameters:
        ring_data (dict): The Ring to create.

        Returns:
        dict: The created Ring or an error message if a Ring with the given lens handle already exists.
        """
        existing_ring = await ring_collection.find_one({"lens_handle": ring_data["lens_handle"]})
        if existing_ring:
            raise RingAlreadyExistsError("A ring with this lens handle already exists")
        
        ring = await ring_collection.insert_one(ring_data)
        new_ring = await ring_collection.find_one({"_id": ring.inserted_id})
        return ring_helper.ring_to_dict(new_ring)



    async def read(self, id: int) -> Optional[int]:
        """
        Reads an Ring from the database.

        Parameters:
        id (ID): The ID of the Ring to read.

        Returns:
        Optional[T]: The read Ring, or None if the Ring does not exist.
        """
        ring = await ring_collection.find_one({"_id": id})
        if ring:
            return ring_helper.ring_to_dict(ring)
        
    async def read_by_lens_handle(self, lens_handle: str) -> Optional[dict]:
        """
        Reads an Ring from the database.

        Parameters:
        lens_handle (str): The lens handle of the Ring to read.

        Returns:
        Optional[T]: The read Ring, or None if the Ring does not exist.
        """
        ring = await ring_collection.find_one({"lens_handle": lens_handle})
        if ring:
            return ring_helper.ring_to_dict(ring)
        
        return None

    async def update(self, ring_data: dict) -> dict:
        """
        Updates an existing Ring in the database.

        Parameters:
        ring_data (T): The Ring to update.

        Returns:
        T: The updated Ring.
        """
        pass

    async def delete(self, id: int) -> None:
        """
        Deletes an Ring from the database.

        Parameters:
        id (ID): The ID of the Ring to delete.

        Returns:
        None
        """
        pass

    async def list(self) -> List[dict]:
        """
        Lists all Rings in the database.

        Returns:
        List[T]: A list of all Rings in the database.
        """
        pass

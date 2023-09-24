from fastapi import APIRouter, Body, HTTPException
from fastapi.encoders import jsonable_encoder

from db.dao.RingsDao.RingsDao import RingsDao

rings_dao = RingsDao()

from db.model.ring import (
    RingSchema,
)

from db.model.response import (
    response_model,
)

router = APIRouter()

@router.post("/", response_description="Ring data added into the database")
async def add_ring_data(ring: RingSchema = Body(...)):
    ring = jsonable_encoder(ring)
    try:
        new_ring = await rings_dao.create(ring)
        return response_model(new_ring, "Ring added successfully.")
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"An error occurred: {e}")
    
@router.get("/{lens_handle}", response_description="Ring data retrieved")
async def get_ring_data(lens_handle):
    try:
        ring = await rings_dao.read_by_lens_handle(lens_handle)

        if ring is not None:
            return response_model(ring, "Ring data retrieved successfully")
        
        raise HTTPException(status_code=404, detail=f"Ring with lens_handle {lens_handle} not found")

    except Exception as e:
          raise HTTPException(status_code=404, detail=f"Ring with lens_handle {lens_handle} not found")      
  

from typing import Optional
from pydantic import BaseModel, Field

class RingSchema(BaseModel):
    lens_handle: str = Field(...) # ... means required
    smart_account_address: str = Field(...)

    class Config:
        schema_extra = {
            "example": {
                "lens_handle": "piero.lens",
                "smart_account_address": "0x1234567890123456789012345678901234567890",
            }
        }

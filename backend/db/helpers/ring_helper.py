def ring_to_dict(ring) -> dict:
    return {
        "id": str(ring["_id"]),
        "lens_handle": ring["lens_handle"],
        "smart_account_address": ring["smart_account_address"],
    }
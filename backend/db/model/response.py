
def response_model(data, message):
    return {
        "data": [data],
        "code": 200,
        "message": message,
    }
    
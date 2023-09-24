from eth_utils import is_address, is_checksum_address

def validate_ethereum_address(address: str) -> bool:
    """
    Validate an Ethereum address.

    This function checks whether the given string is a valid Ethereum address.
    It first checks the length and structure of the address string, and then verifies the checksum
    (if it has one). It leverages the `eth_utils` library to perform these validations.

    :param address: The Ethereum address as a string.
    :type address: str

    :return: True if the address is valid, False otherwise.
    :rtype: bool

    :raises ValueError: If the input is not a string or if it's an empty string.

    :Example:

    >>> validate_ethereum_address('0x742d35Cc6634C0532925a3b844Bc454e4438f44e')
    True

    >>> validate_ethereum_address('0x123')
    False
    """
    if not isinstance(address, str):
        raise ValueError("Address must be a string.")
    
    if not address:
        raise ValueError("Address cannot be an empty string.")
    
    return is_address(address) and (not address.startswith("0x") or is_checksum_address(address))

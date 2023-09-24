import pytest
from utils.address_utils import validate_ethereum_address 

def test_valid_address():
    """Test that the method returns True for valid addresses."""
    assert validate_ethereum_address('0x742d35Cc6634C0532925a3b844Bc454e4438f44e') is True
    assert validate_ethereum_address('0xAb5801a7D398351b8bE11C439e05C5B3259aeC9B') is True

def test_invalid_address():
    """Test that the method returns False for invalid addresses."""
    assert validate_ethereum_address('0x123') is False
    assert validate_ethereum_address('0xGGGG35Cc6634C0532925a3b844Bc454e4438f44e') is False

def test_empty_string():
    """Test that the method raises a ValueError for empty strings."""
    with pytest.raises(ValueError, match="Address cannot be an empty string."):
        validate_ethereum_address('')

def test_non_string_input():
    """Test that the method raises a ValueError for non-string inputs."""
    with pytest.raises(ValueError, match="Address must be a string."):
        validate_ethereum_address(123)
    with pytest.raises(ValueError, match="Address must be a string."):
        validate_ethereum_address(None)

import pytest
from fastapi.testclient import TestClient
from unittest.mock import patch, MagicMock
from datetime import datetime, timedelta

from main import app

client = TestClient(app)

def test_get_slots_success():
    """Test successful retrieval of slots from the /slots endpoint"""
    # Mock data
    mock_slots = [
        {"startTime": "2023-05-01T10:00:00Z", "endTime": "2023-05-01T11:00:00Z"},
        {"startTime": "2023-05-01T14:00:00Z", "endTime": "2023-05-01T15:00:00Z"}
    ]

    # Create test parameters
    today = datetime.now()
    tomorrow = today + timedelta(days=1)
    start_time = today.strftime("%Y-%m-%dT%H:%M:%SZ")
    end_time = tomorrow.strftime("%Y-%m-%dT%H:%M:%SZ")

    # Mock the CalCom API client
    with patch('routers.slots.calcom_client.get_slots') as mock_get_slots:
        mock_get_slots.return_value = {"slots": mock_slots}

        # Make the request
        response = client.get(
            f"/slots?startTime={start_time}&endTime={end_time}&timeZone=Europe/London&storeName=belgravia"
        )

        # Check response
        assert response.status_code == 200
        assert response.json() == mock_slots
        mock_get_slots.assert_called_once()

def test_get_slots_invalid_store():
    """Test error handling for invalid store name"""
    # Create test parameters
    today = datetime.now()
    tomorrow = today + timedelta(days=1)
    start_time = today.strftime("%Y-%m-%dT%H:%M:%SZ")
    end_time = tomorrow.strftime("%Y-%m-%dT%H:%M:%SZ")

    # Make the request with an invalid store name
    response = client.get(
        f"/slots?startTime={start_time}&endTime={end_time}&timeZone=Europe/London&storeName=invalid_store"
    )

    # Check response
    assert response.status_code == 500
    # assert "Invalid slot data" in response.json()["detail"]

def test_get_slots_api_error():
    """Test error handling for API errors"""
    # Create test parameters
    today = datetime.now()
    tomorrow = today + timedelta(days=1)
    start_time = today.strftime("%Y-%m-%dT%H:%M:%SZ")
    end_time = tomorrow.strftime("%Y-%m-%dT%H:%M:%SZ")

    # Mock the CalCom API client to raise an exception
    with patch('routers.slots.calcom_client.get_slots') as mock_get_slots:
        mock_get_slots.side_effect = Exception("API Error")

        # Make the request
        response = client.get(
            f"/slots?startTime={start_time}&endTime={end_time}&timeZone=Europe/London&storeName=belgravia"
        )

        # Check response
        assert response.status_code == 500
        assert "Error fetching slots" in response.json()["detail"]

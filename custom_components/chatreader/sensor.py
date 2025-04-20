import logging
import os
from homeassistant.components.sensor import SensorEntity
from homeassistant.core import HomeAssistant
from homeassistant.helpers.entity_platform import AddEntitiesCallback
from homeassistant.helpers.typing import ConfigType, DiscoveryInfoType

_LOGGER = logging.getLogger(__name__)

def setup_platform(
    hass: HomeAssistant,
    config: ConfigType,
    add_entities: AddEntitiesCallback,
    discovery_info: DiscoveryInfoType | None = None
) -> None:
    """Set up the Chat Reader sensors."""
    _LOGGER.info("Setting up Chat Reader sensors")
    
    contact_map = {
        "Enhy": "contact01.txt",
        "Dad":  "contact02.txt",
        "Ben":  "contact03.txt",
        "Ange": "contact04.txt"
    }

    sensors = []
    for contact_name, filename in contact_map.items():
        file_path = f"/config/www/whatsapp_histories/{filename}"
        if os.path.exists(file_path):
            _LOGGER.info(f"Found chat file for {contact_name}: {file_path}")
            sensors.append(ChatHistorySensor(contact_name, filename))
        else:
            _LOGGER.error(f"Chat history file not found: {file_path}")
    
    add_entities(sensors, True)

class ChatHistorySensor(SensorEntity):
    """Sensor for chat history."""
    
    def __init__(self, contact_name, filename):
        """Initialize the sensor."""
        self._contact_name = contact_name
        self._filename = filename
        self._file_path = f"/config/www/whatsapp_histories/{filename}"
        self._attr_name = f"Chat History {contact_name}"
        self._attr_unique_id = f"chat_{contact_name.lower()}"
        self._attr_should_poll = True
        self._state = "Ready"
        self._attr_extra_state_attributes = {
            "chat_content": None
        }
        _LOGGER.info(f"Initialized sensor for {contact_name}")

    @property
    def state(self):
        """Return the state of the sensor."""
        return self._state

    @property
    def extra_state_attributes(self):
        """Return the state attributes."""
        return self._attr_extra_state_attributes

    def update(self):
        """Update the sensor state."""
        _LOGGER.info(f"Updating sensor for {self._contact_name}")
        if os.path.exists(self._file_path):
            try:
                with open(self._file_path, 'r', encoding='utf-8') as file:
                    content = file.read().strip()
                    if content:
                        self._state = f"Updated ({len(content)} chars)"
                        self._attr_extra_state_attributes["chat_content"] = content
                        _LOGGER.info(f"Updated {self._contact_name} with {len(content)} chars")
                    else:
                        self._state = "Empty file"
                        self._attr_extra_state_attributes["chat_content"] = ""
            except Exception as e:
                _LOGGER.error(f"Failed to read chat file '{self._file_path}': {e}")
                self._state = f"Error"
                self._attr_extra_state_attributes["chat_content"] = None
        else:
            _LOGGER.error(f"File not found: {self._file_path}")
            self._state = "File not found"
            self._attr_extra_state_attributes["chat_content"] = None 
import logging
import os
from homeassistant.components.sensor import SensorEntity

_LOGGER = logging.getLogger(__name__)

def setup_platform(hass, config, add_entities, discovery_info=None):
    """Set up the WhatsApp Chat sensors."""
    _LOGGER.info("Setting up WhatsApp Chat sensors")
    
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
            _LOGGER.info(f"Found chat history file for {contact_name}: {file_path}")
            sensors.append(WhatsappChatHistorySensor(contact_name, filename))
        else:
            _LOGGER.error(f"Chat history file not found: {file_path}")
    
    add_entities(sensors, True)

class WhatsappChatHistorySensor(SensorEntity):
    """Sensor for WhatsApp chat history."""
    
    def __init__(self, contact_name, filename):
        """Initialize the sensor."""
        self._contact_name = contact_name
        self._filename = filename
        self._file_path = f"/config/www/whatsapp_histories/{filename}"
        self._attr_name = f"WhatsApp Chat History {contact_name}"
        self._attr_unique_id = f"whatsapp_chat_{contact_name.lower()}"
        self._attr_should_poll = True
        self._state = None

    @property
    def state(self):
        """Return the state of the sensor."""
        return self._state

    def update(self):
        """Update the sensor state."""
        if os.path.exists(self._file_path):
            try:
                with open(self._file_path, 'r', encoding='utf-8') as file:
                    self._state = file.read()
            except Exception as e:
                _LOGGER.error(f"Failed to read WhatsApp chat file '{self._file_path}': {e}")
                self._state = "Error reading file"
        else:
            self._state = "No messages yet."
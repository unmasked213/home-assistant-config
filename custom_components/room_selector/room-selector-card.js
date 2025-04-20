class RoomSelector extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  setConfig(config) {
    if (!config.button_card) throw new Error('You need to define a button_card config');
    
    this.config = config;
    this.button_card = config.button_card;
  }

  static getConfigElement() {
    return document.createElement('room-selector-editor');
  }

  static getStubConfig() {
    return {
      button_card: {
        type: 'custom:button-card',
        // Your existing button card config here
      }
    };
  }

  set hass(hass) {
    this._hass = hass;

    if (!this.initialized) {
      this.initialized = true;
      this.render();
    }

    // Update room-specific entities
    const currentRoom = hass.states['input_select.room_selector']?.state.toLowerCase();
    if (currentRoom && this.currentRoom !== currentRoom) {
      this.currentRoom = currentRoom;
      this.updateEntities();
    }
  }

  async render() {
    if (!this._hass || !this.config) return;

    const style = document.createElement('style');
    style.textContent = `
      :host {
        display: block;
        position: relative;
      }
      .dropdown {
        position: absolute;
        top: 100%;
        left: 0;
        background: var(--ha-card-background, #000);
        border-radius: 12px;
        box-shadow: var(--ha-card-box-shadow, 0 2px 8px rgba(0,0,0,0.2));
        z-index: 999;
        overflow: hidden;
        opacity: 0;
        transform: translateY(-10px);
        transition: opacity 0.2s ease, transform 0.2s ease;
        pointer-events: none;
      }
      .dropdown.open {
        opacity: 1;
        transform: translateY(0);
        pointer-events: auto;
      }
      .dropdown-item {
        padding: 12px 16px;
        cursor: pointer;
        color: var(--primary-text-color, #fff);
        display: flex;
        align-items: center;
        gap: 8px;
        transition: background-color 0.2s ease;
      }
      .dropdown-item:hover {
        background: var(--accent-color, #03a9f4);
      }
      .dropdown-item.selected {
        background: var(--accent-color, #03a9f4);
        color: var(--accent-color-text, #000);
      }
    `;

    // Create button card element
    const buttonCard = document.createElement('hui-generic-entity-row');
    buttonCard.setConfig(this.button_card);
    buttonCard.hass = this._hass;

    // Add click handler to toggle dropdown
    buttonCard.addEventListener('click', (e) => {
      e.stopPropagation();
      this.toggleDropdown();
    });

    // Create dropdown
    const dropdown = document.createElement('div');
    dropdown.className = 'dropdown';
    this.createDropdownItems(dropdown);

    // Add everything to shadow root
    this.shadowRoot.innerHTML = '';
    this.shadowRoot.appendChild(style);
    this.shadowRoot.appendChild(buttonCard);
    this.shadowRoot.appendChild(dropdown);

    // Add click outside listener
    document.addEventListener('click', () => this.closeDropdown());
  }

  createDropdownItems(dropdown) {
    const options = this._hass.states['input_select.room_selector'].attributes.options;
    options.forEach(room => {
      const item = document.createElement('div');
      item.className = 'dropdown-item';
      if (room.toLowerCase() === this.currentRoom) {
        item.classList.add('selected');
      }
      
      const icon = document.createElement('ha-icon');
      icon.setAttribute('icon', this.getRoomIcon(room));
      
      const text = document.createElement('span');
      text.textContent = room;
      
      item.appendChild(icon);
      item.appendChild(text);
      
      item.addEventListener('click', (e) => {
        e.stopPropagation();
        this.selectRoom(room);
      });
      
      dropdown.appendChild(item);
    });
  }

  getRoomIcon(room) {
    const icons = {
      bedroom: 'mdi:bed',
      office: 'mdi:desk',
      hallway: 'mdi:door-open',
      bathroom: 'mdi:shower',
      lounge: 'mdi:sofa'
    };
    return icons[room.toLowerCase()] || 'mdi:home';
  }

  toggleDropdown() {
    const dropdown = this.shadowRoot.querySelector('.dropdown');
    dropdown.classList.toggle('open');
  }

  closeDropdown() {
    const dropdown = this.shadowRoot.querySelector('.dropdown');
    dropdown.classList.remove('open');
  }

  selectRoom(room) {
    this._hass.callService('input_select', 'select_option', {
      entity_id: 'input_select.room_selector',
      option: room
    });
    this.closeDropdown();
  }

  updateEntities() {
    // Update your button card variables here based on the current room
    const buttonCard = this.shadowRoot.querySelector('hui-generic-entity-row');
    if (buttonCard) {
      buttonCard.setConfig({
        ...this.button_card,
        variables: {
          ...this.button_card.variables,
          a_temp_entity: `sensor.${this.currentRoom}_temperature`,
          a_humidity_entity: `sensor.${this.currentRoom}_humidity`,
          // Update other entities similarly
        }
      });
      buttonCard.hass = this._hass;
    }
  }
}

customElements.define('room-selector-card', RoomSelector);
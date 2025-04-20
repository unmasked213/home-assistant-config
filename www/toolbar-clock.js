setTimeout(function(){
    customElements.whenDefined('mwc-icon-button').then(() => {

        const haButtonMenu = document.querySelector('home-assistant').shadowRoot
            .querySelector('home-assistant-main').shadowRoot
            .querySelector('ha-panel-lovelace').shadowRoot
            .querySelector('hui-root').shadowRoot
            .querySelector('ha-button-menu');

        haButtonMenu.updateComplete.then(() => {

            function haClock() {
                c.innerHTML = (new Date()).toLocaleTimeString(navigator.language, {
                    hour: '2-digit',
                    minute: '2-digit'
                });
            }

            const mdcButton = haButtonMenu.querySelector('ha-icon-button').shadowRoot
                .querySelector('mwc-icon-button').shadowRoot
                .querySelector('button')

            const haMenuSpan = haButtonMenu.querySelector('ha-icon-button').shadowRoot
                .querySelector('mwc-icon-button').shadowRoot
                .querySelector('span')

            // Adjust the CSS
            mdcButton.style.height = 'auto';
            mdcButton.style.width = 'auto';
            mdcButton.style.padding = '0px';
			mdcButton.style.whiteSpace = "nowrap"

            // Insert the clock
            var c = document.createElement('span');
            haMenuSpan.parentNode.replaceChild(c, haMenuSpan);

            // Start the clock
            haClock();
            setInterval(function() {
                haClock();
            }, 1000);
        });
    })
}, 3000);
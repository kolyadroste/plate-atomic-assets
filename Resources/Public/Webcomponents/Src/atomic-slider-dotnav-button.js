class AtomicSliderDotnavButton extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.shadowRoot.innerHTML = `
          <style>
            :host {
              display: inline-block;
              z-index: 1;
              display:block;
              background:var(--base-slider-dotnav-button-background,white);
              height: var(--base-slider-dotnav-button-height,12px);  
              border-radius:100%;
              margin: var(--base-slider-dotnav-button-margin,0 10px 0 0);
              width: var(--base-slider-dotnav-button-width,12px);  
              outline:none; 
              border: var(--base-slider-dotnav-button-border,solid 2px white);  
              padding:0;
              box-shadow: var(--base-slider-dotnav-button-shadow,0px 0px 3px 2px rgba(0,0,0,.4));
            }

            
            :host([aria-selected=true]){
              background:var(--base-slider-dotnav-button-background-active,#90cbff);
              width: var(--base-slider-dotnav-button-active-width,12px);  
              height: var(--base-slider-dotnav-button-active-height,12px);  
            }
            
            :host(:focus) {
              border: var(--base-slider-dotnav-button-focus-border,solid 2px white);  
              box-shadow: var(--base-slider-dotnav-button-focus-shadow, 0 0 10px #9ecaed);
              background:var(--base-slider-dotnav-button-background-active,#90cbff);
            }
          </style>
          <slot></slot>
        `;
    }

    connectedCallback() {
        this.addEventListener('click', this._handleClick.bind(this));
    }

    disconnectedCallback() {
        this.removeEventListener('click', this._handleClick.bind(this));
    }

    get label() {
        return this.getAttribute('label');
    }

    _handleClick() {
        const action = this.getAttribute('action');
        if (action) {
            this.dispatchEvent(new CustomEvent(action));
        }
    }
}

if(!customElements.get('atomic-slider-dotnav-button')){
    customElements.define('atomic-slider-dotnav-button', AtomicSliderDotnavButton);
}

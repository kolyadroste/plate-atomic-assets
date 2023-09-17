class AtomicShowHide extends HTMLElement {
    constructor() {
        super();
        this._show = this.getAttribute('show');
        this._breakpoints = {
            xs: parseInt(this.style.getPropertyValue('--atomic-showhide-bpxs')) || 0,
            sm: parseInt(this.style.getPropertyValue('--atomic-showhide-bpsm')) || 576,
            md: parseInt(this.style.getPropertyValue('--atomic-showhide-bpmd')) || 768,
            lg: parseInt(this.style.getPropertyValue('--atomic-showhide-bplg')) || 992,
            xl: parseInt(this.style.getPropertyValue('--atomic-showhide-bpxl')) || 1200,
            xxl: parseInt(this.style.getPropertyValue('--atomic-showhide-bpxxl')) || 1400
        };
    }

    connectedCallback() {
        this._updateVisibility();
        window.addEventListener('resize', () => this._updateVisibility());
    }

    disconnectedCallback() {
        window.removeEventListener('resize', () => this._updateVisibility());
    }

    attributeChangedCallback(name, oldValue, newValue) {
        if (name === 'show') {
            this._show = newValue;
            this._updateVisibility();
        }
    }

    static get observedAttributes() {
        return ['show'];
    }

    _updateVisibility() {
        const showRules = this._parseShowAttribute();
        const currentBreakpoint = this._getCurrentBreakpoint();

        if (showRules[currentBreakpoint] === 1 || !this._show) {
            this.style.display = 'block';
        } else {
            this.style.display = 'none';
        }
    }

    _parseShowAttribute() {
        const rules = this._show.split(",");
        let showRules = {};
        rules.forEach(rule => {
            let [key, value] = rule.split(":");
            showRules[key] = parseInt(value);
        });
        return showRules;
    }

    _getCurrentBreakpoint() {
        const viewportWidth = window.innerWidth;
        let currentBreakpoint = 'xs';

        Object.entries(this._breakpoints).forEach(([breakpoint, value]) => {
            if (viewportWidth >= value) {
                currentBreakpoint = breakpoint;
            }
        });

        return currentBreakpoint;
    }
}

window.customElements.define('atomic-showhide', AtomicShowHide);

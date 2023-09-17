class AtomicSliderSlide extends HTMLElement {
    static get observedAttributes() {
        return ["selected", "status"];
    }

    constructor() {
        super();
        this.selected = "false";
        this.status = "inactive";
        this.eventStatus = new CustomEvent("status");
        this.attachShadow({ mode: "open" });
    }

    connectedCallback() {
        this.render();
    }

    attributeChangedCallback(name, oldValue, newValue) {
        if (oldValue !== newValue) {
            this.render();
        }
    }

    render() {
        this.shadowRoot.innerHTML = `
      <style>
        :host {
          overflow: hidden;
          height: auto;
          opacity: 1;
          min-height: 100px;
          position: relative;
          transition: opacity 1.5s ease-in-out;
          width: 100%;
        }

        :host([selected="true"]) p {
          opacity: 1;
        }

        ::slotted(*) {
          position: relative;
        }

        :host figure {
          position: relative;
          display: grid;
          grid-template-columns: var(--base-slider-slide-columns, 100%);
          gap: var(--base-grid-gap, 0px);
          margin-block-start: 0;
          margin-block-end: 0;
          margin-inline-start: 0px;
          margin-inline-end: 0px;
          margin: 0px;
        }

        :host {
          position: relative;
          top: 0;
          left:0;
          width: 100%;
          display: none;
          transition: all 0.5s;
        }

        :host([selected="true"]),
        :host([next="true"]),
        :host([previous="true"]) {
          position: absolute;
          width: 100%;
          height: auto;
          display: block;
          visibility: hidden;
          opacity: 0;
        }

        :host([mode="slide"][next="true"]) {
          left: 100%;
        }

        :host([mode="slide"][previous="true"]) {
          left: -100%;
        }

        :host([selected="true"]) {
          left: 0;
          position: relative;
          visibility: visible;
          opacity: 1;
        }
      </style>
      <figure>
        <slot></slot>
      </figure>
    `;
        let images = this.querySelectorAll("img");
        Object.entries(images).forEach((el) => {
            el[1].setAttribute("draggable", "false");
            el[1].style.width = "100%";
        });
        if (this.selected === "true") {
            this.dispatchEvent(this.eventStatus);
        }
        if (this.selected === "true" || this.next === "true") {
            let lazyImages = this.querySelectorAll("lazy-image");
            if (lazyImages.length > 0) {
                lazyImages.forEach((node) => {
                    console.log(node);
                    node.setAttribute("initialised", "");
                });
            }
        }
    }
}

customElements.define("atomic-slider-slide", AtomicSliderSlide);

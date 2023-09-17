export default class AtomicOverlay extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({mode:"open"});
        this.resizeObserver = new ResizeObserver(entries => {
            for(let entry of entries) {
                this.updateClassBasedOnWidth(entry.contentRect.width);
            }
        });
    }

    connectedCallback () {
        this.render();
        this.resizeObserver.observe(this);
    }
    disconnectedCallback() {
        this.resizeObserver.unobserve(this);
        this.windowResizeObserver.unobserve(document.body);
    }

    updateClassBasedOnWidth(width) {
        // entfernen Sie zuerst alle existierenden Klassen
        this.classList.remove("small", "medium", "large", "xlarge");

        // dann fügen Sie die entsprechende Klasse basierend auf der Breite hinzu
        if(width >= 0 && width <= 599) {
            this.classList.add("small");
        } else if(width >= 600 && width <= 949) {
            this.classList.add("medium");
        } else if(width >= 950 && width <= 1249) {
            this.classList.add("large");
        } else if(width >= 1250) {
            this.classList.add("xlarge");
        }
    }


    render(){
        this.shadowRoot.innerHTML = `
      <style>
            :host{
                display:flex;
                align-items:var(--atomic-overlay-text-valign, center);
                justify-content:var(--atomic-overlay-text-halign, center);
                position: relative;
                box-sizing:border-box;
                z-index:var(--atomic-overlay-z-index,100);
                min-height:var(--atomic-overlay-min-height-small, 150px);
                padding-top: var(--atomic-overlay-padding-top, 20px);
                padding-bottom: var(--atomic-overlay-padding-bottom, 20px);
            }
            
            ::slotted(*:last-child){
                margin-bottom: 0 !important;
            }
            
            figcaption{
                background:var(--atomic-overlay-background, rgba(255,255,255,0.6));
                box-shadow: var(--atomic-overlay-shadow, none);
                padding:var(--atomic-overlay-figcaption-padding,20px);
                color:var(--atomic-overlay-color, black);
                /* fixes text issue with backdrop filter on chrome */ 
                -webkit-transform:translate3d(0,0,0);
                width: var(--atomic-overlay-width-small, 100%);
                box-sizing: border-box;
            }
            :host([backdropBlur]) figcaption{
                backdrop-filter: blur(var(--atomic-overlay-figcaption-blur, 10px));
            }
            
            :host(.medium){
                min-height:var(--atomic-overlay-min-height-medium, 250px);
            }
            :host(.medium) figcaption{
                width: var(--atomic-overlay-width-medium, 75%);
            } 
            
            :host(.large){
                min-height:var(--atomic-overlay-min-height-large, 500px);
            }
            
            :host(.large) figcaption{
                width: var(--atomic-overlay-width-large, 50%);
            } 
            
            :host(.xlarge){
                min-height:var(--atomic-overlay-min-height-xlarge, var(--atomic-overlay-min-height-large, 500px));
            }
            
            :host(.xlarge) figcaption{
                width: var(--atomic-overlay-width-xlarge, var(--atomic-overlay-width-large, 50%));
            } 
            
      </style>
    <figcaption part="figcaption">
        <slot></slot>
    </figcaption>
    `
    }
}

if (customElements.get('atomic-overlay') === undefined) {
    customElements.define('atomic-overlay', AtomicOverlay);
}

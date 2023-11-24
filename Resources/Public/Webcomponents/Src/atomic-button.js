class AtomicButton extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({mode:"open"});
    }

    connectedCallback () {
        this.render();
        let root = this;
        if(this.link){
            this.addEventListener("click",()=>{
                window.location.href = root.link;
            });
        }
    }

    get link(){
        let link = this.querySelector("a");
        if(link){
            return link.getAttribute("href");
        }
        return null;
    }

    render(){
        this.shadowRoot.innerHTML = `
      <style>
        :host{
            background:var(--atomic-button-background, #22509a);
            color:var(--atomic-button-color, white);
            padding:var(--atomic-button-padding, 10px 20px);
            border-radius:var(--atomic-button-radius, 3px);
            display:inline-block;
            cursor:pointer;
        }
        ::slotted(button){
            background:transparent;
            border:none;
            padding:0;
        }
        ::slotted(*){
             color:var(--atomic-button-color, inherit) !important;
             cursor:pointer;
             text-decoration: none;
        }
        :host([transparent]){
            background:transparent;
            color:var(--atomic-button-color-transparent,  #22509a);
        }
        :host(:hover){
            background:var(--atomic-button-background-hover, #22509a);
            color:var(--atomic-button-color-hover, white);
        }
        :host(:hover) ::slotted(*){
            color:var(--atomic-button-color-hover, white) !important;
        }
        :host([transparent]:hover){
            color:var(--atomic-button-transparent-color-hover, white);
        }
        .flex{
            display:flex;
            align-items: center;
            gap: 10px;
        }
  
      </style>
    <div class="flex">
        <slot name="before"></slot>
        <slot></slot>
        <slot name="after"></slot>
    </div>
    `
    }
}

if (customElements.get('atomic-button') === undefined) {
    customElements.define('atomic-button', AtomicButton);
}
2
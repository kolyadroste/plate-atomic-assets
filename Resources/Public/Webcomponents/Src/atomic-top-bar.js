/**
 * @license
 * @Author Kolya von Droste zu Vischering
 * @slot - This element has a slot
 */
export default class AtomicTopBar extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({mode:"open"});
  }

  connectedCallback () {
    this.render();
  }

  render(){
    this.shadowRoot.innerHTML = `
      <style>
        :host{
            --stahl-top-bar--background: transparent;
        
            display:flex;
            position: relative;
            align-items: center;
            align-content: center;
            justify-content: space-between;
            background: var(--stahl-top-bar--background);
        }
        .col{
            display:flex;
        }
        col.left{
            justify-content: flex-start;
        }
        col.center{
        
            justify-content: center;
        }
        col.right{
            justify-content: flex-end;
        }
  
      </style>
      <div class="col left">
          <slot name="left"></slot>  
      </div> 
      <div class="col center">
          <slot name="center"></slot>   
      </div>
      <div class="col right">
          <slot name="right"></slot>   
      </div>
    `
  }
}
if (customElements.get('atomic-top-bar') === undefined) {
  customElements.define('atomic-top-bar', AtomicTopBar);
}

export default class AtomicLoadmore extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({mode:"open"});
        this.callback = this.getAttribute("callback");
        this.headers = this.attributes.headers ? this.attributes.headers.value : {'Content-Type': 'application/x-www-form-urlencoded'};
    }

    connectedCallback () {
        this.render();
        this._activateButton();
    }

    get method(){
        return this.attributes.timeout ? this.attributes.timeout.value: 100;
    }

    get mode(){
        return this.attributes.mode ? this.attributes.mode.value: 'cors';
    }

    get method(){
        return this.attributes.method ? this.attributes.method.value : 'POST';
    }

    get form(){
        if(this.hasAttribute("getFormData")){
            let form =  this.hasAttribute("formSelector") ? document.querySelector(this.getAttribute("formSelector")) : this.closest('form');
            return form;
        }
    }

    get formData(){
        return this.form ? new FormData(this.form) : null;
    }

    get url(){
        return this.attributes.url ? this.attributes.url.value : '';
    }

    get target(){
        if(this.hasAttribute("target")){
            let target = this.getAttribute("target");
            target = document.querySelector(target);
            return target ? target : this;
        }
    }

    get loader(){
        return this.shadowRoot.querySelector(".loader");
    }

    _activateButton(){
        const link = this.shadowRoot.querySelector("#link");
        link.addEventListener("click",(e)=>{
            e.stopPropagation();
            e.preventDefault();
            this.load((html)=>{
                //let content = this._parseHTML(html);
                var parser = new DOMParser();
                var content = parser.parseFromString(html, 'text/html').querySelector('body').innerHTML;
                this._addContent(content);
                if(this.callback) {
                    this._customCallback(content);
                }
            });
        })
    }

    _addContent(content){
        var parser = new DOMParser();
        // content will be added with disconnectedCallback
        this.loadedContent = parser.parseFromString(content, 'text/html').querySelector('body').innerHTML;
        this.remove();
    }

    disconnectedCallback(){
        this.target.innerHTML += this.loadedContent;
    }

    load(callback){
        if(!this.url) return;

        this.loader.classList.remove("hidden");

        fetch(this.url,{
            method: this.method,
            mode: this.mode,
            body: this.formData ? this.formData : null,
        })

            .then((response) => {
                return response.text();
            })

            .then((html) => {
                callback(html);
            })

            .catch(function (err) {
                // There was an error
                console.warn('Something went wrong.', err);
            });
    }

    _customCallback(data){
        if(!this.callback){return}
        const func = eval(this.callback);
        func(data);
    }

    render(){
        this.shadowRoot.innerHTML = `
            <style>
                :host{
                    display:block;
                    position: relative;
                    
                }
                .hidden{
                    display:none !important;
                }
                .loader {
                  display: block;
                  margin: auto;
                  margin-top: var(--base-loadermore--loader-margin, 20px);
                  width: calc(var(--base-loadermore--loader-size, 40px) * 1.2);
                  height: calc(var(--base-loadermore--loader-size, 40px) * 1.2);
                }
                .loader:after {
                  content: " ";
                  display: block;

                  left: 50%;
                  top: calc(var(--base-loadermore--loader-size, 40px) * -10px);
                  transform: translateX(-50%);
                  width: var(--base-loadermore--loader-size, 40px);
                  height: var(--base-loadermore--loader-size, 40px);
      
                  border-radius: 50%;
                  opacity: var(--base-loadermore--loader-opacity, 0.5);
                  border: 6px solid var(--base-loadermore--loader-color, black);
                  border-color: var(--base-loadermore--loader-color, black) transparent var(--base-loadermore--loader-color, black) transparent;
                  animation: loader 1.2s linear infinite;
                }
                @keyframes loader {
                  0% {
                    transform: rotate(0deg);
                  }
                  100% {
                    transform: rotate(360deg);
                  }
                }
            </style>
            <slot name="dataSlot"></slot>   
            <div class="">
               <a href="${this.url}" id="link" part="link">
                <slot></slot>            
               </a>
            </div>
            <div class="loader hidden"></div> 
        `
    }
}

if (customElements.get('atomic-loadmore') === undefined) {
    window.customElements.define('atomic-loadmore', AtomicLoadmore);
}
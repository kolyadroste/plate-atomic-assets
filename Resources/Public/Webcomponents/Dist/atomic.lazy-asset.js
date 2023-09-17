class AtomicLazyAsset extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.shadowRoot.innerHTML = `
            <style>
                :host {
                    display:block;
                    visibility: hidden !important;
                    position: relative !important;
                    z-index: -1 !important;
                }
                #area{
                    display:block;
                    position: absolute;
                    top: -${this.loadBefore} !important;
                    height: ${this.range} !important;
                    width: 100% !important;
                }
            </style>
            <div id="area"></div>
        `;
    }

    get type(){
        return this.getAttribute('type') ? this.getAttribute('type') : "js"
    }
    get area(){
        return this.shadowRoot.querySelector('#area');
    }
    get loadBefore(){
        return this.getAttribute('load-before') ? this.getAttribute('load-before') : "300px";
    }
    get range(){
        return this.getAttribute('range') ? this.getAttribute('range') : "100vh";
    }

    get getSrc(){
        if(this.type == 'js'){
            return this.getAttribute('src');
        }else{
            return this.getAttribute('href');
        }

    }

    get isFileLinked() {
        if(this.type==='js'){
            const script = document.querySelector(`script[src="${this.getSrc}"]`);
            return script !== null;
        }else{
            const cssLink = document.querySelector(`link[href="${this.getSrc}"]`);
            return cssLink !== null;
        }
    }

    connectedCallback () {
        this.observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    this.loadCss();
                    this.observer.disconnect();
                }
            });
        });
        this.observer.observe(this.area);
    }

    loadCss() {
        if(this.isFileLinked) return;
        let asset = "";
        if(this.type === 'js'){
            asset = document.createElement('script');
            asset.type = 'module';
            asset.src = this.getSrc;
            asset.async = true
        }else{
            asset = document.createElement('link');
            asset.rel = 'stylesheet';
            asset.href = this.getSrc;
            console.log(asset);
        }

        asset.addEventListener('load', () => {
            this.dispatchEvent(
                new CustomEvent('script loaded', {
                    bubbles: true,
                    composed: true,
                })
            );
        });
        document.head.appendChild(asset);
    }
}

customElements.define('a-lazy-asset', AtomicLazyAsset);



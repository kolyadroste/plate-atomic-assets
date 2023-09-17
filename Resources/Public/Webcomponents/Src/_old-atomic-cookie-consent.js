class AtomicCookieConsent extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({mode:"open"});
    }

    get expiringDays(){
        return this.hasAttribute("expiringDays") ? this.getAttribute("expiringDays") : 365;
    }

    get cookieStorage(){
        return this.hasAttribute("cookieStorage") ? this.getAttribute("cookieStorage") : 'document.cookie';
    }

    get cookieIdentifier(){
        return this.hasAttribute("cookieIdentifier") ? this.getAttribute("cookieIdentifier") : 'cookie_consent';
    }

    get identifier(){
        return this.hasAttribute("identifier") ? this.getAttribute("identifier") : '';
    }

    get embedType(){
        return this.hasAttribute("embedType") ? this.getAttribute("embedType") : 'iframe';
    }

    get contentName(){
        return this.hasAttribute("contentName") ? this.getAttribute("contentName") : 'Nicht gesetzt';
    }

    get contentProtector(){
        return this.hasAttribute("contentProtector") ? this.getAttribute("contentProtector") : 'Nicht gesetzt';
    }

    get linkPrivacyPolicy(){
        return this.hasAttribute("linkPrivacyPolicy") ? this.getAttribute("linkPrivacyPolicy") : '#';
    }

    get valuesHTMLencoded(){
        return this.hasAttribute("valuesHTMLencoded") ? true : false;
    }

    get stateLoaded(){
        return this.hasAttribute("loaded");
    }

    get slotConsentedContent(){
        return this.querySelector('[slot="consentedContent"]');
    }

    get allowBt(){
        let allowBt;
        allowBt = this.querySelector('[slot="allowButton"]');
        if(allowBt === null){
            allowBt = this.shadowRoot.querySelector('button[allowBT]');

        }
        return allowBt;
    }

    get allowAllBt(){
        let allowAllBt;
        allowAllBt = this.querySelector('[slot="allowAllButton"]');
        if(allowAllBt === null){
            allowAllBt = this.shadowRoot.querySelector('button[allowAllBT]');
        }
        return allowAllBt;
    }

    get consentCookie(){
        var value = "; " + eval(this.cookieStorage);
        var values = value.split("; " + this.cookieIdentifier + "=");
        if (values.length == 2) {
            values =  values.pop().split(";").shift();
            values = decodeURIComponent(values);
            return JSON.parse(values);
        }else{
            return false;
        };
    }

    get doConsentCookieExist(){
        return this.consentCookie ? true : false;
    }

    get isCookieConsentedGlobally(){
        let consentCookie = this.consentCookie;
        if(consentCookie){
            if(consentCookie.options.includes(this.identifier)){
                return true;
            }else{
                console.log(this.constructor.name + ': cookie:"' + this.identifier +'" isnt consented globally');
            }
        }else{
            console.log(this.constructor.name + ': cookie:"' + this.identifier +'" isnt consented globally');
        }
    }

    _createCookie(){
        let baseSettings = {"consent":false,"options":[]};
        if(valuesHTMLencoded) baseSettings = encodeURIComponent(baseSettings);
        var d = new Date();
        d.setTime(d.getTime() + (this.expiringDays*24*60*60*1000));
        var expires = "expires="+ d.toUTCString();
        document.cookie = this.cookieIdentifier + "=" + baseSettings + ";" + expires + ";path=/" + ";SameSite=Strict";
    }


    _isEncoded(uri) {
        return uri !== decodeURIComponent(uri);
    }

    updateCookieConsent(){
        if(this.consentCookie){
            let consentCookie = this.consentCookie;

            if(consentCookie.options.includes(this.identifier)) return;
            let baseSettings = {"consent":true,"options":[]};
            baseSettings.options = consentCookie.options;
            baseSettings.options.push(this.identifier);
            baseSettings = JSON.stringify(baseSettings);
            baseSettings = encodeURIComponent(baseSettings);
            var d = new Date();
            d.setTime(d.getTime() + (this.expiringDays*24*60*60*1000));
            var expires = "expires="+ d.toUTCString();

            document.cookie = this.cookieIdentifier + "=" + baseSettings + ";" + expires + ";path=/" + ";SameSite=Strict";

        }else{
            console.error(this.constructor.name + ': atomic-cookie-consent: cookie couldnt be updated');
        }
    }

    connectedCallback () {
        this.render();

        this.allowBt.addEventListener('click',(e)=>{
            this._onClickAllow();
        })
        this.allowAllBt.addEventListener('click',(e)=>{
            this._onClickAllowGlobally();
        });

        if(this.isCookieConsentedGlobally){
            this.showConsentContent();
        }else{
            this.hideConsentContent();
        }

        document.addEventListener('atomic-cookie-consent-' + this.identifier, ()=>{
            this.showConsentContent();
        }, false);

    }

    _onClickAllow(){
        this.showConsentContent();
    }

    _onClickAllowGlobally(){
        if(!this.doConsentCookieExist){
            this._createCookie();
        }
        this.updateCookieConsent();

        document.dispatchEvent(new CustomEvent('atomic-cookie-consent-' + this.identifier));
    }

    showConsentContent(){
        if(this.hasAttribute("loaded")){
            return;
        }
        this.setAttribute('loaded','');
        let protectedContent = this.querySelector('script[type="text/x-gdpr-protected"]');
        if(protectedContent){
            let replace = protectedContent.innerHTML;
            if(!this.slotConsentedContent){
                const visibleContentSlot = document.createElement("div");
                visibleContentSlot.setAttribute("slot","consentedContent");
                this.appendChild(visibleContentSlot);
                visibleContentSlot.innerHTML = replace;

            }else{
                this.slotConsentedContent.innerHTML = replace;
            }

            protectedContent.innerHTML = '';
        }

    }

    hideConsentContent(){
        if(!this.hasAttribute("loaded")){
            return;
        }
        this.removeAttribute('loaded');
        let content = this.querySelector('script[type="text/x-gdpr-protected"]');
        if(content){
            let replace = this.slotConsentedContent.innerHTML;
            content.innerHTML = replace;
        }
    }

    updateStatus(){
        if(this.isCookieConsentedGlobally && !this.stateLoaded){
            this.showConsentContent();
        }
    }



    render(){
        this.shadowRoot.innerHTML = `
        <style>
          :host{         
             --atomic-cookie-consent--button-color: #008227;
             
             position:relative;
             display:block;
             min-height: var(--atomic-cookie-consent--min-height, 150px);
          }
          :host .overlay{
            z-index:10;
            background:var(--atomic-cookie-consent--background, #eee);
            position:absolute;
            left:0;
            top:0;
            height: calc(100% - 40px);
            width:calc(100% - 40px);
            display:flex;
            align-items: center;
            justify-content: center;
            padding:20px;
            box-shadow: 0 0 0 1px var(--atomic-cookie-consent--border-color.rgba(255,255,255,0.5));
          }        
          :host .overlay{
            text-align:center;
          }
          
          .intro-text{
            display:block;
          }
          
          :host([loaded]) .overlay{
            display:none;
            
          }
          :host button{
            display:inline-flex;
            padding:var(--atomic-cookie-consent--button-padding, 7px 15px);
            cursor:pointer;
            border: var(--atomic-cookie-consent-button-border, 2px solid #008227);
            border-color:var(--atomic-cookie-consent-button-background-color, #008227);
            color: var(--atomic-cookie-consent-button-color , #008227);
            margin-bottom:10px;
          }
          :host button[allowAllBT]{
            display:inline-flex;
            border: var(--atomic-cookie-consent-button-all--border, 2px solid #008227);
            background: var(--atomic-cookie-consent-button-all-background-color, #008227);
            color: var(--atomic-cookie-consent-button-all-color , white);
            margin-bottom:10px;
          }
          :host button:hover{
            opacity:0.8;
          }
          :host([embed16by9]) [name="consentedContent"]{
            position: relative;
            display: block;
            width: 100%;
            padding: 56.25% 0 0 0;
            overflow: hidden;
          }
          :host([embed16by9]) ::slotted([slot="consentedContent"]){
            position: absolute;
            top: 0;
            bottom: 0;
            left: 0;
            width: 100%;
            height: 100%;
            border: 0;
          }
          
        </style>
        <div class="overlay">
            <div class="centered">
                <div part="intro-text">
                    <slot name="introtext">
                        <p>Mit dem Laden von \"${this.contentName}\" akzeptieren Sie die
                        <br><a href=\"${this.linkPrivacyPolicy}\" target=\"blank\">Datenschutzerklärung</a> von ${this.contentProtector}.</p>                
                    </slot>                
                </div>
                <div part="buttons">
                    <slot name="allowButton">
                        <button allowBT class="button-allow" part="allowButton">
                            ${this.contentName} laden
                        </button>    
                    </slot>
                    <slot name="allowAllButton">
                        <button allowAllBT class="button-allow" part="allowAllButton">
                            ${this.contentName} "immer" laden
                        </button>
                    </slot>            
                </div>            
            </div>


        </div>
        <slot></slot>
        <slot name="consentedContent"></slot>
    `
    }
}

if (customElements.get('atomic-cookie-consent') === undefined) {
    customElements.define('atomic-cookie-consent', AtomicCookieConsent);
}

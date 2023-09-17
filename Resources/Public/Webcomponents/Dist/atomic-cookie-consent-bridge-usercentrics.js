class AtomicCookieConsentBridgeUsercentrics extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({mode:"closed"});

        window._ucEvent = window._ucEvent || [];
        window._ucEvent.push(['setConsentListener', function(consentData) {
            if (consentData.consent.status === 'accepted') {
                console.log('Usercentrics consent accepted');
            }else{
                console.log('Usercentrics consent declined');
            }
        }]);
    }

    connectedCallBack(){

    }

    // /**
    //  * @returns {string}
    //  * stored in LocalStorage
    //  * based on usercentrics Version 3.22.0
    //  */
    // get usercentricsData(){
    //     return localStorage.getItem("uc_gcm") ?? console.error("usercentricsData not found");
    // }
    //
    // get isUserCentricsActive(){
    //     setTimeout(()=>{}, 1000);
    // }

    updateCookieConsentCookie(){

    }

    callUpdateAtomicCookieConsent(){

    }
}

if (customElements.get('atomic-cookie-consent-bridge-usercentrics') === undefined) {
    customElements.define('atomic-cookie-consent-bridge-usercentrics', AtomicCookieConsentBridgeUsercentrics);
}

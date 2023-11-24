class AtomicScrolltotop extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: "open" });
        this.treshold = this.getAttribute('treshold') || 300;
    }

    connectedCallback() {
        this.render();

        // Event Listener für Scroll-Verhalten
        window.addEventListener('scroll', () => this.handleScroll());
        this.addEventListener('click', () => this.scrollToTop());
    }

    handleScroll() {
        // Checken, ob der Scroll-Bereich größer ist als der treshold
        if (window.scrollY > this.treshold) {
            this.classList.add('show');

            // is end of page reached?
            if ((window.innerHeight + window.scrollY) >= (document.body.offsetHeight - 100)) {
                this.classList.add('endreached');
            } else {
                this.classList.remove('endreached');
            }
        } else {
            this.classList.remove('show');
        }
    }

    scrollToTop() {
        console.log("scrollToTop");
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    }

    render() {
        this.shadowRoot.innerHTML = `
      <style>
        :host {
            position: fixed;
            z-index: var(--atomic-scrolltotop-zindex,1000);
            inset: var(--atomic-scrolltotop-inset, auto 30px 30px auto);
            background: var(--atomic-scrolltotop-bg, #eee);
            color: var(--atomic-scrolltotop-color, #333);
            display: flex;
            justify-content: center;
            align-items: center;
            cursor: pointer;
            width: var(--atomic-scrolltotop-width, 40px);
            height: var(--atomic-scrolltotop-height, 40px);
            opacity: 0;
            box-sizing: border-box;
            transition: all 0.5s ease-in-out; 
            box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
        }
        :host(.show) {
            opacity: 1;
        }
        :host(.show:hover){
            background: var(--atomic-scrolltotop-bg-hover, #d7d7d7);
        }
        :host(.endreached){
            border: var(--atomic-scrolltotop-borderatend, 2px solid #999);
        }
        
        .arrow {
        }

        .arrow span {
            display: block;
            width: 10px;
            height: 10px;
            position: relative;
            top: var(--atomic-scrolltotop-icon-shifttop, 2px);
            border-bottom: 5px solid var(--atomic-scrolltotop-icon-color, #333);
            border-right: 5px solid var(--atomic-scrolltotop-icon-color, #333);
            transform: rotate(-135deg);
        }
        :host(.show:hover) .arrow span{
            border-bottom: 5px solid var(--atomic-scrolltotop-icon-color-hover, #000);
            border-right: 5px solid var(--atomic-scrolltotop-icon-color-hover, #000);
        }
      </style>


      <slot>
        <div class="arrow"><span></span></div>
      </slot>

    `
    }
}

if (customElements.get('atomic-scrolltotop') === undefined) {
    customElements.define('atomic-scrolltotop', AtomicScrolltotop);
}

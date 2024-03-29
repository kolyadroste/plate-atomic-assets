class AtomicSliderResponsiveCols extends HTMLElement {
    constructor() {
        super();
        this.shadowDom = this.attachShadow({mode: 'open'});
        this.shadowDom.innerHTML = `
            <style>
                :host{
                    display:block;
                    cursor:pointer;
                }       
            </style>
            <slot></slot>    
        `;

        this.responsiveCheck = this.responsiveCheck.bind(this);
        this._initElements();
    }

    get alignRight() {
        return this.hasAttribute('alignRight');
    }

    _initElements() {
        if(!this.slideSelector) {
            console.error("atomic-slider-responsive-cols: slides defined by slideSelector could not be found");
        }
        let elements = this.querySelectorAll(this.slideSelector);
        if (elements.length <= 0) {
            console.error("atomic-slider-responsive-cols: target could not be found or is empty");
        }
        this.targetContainer = elements[0].parentNode;
        elements.forEach((item, index) => {
            item.setAttribute('data-index', index);
            item.setAttribute('arcElement',"");
        });
    }

    connectedCallback() {
        window.addEventListener('resize', this.responsiveCheck);
        this.responsiveCheck();
    }

    disconnectedCallback() {
        window.removeEventListener('resize', this.responsiveCheck);
    }

    get slideSelector() {
        return this.getAttribute('slideSelector') ? this.getAttribute('slideSelector') : ".asrc-slide";
    }

    get cols() {
        let conf = this.getAttribute('cols');
        let colsConfig = [];
        try{
            conf.split(',').map((item,index) => {
                const [key, value] = item.split(':');
                colsConfig[key] = value;
            });


        }catch(e){
            colsConfig = [{0:1}, {500:2}, {1024:3}];
            console.error('Invalid cols attribute. Using default value: [{0:1}, {500:2}, {1024:3}]');
        }
        return colsConfig;
    }

    get elements() {
        return this.querySelectorAll('[arcElement]');
    }
    get slider() {
        return this.querySelector('atomic-slider');
    }

    responsiveCheck() {
        const width = this.offsetWidth;
        let cols = 1;
        let colsConfig = this.cols;

        Object.keys(colsConfig).forEach((key) => {
            if (width >= key){
                cols = colsConfig[key];
            }
        });
        this._updateCols(Number(cols));
    }

    _updateCols(cols) {
        if(cols !== undefined && cols < 1) return;
        this.setAttribute('data-cols', cols);

        this._putElementsInCols(cols);
    }

    _putElementsInCols(colsAmount) {
        console.log("putting elements in cols");
        let elements = this.elements;
        let containerElements = this.targetContainer.querySelectorAll('[asrc-container]');
        let col;
        // Remove all container elements
        if (containerElements.length > 0) {
            containerElements.forEach((item) => {
                item.remove();
            });
        }
        // Rebuild container elements
        let countColNum = 0;
        for (let i = 0; i < elements.length; i++) {
            // Elements are grouped by colSize
            if (i % colsAmount === 0) {
                col = document.createElement('div');
                col.setAttribute("asrc-container", "");
                col.classList.add('asrc-row');
                col.classList.add('asrc-col-' + colsAmount);
                col.setAttribute('data-num', countColNum);
                col.style.display = "grid";
                col.style.width = "100%";
                col.style.gap = "var(--atomic-slider-responsive-cols-gap, 5px)";
                col.style.gridTemplateColumns = "repeat(" + colsAmount + ", minmax(0, 1fr))";
                this.targetContainer.appendChild(col);
                countColNum++;
            }
            elements[i].classList.add('col');
            col.appendChild(elements[i]);
        }
        // Check if this.alignRight is true and then add filler elements if necessary
        if (this.alignRight) {
            console.log("true");
            let lastColChildCount = col.childElementCount;
            for (let i = lastColChildCount; i < colsAmount; i++) {
                let fillerElement = document.createElement('div');
                fillerElement.classList.add('col', 'filler');
                col.prepend(fillerElement);
            }
        }

        let colChange = new CustomEvent('as-responsive-cols-update', {detail: {cols: colsAmount}});
        this.dispatchEvent(colChange);
    }

}

if(!customElements.get('atomic-slider-responsive-cols')){
    customElements.define('atomic-slider-responsive-cols', AtomicSliderResponsiveCols);
}

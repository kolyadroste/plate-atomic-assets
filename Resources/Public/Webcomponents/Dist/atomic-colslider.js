class AtomicColSlider extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        const prefinedIndex = this.getAttribute('index');
        this.shadowRoot.innerHTML = `
          <style>
            :host {
              display: block;
              overflow: var(--acs-overflow, hidden);
              position: relative;
              background: var(--acs-bg, #000);
              --acs-cols: 1;
            }
            :host([data-currcols="2"]){
                --acs-cols: 2;
            }
            :host([data-currcols="3"]){
                --acs-cols: 3;
            }
            :host([data-currcols="4"]){
                --acs-cols: 4;
            }
            :host([data-currcols="5"]){
                --acs-cols: 5;
            }
            :host([data-currcols="6"]){
                --acs-cols: 6;
            }
            .slider-container {
              display: flex;
              flex-wrap: nowrap;
              gap: var(--acs-gap, 0px); /* Set gap between slides */
              transition: transform 0.5s ease-in-out;
            }
            .slider-slot::slotted(*) {
              flex: 0 0 auto;
              padding: var(--acs-padding, 0px);
              box-sizing: border-box;
            }
            .slider-slot::slotted(.as-slide) {
              width: calc((100% - (var(--acs-gap, 0px) * (var(--acs-cols) - 1))) / var(--acs-cols));
            }
            .control {
              position: absolute;
              top: 50%;
              z-index: 1;
              transform: translateY(-50%);
            }
            button{
              height: var(--acs-control-dim, 30px);
              width: var(--acs-control-dim, 30px);
              background-color: #fff;
              border: none;
              display: flex;
              align-items: center;
              justify-content: center;
              line-height: 1;
              cursor: pointer;
            }
            .control:hover {
                opacity: 0.8;
            }
            .prev { left: 0; }
            .next { right: 0; }
          </style>
          <div class="control prev"><slot name="prev"><button class="prev">&#10094;</button></slot></div>
          <div class="slider-container" part="container">
            <slot class="slider-slot"></slot>
          </div>
          <div class="control next"><slot name="next"><button class="next">&#10095;</button></slot></div>
        `;

        this.index = prefinedIndex ? parseInt(prefinedIndex, 10) : 0;
        // when configured index is bigger then the amount of slides, set it to the last index
        if (this.index >= this.slideAmount) {
            this.index = this.slideAmount - this.cols;
        }
        // when index ist set to the word 'last', set it to the last index
        if (prefinedIndex === 'last') {
            this.index = this.slideAmount - this.cols;
        }
        if (prefinedIndex === 'first') {
            this.index = 0;
        }
    }

    get sliderContainer() {
        return this.shadowRoot.querySelector('.slider-container');
    }

    //get all slotted elements
    get items() {
        return this.querySelectorAll(':scope > *:not([slot])');
    }
    get slideAmount() {
        return this.items.length;
    }
    get images() {
        return this.querySelectorAll(':scope img');
    }

    connectedCallback() {
        this.init();
        this.setupEvents();
        this.updateLayout();

        window.addEventListener('resize', this.updateLayout.bind(this));

        if ('ontouchstart' in window) {
            this.setupTouchEvents();
        }

        this.sliderContainer.addEventListener('transitionend', () => {
            this.isSliding = false;
        });
    }

    disconnectedCallback() {
        window.removeEventListener('resize', this.updateLayout.bind(this));
        if ('ontouchstart' in window) {
            this.removeTouchEvents();
        }
    }

    setupTouchEvents() {
        let startX = 0;
        const onTouchStart = (e) => {
            if (this.isSliding) return;
            startX = e.touches[0].pageX;
        };

        const onTouchMove = (e) => {
            if (this.isSliding) return;
            const touch = e.touches[0];
            const change = startX - touch.pageX;
            if (change > 40) {

                this.slide(1);
                e.preventDefault();
            } else if (change < -40) {
                this.slide(-1);
                e.preventDefault();
            }
        };

        this.sliderContainer.addEventListener('touchstart', onTouchStart);
        this.sliderContainer.addEventListener('touchmove', onTouchMove);

        this._onTouchStart = onTouchStart;
        this._onTouchMove = onTouchMove;
    }

    removeTouchEvents() {
        this.sliderContainer.removeEventListener('touchstart', this._onTouchStart);
        this.sliderContainer.removeEventListener('touchmove', this._onTouchMove);
    }

    init() {
        this.items.forEach(item => {
            item.classList.add('as-slide');
        });
        this.images.forEach(item => {
            item.style.width = "100%";
            item.style.height = "auto";
            item.style.display = "block";
        });
    }

    setupEvents() {
        this.shadowRoot.querySelector('.prev').addEventListener('click', () => this.slide(-1));
        this.shadowRoot.querySelector('.next').addEventListener('click', () => this.slide(1));
    }

    get cols() {
        const defaultColsConfig = '320:1,640:2,960:3';
        const colsAttribute = this.getAttribute('cols');
        const colsConfigString = colsAttribute === null ? defaultColsConfig : colsAttribute;

        let colsConfig;
        try {
            colsConfig = colsConfigString.split(',')
                .map(part => part.split(':').map(Number))
                .sort((a, b) => b[0] - a[0]);

            if (colsConfig.some(config => config.length !== 2 || isNaN(config[0]) || isNaN(config[1]))) {
                throw new Error('Invalid cols configuration format');
            }
        } catch (error) {
            console.error(error.message);
            return 1;
        }

        const containerWidth = this.offsetWidth;
        const matchingConfig = colsConfig.find(config => containerWidth >= config[0]);

        let cols =  matchingConfig ? matchingConfig[1] : colsConfig[colsConfig.length - 1][1];
        return cols;
    }


    updateLayout() {
        this.setAttribute('data-currcols', this.cols);
        this.updateSlider();
    }

    slide(direction) {
        if (this.isSliding) return;
        this.isSliding = true;
        const items = this.shadowRoot.querySelector('.slider-slot').assignedElements();
        this.index += direction;
        if (this.index > items.length - this.cols) this.index = 0;
        if (this.index < 0) this.index = items.length - this.cols;
        if(this.cols !== this.previousCols){
            this.sliderContainer.style.transform = `translateX(0)`;
        }
        this.previousCols = this.cols;
        this.updateSlider();
    }

    updateSlider() {
        const gap = parseInt(getComputedStyle(this).getPropertyValue('--acs-gap'), 10) || 0;
        const gapRaw = getComputedStyle(this).getPropertyValue('--acs-gap') || 0;
        const effectiveWidth = this.sliderContainer.offsetWidth - (gap * (this.cols - 1));
        const itemWidth = effectiveWidth / this.cols;
        this.sliderContainer.style.transform = `translateX(calc(-${this.index} * (${itemWidth}px + ${gapRaw})))`;
    }
}
if (!customElements.get('atomic-colslider')) {
    customElements.define('atomic-colslider', AtomicColSlider);
}
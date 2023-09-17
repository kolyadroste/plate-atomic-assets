!function(e,t){"object"==typeof exports&&"undefined"!=typeof module?module.exports=t(require("./util"),require("./dom/event-handler"),require("./dom/manipulator"),require("./dom/selector-engine"),require("./util/swipe"),require("./base-component")):"function"==typeof define&&define.amd?define(["./util","./dom/event-handler","./dom/manipulator","./dom/selector-engine","./util/swipe","./base-component"],t):(e="undefined"!=typeof globalThis?globalThis:e||self).Carousel=t(e.Index,e.EventHandler,e.Manipulator,e.SelectorEngine,e.Swipe,e.BaseComponent)}(this,function(e,t,i,s,n,r){"use strict";let l=e=>e&&"object"==typeof e&&"default"in e?e:{default:e},a=l(t),o=l(i),d=l(s),u=l(n),c=l(r),h=".bs.carousel",f=".data-api",m="next",g="prev",p="left",v="right",b=`slide${h}`,y=`slid${h}`,I=`keydown${h}`,E=`mouseenter${h}`,w=`mouseleave${h}`,x=`dragstart${h}`,A=`load${h}${f}`,L=`click${h}${f}`,T="carousel",C="active",k=".active",O=".carousel-item",$=k+O,S={ArrowLeft:v,ArrowRight:p},D={interval:5e3,keyboard:!0,pause:"hover",ride:!1,touch:!0,wrap:!0},H={interval:"(number|boolean)",keyboard:"boolean",pause:"(string|boolean)",ride:"(boolean|string)",touch:"boolean",wrap:"boolean"};class _ extends c.default{constructor(e,t){super(e,t),this._interval=null,this._activeElement=null,this._isSliding=!1,this.touchTimeout=null,this._swipeHelper=null,this._indicatorsElement=d.default.findOne(".carousel-indicators",this._element),this._addEventListeners(),this._config.ride===T&&this.cycle()}static get Default(){return D}static get DefaultType(){return H}static get NAME(){return"carousel"}next(){this._slide(m)}nextWhenVisible(){!document.hidden&&e.isVisible(this._element)&&this.next()}prev(){this._slide(g)}pause(){this._isSliding&&e.triggerTransitionEnd(this._element),this._clearInterval()}cycle(){this._clearInterval(),this._updateInterval(),this._interval=setInterval(()=>this.nextWhenVisible(),this._config.interval)}_maybeEnableCycle(){if(this._config.ride){if(this._isSliding){a.default.one(this._element,y,()=>this.cycle());return}this.cycle()}}to(e){let t=this._getItems();if(e>t.length-1||e<0)return;if(this._isSliding){a.default.one(this._element,y,()=>this.to(e));return}let i=this._getItemIndex(this._getActive());i!==e&&this._slide(e>i?m:g,t[e])}dispose(){this._swipeHelper&&this._swipeHelper.dispose(),super.dispose()}_configAfterMerge(e){return e.defaultInterval=e.interval,e}_addEventListeners(){this._config.keyboard&&a.default.on(this._element,I,e=>this._keydown(e)),"hover"===this._config.pause&&(a.default.on(this._element,E,()=>this.pause()),a.default.on(this._element,w,()=>this._maybeEnableCycle())),this._config.touch&&u.default.isSupported()&&this._addTouchEventListeners()}_addTouchEventListeners(){for(let e of d.default.find(".carousel-item img",this._element))a.default.on(e,x,e=>e.preventDefault());let t=()=>{"hover"===this._config.pause&&(this.pause(),this.touchTimeout&&clearTimeout(this.touchTimeout),this.touchTimeout=setTimeout(()=>this._maybeEnableCycle(),500+this._config.interval))};this._swipeHelper=new u.default(this._element,{leftCallback:()=>this._slide(this._directionToOrder(p)),rightCallback:()=>this._slide(this._directionToOrder(v)),endCallback:t})}_keydown(e){if(/input|textarea/i.test(e.target.tagName))return;let t=S[e.key];t&&(e.preventDefault(),this._slide(this._directionToOrder(t)))}_getItemIndex(e){return this._getItems().indexOf(e)}_setActiveIndicatorElement(e){if(!this._indicatorsElement)return;let t=d.default.findOne(k,this._indicatorsElement);t.classList.remove(C),t.removeAttribute("aria-current");let i=d.default.findOne(`[data-bs-slide-to="${e}"]`,this._indicatorsElement);i&&(i.classList.add(C),i.setAttribute("aria-current","true"))}_updateInterval(){let e=this._activeElement||this._getActive();if(!e)return;let t=Number.parseInt(e.getAttribute("data-bs-interval"),10);this._config.interval=t||this._config.defaultInterval}_slide(t,i=null){if(this._isSliding)return;let s=this._getActive(),n=t===m,r=i||e.getNextActiveElement(this._getItems(),s,n,this._config.wrap);if(r===s)return;let l=this._getItemIndex(r),o=e=>a.default.trigger(this._element,e,{relatedTarget:r,direction:this._orderToDirection(t),from:this._getItemIndex(s),to:l}),d=o(b);if(d.defaultPrevented||!s||!r)return;let u=Boolean(this._interval);this.pause(),this._isSliding=!0,this._setActiveIndicatorElement(l),this._activeElement=r;let c=n?"carousel-item-start":"carousel-item-end",h=n?"carousel-item-next":"carousel-item-prev";r.classList.add(h),e.reflow(r),s.classList.add(c),r.classList.add(c);let f=()=>{r.classList.remove(c,h),r.classList.add(C),s.classList.remove(C,h,c),this._isSliding=!1,o(y)};this._queueCallback(f,s,this._isAnimated()),u&&this.cycle()}_isAnimated(){return this._element.classList.contains("slide")}_getActive(){return d.default.findOne($,this._element)}_getItems(){return d.default.find(O,this._element)}_clearInterval(){this._interval&&(clearInterval(this._interval),this._interval=null)}_directionToOrder(t){return e.isRTL()?t===p?g:m:t===p?m:g}_orderToDirection(t){return e.isRTL()?t===g?p:v:t===g?v:p}static jQueryInterface(e){return this.each(function(){let t=_.getOrCreateInstance(this,e);if("number"==typeof e){t.to(e);return}if("string"==typeof e){if(void 0===t[e]||e.startsWith("_")||"constructor"===e)throw TypeError(`No method named "${e}"`);t[e]()}})}}return a.default.on(document,L,"[data-bs-slide], [data-bs-slide-to]",function(t){let i=e.getElementFromSelector(this);if(!i||!i.classList.contains(T))return;t.preventDefault();let s=_.getOrCreateInstance(i),n=this.getAttribute("data-bs-slide-to");if(n){s.to(n),s._maybeEnableCycle();return}if("next"===o.default.getDataAttribute(this,"slide")){s.next(),s._maybeEnableCycle();return}s.prev(),s._maybeEnableCycle()}),a.default.on(window,A,()=>{let e=d.default.find('[data-bs-ride="carousel"]');for(let t of e)_.getOrCreateInstance(t)}),e.defineJQueryPlugin(_),_});
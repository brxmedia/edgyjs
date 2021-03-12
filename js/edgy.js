'use strict';
/*!*
 * EDGYJS - Plugin
 * @version 0.1.2
 * @author Patrick Born
 !*/


/**
 * Default argutments for edgy
 */
var defaults = {
    position: 'left',
    handle: '.75rem',
    parent: null,
    toggle: '.edgy-toggle',
    close: '.edgy-close',
    open: '.edgy-open',
    fastExecution: 250,
    fastDistance: 50
};

/**
 * **EDGY JS**
 * 
 * The ultimate edgenavigation Plugin. Built a sidebarnavigation or a header swipedown navigation as flexible as you want!
 */
class edgy{
    /**
     * 
     * @param element Picks the first Element of a classname or picks a elementByID!
     * @param args The edgyjs argument list. You will the list of default and your configuration abillities in the documentation.
     */
    constructor(element, args = {}){
        this.element = document.querySelector(element);
        if(this.element == null || typeof(this.element) == 'undefined') throw Error("Element not found!\n\nThe element '" + element + "' you provided to edgy was not found in the DOM!");
        
        // compare defaults with transmitted arguments
        this.args = Object.assign({}, defaults, args);
        this.validateArgs();

        this.prepairDOM();
        this.addEvents();

        // launch _edgewiz
        this._edgewiz = new egdewiz(this.element, this.args);
    }

    open(){
        this._edgewiz.wizopen(true);
    }
    close(){
        this._edgewiz.wizclose(true);
    }
    toggle(){
        this._edgewiz.wiztoggle();
    }

    /**
     * Validating all Arguments a user can potentialy transmit wrong
     */
    validateArgs(){
        let wholeHandle = this.args.handle;
        this.args.handle = parseFloat(this.args.handle, 10);

        let handleUnit = wholeHandle.substring(String(this.args.handle).length, wholeHandle.length);
        this.args.handleUnit = 'px';
        if(handleUnit.length >= 1 && (handleUnit == '%' || handleUnit == 'px' || handleUnit == 'em' || handleUnit == 'rem')) this.args.handleUnit = handleUnit;

        if(isNaN(this.args.handle)) throw TypeError("Wrong data type!\n\nThe argument - handle has to be of type 'number', not of type '"+ typeof(this.args.handle) +"'!");

    }
    /**
     * Prepair DOM for edgy,
     * if edgy content is not wrapped with `<nav>` it will generate `<nav>` and settings default _styles_ and _classes_ based on parsed arguments.
     */
    prepairDOM(){
        console.log(typeof this.element.children[0])
        if(typeof this.element.children[0] == 'undefined' || this.element.children[0].tagName != 'nav'){
            let cache = this.element.innerHTML;
            let wrapped = '<nav>'+ cache +'</nav>';
            this.element.innerHTML = wrapped;
        }

        // add shadow
        if(this.args.parent == null) this.args.parent = this.element.parentElement;
        var shadowFound = false;
        for (let i = 0; i < this.args.parent.children.length; i++) {
            if(this.args.parent.children[i].classList.contains('edgy-shadow')){
                shadowFound = true;
                this.args.shadow = this.args.parent.children[i];
            }
        }
        if(!shadowFound){
            this.args.shadow = document.createElement("div");
            this.args.shadow.classList.add('edgy-shadow');
            this.args.parent.appendChild(this.args.shadow);
        }
        this.args.shadow.style.display = 'none';
        this.args.shadow.style.opacity = 0;


        // add class bases on position
        if(!this.element.classList.contains('edgy')) this.element.classList.add('edgy');
        this.element.classList.add('edgy-'+ this.args.position);

        if(this.args.position == 'left' || this.args.position == 'right'){
            this.element.style.width = this.args.handle + this.args.handleUnit;
        }
        else{
            this.element.style.height = this.args.handle + this.args.handleUnit;
        }
    }
    /**
     * Add EventListeners for _edgewiz and even more custom events.
     */
    addEvents(){
        // add toggle function on trigger button click
        if(document.querySelector(this.args.toggle) != null)
            document.querySelector(this.args.toggle).addEventListener('click', () => {
                this._edgewiz.wiztoggle();
            });
        // add close function on trigger button click
        if(document.querySelector(this.args.close) != null)
        document.querySelector(this.args.close).addEventListener('click', () => {
            this._edgewiz.wizclose(true);
        });
        // add open function on trigger button click
        if(document.querySelector(this.args.open) != null)
        document.querySelector(this.args.open).addEventListener('click', () => {
            this._edgewiz.wizopen(true);
        });

        // get all Events for this DOM Element
        this.element.addEventListener('edgewiz.start', function(){
            
        });
        this.element.addEventListener('edgewiz.move', function(){
            
        });
        this.element.addEventListener('edgewiz.stop', function(){
            
        });
        this.element.addEventListener('edgewiz.open', function(){
            console.log('EDGEWIZ Open is fired');
        });
        this.element.addEventListener('edgewiz.opened', function(){
            console.log('EDGEWIZ Opened is fired');
        });
        this.element.addEventListener('edgewiz.close', function(){
            console.log('EDGEWIZ Close is fired');
        });
        this.element.addEventListener('edgewiz.closed', function(){
            console.log('EDGEWIZ Closed is fired');
        });
    }
}

/**
 * edgywiz **class**.
 * Calculates with the current cursor or touch position to place or manipulate elements in the DOM.
 */
class egdewiz{
    /**
     * 
     * @param {*} element The DOM element that _edgewiz will bind to
     * @param {*} debug Boolean if theres a debug view or not.
     * @param {*} debugElement The elementID the debug will be placed in.
     */
    constructor(element, args, debug = false, debugElement = '_edgewizDebug'){
        this.mousesupport = true;

        this.element = element;
        this.args = args;
        this.debug = debug;
        this.debugElement = document.getElementById(debugElement);

        this.status = 'close';
        this.swipe = false;
        this.start = {x:0,y:0};
        this.dist = {x:0,y:0};
        this.stop = {x:0,y:0};

        this.nav = this.element.children[0];
        if(this.args.position == 'left' || this.args.position == 'right'){
            this.navSize = this.nav.offsetWidth;
        }
        else{
            this.navSize = this.nav.offsetHeight;
        }
        

        this.element.addEventListener("touchstart", eve => this.touchstart(eve));
        this.element.addEventListener("touchmove", eve => this.touchmove(eve));
        this.element.addEventListener("touchend", eve => this.touchend(eve));

        this.args.shadow.addEventListener("click", e => this.wizclose());

        if(this.mousesupport){
            this.element.addEventListener('mousedown',eve => this.touchstart(eve,false));
            this.element.addEventListener('mousemove',eve => this.touchmove(eve,false));
            this.element.addEventListener('mouseup',eve => this.touchend(eve,false));
        }
    }

    wizstart(){
        this.element.classList.add('edgy-swipe');
        this.args.parent.classList.add('edgy-swipe');

        this.startSwipe = new Date().getTime();

        // SHADOW
        if(!this.open){
            this.args.shadow.style.opacity = 0;
        }
        else{
            this.args.shadow.style.opacity = 1;
        }
        this.args.shadow.style.display = 'block';
    }
    wizmove(){
        switch (this.args.position) {
            case 'left':
                if(!this.open){
                    var move = 0;
                    if(this.dist.x >= this.navSize)     move = this.navSize;
                    else if(this.dist.x <= 0)           move = 0;
                    else                                move = this.dist.x;
                }
                else{
                    var move = this.navSize;
                    if(this.dist.x >= 0)                            move = this.navSize;
                    else if(this.dist.x <= (this.navSize * -1))     move = 0;
                    else                                            move = this.navSize + this.dist.x;
                }
                this.element.style.transform = 'translateX('+ (move) +'px)';
                break;
            case 'right':
                if(!this.open){
                    var move = 0;
                    if(this.dist.x <= (this.navSize * -1))  move = (this.navSize * -1);
                    else if(this.dist.x >= 0)               move = 0;
                    else                                    move = this.dist.x;
                }
                else{
                    var move = (this.navSize * -1);
                    if(this.dist.x <= 0)                    move = (this.navSize * -1);
                    else if(this.dist.x >= this.navSize)    move = 0;
                    else                                    move = (this.navSize * -1) + this.dist.x;
                }
                this.element.style.transform = 'translateX('+ (move) +'px)';
                break;
            case 'top':
                if(!this.open){
                    var move = 0;
                    if(this.dist.y >= this.navSize)     move = this.navSize;
                    else if(this.dist.y <= 0)           move = 0;
                    else                                move = this.dist.y;
                }
                else{
                    var move = this.navSize;
                    if(this.dist.y >= 0)                            move = this.navSize;
                    else if(this.dist.y <= (this.navSize * -1))     move = 0;
                    else                                            move = this.navSize + this.dist.y;
                }
                this.element.style.transform = 'translateY('+ (move) +'px)';
                break;
            case 'bottom':
                if(!this.open){
                    var move = 0;
                    if(this.dist.y <= (this.navSize * -1))  move = (this.navSize * -1);
                    else if(this.dist.y >= 0)               move = 0;
                    else                                    move = this.dist.y;
                }
                else{
                    var move = (this.navSize * -1);
                    if(this.dist.y <= 0)                    move = (this.navSize * -1);
                    else if(this.dist.y >= this.navSize)    move = 0;
                    else                                    move = (this.navSize * -1) + this.dist.y;
                }
                this.element.style.transform = 'translateY('+ (move) +'px)';
                break;
        
            default:
                if(!this.open){
                    var move = 0;
                    if(this.dist.x >= this.navSize)     move = this.navSize;
                    else if(this.dist.x <= 0)           move = 0;
                    else                                move = this.dist.x;
                }
                else{
                    var move = this.navSize;
                    if(this.dist.x >= 0)                            move = this.navSize;
                    else if(this.dist.x <= (this.navSize * -1))     move = 0;
                    else                                            move = this.navSize + this.dist.x;
                }
                this.element.style.transform = 'translateX('+ (move) +'px)';
                break;
        }

        // SHADOW
        if(this.args.position == 'left' || this.args.position == 'right'){
            if(!this.open){
                this.distPercent = Math.abs(this.dist.x) / this.navSize;
            }
            else{
                if(this.dist.x < 0 && this.args.position == 'left' || this.dist.x > 0 && this.args.position == 'right'){
                    this.distPercent = 1 - Math.abs(this.dist.x) / this.navSize;
                }
                else{
                    this.distPercent = 1;
                }
            }
        }
        else{
            if(!this.open){
                this.distPercent = Math.abs(this.dist.y) / this.navSize;
            }
            else{
                if(this.dist.y < 0 && this.args.position == 'top' || this.dist.y > 0 && this.args.position == 'bottom'){
                    this.distPercent = 1 - Math.abs(this.dist.y) / this.navSize;
                }
                else{
                    this.distPercent = 1;
                }
            }
        }
        if(this.distPercent.toFixed(2) >= 1) this.distPercent = 1;
        else if(this.distPercent.toFixed(2) <= 0) this.distPercent = 0;
        this.args.shadow.style.opacity = this.distPercent.toFixed(2);
    }
    wizend(){
        this.element.classList.remove('edgy-swipe');
        this.args.parent.classList.remove('edgy-swipe');

        this.endSwipe = new Date().getTime();
        let fastExecution = false;
        if((this.endSwipe - this.startSwipe) <= this.args.fastExecution) fastExecution = true;

        switch (this.args.position) {
            case 'left':
                if(!this.open){
                    if(this.dist.x >= this.navSize / 2 || fastExecution && this.dist.x > this.args.fastDistance)            this.wizopen();
                    else                                                                                                    this.wizclose();
                }
                else{
                    if(this.dist.x <= (this.navSize * -1) / 2 || fastExecution && this.dist.x < -this.args.fastDistance)    this.wizclose();
                    else                                                                                                    this.wizopen();
                }
                break;
            case 'right':
                if(!this.open){
                    if(this.dist.x <= (this.navSize * -1) / 2 || fastExecution && this.dist.x < -this.args.fastDistance)    this.wizopen();
                    else                                                                                                    this.wizclose();
                }
                else{
                    if(this.dist.x >= this.navSize / 2 || fastExecution && this.dist.x > this.args.fastDistance)            this.wizclose();
                    else                                                                                                    this.wizopen();
                }
                break;
            case 'top':
                if(!this.open){
                    if(this.dist.y >= this.navSize / 2 || fastExecution && this.dist.y > this.args.fastDistance)            this.wizopen();
                    else                                                                                                    this.wizclose();
                }
                else{
                    if(this.dist.y <= (this.navSize * -1) / 2 || fastExecution && this.dist.y < -this.args.fastDistance)    this.wizclose();
                    else                                                                                                    this.wizopen();
                }
                break;
                break;
            case 'bottom':
                if(!this.open){
                    if(this.dist.y <= (this.navSize * -1) / 2 || fastExecution && this.dist.y < -this.args.fastDistance)    this.wizopen();
                    else                                                                                                    this.wizclose();
                }
                else{
                    if(this.dist.y >= this.navSize / 2 || fastExecution && this.dist.y > this.args.fastDistance)            this.wizclose();
                    else                                                                                                    this.wizopen();
                }
                break;
        
            default:
                if(!this.open){
                    if(this.dist.x >= this.navSize / 2 || fastExecution && this.dist.x > this.args.fastDistance)            this.wizopen();
                    else                                                                                                    this.wizclose();
                }
                else{
                    if(this.dist.x <= (this.navSize * -1) / 2 || fastExecution && this.dist.x < -this.args.fastDistance)    this.wizclose();
                    else                                                                                                    this.wizopen();
                }
                break;
        }
    }

    wizopen(direct = false){
        // dispatch Event wizopen
        if(!this.open) this.element.dispatchEvent(new Event('edgewiz.open'));

        switch (this.args.position) {
            case 'left':
                this.element.style.transform = 'translateX('+ this.navSize +'px)';
                break;
            case 'right':
                this.element.style.transform = 'translateX(-'+ this.navSize +'px)';
                break;
            case 'top':
                this.element.style.transform = 'translateY('+ this.navSize +'px)';
                break;
            case 'bottom':
                this.element.style.transform = 'translateY(-'+ this.navSize +'px)';
                break;
        
            default:
                this.element.style.transform = 'translateX('+ this.navSize +'px)';
                break;
        }

        // SHADOW
        var i = 0;
        // delayed open state
        var delayOpen = this.open;
        var val = setInterval(async () => {
            i++;
            this.args.shadow.style.opacity = parseFloat(this.args.shadow.style.opacity) + 0.02;
            if(this.args.shadow.style.opacity >= 1) this.args.shadow.style.opacity = 1;
            if(this.args.shadow.style.opacity >= 1 || i > 200){
                // dispatch Event wizopened
                if(!delayOpen) this.element.dispatchEvent(new Event('edgewiz.opened'));
                clearInterval(val);
            }
        }, 5);
        if(direct){
            if(this.args.shadow.style.display != 'block') this.args.shadow.style.display = 'block';
        }
        
        this.open = true;
        this.element.classList.add('edgy-open');
        if(this.args.parent.tagName != 'body'){
            document.body.classList.add('edgy-open');
        }
        this.args.parent.classList.add('edgy-open');
        this.element.classList.remove('edgy-close');
    }

    wizclose(direct = false){
        // dispatch Event wizclose
        if(this.open) this.element.dispatchEvent(new Event('edgewiz.close'));

        switch (this.args.position) {
            case 'left':
                this.element.style.transform = 'translateX(0px)';
                break;
            case 'right':
                this.element.style.transform = 'translateX(0px)';
                break;
            case 'top':
                this.element.style.transform = 'translateY(0px)';
                break;
            case 'bottom':
                this.element.style.transform = 'translateY(0px)';
                break;
        
            default:
                this.element.style.transform = 'translateX(0px)';
                break;
        }

        // SHADOW
        var i = 0;
        // delayed open state
        var delayOpen = this.open;
        var val = setInterval(async () => {
            i++;
            this.args.shadow.style.opacity = parseFloat(this.args.shadow.style.opacity) - 0.02;
            if(this.args.shadow.style.opacity <= 0) this.args.shadow.style.opacity = 0;
            if(this.args.shadow.style.opacity <= 0 || i > 200){
                this.args.shadow.style.display = 'none';
                // dispatch Event wizclosed
                if(delayOpen) this.element.dispatchEvent(new Event('edgewiz.closed'));
                clearInterval(val);
            }
        }, 5);
        
        this.open = false;
        this.element.classList.add('edgy-close');
        if(this.args.parent.tagName != 'body'){
            document.body.classList.remove('edgy-open');
        }
        this.args.parent.classList.remove('edgy-open');
        this.element.classList.remove('edgy-open');
    }

    wiztoggle(){
        if(this.open)   this.wizclose(true);
        else            this.wizopen(true);
    }

    /**
      * Touch Functions
    */
    touchstart(eve, touch = true){
        // dispatch Event wizstart
        this.element.dispatchEvent(new Event('edgewiz.start'));
        // Event prevent Default
        eve.preventDefault();

        let evt = eve;
        if(touch) evt = eve.changedTouches[0]; // reference first touch point for this event

        this.swipe = true;
        this.start = {
            x: parseInt(evt.clientX),
            y: parseInt(evt.clientY)
        };

        this.wizstart();

        // DEBUG
        if(this.debug)  this.debugElement.innerHTML = "touchstart bei ClientX: " + this.start.x + "px ClientY: " + this.start.y + "px";
    }
    touchmove(eve, touch = true){
        if(this.swipe){
            // dispatch Event wizmove
            this.element.dispatchEvent(new Event('edgewiz.move'));
            // Event prevent Default
            eve.preventDefault();

            let evt = eve;
            if(touch) evt = eve.changedTouches[0]; // reference first touch point for this event

            this.dist = {
                x: parseInt(evt.clientX) - this.start.x,
                y: parseInt(evt.clientY) - this.start.y
            };

            this.wizmove();

            // DEBUG
            if(this.debug)  this.debugElement.innerHTML = "touchend bei X-Koordinate: " + this.stop.x + "px Y-Koordinate: " + this.stop.y + "px";
        }
    }
    touchend(eve, touch = true){
        // dispatch Event wizstop
        this.element.dispatchEvent(new Event('edgewiz.stop'));
        // Event prevent Default
        eve.preventDefault();

        let evt = eve;
        if(touch) evt = eve.changedTouches[0]; // reference first touch point for this event

        this.swipe = false;
        this.stop = {
            x: parseInt(evt.clientX),
            y: parseInt(evt.clientY)
        };

        this.wizend();

        // DEBUG
        if(this.debug)  this.debugElement.innerHTML = "touchend bei X-Koordinate: " + this.stop.x + "px Y-Koordinate: " + this.stop.y + "px";
    }
}

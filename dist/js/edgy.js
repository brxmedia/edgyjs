'use strict';

var defaults = {
    position: 'left',
    trigger: '.edgy-btn',
    handle: 15,
    parent: ''
};

class edgy{
    constructor(element, args = {}){
        this.element = document.querySelector(element);
        if(this.element == null || typeof(this.element) == 'undefined') throw Error("Element not found!\n\nThe element '" + element + "' you provided to edgy was not found in the DOM!");
        
        // compare defaults with transmitted arguments
        this.args = Object.assign({}, defaults, args);
        this.validateArgs();

        this.init();
    }

    init(){
        this.addEvents();
        this.prepairDOM();


        var obj_edgewiz = new egdewiz(this.element,true);
    }
    /**
     * Validating all Arguments a user can potentialy transmit wrong
     */
    validateArgs(){
        let wholeHandle = this.args.handle;
        this.args.handle = parseFloat(this.args.handle, 10);

        let handleUnit = wholeHandle.substring(String(this.args.handle).length, wholeHandle.length);
        this.handleUnit = 'px';
        if(handleUnit.length >= 1 && (handleUnit == '%' || handleUnit == 'px' || handleUnit == 'em' || handleUnit == 'rem')) this.handleUnit = handleUnit;

        if(isNaN(this.args.handle)) throw TypeError("Wrong data type!\n\nThe argument - handle has to be of type 'number', not of type '"+ typeof(this.args.handle) +"'!");

    }
    /**
     * Prepair DOM for edgy,
     * if edgy content is not wrapped with `<nav>` it will generate `<nav>` and settings default _styles_ and _classes_ based on parsed arguments.
     */
    prepairDOM(){
        if(this.element.children[0].tagName != 'nav'){
            let cache = this.element.innerHTML;
            let wrapped = '<nav>'+ cache +'</nav>';
            this.element.innerHTML = wrapped;
        }
        // add class bases on position
        if(!this.element.classList.contains('edgy')) this.element.classList.add('edgy');
        this.element.classList.add('edgy-'+ this.args.position);

        this.element.style.width = this.args.handle + this.handleUnit;
    }
    /**
     * Add EventListeners for edgewiz and even more custom events.
     */
    addEvents(){
        // get all DOM Elements for element
        this.element.addEventListener('edgewiz.start', function(){
            console.log('EDGEWIZ Start is fired');
        });
        this.element.addEventListener('edgewiz.move', function(){
            console.log('EDGEWIZ Move is fired');
        });
        this.element.addEventListener('edgewiz.stop', function(){
            console.log('EDGEWIZ Stop is fired');
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
     * @param {*} element The DOM element that edgewiz will bind to
     * @param {*} debug Boolean if theres a debug view or not.
     * @param {*} debugElement The elementID the debug will be placed in.
     */
    constructor(element, debug = false, debugElement = 'edgewizDebug'){
        this.mousesupport = true;

        this.element = element;
        this.debug = debug;
        this.debugElement = document.getElementById(debugElement);

        this.status = 'close';
        this.swipe = false;
        this.start = {x:0,y:0};
        this.dist = {x:0,y:0};
        this.stop = {x:0,y:0};

        this.nav = this.element.children[0];
        this.navWidth = this.nav.offsetWidth;

        console.log(this.nav);

        this.element.addEventListener("touchstart", eve => this.touchstart(eve));
        this.element.addEventListener("touchmove", eve => this.touchmove(eve));
        this.element.addEventListener("touchend", eve => this.touchend(eve));

        if(this.mousesupport){
            this.element.addEventListener('mousedown',eve => this.touchstart(eve,false));
            this.element.addEventListener('mousemove',eve => this.touchmove(eve,false));
            this.element.addEventListener('mouseup',eve => this.touchend(eve,false));
        }
    }

    wizstart(){
        this.element.classList.add('edgy-swipe');
    }
    wizmove(){
        if(this.status == 'close'){
            let move = 0;
            if(this.dist.x >= this.navWidth)    move = this.navWidth;
            else                                move = this.dist.x;
    
            this.nav.style.transform = 'translateX('+ move +'px)';
        }
        else{
            let move = 0;
            if(this.dist.x <= this.navWidth)    move = this.navWidth;
            else                                move = this.dist.x;
    
            this.nav.style.transform = 'translateX('+ (this.navWidth - move) +'px)';
        }
    }
    wizend(){
        if(this.dist.x >= this.navWidth / 2)    this.wizopen();
        else                                    this.wizclose();

        this.element.classList.remove('edgy-swipe');
    }

    wizopen(){
        this.status = 'open';
        this.nav.style.transform = 'translateX('+ this.navWidth +'px)';
        this.element.classList.add('edgy-open');
        this.element.classList.remove('edgy-close');
    }

    wizclose(){
        this.status = 'close';
        this.nav.style.transform = 'translateX(0px)';
        this.element.classList.add('edgy-close');
        this.element.classList.remove('edgy-open');
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

var obj_edgy = new edgy('#sidebar',{
    handle: '.75rem'
});

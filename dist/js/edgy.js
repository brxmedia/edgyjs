'use strict';

var defaults = {
    position: 'right',
    trigger: '.edgy-btn',
    handle: 15,
    parent: ''
};

class edgy{
    constructor(element, args = {}){
        this.element = document.querySelector(element);
        if(this.element == null || typeof(this.element) == 'undefined') throw Error("Element not found!\n\nThe element '" + element + "' you provided to edgy was not found in the DOM!");
        
        this.args = Object.assign({}, defaults, args);


        this.init();
    }

    init(){
        this.addEvents();
        this.prepairDOM();


        var obj_edgewiz = new egdewiz(this.element,true);
    }
    /**
     * Prepair DOM for edgy,
     * if edgy content is not wrapped with `<nav>` it will generate `<nav>`.
     */
    prepairDOM(){
        if(this.element.children[0].tagName != 'nav'){
            let cache = this.element.innerHTML;
            let wrapped = '<nav>'+ cache +'</nav>';
            this.element.innerHTML = wrapped;
        }
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

        this.swipe = false;
        this.start = {x:0,y:0};
        this.dist = {x:0,y:0};
        this.stop = {x:0,y:0};

        this.element.addEventListener("touchstart", eve => this.touchstart(eve));
        this.element.addEventListener("touchmove", eve => this.touchmove(eve));
        this.element.addEventListener("touchend", eve => this.touchend(eve));

        if(this.mousesupport){
            this.element.addEventListener('mousedown',eve => this.touchstart(eve,false));
            this.element.addEventListener('mousemove',eve => this.touchmove(eve,false));
            this.element.addEventListener('mouseup',eve => this.touchend(eve,false));
        }

        this.startEvent = new Event('edgewiz.start');
        this.moveEvent = new Event('edgewiz.move');
        this.stopEvent = new Event('edgewiz.stop');
    }

    /**
      * Touch Functions
    */
    touchstart(eve, touch = true){
        // dispatch Event wizstart
        this.element.dispatchEvent(this.startEvent);
        // Event prevent Default
        eve.preventDefault();

        let evt = eve;
        if(touch) evt = eve.changedTouches[0]; // reference first touch point for this event

        this.swipe = true;
        this.start = {
            x: parseInt(evt.clientX),
            y: parseInt(evt.clientY)
        };

        // DEBUG
        if(this.debug)  this.debugElement.innerHTML = "touchstart bei ClientX: " + this.start.x + "px ClientY: " + this.start.y + "px";
    }
    touchmove(eve, touch = true){
        if(this.swipe){
            // dispatch Event wizmove
            this.element.dispatchEvent(this.moveEvent);
            // Event prevent Default
            eve.preventDefault();

            let evt = eve;
            if(touch) evt = eve.changedTouches[0]; // reference first touch point for this event

            this.dist = {
                x: parseInt(evt.clientX) - this.start.x,
                y: parseInt(evt.clientY) - this.start.y
            };

            this.element.style.transform = 'translateX('+ this.dist.x +'px)';

            // DEBUG
            if(this.debug)  this.debugElement.innerHTML = "touchend bei X-Koordinate: " + this.stop.x + "px Y-Koordinate: " + this.stop.y + "px";
        }
    }
     
    touchend(eve, touch = true){
        // dispatch Event wizstop
        this.element.dispatchEvent(this.stopEvent);
        // Event prevent Default
        eve.preventDefault();

        let evt = eve;
        if(touch) evt = eve.changedTouches[0]; // reference first touch point for this event

        this.swipe = false;
        this.stop = {
            x: parseInt(evt.clientX),
            y: parseInt(evt.clientY)
        };
        this.element.style.position = 'relative';
        let left = this.element.style.left ? this.element.style.left : 0;
        this.element.style.left = ''+ (parseInt(left, 10) + this.dist.x) +'px';
        console.log(left);
        this.element.style.transform = 'translateX(0px)';

        // DEBUG
        if(this.debug)  this.debugElement.innerHTML = "touchend bei X-Koordinate: " + this.stop.x + "px Y-Koordinate: " + this.stop.y + "px";
    }
}

var obj_edgy = new edgy('.edgy',{
    handle: 'drölf'
});

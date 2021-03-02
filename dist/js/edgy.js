'use strict';

var defaults = {
    direction: 'right',
    handle: '15px'
};

class edgy{
    constructor(element, args = {}){
        this.element = document.querySelector(element);
        this.args = Object.assign({}, defaults, args);

        this.init();
    }

    init(){
        // get all DOM Elements for element
        this.element.addEventListener('edgewiz.start', function(){
            console.log('EDGEWIZ Start is fired');
            console.log(this);
        });
        this.element.addEventListener('edgewiz.move', function(){
            console.log('EDGEWIZ Move is fired');
        });
        this.element.addEventListener('edgewiz.stop', function(){
            console.log('EDGEWIZ Stop is fired');
        });

        var obj_edgewiz = new egdewiz(this.element,true);


    }
}


class egdewiz{
    constructor(element, debug = false, debugElement = 'edgewizDebug'){
        this.element = element;
        this.debug = debug;
        this.debugElement = document.getElementById(debugElement);

        this.start = {x:0,y:0};
        this.dist = {x:0,y:0};

        this.element.addEventListener("touchstart", eve => this.touchstart(eve));
        this.element.addEventListener("touchmove", eve => this.touchmove(eve));
        this.element.addEventListener("touchend", eve => this.touchend(eve));

        this.startEvent = new Event('edgewiz.start');
        this.moveEvent = new Event('edgewiz.move');
        this.stopEvent = new Event('edgewiz.stop');
    }

    touchstart(eve){
        let touchobj = eve.changedTouches[0]; // reference first touch point for this event
        this.start = {
            x: parseInt(touchobj.clientX),
            y: parseInt(touchobj.clientY)
        };

        this.element.dispatchEvent(this.startEvent);
        eve.preventDefault();

        if(this.debug)  this.debugElement.innerHTML = "touchstart bei ClientX: " + this.start.x + "px ClientY: " + this.start.y + "px";
    }
    touchmove(eve){
        let touchobj = eve.changedTouches[0]; // reference first touch point for this event
        this.dist = {
            x: parseInt(touchobj.clientX) - this.start.x,
            y: parseInt(touchobj.clientY) - this.start.y
        };

        this.element.dispatchEvent(this.moveEvent);
        eve.preventDefault();

        if(this.debug)  this.debugElement.innerHTML = "touchmove horizontal: " + this.dist.x + "px vertikal: " + this.dist.y + "px";
     }
     
     touchend(eve){
        let touchobj = eve.changedTouches[0]; // reference first touch point for this event

        this.element.dispatchEvent(this.stopEvent);
        eve.preventDefault();

        if(this.debug)  this.debugElement.innerHTML = "touchend bei X-Koordinate: " + touchobj.clientX + "px Y-Koordinate: " + touchobj.clientY + "px";
     }
}

var obj_edgy = new edgy('.edgy',{
    handle: 'drölf'
});




















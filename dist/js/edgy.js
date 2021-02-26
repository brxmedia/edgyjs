'use strict';

var defaults = {
    direction: 'right',
    handle: '15px'
};

class edgy{
    constructor(element, args = {}){
        this.element = element;
        this.args = Object.assign({}, defaults, args);

        this.init();
    }

    init(){
        // get all DOM Elements for element
        var elements = document.querySelectorAll(this.element);


        console.log(new egdewiz());
    }
}


class egdewiz{
    constructor(debug = false, debugelement = '#edgewizDebug'){
        
        window.onload = this.init();
        this.dragging = false;
        this.status = 'init';
        this.current = {
            X: 0,
            Y: 0
        };
        this.startDrag = {
            X: 0,
            Y: 0
        }
        this.drag = {
            X: 0,
            Y: 0
        };

        // handlers bound to the element only once
        this.onMouseDown = addEvent (document, 'mousedown', this.onMouseDown());
        this.onMouseMove = addEvent (document, 'mousemove', this.onMouseMove());
        this.onMouseUp = addEvent (document, 'mouseup', this.onMouseUp());
    }

    init() {
        document.onmousemove = this.getCursorPosition();
    }

    getCursorPosition(e) {
        this.current = {
            X: ((window.Event) ? e.pageX : event.clientX + (document.documentElement.scrollLeft ? document.documentElement.scrollLeft : document.body.scrollLeft)),
            Y: ((window.Event) ? e.pageY : event.clientY + (document.documentElement.scrollTop ? document.documentElement.scrollTop : document.body.scrollTop))
        };
    }

    addEvent(element, type, fn) {
        // custom add event function that cares about compatibility
        return element.addEventListener(type, fn);
    }

    onMouseDown() {
        this.dragging = true;
        this.status = 'start dragging';
        this.startDrag = {
            X: this.current.X,
            Y: this.current.Y
        };
    }

    onMouseMove() {
        if (!this.dragging) return; // skip dragging action if mouse button not depressed
        // do your dragging stuff
        this.status = 'dragging';
        this.drag = {
            X: this.current.X - this.startDrag.X,
            Y: this.current.Y - this.startDrag.Y
        }
    }

    onMouseUp() {
        this.dragging = false;
        this.status = 'stop dragging';
        this.startDrag = {
            X: 0,
            Y: 0
        };
    }
}

console.log(new edgy('.edgy',{
    handle: 'drölf'
}));




















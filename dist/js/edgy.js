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

        var obj_edgewiz = new egdewiz(true);
    }
}


class egdewiz{
    current = {};
    status;
    dragging = false;
    _debug = false;

    get debug(){return this._debug;}
    set debug(value){this._debug = value;}

    constructor(debug = false, debugelement = '#edgewizDebug'){
        
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

        // debug
        this.debug = debug;
        window.onload = this.init();

        var element = document.querySelector('#object');
        // handlers bound to the element only once
        this.onMouseDown = this.addEvent (element, 'mousedown', this.onMouseDown());
        this.onMouseMove = this.addEvent (element, 'mousemove', this.onMouseMove());
        this.onMouseUp = this.addEvent (element, 'mouseup', this.onMouseUp());
    }

    init(e) {
        document.onmousemove = this.getCursorPosition(e);
    }

    getCursorPosition(e) {
        this.current = {
            X: ((window.Event) ? e.pageX : event.clientX + (document.documentElement.scrollLeft ? document.documentElement.scrollLeft : document.body.scrollLeft)),
            Y: ((window.Event) ? e.pageY : event.clientY + (document.documentElement.scrollTop ? document.documentElement.scrollTop : document.body.scrollTop))
        };
        if(this.debug){
            document.getElementById('posX').innerHTML = "current X: " + this.current.X;
            document.getElementById('posY').innerHTML = "current Y: " + this.current.Y;
        }
        console.log(this);
    }
    test(){
        console.log(this);
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
        if(this.debug){
            document.getElementById('posX').innerHTML = "current X: " + this.current.X;
            document.getElementById('posY').innerHTML = "current Y: " + this.current.Y;
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

var obj_edgy = new edgy('.edgy',{
    handle: 'drölf'
});




















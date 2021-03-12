window.onload = init;
var dragging = false;
var currentX = 0;
var currentY = 0;

var startDragX = 0;
var startDragY = 0;

function init() {
    // if (window.Event) {
    //     document.captureEvents(Event.MOUSEMOVE);
    // }
    document.onmousemove = getCursorPosition;
}

function getCursorPosition(e) {
    currentX = ((window.Event) ? e.pageX : event.clientX + (document.documentElement.scrollLeft ? document.documentElement.scrollLeft : document.body.scrollLeft));
    currentY = ((window.Event) ? e.pageY : event.clientY + (document.documentElement.scrollTop ? document.documentElement.scrollTop : document.body.scrollTop));

    document.getElementById('posX').innerHTML = "current X: " + currentX;
    document.getElementById('posY').innerHTML = "current Y: " + currentY;
}

function addEvent(element, type, fn) {
    // custom add event function that cares about compatibility
    return element.addEventListener(type, fn);
}

function onMouseDown() {
    dragging = true;
    document.getElementById('status').innerHTML = 'status: start dragging';
    startDragX = currentX;
    startDragY = currentY;
    document.getElementById('startDragX').innerHTML = 'startDrag X: ' + startDragX;
    document.getElementById('startDragY').innerHTML = 'startDrag Y: ' + startDragY;
}

function onMouseMove() {
    if (!dragging) return; // skip dragging action if mouse button not depressed
    // do your dragging stuff
    document.getElementById('status').innerHTML = 'status: dragging';

    var dragX = currentX - startDragX;
    var dragY = currentY - startDragY;
    document.getElementById('draggedX').innerHTML = 'dragged X: ' + dragX;
    document.getElementById('draggedY').innerHTML = 'dragged Y: ' + dragY;
}

function onMouseUp() {
    dragging = false;
    document.getElementById('status').innerHTML = 'status: stop dragging';
    startDragX = 0;
    startDragY = 0;
    // do your end of dragging stuff
}

// handlers bound to the element only once
var onMouseDown = addEvent (document, 'mousedown', onMouseDown);
var onMouseMove = addEvent (document, 'mousemove', onMouseMove);
var onMouseUp = addEvent (document, 'mouseup'  , onMouseUp);
// DOM: DOM functions
// -----------------------------------------------
// Version 2.3
//
// Requires: none

var ua = navigator.userAgent.toLowerCase(); 
var DOM_IsGecko = ua.indexOf('gecko') != -1;
var DOM_IsOpera = ua.indexOf('opera') != -1;
var DOM_IsIE = ua.indexOf('msie') != -1 && !DOM_IsOpera;
var DOM_IsIE6up = DOM_IsIE && parseInt(navigator.appVersion) >= 6;
// var DOM_IsKonqueror   = (ua.indexOf('konqueror') != -1); 
// var DOM_IsSafari      = (ua.indexOf('safari') != - 1);

function DOM_ReplaceText(element, text)
{
    DOM_RemoveAllChilds(element);
    element.appendChild(document.createTextNode(text));
}

function DOM_RemoveAllChilds(element)
{
    while (element.childNodes.length > 0) {
        element.removeChild(element.childNodes[0]);
    }
}

function DOM_ReplaceChilds(element, new_child)
{
    DOM_RemoveAllChilds(element);
    element.appendChild(new_child);
}

function DOM_SwapElements(element1, element2)
{
    var tmp1 = document.createTextNode('');
    var tmp2 = document.createTextNode('');
    
    element1.parentNode.replaceChild(tmp1, element1);
    element2.parentNode.replaceChild(tmp2, element2);
    
    tmp1.parentNode.replaceChild(element2, tmp1);
    tmp2.parentNode.replaceChild(element1, tmp2);
}


function DOM_OpenWindow(url, width, height, name, parms)
{
    var left = Math.floor((screen.width - width) / 2);
    var top = Math.floor((screen.height - height) / 2);
    var winParms = "top=" + top + ",left=" + left + ",height=" + height + ",width=" + width;
    if (parms) {
        winParms += "," + parms;
    }
    var win = window.open(url, name, winParms);
    if (parseInt(navigator.appVersion) >= 4) {
        win.window.focus();
    }
    return win;
}

function DOM_CreateLink(text, url, onclick)
{
    var a = document.createElement('a');
    a.href = url;
    if (onclick) {
        if (typeof onclick == 'string') {
            a.setAttribute('onclick', onclick);
        } else {
            DOM_AddEventListener(a, 'click', onclick);
        }
    }
    a.appendChild(document.createTextNode(text));
    return a;
}

function DOM_AlterStyle(rule, property, value)
{
    var current_rule, i, ii, ss;
    ss = document.styleSheets;
    for(ii=0; ii<ss.length; ii++) {
        for(i=0; i < ss[ii].cssRules.length; i++) {
            current_rule = ss[ii].cssRules[i];
            if (current_rule.selectorText == rule) {
                current_rule.style.setProperty(property, value, '');
            }
        }
    }
}

function DOM_GetPosition(obj)
{
    var curleft = 0;
    var curtop = 0;
    
    if (obj.offsetParent) {
        while (obj.offsetParent) {
            curleft += obj.offsetLeft;
            curtop += obj.offsetTop;
            obj = obj.offsetParent;
        }
    }
    
    return {x: curleft, y: curtop};
}

function DOM_GetElementFromEvent(event)
{
    if (event.target) {
        return event.target;
    } else {
        return event.srcElement;
    }
}

function DOM_GetPositionFromEvent(event)
{
    if (event.pageX) { /* Standards... */
        return {x: event.pageX, y: event.pageY};
    } else { /* ie ... */
        var pos = DOM_GetScrollBarPositions();
        return {x: event.clientX + pos.x, y: event.clientY + pos.y};
    }
}

function DOM_GetButtonFromEvent(event)
{
    if (event.button == 2) {
        return 'right';
    } else if (DOM_IsGecko) {
        if (event.button == 0) {
            return 'left';
        } else {
            return 'middle';
        }
    } else {
        if (event.button == 1) {
            return 'left';
        } else {
            return 'middle';
        }
    }
}

function DOM_GetScrollBarPositions()
{
    var x, y;
    if (typeof document.documentElement != 'undefined' && typeof document.documentElement.scrollLeft != 'undefined') {
        x = document.documentElement.scrollLeft;
        y = document.documentElement.scrollTop;
    } else if (typeof window.pageXOffset != 'undefined') {
        x = document.documentElement.scrollLeft;
        y = document.documentElement.scrollTop;
    } else {
        x = document.body.scrollLeft;
        y = document.body.scrollTop;
    }
    return {x: x, y: y}
}

function DOM_PreventDefault(event) // Usage: return DOM_PreventDefault(event) (it will always return false for internet explorer)
{
    if (event.preventDefault) {
        event.preventDefault();
    } else {
        event.returnValue = false;
    }
    return false;
}

function DOM_StopPropagation(event)
{
    if (event.stopPropagation) {
        event.stopPropagation();
    } else {
        window.event.cancelBubble = true;
    }
}

function DOM_AddEventListener(element, event_string, handler)
{
    if (element.addEventListener) {
        element.addEventListener(event_string, handler, false);
    } else {
        element.attachEvent("on" + event_string, handler);
    }
}

function DOM_RemoveEventListener(element, event_string, handler)
{
    if (element.addEventListener) {
        element.removeEventListener(event_string, handler, false);
    } else {
        element.detachEvent("on" + event_string, handler);
    }
}


// These are used to add or remove an event handler to an object preserving the "this" reference

var DOM_Obj_event_listeners = [];

function DOM_AddObjEventListener(obj, element, event_string, handler)
{
    var pos = DOM_Obj_event_listeners.length;
    var item = { obj: obj, element: element, event_string: event_string, handler: handler, internal_handler: new Function('event', "DOM_RunObjEventHandler(event, " + pos + ")") };
    DOM_Obj_event_listeners[pos] = item
    DOM_AddEventListener(element, event_string, item.internal_handler);
}

function DOM_RemoveObjEventListener(obj, element, event_string, handler)
{
    var list = DOM_Obj_event_listeners, item, i;
    
    for (i = 0; i < list.length; i++) {
        item = list[i];
        if (item && item.obj == obj && item.element == element && item.event_string == event_string && item.handler == handler) {
            DOM_RemoveEventListener(element, event_string, item.internal_handler);
            delete(list[i]);
            break;
        }
    }
}

function DOM_RunObjEventHandler(event, number)
{
    DOM_Obj_event_listeners[number].handler.call(DOM_Obj_event_listeners[number].obj, event);
}

// -----

function DOM_GetOptionByValue(select_element, value)
{
    for (var i = 0; i < select_element.options.length; i++) {
        if (select_element.options[i].value == value) {
            return select_element.options[i];
        }
    }
    return null;
}

function DOM_AddPageLoadEvent(func)
{
    var old_onload = window.onload;
    if (typeof window.onload != 'function') {
        window.onload = func;
    } else {
        window.onload = function() {
            old_onload();
            func();
        }
    }
}

function DOM_InsertAfter(new_element, target_element)
{
    if (target_element.nextSibling == null) {
        target_element.parentNode.appendChild(new_element);
    } else {
        target_element.parentNode.insertBefore(new_element, target_element.nextSibling);
    }
}

var DOM_OnFocusChangeListeners = [];

function DOM_AddOnFocusChangeListener(callback)
{
    DOM_OnFocusChangeListeners[DOM_OnFocusChangeListeners.length] = callback;
}

function DOM_DispatchOnFocusChangeEvent(data)
{
    var i;
    for (i = 0; i < DOM_OnFocusChangeListeners.length; i++) {
        DOM_OnFocusChangeListeners[i](data);
    }
}

function DOM_GetWindowInnerSize()
{
    var w, h;
    if (document.documentElement && document.documentElement.clientHeight) { // ie 6 strict and mozilla
        w = document.documentElement.clientWidth;
        h = document.documentElement.clientHeight;
    } else if (self.innerHeight) { // all except ie
        w = self.innerWidth;
        h = self.innerHeight;
    } else if (document.body) { // ie not strict
        w = document.body.clientWidth;
        h = document.body.clientHeight;
    }
    return {w: w, h: h}
}

function DOM_GetNextElement(element)
{
    if (!(element = element.nextSibling)) {
        return null
    }
    while (element.nodeType != 1 && element.nextSibling) { // 1 is ELEMENT_NODE (not text or cdata)
        element = element.nextSibling;
    }
    if (element.nodeType == 1) {
        return element;
    } else {
        return null;
    }
}

function DOM_GetAllNodesBetweeen(element1, element2)
{
    if (element1 == element2) {
        return [];
    }
    if (element1.firstChild) {
        return [ element1.firstChild ].concat(DOM_GetAllNodesBetweeen(element1.firstChild, element2));
    } else if (element1.nextSibling) {
        return [ element1.nextSibling ].concat(DOM_GetAllNodesBetweeen(element1.nextSibling, element2));
    } else {
        while (element1.parentNode && element1.parentNode != element2) {
            var i, nodes;
            nodes = element1.parentNode.childNodes;
            for (i = 0; i < nodes.length; i++) {
                if (nodes[i] == element1) {
                    break;
                }
            }
            if (i + 1 < nodes.length) { // if the element is not the last one
                return DOM_GetAllNodesBetweeen(nodes[i + 1], element2);
            }
            // the element is the last one
            element1 = element1.parentNode;
        }
        return []; // We have no more parents
    }
}

function DOM_GetPreviousElement(element)
{
    if (!(element = element.previousSibling)) {
        return null;
    }
    while (element.nodeType != 1 && element.previousSibling) { // 1 is ELEMENT_NODE (not text or cdata)
        element = element.previousSibling;
    }
    if (element.nodeType == 1) {
        return element;
    } else {
        return null;
    }
}


function DOM_GetRadioValue(name)
{
    var elements = document.getElementsByName(name);
    for (var i = 0; i < elements.length; i++) {
        if (elements[i].checked) {
            return elements[i].value;
        }
    }
    return false;
}

function DOM_GetTextareaSelection(element)
{
    var start = 0;
    var end = 0;
    if (DOM_IsIE) {
        var selection = document.selection.createRange();
        var element_selection = selection.duplicate();
        element_selection.moveToElementText(element);
        
        var i;
        for (i = 0; i <= element.value.length; i++) {
            if (i > 0) {
                element_selection.move('character');
            }
            if (element_selection.compareEndPoints('StartToStart', selection) == 0) {
                start = i;
            }
            if (element_selection.compareEndPoints('StartToEnd', selection) == 0) {
                end = i;
            }
        }
    } else if (element.setSelectionRange) {
        start = element.selectionStart;
        end = element.selectionEnd;
    }
    return [start, end];
}

// range is an array [start, end]
function DOM_SetTextareaSelection(element, range)
{
    if (DOM_IsIE) {
        var selection = document.selection.createRange();
        selection.moveToElementText(element);
        var i;
        var distance = element.value.length - range[1];
        if (distance < 0) {
            distance = 0;
        }
        for (i = 1; i <= distance; i++) {
            selection.moveEnd('character', -1);
        }
        distance = range[0];
        if (distance > element.value.length) {
            distance = element.value.length;
        }
        for (i = 1; i <= distance; i++) {
            selection.moveStart('character');
        }
        selection.select();
    } else if (element.setSelectionRange) {
        element.selectionStart = range[0];
        element.selectionEnd = range[1];
    }
}

function DOM_GetElementById(id)
{
    if (DOM_IsIE) {
        var list = document.getElementsByName(id);
        var i;
        for (i = 0; i < list.length; i++) {
            if (list[i].id == id) {
                return list[i];
            }
        }
        return null;
    } else {
        return document.getElementById(id);
    }
}
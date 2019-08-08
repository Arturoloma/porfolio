var usedBrowser = (function(){
'use strict'

// Opera 8.0+
var _isOpera = (!!window.opr && !!opr.addons) || !!window.opera || navigator.userAgent.indexOf(' OPR/') >= 0;

// Firefox 1.0+
var _isFirefox = typeof InstallTrigger !== 'undefined';

// Safari 3.0+ "[object HTMLElementConstructor]" 
var _isSafari = /constructor/i.test(window.HTMLElement) || (function (p) { return p.toString() === "[object SafariRemoteNotification]"; })(!window['safari'] || (typeof safari !== 'undefined' && safari.pushNotification));

// Internet Explorer 6-11
var _isIE = /*@cc_on!@*/false || !!document.documentMode;

// Edge 20+
var _isEdge = !_isIE && !!window.StyleMedia;

// Chrome 1 - 71
var _isChrome = !!window.chrome && (!!window.chrome.webstore || !!window.chrome.runtime);

// Blink engine detection
var _isBlink = (_isChrome || _isOpera) && !!window.CSS;

return {
    isOpera: _isOpera,
    isFirefox: _isFirefox,
    isSafari: _isSafari,
    isIE: _isIE,
    isEdge: _isEdge,
    isChrome: _isChrome,
    isBlink: _isBlink
}

})();
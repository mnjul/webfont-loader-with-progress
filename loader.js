(function(exports){

// See https://en.wikipedia.org/wiki/Base64
var arrayBufferToBase64 = function(arrayBuffer) {
    var base64 = '';
    var codebook = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';

    var bytesView = new Uint8Array(arrayBuffer);

    var MASK = ((1 << 6) - 1);

    for(var i = 0; i < bytesView.length - 2; i += 3){
        var segment = (bytesView[i] << 16) | (bytesView[i + 1] << 8) | bytesView[i + 2];
        base64 += codebook[segment >> 18] + codebook[(segment >> 12) & MASK] + codebook[(segment >> 6) & MASK] + codebook[segment & MASK];
    }

    // one remaining: append two zero bytes and pick the first two sextets
    if(1 === bytesView.length - i){
        var segment = bytesView[bytesView.length - 1] << 16;
        base64 += codebook[segment >> 18] + codebook[(segment >> 12) & MASK] + '==';
    // two remaining: append one zero bytes and pick the first three sextets
    }else if(2 === bytesView.length - i){
        var segment = (bytesView[bytesView.length - 2] << 16) | (bytesView[bytesView.length - 1] << 8);
        base64 += codebook[segment >> 18] + codebook[(segment >> 12) & MASK] + codebook[(segment >> 6) & MASK] + '=';
    }

    return base64;
};

var getHandlerInvoker = function(evtType){
    return function(e){
        e.detail = this;
        this.eventListeners[evtType].forEach(function(f){
            f.call(window, e);
        }.bind(this));
    }.bind(this);
};

var Loader = function(fontFamily, url, extraCSSString, mime, format){
    this.eventListeners = {
        'beforesend': [],
        'progress': [],
        'load': [],
        'error': [],
        'abort': []
    };

    this.xhr = new XMLHttpRequest();

    this.xhr.addEventListener('progress', getHandlerInvoker.call(this, 'progress'));

    this.xhr.addEventListener('load', function(e){
        if(this.xhr.status.toString()[0] === '2'){
            var base64 = arrayBufferToBase64(this.xhr.response);

            var head = document.getElementsByTagName('head')[0];
            var style = document.createElement('style');
            style.setAttribute('type', 'text/css');
            style.textContent = '\n' +
                '@font-face{\n' +
                '    font-family: ' + fontFamily + ';\n' +
                '    src: url(\'data:' + mime + ';base64,' + base64 + '\') format(\'' + format + '\');\n' +
                (extraCSSString ? ('    ' + extraCSSString + '\n') : '') +
                '}\n';

            head.appendChild(style);
        }

        getHandlerInvoker.call(this, 'load')(e);
    }.bind(this));

    this.xhr.addEventListener('abort', getHandlerInvoker.call(this, 'abort'));

    this.xhr.addEventListener('error', getHandlerInvoker.call(this, 'error'));


    this.xhr.open('GET', url);

    this.xhr.responseType = 'arraybuffer';
};

Loader.prototype.addEventListener = function(evt, callback){
    this.eventListeners[evt].push(callback);
};

Loader.prototype.removeEventListener = function(evt, callback){
    var idx = this.eventListeners[evt].indexOf(callback);
    if(idx !== -1){
        this.eventListeners[evt].splice(idx, 1);
    }
};

Loader.prototype.load = function(){
    getHandlerInvoker.call(this, 'beforesend')({
        name: 'beforesend',
        target: this.xhr
    });

    this.xhr.send(null);
};

exports.WebFontLoader = Loader;

})(window);

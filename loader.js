(function(exports){

var getHandlerInvoker = function(evtType){
    return function(e){
        e.detail = this;
        this.eventListeners[evtType].forEach(function(f){
            f.call(window, e);
        }.bind(this));
    }.bind(this);
};

var Loader = function(fontFamily, url, extraCSSString, format){
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
            var blobURL = URL.createObjectURL(this.xhr.response);

            var head = document.getElementsByTagName('head')[0];
            var style = document.createElement('style');
            style.setAttribute('type', 'text/css');
            style.textContent = '\n' +
                '@font-face{\n' +
                '    font-family: ' + fontFamily + ';\n' +
                '    src: url(\'' + blobURL + '\') format(\'' + format + '\');\n' +
                (extraCSSString ? ('    ' + extraCSSString + '\n') : '') +
                '}\n';

            head.appendChild(style);
        }

        getHandlerInvoker.call(this, 'load')(e);
    }.bind(this));

    this.xhr.addEventListener('abort', getHandlerInvoker.call(this, 'abort'));

    this.xhr.addEventListener('error', getHandlerInvoker.call(this, 'error'));


    this.xhr.open('GET', url);

    this.xhr.responseType = 'blob';
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

# (Yet Another) JavaScript web font loader, with progress event

Yes, there are a plethora of JavaScript-based (or even the bleeding-edge [CSS Font Loading Module](http://www.w3.org/TR/css-font-loading-3/)-based) web font loaders. However most (if not all) of them lack any kind of progress event, i.e. how much of the webfont file has been downloaded over the network from the server.

For such propose, this web font loader uses naïve XMLHTTPRequest to load a webfont file from the remote server, and injects such webfont into CSS in the form of Data URI. As such, this comes at the cost of the performance that the browser must re-parse the base64 representation of the (already potentially megabytes of) font. Additionally, some browsers impose their  own length limit on a base64 Data URIs.

I created this loader when I was making [Allodynia](http://allodynia.mnjul.net) -- as it downloaded (already subsetted but still 1MB large) CJK fonts from remote server, I needed progress event for better UX. It's too bad that as of today, CSS Font Loading Module does not expose such event. I hope however that some future font subsetting technology or typography technology will finally eliminate such need, by minimizing the webfont size for whatever kind of text that a webpage may display, dynamic or static, Latin or plqaD; and that such minimization will allow any kind of webfont to load as fast as contemporary Latin ones (my belief is Latin's such fastness is the main reason why the majority of people don't really care about progress event today).

# Usage

Please see ``./test/test.html`` for some examples. The JS file exports a ``WebFontLoader`` class. To load a font, use:

```
var loader = new WebFontLoader(fontFamily, fontURL, extraCSSString, fontMIME, fontFormat);
loader.load();
```

The loader will XHR-load the font file (using HTTP GET method) and append appropriate ``<style>`` tag including the font blob converted to base64 Data URI.

* ``fontFamily`` parameter is used to identify the webfont in other places of your document's CSS.
* ``extraCSSString`` parameter is appended after the ``src`` property in the CSS ``@font-face`` block, and is useful when you want to specify ``font-weight`` and ``font-style`` for the webfont.
* ``fontMIME`` parameter specifies the MIME (for use in the Data URI) of the font. For WOFF fonts, this should be ``application/font-woff``.
* ``fontFormat`` parameter specifies the font type as used in the CSS ``@font-face``'s ``src`` property, after the Data URI.

In essense, The CSS ``@font-face`` block the loader generates looks like:
```
@font-face{
	font-family: {fontFamily};
	src: url('data:{fontMIME};base64,{fontFileBlobInBase64}') format({fontFormat});
	{extraCSSString}
}
```

The loader exposes several events: ``beforesend``, ``progress``, ``load``, ``error``, and ``abort``. Except for the ``beforesend`` event, the other four events correspond to the events exposed by the XHR. Additionally, for all the events, the event object passed to the handler has ``target`` property to the XHR object used to retrieve the font file, and the ``detail`` property to the WebFontLoader instance.

``beforesend`` is called before the loader invokes the XHR's ``send()`` function and is useful if you want to tailor the XHR's behaviors.

You should attach event listeners after you instantiate the WebFontLoader instance and before the ``load()`` call. For example:

```
var loader = new WebFontLoader(fontFamily, fontURL, extraCSSString, fontMIME, fontFormat);
loader.addEventListener('beforesend', function(e){
	// peek XHR with e.target here
});
loader.addEventListener('progress', function(e){
	// e.total and e.loaded indicate the progress
	// e.detail === loader
});
loader.load();
});
```

Licensed under Apache license. Forking and PR are of course welcome.

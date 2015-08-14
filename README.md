# (Yet Another) JavaScript web font loader, with progress event

Yes, there are a plethora of JavaScript-based (or even the bleeding-edge [CSS Font Loading Module](http://www.w3.org/TR/css-font-loading-3/)-based) web font loaders. However most (if not all) of them lack any kind of progress event, i.e. how much of the webfont file has been downloaded over the network from the server.

For such propose, this web font loader uses naïve XMLHTTPRequest to load a webfont file from the remote server, and injects such webfont into CSS in the form of Data URI. As such, this comes at the cost of the performance that the browser must re-parse the base64 representation of the (already potentially megabytes of) font. Additionally, some browsers impose their  own length limit on a base64 Data URIs.

I created this loader when I was making [Allodynia](http://allodynia.mnjul.net) -- as it downloaded (already subsetted but still 1MB large) CJK fonts from remote server, I needed progress event for better UX. It's too bad that as of today, CSS Font Loading Module does not expose such event. I hope however that some future font subsetting technology or typography technology will finally eliminate such need, by minimizing the webfont size for whatever kind of text that a webpage may display, dynamic or static, Latin or plqaD; and that such minimization will allow any kind of webfont to load as fast as contemporary Latin ones (my belief is such fastness is the main reason why the majority of people don't really care about progress event today).

Licensed under Apache license. Forking and PR are of course welcome.

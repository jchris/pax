# pax

Curry your path segments with intelligent escaping. Tiny. Used by `hoax`, hopefully

## Getting Started
Install the module with: `npm install pax`

```javascript
var pax = require('pax'),
	site = pax("http://twitter.com",{myDefault : "query"}),
	jchris = site("jchris");

jchris.toString() === "http://twitter.com/jchris?myDefault=query"
```

## License
Copyright (c) 2013 Chris Anderson
Licensed under the APL license.

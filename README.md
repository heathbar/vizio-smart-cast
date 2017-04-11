## Synopsis

npm module to communicate with vizio smart cast tvs

## Code Example

```JavaScript
let smartCast = require('vizio-smart-cast');
smartCast.powerMode('192.168.0.101').then((data) => {
    console.log(data);
});
// example output:
// {"STATUS": {"RESULT": "SUCCESS", "DETAIL": "Success"}, "ITEMS": [{"CNAME": "power_mode", "TYPE": "T_VALUE_V1", "NAME": "Power Mode", "VALUE": 0}], "URI": "/state/device/power_mode"}
```

## Installation

```bash
npm install vizio-smart-cast
```

## API Reference

Coming Soon

## Tests

npm test

## License

ISC License
Permission to use, copy, modify, and/or distribute this software for any purpose with or without fee is hereby granted, provided that the above copyright notice and this permission notice appear in all copies.
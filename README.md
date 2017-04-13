## Synopsis

npm module to communicate with vizio smart cast tvs

## Code Example

```JavaScript
let smartcast = require('vizio-smart-cast');
let tv = new smartcast('192.168.0.101');

tv.power.currentMode().then((data) => {
    console.log(data);
});
// example output:
// {"STATUS": {"RESULT": "SUCCESS", "DETAIL": "Success"}, "ITEMS": [{"CNAME": "power_mode", "TYPE": "T_VALUE_V1", "NAME": "Power Mode", "VALUE": 0}], "URI": "/state/device/power_mode"}
```

## Installation

```bash
npm install vizio-smart-cast --save
```

## API Reference

### `new smartcast(ipAddress, [deviceName, [deviceId]])`
Instatiates a new smart cast device
#### Arguments
1. `ipAddress` *(string)*: IP address of the smart cast device
1. `[deviceName]` *(string='vizio-smart-cast-node-app')*: Name of the connecting device/app
1. `[deviceId]` *(string='vizio-smart-cast-node-app')*: ID of the connecting device/app

#### Returns
*(`smartcast`)*: A new smartcast instance

#### Example
```js
let smartcast = require('vizio-smart-cast');
let tv = new smartcast('192.168.0.101');
```

### `power.currentMode()`
Fetch current tv power mode.

#### Returns
*(`Promise`)*: A promise of the http response from the smart cast device

#### Example
```js
let smartcast = require('vizio-smart-cast');
let tv = new smartcast('192.168.0.101');

tv.power.currentMode().then((data) => {
    console.log(data);
});
// example output:
// {"STATUS": {"RESULT": "SUCCESS", "DETAIL": "Success"}, "ITEMS": [{"CNAME": "power_mode", "TYPE": "T_VALUE_V1", "NAME": "Power Mode", "VALUE": 0}], "URI": "/state/device/power_mode"}
```

### `pairing.initialize()`
Initiate pairing with a smart cast device. If successful, a pin will be displayed on the screen of the smart cast device.
#### Returns
*(`Promise`)*: A containing the response from the smart cast device

#### Example
see next method for example

### `pairing.pair(pin)`
#### Arguments
1. `pin` *(string)*: The pin displayed on the smart cast device after a successful `initialize()` call

#### Returns
*(`Promise`)*: A promise containing the response from the smart cast device, including the auth token to use for future requests

#### Example
```js
let smartcast = require('vizio-smart-cast');
let readline = require('readline'); // user input via cmd line
let tv = new smartcast('192.168.0.102');

// configure cmd line input
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

// Initiate a pairing request with a smart cast device
tv.pairing.initiate().then((response) => {

    // prompt the user for the pin that is displayed on the smart cast device
    rl.question('Enter PIN:', (answer) => {
        
        // send the pin to the smart cast device to complete the pairing process
        tv.pairing.pair(answer).then((response) => {

            // log the token to be used for future, authenticated requests
            console.log(response.ITEM.AUTH_TOKEN);
        });

        rl.close();
    });
});
```

## Tests

npm test

## Contributors
This was all made possible by the reference guide here: https://github.com/exiva/Vizio_SmartCast_API

## License

ISC License
Permission to use, copy, modify, and/or distribute this software for any purpose with or without fee is hereby granted, provided that the above copyright notice and this permission notice appear in all copies.
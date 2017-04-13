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
Provide a user-entered pin to the smart cast device. The smart cast device will respond with an auth token that can be used indefinitely. The vizio-smart-cast library will automatically re-use the token for the remainder of the session. For future sessions, call `pairing.useAuthToken(...)` with the token to skip the pairing process.

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

### `pairing.useAuthToken(token)`
Skip the pairing process and use the specified token instead. On first run, a call to `pairing.pair(...)` is required to obtain an auth token. On successive runs, use this method to skip the pairing process.

#### Arguments
1. `token` *(string)*: The token retrieved from a successful `pairing.pair(...)` call

#### Returns
*(`void`)*: Nothing

#### Example
```js
let smartcast = require('../vizio-smart-cast');
let tv = new smartcast('192.168.0.103');

// set auth token manually instead of the cumbersome pairing process
tv.pairing.useAuthToken('xxxxxxxxxx');

// make a call to an authenticated method
tv.input.current().then((data) => {
    console.log('response: ', data);
});

```

### `input.current()`
Fetch current tv input.

#### Returns
*(`Promise`)*: A promise of the http response from the smart cast device

#### Example
```js
let smartcast = require('../vizio-smart-cast');
let tv = new smartcast('192.168.0.103');

// set auth token manually instead of the cumbersome pairing process
tv.pairing.useAuthToken('xxxxxxxxxx');

// make a call to an authenticated method
tv.input.current().then((data) => {
    console.log('response: ', data);
});
// Example output
// { STATUS: { RESULT: 'SUCCESS', DETAIL: 'Success' },
//  ITEMS: 
//   [ { HASHVAL: 1234123412,
//       NAME: 'Current Input',
//       ENABLED: 'FALSE',
//       VALUE: 'HDMI-1',
//       CNAME: 'current_input',
//       TYPE: 'T_STRING_V1' } ],
//  HASHLIST: [ 0928345790, 9087654321 ],
//  URI: '/menu_native/dynamic/tv_settings/devices/current_input',
//  PARAMETERS: { FLAT: 'TRUE', HELPTEXT: 'FALSE', HASHONLY: 'FALSE' } }
```

### `input.list()`
Fetch the list of all inputs

#### Returns
*(`Promise`)*: A promise of the http response from the smart cast device

#### Example
```js
let smartcast = require('../vizio-smart-cast');
let tv = new smartcast('192.168.0.103');

// set auth token manually instead of the cumbersome pairing process
tv.pairing.useAuthToken('xxxxxxxxxx');

// make a call to an authenticated method
tv.input.list().then((data) => {
    console.log('response: ', data);
});
// Example output
 // {
//     "STATUS": {
//         "RESULT": "SUCCESS",
//         "DETAIL": "Success"
//     },
//     "HASHLIST": [
//         1234567890,
//         0987654321,
//         9999999999
//     ],
//     "GROUP": "G_DEVICES",
//     "NAME": "Name Input",
//     "PARAMETERS": {
//         "FLAT": "TRUE",
//         "HELPTEXT": "FALSE",
//         "HASHONLY": "FALSE"
//     },
//     "ITEMS": [
//         {
//         "HASHVAL": 1111111111,
//         "CNAME": "cast",
//         "NAME": "CAST",
//         "TYPE": "T_DEVICE_V1",
//         "READONLY": "TRUE",
//         "VALUE": {
//             "NAME": "CAST",
//             "METADATA": ""
//         }
//         },
//         {
//         "HASHVAL": 2222222222,
//         "CNAME": "hdmi1",
//         "TYPE": "T_DEVICE_V1",
//         "NAME": "HDMI-1",
//         "VALUE": {
//             "NAME": "BLU-RAY",
//             "METADATA": ""
//         }
//         },
//         {
//         "HASHVAL": 3333333333,
//         "CNAME": "hdmi2",
//         "TYPE": "T_DEVICE_V1",
//         "NAME": "HDMI-2",
//         "VALUE": {
//             "NAME": "XBOX 360",
//             "METADATA": ""
//         }
//         },
//         {
//         "HASHVAL": 4444444444,
//         "CNAME": "hdmi3",
//         "TYPE": "T_DEVICE_V1",
//         "NAME": "HDMI-3",
//         "VALUE": {
//             "NAME": "XBOX ONE",
//             "METADATA": ""
//         }
//         },
//         {
//         "HASHVAL": 5555555555,
//         "CNAME": "hdmi4",
//         "TYPE": "T_DEVICE_V1",
//         "NAME": "HDMI-4",
//         "VALUE": {
//             "NAME": "PLAYSTATION",
//             "METADATA": ""
//         }
//         },
//         {
//         "HASHVAL": 66666666666,
//         "CNAME": "hdmi5",
//         "TYPE": "T_DEVICE_V1",
//         "NAME": "HDMI-5",
//         "VALUE": {
//             "NAME": "",
//             "METADATA": ""
//         }
//         },
//         {
//         "HASHVAL": 7777777777,
//         "CNAME": "comp",
//         "TYPE": "T_DEVICE_V1",
//         "NAME": "COMP",
//         "VALUE": {
//             "NAME": "",
//             "METADATA": ""
//         }
//         }
//     ],
//     "URI": "/menu_native/dynamic/tv_settings/devices/name_input",
//     "CNAME": "name_input",
//     "TYPE": "T_MENU_V1"
// };
```

## Tests

npm test

## Contributors
This was all made possible by the reference guide here: https://github.com/exiva/Vizio_SmartCast_API

## License

ISC License
Permission to use, copy, modify, and/or distribute this software for any purpose with or without fee is hereby granted, provided that the above copyright notice and this permission notice appear in all copies.
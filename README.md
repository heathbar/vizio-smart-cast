## Synopsis

npm module to communicate with vizio smartcast tvs

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

### `smartcast.discover(success, [error, [timeout]] )`

Discover smartcast devices on the local network

#### Arguments

1. `success` *(Function)*: callback to execute when a device is found
1. `error` *(Function)*: callback to execute when an error occurs
1. `timeout` *(number)*: number of milliseconds to wait for responses, defaults to 4000ms

#### Returns

*(`void`)*: nothing important

#### Example

```js
let smartcast = require('vizio-smart-cast');
smartcast.discover(device => {
  console.log(device);
});

// Example output:
// {
//     ip: "192.168.0.131",
//     name: "Living Room",
//     manufacturer: "VIZIO",
//     model: "P65-C1"
// }
```

### `new smartcast(host, [authToken])`

Instatiates a new smartcast device

#### Arguments

1. `host` *(string)*: Host IP address (and optionally PORT) of the smartcast device
1. `[authToken]` *(string)*: Authorization token from a previous session. Auth tokens are returned from `pairing.pair(...)`

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

*(`Promise`)*: A promise of the http response from the smartcast device

#### Example

```js
let smartcast = require('vizio-smart-cast');
let tv = new smartcast('192.168.0.101');

tv.power.currentMode().then(data => {
  console.log(data);
});
// example output:
// {"STATUS": {"RESULT": "SUCCESS", "DETAIL": "Success"}, "ITEMS": [{"CNAME": "power_mode", "TYPE": "T_VALUE_V1", "NAME": "Power Mode", "VALUE": 0}], "URI": "/state/device/power_mode"}
```

### `pairing.initiate([deviceName, [deviceId]])`

Initiate pairing with a smartcast device. If successful, a pin will be displayed on the screen of the smartcast device. Device name and ID appear in the SmartCast app to uniquely identify and manage connections.

#### Arguments

1. `[deviceName]` *(string='node-app-1234567890')*: Name of the connecting device/app
1. `[deviceId]` *(string='node-app-1234567890')*: ID of the connecting device/app

#### Returns

*(`Promise`)*: A promise containing the response from the smartcast device

#### Example

see next method for example

### `pairing.pair(pin)`

Provide a user-entered pin to the smartcast device. The smartcast device will respond with an auth token that can be used indefinitely. The vizio-smart-cast library will automatically re-use the token for the remainder of the session. For future sessions, specify the authToken in the constructor or call `pairing.useAuthToken(...)` with the token to skip the pairing process.

#### Arguments

1. `pin` *(string)*: The pin displayed on the smartcast device after a successful `pairing.initiate()` call

#### Returns

*(`Promise`)*: A promise containing the response from the smartcast device, including the auth token to use for future requests

#### Example

```js
let smartcast = require('vizio-smart-cast');
let readline = require('readline'); // user input via cmd line
let tv = new smartcast('192.168.0.101');

// configure cmd line input
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Initiate a pairing request with a smartcast device
tv.pairing.initiate().then(response => {
  // prompt the user for the pin that is displayed on the smartcast device
  rl.question('Enter PIN:', answer => {
    // send the pin to the smartcast device to complete the pairing process
    tv.pairing.pair(answer).then(response => {
      // log the token to be used for future, authenticated requests
      console.log(response.ITEM.AUTH_TOKEN);
    });

    rl.close();
  });
});
```

### `pairing.useAuthToken(token)`

Skip the pairing process and use the specified token instead. On first run, a call to `pairing.pair(...)` is required to obtain an auth token. On successive runs, use this method to skip the pairing process.

*NOTE:* the authorization token can also be specified in the constructor. Either way, the libarary remembers it for the remainder of the smartcast instance.

#### Arguments

1. `token` *(string)*: The token retrieved from a successful `pairing.pair(...)` call

#### Returns

*(`void`)*: Nothing

#### Example

```js
let smartcast = require('vizio-smart-cast');
let tv = new smartcast('192.168.0.101');

tv.pairing.useAuthToken('xAuthTokenx');

// make a call to an authenticated method
tv.input.current().then(data => {
  console.log('response: ', data);
});
```

### `input.current()`

Fetch current tv input.

#### Returns

*(`Promise`)*: A promise of the http response from the smartcast device

#### Example

```js
let smartcast = require('vizio-smart-cast');
let tv = new smartcast('192.168.0.101', 'xAuthTokenx');

// make a call to an authenticated method
tv.input.current().then(data => {
  console.log('response: ', data);
});
// Example output
// { STATUS: { RESULT: "SUCCESS", DETAIL: "Success" },
//  ITEMS:
//   [ { HASHVAL: 1234123412,
//       NAME: "Current Input",
//       ENABLED: "FALSE",
//       VALUE: "HDMI-1",
//       CNAME: "current_input",
//       TYPE: "T_STRING_V1" } ],
//  HASHLIST: [ 0928345790, 9087654321 ],
//  URI: "/menu_native/dynamic/tv_settings/devices/current_input",
//  PARAMETERS: { FLAT: "TRUE", HELPTEXT: "FALSE", HASHONLY: "FALSE" } }
```

### `input.list()`

Fetch the list of all inputs

#### Returns

*(`Promise`)*: A promise of the http response from the smartcast device

#### Example

```js
let smartcast = require('vizio-smart-cast');
let tv = new smartcast('192.168.0.101', 'xAuthTokenx');

// make a call to an authenticated method
tv.input.list().then(data => {
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

### `input.set(name)`

Set the current input to the specified name. Name can be either the built-in name or the user defined name and is case insensitive.

#### Returns

*(`Promise`)*: A promise of the http response from the smartcast device

*NOTE:* the HTTP call may return, and thus the promise may resolve before the smartcast device has finished changing inputs. For that reason, it is possible to receive the old value from tv.input.current() if you call it immediately after the promise from tv.input.set(...) resolves.

#### Example

```js
let smartcast = require('vizio-smart-cast');
let tv = new smartcast('192.168.0.101', 'xAuthTokenx');

// Built in names
tv.input.set('HDMI-1');

// User defined names
tv.input.set('Kodi');
```

### `control.volume.down()`

Turn volume down one step

#### Returns

*(`Promise`)*: A promise of the http response from the smartcast device

#### Example

```js
let smartcast = require('vizio-smart-cast');
let tv = new smartcast('192.168.0.101', 'xAuthTokenx');

tv.control.volume.down();
```

### `control.volume.up()`

Turn volume up one step

#### Returns

*(`Promise`)*: A promise of the http response from the smartcast device

#### Example

```js
let smartcast = require('vizio-smart-cast');
let tv = new smartcast('192.168.0.101', 'xAuthTokenx');

tv.control.volume.up();
```

### `control.volume.set(value)`

Specify a specific volume level

#### Arguments

1. `value` *(number)*: The volume level to set [0-100]

#### Returns

*(`Promise`)*: A promise of the http response from the smartcast device

#### Example

```js
let smartcast = require('vizio-smart-cast');
let tv = new smartcast('192.168.0.101', 'xAuthTokenx');

tv.control.volume.set(20);
```

### `control.volume.mute()`

Mute the volume

#### Returns

*(`Promise`)*: A promise of the http response from the smartcast device

#### Example

```js
let smartcast = require('vizio-smart-cast');
let tv = new smartcast('192.168.0.101', 'xAuthTokenx');

tv.control.volume.mute();
```

### `control.volume.unmute()`

Unmute the volume

#### Returns

*(`Promise`)*: A promise of the http response from the smartcast device

#### Example

```js
let smartcast = require('vizio-smart-cast');
let tv = new smartcast('192.168.0.101', 'xAuthTokenx');

tv.control.volume.unmute();
```

### `control.volume.toggleMute()`

Toggle muting of the volume

#### Returns

*(`Promise`)*: A promise of the http response from the smartcast device

#### Example

```js
let smartcast = require('vizio-smart-cast');
let tv = new smartcast('192.168.0.101', 'xAuthTokenx');

tv.control.volume.toggleMute();
```

### `control.input.cycle()`

Select the next input

#### Returns

*(`Promise`)*: A promise of the http response from the smartcast device

#### Example

```js
let smartcast = require('vizio-smart-cast');
let tv = new smartcast('192.168.0.101', 'xAuthTokenx');

tv.control.input.cycle();
```

### `control.channel.down()`

Move down one channel

#### Returns

*(`Promise`)*: A promise of the http response from the smartcast device

#### Example

```js
let smartcast = require('vizio-smart-cast');
let tv = new smartcast('192.168.0.101', 'xAuthTokenx');

tv.control.channel.down();
```

### `control.channel.up()`

Move up one channel

#### Returns

*(`Promise`)*: A promise of the http response from the smartcast device

#### Example

```js
let smartcast = require('vizio-smart-cast');
let tv = new smartcast('192.168.0.101', 'xAuthTokenx');

tv.control.channel.up();
```

### `control.channel.previous()`

Move to the previous channel

#### Returns

*(`Promise`)*: A promise of the http response from the smartcast device

#### Example

```js
let smartcast = require('vizio-smart-cast');
let tv = new smartcast('192.168.0.101', 'xAuthTokenx');

tv.control.channel.previous();
```

### `control.power.on()`

Turn on the device.
*NOTE:* some devices may require you to send a WOL magic packet to first wake-up the device. Eco-mode is not supported.

#### Returns

*(`Promise`)*: A promise of the http response from the smartcast device

#### Example

```js
let smartcast = require('vizio-smart-cast');
let tv = new smartcast('192.168.0.101', 'xAuthTokenx');

tv.control.power.on();
```

### `control.power.off()`

Turn off the device

#### Returns

*(`Promise`)*: A promise of the http response from the smartcast device

#### Example

```js
let smartcast = require('vizio-smart-cast');
let tv = new smartcast('192.168.0.101', 'xAuthTokenx');

tv.control.power.off();
```

### `control.power.toggle()`

Toggle power to the device.
*NOTE:* some devices may require you to send a WOL magic packet to first wake-up the device. Eco-mode is not supported.

#### Returns

*(`Promise`)*: A promise of the http response from the smartcast device

#### Example

```js
let smartcast = require('vizio-smart-cast');
let tv = new smartcast('192.168.0.101', 'xAuthTokenx');

tv.control.power.toggle();
```

### `control.media.seek.forward()`

Seeks the current media forward

#### Returns

*(`Promise`)*: A promise of the http response from the smartcast device

#### Example

```js
let smartcast = require('vizio-smart-cast');
let tv = new smartcast('192.168.0.101', 'xAuthTokenx');

tv.control.media.seek.forward();
```

### `control.media.seek.back()`

Seeks the current media backwards

#### Returns

*(`Promise`)*: A promise of the http response from the smartcast device

#### Example

```js
let smartcast = require('vizio-smart-cast');
let tv = new smartcast('192.168.0.101', 'xAuthTokenx');

tv.control.media.seek.back();
```

### `control.media.play()`

Plays the current media
*NOTE:* Some applications will toggle play / pause

#### Returns

*(`Promise`)*: A promise of the http response from the smartcast device

#### Example

```js
let smartcast = require('vizio-smart-cast');
let tv = new smartcast('192.168.0.101', 'xAuthTokenx');

tv.control.media.play();
```

### `control.media.pause()`

Pauses the current media
*NOTE:* Some applications will toggle play / pause

#### Returns

*(`Promise`)*: A promise of the http response from the smartcast device

#### Example

```js
let smartcast = require('vizio-smart-cast');
let tv = new smartcast('192.168.0.101', 'xAuthTokenx');

tv.control.media.pause();
```

### `control.media.cc()`

Sends closed captioning key
*NOTE:* Some applications require sending this command to switch between languages
The arrow keys should also work for this.

#### Returns

*(`Promise`)*: A promise of the http response from the smartcast device

#### Example

```js
let smartcast = require('vizio-smart-cast');
let tv = new smartcast('192.168.0.101', 'xAuthTokenx');

tv.control.media.cc();
```

### `control.navigate.up()`

Up arrow key used to navigate.

#### Returns

*(`Promise`)*: A promise of the http response from the smartcast device

#### Example

```js
let smartcast = require('vizio-smart-cast');
let tv = new smartcast('192.168.0.101', 'xAuthTokenx');

tv.control.navigate.up();
```

### `control.navigate.down()`

Down arrow key used to navigate.

#### Returns

*(`Promise`)*: A promise of the http response from the smartcast device

#### Example

```js
let smartcast = require('vizio-smart-cast');
let tv = new smartcast('192.168.0.101', 'xAuthTokenx');

tv.control.navigate.down();
```

### `control.navigate.left()`

Left arrow key used to navigate.

#### Returns

*(`Promise`)*: A promise of the http response from the smartcast device

#### Example

```js
let smartcast = require('vizio-smart-cast');
let tv = new smartcast('192.168.0.101', 'xAuthTokenx');

tv.control.navigate.left();
```

### `control.navigate.right()`

Right arrow key used to navigate.

#### Returns

*(`Promise`)*: A promise of the http response from the smartcast device

#### Example

```js
let smartcast = require('vizio-smart-cast');
let tv = new smartcast('192.168.0.101', 'xAuthTokenx');

tv.control.navigate.right();
```

### `control.navigate.ok()`

Ok key used for navigating.

#### Returns

*(`Promise`)*: A promise of the http response from the smartcast device

#### Example

```js
let smartcast = require('vizio-smart-cast');
let tv = new smartcast('192.168.0.101', 'xAuthTokenx');

tv.control.navigate.ok();
```

### `control.navigate.back()`

Navigate back in an application.

#### Returns

*(`Promise`)*: A promise of the http response from the smartcast device

#### Example

```js
let smartcast = require('vizio-smart-cast');
let tv = new smartcast('192.168.0.101', 'xAuthTokenx');

tv.control.navigate.back();
```

### `control.navigate.exit()`

Exit an application.

#### Returns

*(`Promise`)*: A promise of the http response from the smartcast device

#### Example

```js
let smartcast = require('vizio-smart-cast');
let tv = new smartcast('192.168.0.101', 'xAuthTokenx');

tv.control.navigate.exit();
```

### `control.menu()`

Launch the on-screen menu.

#### Returns

*(`Promise`)*: A promise of the http response from the smartcast device

#### Example

```js
let smartcast = require('vizio-smart-cast');
let tv = new smartcast('192.168.0.101', 'xAuthTokenx');

tv.control.menu();
```

### `control.info()`

Displays the tuner information.

#### Returns

*(`Promise`)*: A promise of the http response from the smartcast device

#### Example

```js
let smartcast = require('vizio-smart-cast');
let tv = new smartcast('192.168.0.101', 'xAuthTokenx');

tv.control.info();
```

### `control.smartcast()`

Launch the smartcast application.

#### Returns

*(`Promise`)*: A promise of the http response from the smartcast device

#### Example

```js
let smartcast = require('vizio-smart-cast');
let tv = new smartcast('192.168.0.101', 'xAuthTokenx');

tv.control.smartcast();
```

### `control.keyCommand(codeset, code, [action])`

Send a key command to the smartcast device.

#### Arguments

1. `codeset` *(number)*: The codeset to send. See https://github.com/exiva/Vizio_SmartCast_API
1. `code` *(number)*: The code to send. See https://github.com/exiva/Vizio_SmartCast_API
1. `[action]` *(string=KEYPRESS)*: The action to send. One of: `KEYDOWN`, `KEYUP`, `KEYPRESS`.

#### Returns

*(`Promise`)*: A promise of the http response from the smartcast device

#### Example

```js
let smartcast = require('vizio-smart-cast');
let tv = new smartcast('192.168.0.101', 'xAuthTokenx');

tv.control.keyCommand(5, 1, 'KEYDOWN');
```

### `settings.picture.get()`

Get picture settings

#### Returns

*(`Promise`)*: A promise of the http response from the smartcast device

#### Example

```js
let smartcast = require('vizio-smart-cast');
let tv = new smartcast('192.168.0.101', 'xAuthTokenx');

tv.settings.picture.get().then(data => console.log(data));
```

### `settings.picture.size.get()`

Get picture size settings

#### Returns

*(`Promise`)*: A promise of the http response from the smartcast device

#### Example

```js
let smartcast = require('vizio-smart-cast');
let tv = new smartcast('192.168.0.101', 'xAuthTokenx');

tv.settings.picture.size.get().then(data => console.log(data));
```

### `settings.picture.position.get()`

Get picture position settings

#### Returns

*(`Promise`)*: A promise of the http response from the smartcast device

#### Example

```js
let smartcast = require('vizio-smart-cast');
let tv = new smartcast('192.168.0.101', 'xAuthTokenx');

tv.settings.picture.position.get().then(data => console.log(data));
```

### `settings.picture.modeEdit.get()`

Get mode settings

#### Returns

*(`Promise`)*: A promise of the http response from the smartcast device

#### Example

```js
let smartcast = require('vizio-smart-cast');
let tv = new smartcast('192.168.0.101', 'xAuthTokenx');

tv.settings.picture.modeEdit.get().then(data => console.log(data));
```

### `settings.picture.mode.get()`

Get picture mode

#### Returns

*(`Promise`)*: A promise of the http response from the smartcast device

#### Example

```js
let smartcast = require('vizio-smart-cast');
let tv = new smartcast('192.168.0.101', 'xAuthTokenx');

tv.settings.picture.mode.get().then(data => console.log(data));
```

### `settings.picture.mode.set(value)`

Set picture mode

#### Returns

*(`Promise`)*: A promise of the http response from the smartcast device

#### Example

```js
let smartcast = require('vizio-smart-cast');
let tv = new smartcast('192.168.0.101', 'xAuthTokenx');

tv.settings.picture.mode.set('Standard').then(data => console.log(data));
```

### `settings.picture.color.calibration.get()`

Get color calibration settings

#### Returns

*(`Promise`)*: A promise of the http response from the smartcast device

#### Example

```js
let smartcast = require('vizio-smart-cast');
let tv = new smartcast('192.168.0.101', 'xAuthTokenx');

tv.settings.picture.color.calibration.get().then(data => console.log(data));
```

### `settings.picture.color.tuner.get()`

Get color tuner settings

#### Returns

*(`Promise`)*: A promise of the http response from the smartcast device

#### Example

```js
let smartcast = require('vizio-smart-cast');
let tv = new smartcast('192.168.0.101', 'xAuthTokenx');

tv.settings.picture.color.tuner.get().then(data => console.log(data));
```

### `settings.picture.calibrationTests.get()`

Get calibration test settings

#### Returns

*(`Promise`)*: A promise of the http response from the smartcast device

#### Example

```js
let smartcast = require('vizio-smart-cast');
let tv = new smartcast('192.168.0.101', 'xAuthTokenx');

tv.settings.picture.calibrationTests.get().then(data => console.log(data));
```

### `settings.audio.get()`

Get audio settings

#### Returns

*(`Promise`)*: A promise of the http response from the smartcast device

#### Example

```js
let smartcast = require('vizio-smart-cast');
let tv = new smartcast('192.168.0.101', 'xAuthTokenx');

tv.settings.audio.get().then(data => console.log(data));
```

### `settings.timers.get()`

Get timer settings

#### Returns

*(`Promise`)*: A promise of the http response from the smartcast device

#### Example

```js
let smartcast = require('vizio-smart-cast');
let tv = new smartcast('192.168.0.101', 'xAuthTokenx');

tv.settings.timers.get().then(data => console.log(data));
```

### `settings.timers.sleepTimer.get()`

Get sleep timer settings

#### Returns

*(`Promise`)*: A promise of the http response from the smartcast device

#### Example

```js
let smartcast = require('vizio-smart-cast');
let tv = new smartcast('192.168.0.101', 'xAuthTokenx');

tv.settings.timers.sleepTimer.get().then(data => console.log(data));
```

### `settings.timers.sleepTimer.set(value)`

Sets sleep timer

#### Arguments

1. `value` *(string|number)*: The value of the sleep timer as a string value or the numbered index.

> NOTE: library will not allow you to set value outside of these parameters to prevent potentially bricking your display.

| Number  | String          | Action                |
| ------- | --------------- | --------------------- |
| `0`     | `'Off'`         | turns off sleep timer |
| `1`     | `'30 minutes'`  | 30 minutes            |
| `2`     | `'60 minutes'`  | 60 minutes            |
| `3`     | `'90 minutes'`  | 90 minutes            |
| `4`     | `'120 minutes'` | 120 minutes           |
| `5`     | `'180 minutes'` | 180 minutes           |

#### Returns

*(`Promise`)*: A promise of the http response from the smartcast device

#### Example

```js
let smartcast = require('vizio-smart-cast');
let tv = new smartcast('192.168.0.101', 'xAuthTokenx');

// Set the sleep timer to 30 minutes
tv.settings.timers.sleepTimer.set(1).then(data => console.log(data));
```

### `settings.timers.autoPowerOffTimer.get()`

Get auto power off timer settings. With no video input (DVD player falls asleep), the TV will turn off after 10 minutes.

#### Returns

*(`Promise`)*: A promise of the http response from the smartcast device

#### Example

```js
let smartcast = require('vizio-smart-cast');
let tv = new smartcast('192.168.0.101', 'xAuthTokenx');

tv.settings.timers.autoPowerOffTimer.get().then(data => console.log(data));
```

### `settings.timers.autoPowerOffTimer.set(value)`

Sets auto power off timer setting. By default, it is set to 10 minutes. It can be disabled by setting to 'Off'.

#### Arguments

1. `value` *(number|string)*: The value of the autoPowerOffTimer setting as the string value or the numbered index.

> NOTE: library will not allow you to set value outside of these parameters to prevent potentially bricking your display.

| Integer | String         | Action                            |
| ------- | -------------- | --------------------------------- |
| `0`     | `'10 minutes'` | Default auto power off of 10 mins |
| `1`     | `'Off'`        | Disable this feature              |

#### Returns

*(`Promise`)*: A promise of the http response from the smartcast device

#### Example

```js
let smartcast = require('vizio-smart-cast');
let tv = new smartcast('192.168.0.101', 'xAuthTokenx');

// Disable auto power off timer
tv.settings.timers.autoPowerOffTimer.set(1).then(data => console.log(data));
```

### `settings.timers.blankScreen.get()`

Get the blankScreen settings. Due to this being an executable action, and not a list, there is no meaningful value returned by this aside from `hashval`, which is 
used internally to trigger the action. See `execute()` below to perform the action.

#### Returns

*(`Promise`)*: A promise of the http response from the smartcast device

#### Example

```js
let smartcast = require('vizio-smart-cast');
let tv = new smartcast('192.168.0.101', 'xAuthTokenx');

tv.settings.timers.blankScreen.get().then(data => console.log(data));
```

### `settings.timers.blankScreen.execute()`

Executes the blank screen action to turn off the display but continue playing the content (audio is still available). 

#### Returns

*(`Promise`)*: A promise of the http response from the smartcast device

#### Example

```js
let smartcast = require('vizio-smart-cast');
let tv = new smartcast('192.168.0.101', 'xAuthTokenx');

// Turn off the screen only
tv.settings.timers.blankScreen.execute().then(data => console.log(data));
```

### `settings.network.get()`

Get network settings

#### Returns

*(`Promise`)*: A promise of the http response from the smartcast device

#### Example

```js
let smartcast = require('vizio-smart-cast');
let tv = new smartcast('192.168.0.101', 'xAuthTokenx');

tv.settings.network.get().then(data => console.log(data));
```

### `settings.channels.get()`

Get channels settings

#### Returns

*(`Promise`)*: A promise of the http response from the smartcast device

#### Example

```js
let smartcast = require('vizio-smart-cast');
let tv = new smartcast('192.168.0.101', 'xAuthTokenx');

tv.settings.channels.get().then(data => console.log(data));
```

### `settings.closedCaptions.get()`

Get closed caption settings

#### Returns

*(`Promise`)*: A promise of the http response from the smartcast device

#### Example

```js
let smartcast = require('vizio-smart-cast');
let tv = new smartcast('192.168.0.101', 'xAuthTokenx');

tv.settings.closedCaptions.get().then(data => console.log(data));
```

### `settings.devices.get()`

Get devices settings

#### Returns

*(`Promise`)*: A promise of the http response from the smartcast device

#### Example

```js
let smartcast = require('vizio-smart-cast');
let tv = new smartcast('192.168.0.101', 'xAuthTokenx');

tv.settings.devices.get().then(data => console.log(data));
```

### `settings.system.get()`

Get system settings

#### Returns

*(`Promise`)*: A promise of the http response from the smartcast device

#### Example

```js
let smartcast = require('vizio-smart-cast');
let tv = new smartcast('192.168.0.101', 'xAuthTokenx');

tv.settings.system.get().then(data => console.log(data));
```

### `settings.system.information.get()`

Get system information settings

#### Returns

*(`Promise`)*: A promise of the http response from the smartcast device

#### Example

```js
let smartcast = require('vizio-smart-cast');
let tv = new smartcast('192.168.0.101', 'xAuthTokenx');

tv.settings.system.information.get().then(data => console.log(data));
```

### `settings.system.information.tv.get()`

Get tv information

#### Returns

*(`Promise`)*: A promise of the http response from the smartcast device

#### Example

```js
let smartcast = require('vizio-smart-cast');
let tv = new smartcast('192.168.0.101', 'xAuthTokenx');

tv.settings.system.information.tv.get().then(data => console.log(data));
```

### `settings.system.information.tuner.get()`

Get tuner information

#### Returns

*(`Promise`)*: A promise of the http response from the smartcast device

#### Example

```js
let smartcast = require('vizio-smart-cast');
let tv = new smartcast('192.168.0.101', 'xAuthTokenx');

tv.settings.system.information.tuner.get().then(data => console.log(data));
```

### `settings.system.information.network.get()`

Get network information

#### Returns

*(`Promise`)*: A promise of the http response from the smartcast device

#### Example

```js
let smartcast = require('vizio-smart-cast');
let tv = new smartcast('192.168.0.101', 'xAuthTokenx');

tv.settings.system.information.network.get().then(data => console.log(data));
```

### `settings.system.information.uli.get()`

Get ULI information

#### Returns

*(`Promise`)*: A promise of the http response from the smartcast device

#### Example

```js
let smartcast = require('vizio-smart-cast');
let tv = new smartcast('192.168.0.101', 'xAuthTokenx');

tv.settings.system.information.uli.get().then(data => console.log(data));
```

### `settings.mobileDevices.get()`

Get mobile device settings

#### Returns

*(`Promise`)*: A promise of the http response from the smartcast device

#### Example

```js
let smartcast = require('vizio-smart-cast');
let tv = new smartcast('192.168.0.101', 'xAuthTokenx');

tv.settings.mobileDevices.get().then(data => console.log(data));
```

### `settings.cast.get()`

Get cast settings

#### Returns

*(`Promise`)*: A promise of the http response from the smartcast device

#### Example

```js
let smartcast = require('vizio-smart-cast');
let tv = new smartcast('192.168.0.101', 'xAuthTokenx');

tv.settings.cast.get().then(data => console.log(data));
```


### `app.launch(app, [app_id, [name_space]])`

Launch a vizio app via URL or using App ID (See https://github.com/exiva/Vizio_SmartCast_API#app-ids)

#### Returns

*(`Promise`)*: A promise of the http response from the smartcast device

#### Example

```js
let smartcast = require('vizio-smart-cast');
let tv = new smartcast('192.168.0.101', 'xAuthTokenx');

tv.app.launch('http://demo.example.com/vizio.html').then(data => console.log(data));
```

## Tests

npm test

## Contributors

This was all made possible by the reference guide here: https://github.com/exiva/Vizio_SmartCast_API

## License

ISC License
Permission to use, copy, modify, and/or distribute this software for any purpose with or without fee is hereby granted, provided that the above copyright notice and this permission notice appear in all copies.

# mqtt-dispatch
A replacement for MQTT.js [https://www.npmjs.com/package/mqtt] which
adds a new method **dispatch** to the MQTT client for easier message routing.

## Example

```javascript

var client = MQTT.connect(host, options);

client.subscribe('devices/#');

client.dispatch('devices/:name/status', (message, args) => {
	console.log(`Message from topic devices/${args.name}/status: ${message}`);
});

```

# mqtt-dispatch
A dispatcher for MQTT.js (https://www.npmjs.com/package/mqtt) which
supports message routing for specific topics.


## Example

```javascript
function example() {
	var Mqtt = require('mqtt');
	var MqttDispatch = require('./mqtt-dispatch.js');

	// Load .env
	require('dotenv').config();

	// Enter your MQTT broker´s credentials here
	let options = {
		host     : process.env.MQTT_HOST,
		username : process.env.MQTT_USERNAME,
		password : process.env.MQTT_PASSWORD,
		port     : process.env.MQTT_PORT
	};

	console.log(`Connecting to MQTT broker ${options.host}...`);

	// Connect to MQTT broker as usual.
	let client = Mqtt.connect(options.host, options);

	// Modify MQTT client to dispatch messages
	client = MqttDispatch(client);

	// Notify when connected
	client.on('connect', () => {
		console.log(`Connected to MQTT broker ${options.host} on port ${options.port}.`);
	});
	
	// Subscribe to the topics you want
	client.subscribe('example/#');

	// Example just to show how to use parameters
	client.on('example/topic/foo/bar', (message) => {
		console.log(`example/topic/foo/bar: ${JSON.stringify(message)}`);
	});
	
	// Example just to show how to use parameters
	client.on('example/topic/:A/:B', (message, args) => {
		console.log(`example/topic/${args.A}/${args.B}: ${JSON.stringify(message)}`);
	});

}

example();
```

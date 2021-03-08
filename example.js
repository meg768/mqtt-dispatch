
function example() {
//	var Mqtt = require('mqtt-dispatch');
	var Mqtt = require('./index.js');

	// Load .env
	require('dotenv').config();

	// Enter your MQTT broker´s credentials here
	var options = {
		host     : process.env.MQTT_HOST,
		username : process.env.MQTT_USERNAME,
		password : process.env.MQTT_PASSWORD,
		port     : process.env.MQTT_PORT
	};

	console.log(`Connecting to MQTT broker ${process.env.MQTT_HOST}...`);
	var client = Mqtt.connect(options.host, options);
	
	// Notify when connected
	client.on('connect', () => {
		console.log('Connected to MQTT broker.');
	});
	
	// Subscribe to the topics you want, just as you would using MQTT.js
	client.subscribe('homey/devices/#');
	
	// Perform specific tasks on each topic
	client.on('homey/devices/:device/onoff', (message, args) => {
		console.log(`Lightbulb/socket ${args.device} is set to state ${message}`);
	});
	
	client.on('homey/devices/:device/alarm_motion', (message, args) => {
		console.log(`Sensor ${args.device} is set to state ${message}`);
	});

	// Another example just to show how to use parameters
	client.on('homey/devices/:device/:capability', (message, args) => {
		console.log(`Device ${args.device}:${args.capability} is set to ${message}`);
	});

	// You may receive messages as usual...
	client.on('message', (topic, message) => {
		console.log(`Message ${message.toString()} from topic ${topic}`);
	});
}

example();
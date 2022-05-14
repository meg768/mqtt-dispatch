#!/usr/bin/env node

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

	console.log(`Connecting to MQTT broker ${process.env.MQTT_HOST}...`);

	// Connect to MQTT broker as usual.
	let client = Mqtt.connect(options.host, options);

	// Modify MQTT client to dispatch messages
	client = MqttDispatch(client);

	// Notify when connected
	client.on('connect', () => {
		console.log('Connected to MQTT broker.');
	});
	
	// Subscribe to the topics you want
	client.subscribe('homey/devices/#');
	client.subscribe('example/#');
	
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

	// Another example just to show how to use parameters
	client.on('example/topic/:name/:foo', (message, args) => {
		console.log(`${message} ${JSON.stringify(args)}`);
	});

}

example();
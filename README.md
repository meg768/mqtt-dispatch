# mqtt-dispatch
A super simple dispatcher for MQTT messages.

## Source code

```javascript

var Events = require("events");

class MqttDispatch extends Events {

	constructor(mqtt) {

		super();

		this.topics = [];

		function isMatch(A, B) {
			var args = {};

			var A = A.split('/');
			var B = B.split('/');
		
			if (A.length != B.length)
				return null;
		
			for (let i = 0; i < A.length; i++) {
				if (A[i] != B[i]) {
					let match = B[i].match(/^:([a-zA-Z0-9]+)$/);
		
					if (!match)
						return null;
		
					args[match[1]] = A[i];
				}
			}

			return args;
		}

		mqtt.on('message', (topic, message) => {
	
			message = message.toString();

			this.topics.forEach((item) => {
				let match = isMatch(topic, item);

				if (match) {
					this.emit(item, message, match);
				}
			});
		});		
	}

	on(topic, fn) {
		this.topics.push(topic);
		super.on(topic, fn);
	}
}


```

### Actual working example

```javascript

var Pushover = require('pushover-notifications');
var MqttDispatch = require('mqtt-dispatch');

require('dotenv').config();

class App {

	constructor() {
		var yargs = require('yargs');

		yargs.usage('Usage: $0 [options]')

		yargs.option('help',     {alias:'h', describe:'Displays this information'});
		yargs.option('host',     {describe:'Specifies MQTT host', default:process.env.MQTT_HOST});
		yargs.option('password', {describe:'Password for MQTT broker', default:process.env.MQTT_PASSWORD});
		yargs.option('username', {describe:'User name for MQTT broker', default:process.env.MQTT_USERNAME});
		yargs.option('port',     {describe:'Port for MQTT', default:process.env.MQTT_PORT});

		yargs.help();
		yargs.wrap(null);

		yargs.check(function(argv) {
			return true;
		});

		this.argv = yargs.argv;
		this.config = {};
	}


	pushover(payload) {
		return new Promise((resolve, reject) => {
			try {
				console.log('Sending payload:', payload);

				var {user, token, ...message} = payload;
				var push = new Pushover({user:user, token:token});

				push.send(message, (error, result) => {
					if (error)
						reject(error);
					else
						resolve();
				});
			}
			catch (error) {
				reject(error);
			}

		});
	}


	run() {
		try {

			var MQTT = require('mqtt');
			var argv = this.argv;

			this.mqtt = MQTT.connect(argv.host, {username:argv.username, password:argv.password});
			this.dispatch = new MqttDispatch(this.mqtt);
					
			this.mqtt.on('connect', () => {
				console.log('Connected');
			});

			this.dispatch.on('pushover/:name', (message, args) => {
				try {
					if (message != '') {
						message = JSON.parse(message);
						console.log('CONFIG', message, args);
						this.config[args.name] = message;
	
					}
				}
				catch (error) {
					console.error(error);					
				}
			});

			this.dispatch.on('pushover/:name/send', (message, args) => {
				try {
					if (message != '') {
						message = JSON.parse(message);
						console.log('SEND', message, args);
						this.pushover({...this.config[args.name], ...message});
	
					}
				}
				catch (error) {
					console.error(error);					
				}

			});
			this.mqtt.subscribe('pushover/#');
			
			this.mqtt.on('message', (topic, message) => {
	
				message = message.toString();
				console.log(`${topic}:${message.toString()}`);
			});			
			console.log(this.argv);
		}
		catch(error) {
			console.error(error.stack);
		}

	}

}

let app = new App();
app.run();

```
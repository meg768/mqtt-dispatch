# mqtt-dispatch
mqtt-dispatch

## Super simple dispatch for MQTT

´´´javascript

var Events = require("events");

class MqttDispatch extends Events {

	constructor(mqtt) {

		super();

		this.topics = [];

		function isMatch(topicA, topicB) {
			var args = {};

			var pathA = topicA.split('/');
			var pathB = topicB.split('/');
		
			if (pathA.length != pathB.length)
				return null;
		
			for (let i = 0; i < pathA.length; i++) {
				if (pathA[i] != pathB[i]) {
					let match = pathB[i].match(/^:([a-zA-Z0-9]+)$/);
		
					if (!match)
						return null;
		
					args[match[1]] = pathA[i];
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

module.exports = MqttDispatch;

´´´
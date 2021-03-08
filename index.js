
var MQTT = require('mqtt');

function connect(host, options) {

	var mqtt = MQTT.connect(host, options);
	var callbacks = {};

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

		for (const [item, fn] of Object.entries(callbacks)) {
			let match = isMatch(topic, item);

			if (match) {
				fn(message, match);
			}
		  
		}
	});

	mqtt.dispatch = function(topic, fn) {
		callbacks[topic] = fn;
	}

	return mqtt;
}

module.exports.connect = connect
module.exports.MqttClient = MQTT.MqttClient
module.exports.Client = MQTT.MqttClient
module.exports.Store = MQTT.Store


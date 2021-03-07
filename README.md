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
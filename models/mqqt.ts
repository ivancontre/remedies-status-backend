import mqtt from 'mqtt';

export default class Mqtt {
	mqttClient: mqtt.MqttClient | null;
	host: string;
	username: string;
	password: string;
	constructor() {
		this.mqttClient = null;
		this.host = 'mqtt://broker.emqx.io:1883';
		this.username = 'ivcontre'; // mqtt credentials if these are needed to connect
		this.password = 'ivan28998988';
	}
  
  connect() {
    // Connect mqtt with credentials (in case of needed, otherwise we can omit 2nd param)
    this.mqttClient = mqtt.connect(this.host, { username: this.username, password: this.password });

    // Mqtt error calback
    this.mqttClient.on('error', (err) => {
      	console.log(err);
      	this.mqttClient?.end();
    });

    // Connection callback
    this.mqttClient.on('connect', () => {
      	console.log(`mqtt client connected`);
    });

    // mqtt subscriptions
    this.mqttClient.subscribe('entrada/01', {qos: 0});

    // When a message arrives, console.log it
    this.mqttClient.on('message', function (topic, message) {
      	console.log(message.toString());
    });

    this.mqttClient.on('close', () => {
      	console.log(`mqtt client disconnected`);
    });
  }

  // Sends a mqtt message to topic: mytopic
  sendMessage(message: string) {
	  console.log(message)
    this.mqttClient?.publish('entrada/01', message);
  }
}
// DAW Control - server code
//
//-------------------------------configurable params---------------------------------
const midi_daw_out = "DAWOUT"
const midi_daw_in = "DAWIN"
const debug = false;

//-------------------------------internal params-------------------------------------
const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);

// comment below needed for inclusion of relative statements in HTML file (public dir)
app.use(express.static(__dirname + '/public'));

// setup client file
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/index.html');
});

// start server (port 80 is the standard port, if different port is used, use <ip_address>:<port number>, so for istance for port 3000 you can use: 127.168.1.1:3000
server.listen(80, () => {
  console.log('navigate to http://localhost/ or <ip_address>');
});

//----------------------------------setup MIDI INPUT----------------------------------------

const midi = require('midi');

// Set up a new input.
const input = new midi.Input();

// Scan through available input ports.
var connected = false;
for (let i = 0; i < input.getPortCount(); i++) {
	if (input.getPortName(i).startsWith(midi_daw_out)) {
		input.openPort(i);
		input.ignoreTypes(false, false, false);			// filter for (Sysex, Timing, Active Sensing) -> set false to receive message
		connected = true;
		if (debug) 
			console.log("INPUT: " + input.getPortName(i));
	}
}
if (connected == false)
	console.error("Could not connect to midi interface, check midi_daw_out variable in server.js");

//----------------------------------setup MIDI OUTPUT----------------------------------------

// Set up a new output.
const output = new midi.Output();

// Scan through available output ports.
connected = false;
for (let i = 0; i < output.getPortCount(); i++) {
	// console.log(output.getPortName(i));
	if (output.getPortName(i).startsWith(midi_daw_in)) {
		output.openPort(i);
		connected = true;
		if (debug) 
			console.log("OUTPUT: " + output.getPortName(i));
	}
}
if (connected == false)
	console.error("Could not connect to midi interface, check midi_daw_in variable in server.js");

//-------------------------------------callback functions------------------------------------
// callback function for information received from client (to be sent out as MIDI)
io.on('connection', (socket) => {
  socket.on('midi', (msg) => {
	output.sendMessage(IntToMidi(msg));
	if(debug)
		console.log(IntToMidi(msg));
  });
});

// Configure a callback for MIDI messages received.
input.on('message', (deltaTime, message) => {
  if(debug)
	console.log(`m: ${message} d: ${deltaTime}`);

  if (message.length == 3) {					// standard MIDI message
	io.emit('midi', MidiToInt(message));
  }
});

//-------------------------------------useful functions------------------------------------

function MidiToInt(message) {
  return (message[0] << 16) + (message[1] << 8) + message[2];
}

function IntToMidi(x) {
	var message = [0, 0, 0];
	message[0] = (x >> 16) & 255;
	message[1] = (x >> 8) & 255;
	message[2] = (x) & 255;
	return message;
}

const net = require('net')

const { commands, messages } = require('./constants')

const HOST = 'localhost'
const PORT = 1337
const DELIMITER = ':'

// Set up TCP server
const server = net.createServer((socket) => {
	// Set data enconding to utf8
	socket.setEncoding('utf8')

	socket.on('error', err => console.log('An error occurred on the socket :/ ', err))

	// Handle commands sent to the TCP server
	socket.on('data', (data) => {
		let [ command, ...args ] = data.split(DELIMITER)
		command = command.replace(/\n/, '')

		switch (command) {
			case commands.help:
				socket.write(messages.help)
				break;
			default:
				socket.write(messages.commandNotFount(command))
		}
	})
})

server.on('error', err => console.log('An error occurred on the server ! ', err))

server.listen(PORT, HOST)

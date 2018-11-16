const net = require('net')

const NotesManager = require('./notesManager');
const { config, commands, messages } = require('./constants')

const notesManager = new NotesManager(config.NOTES_PATH)

function stripNewLine(str) {
	return str.replace(new RegExp('\n$'), '')
}

// Set up TCP server
const server = net.createServer((socket) => {
	// Set data enconding to utf8
	socket.setEncoding('utf8')

	socket.on('error', err => console.log('An error occurred on the socket :/ ', err))

	// Handle commands sent to the TCP server
	socket.on('data', (data) => {
		// Get data and strip last new line to avoid creating files with \n in name
		let [ command, ...args ] = data.split(config.DELIMITER).map(stripNewLine)

		switch (command) {
			case commands.help: {
				socket.write(messages.help)
				break
			}
			case commands.create: {
				const [ docId ] = args

				notesManager.create(docId)
					.then(() => socket.write(messages.success))
					.catch(() => socket.write(messages.error))
				break
			}
			case commands.get: {
				const [ docId, format ] = args

				notesManager.get(docId, format)
					.then(data => socket.write(data))
					.catch(() => socket.write(messages.notFound))
				break
			}
			default:
				socket.write(messages.commandNotFount(command))
		}
	})
})

server.on('error', err => console.log('An error occurred on the server ! ', err))

server.listen(config.PORT, config.HOST)

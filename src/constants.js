const commands = {
	help: 'help',
	create: 'create',
	get: 'get',
	delete: 'delete',
	insert: 'insert',
}

const messages = {
  commandNotFount: command => `Command '${command}' not found.\nTry '${commands.help}' to see available commands.\n\n`,
	help: `
===================================
=== Welcome to Slite CLI - 1986 ===
===================================

Examples of commands:
* Create a doc: \`create:doca\`
* Insert content: \`insert:doca:0:Hello\`
* Insert content at the end: \`insert:doca: world!\`
* Toggle format at position: \`format:doca:0:5:bold\`
* Get the doc in text or md: \`get:doca:text\`
* Delete content: \`delete:doca\`

Your turn ✨
===================================
`
}

module.exports = {
  commands,
  messages,
}
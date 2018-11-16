const fs = require('fs')

class NotesManager {
  constructor(notesPath = './myNotes') {
    this.path = notesPath

    if (!fs.existsSync(this.path)){
      fs.mkdirSync(this.path);
    }
  }

  create(docId) {
    return new Promise((resolve, reject) => fs.writeFile(
      `${this.path}/${docId}`,
      '\r\n',
      (err, data) => err ? reject(err) : resolve(data))
    )
  }
}

module.exports = NotesManager;

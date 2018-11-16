const fs = require('fs')

class NotesManager {
  constructor(notesPath = './myNotes') {
    this.path = notesPath
    this.initFolder()
  }

  initFolder() {
    if (!fs.existsSync(this.path)){
      fs.mkdirSync(this.path);
    }
  }

  create(docId) {
    this.initFolder()
    return new Promise((resolve, reject) => fs.writeFile(
      `${this.path}/${docId}`,
      '\r\n',
      (err, data) => err ? reject(err) : resolve(data))
    )
  }

  get(docId, format = 'txt') {
    return new Promise((resolve, reject) => fs.readFile(
      `${this.path}/${docId}`,
      (err, data) => err ? reject(err) : resolve(data))
    )
  }

  delete(docId, format = 'txt') {
    return new Promise((resolve, reject) => fs.unlink(
      `${this.path}/${docId}`,
      (err, data) => err ? reject(err) : resolve(data))
    )
  }
}

module.exports = NotesManager;

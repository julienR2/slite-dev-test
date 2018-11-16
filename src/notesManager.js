const fs = require('fs')

const EMPTY = '\r\n'

class NotesManager {
  constructor(notesPath = './myNotes') {
    this.path = notesPath
    this.initFolder()
  }

  initFolder() {
    if (!fs.existsSync(this.path)){
      fs.mkdirSync(this.path)
    }
  }

  create(docId) {
    this.initFolder()
    return new Promise((resolve, reject) => fs.writeFile(
      `${this.path}/${docId}`,
      EMPTY,
      (err, data) => err ? reject(err) : resolve(data)
    ))
  }

  get(docId, format = 'txt') {
    return new Promise((resolve, reject) => fs.readFile(
      `${this.path}/${docId}`,
      (err, data) => err ? reject(err) : resolve(data)
    ))
  }

  delete(docId, format = 'txt') {
    return new Promise((resolve, reject) => fs.unlink(
      `${this.path}/${docId}`,
      (err, data) => err ? reject(err) : resolve(data)
    ))
  }

  insert(docId, position, text) {
    const path = `${this.path}/${docId}`

    return new Promise((resolve, reject) => fs.readFile(
      path,
      (err, data) => {
        if (err) {
          reject(err)
        }

        try {
          const fileContent = data.toString()
          // absPosition is the position where to insert the new content or the last position before empty string
          const absPosition = position || (fileContent.length - EMPTY.length)
          // Get content after position
          const content = fileContent.substring(absPosition)

          const buffer = new Buffer(text + content)

          // Open file with the rights to modify it
          const file = fs.openSync(path, 'r+')
          // Write the new content at absPosition
          fs.writeSync(file, buffer, 0, buffer.length, absPosition)
          fs.closeSync(file)

          resolve()
        } catch (e) {
          console.log('err', e)
          reject(e)
        }
      }
    ))
  }
}

module.exports = NotesManager

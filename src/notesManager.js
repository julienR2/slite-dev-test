const fs = require('fs')

const EMPTY = '\r\n'

const EMPTY_FILE = {
  content: EMPTY,
  styles: {},
}

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

  getPath(docId) {
    return `${this.path}/${docId}.json`
  }

  create(docId, obj = EMPTY_FILE) {
    this.initFolder()
    return new Promise((resolve, reject) => fs.writeFile(
      this.getPath(docId),
      JSON.stringify(obj),
      err => err ? reject(err) : resolve()
    ))
  }

  get(docId, format = 'txt') {
    return new Promise((resolve, reject) => fs.readFile(
      this.getPath(docId),
      (err, data) => {
        if (err) {
          reject(err)
        }

        try {
          const parsedData = JSON.parse(data)
          resolve(parsedData.content)
        } catch (e) {
          reject(e)
        }
      }
    ))
  }

  delete(docId, format = 'txt') {
    return new Promise((resolve, reject) => fs.unlink(
      this.getPath(docId),
      err => err ? reject(err) : resolve()
    ))
  }

  insert(docId, position, text) {
    const path = this.getPath(docId)

    return new Promise((resolve, reject) => fs.readFile(
      path,
      (err, data) => {
        if (err) {
          reject(err)
        }

        try {
          const parsedData = JSON.parse(data)
          const currentText = parsedData.content
          // absPosition is the position where to insert the new content or the last position before empty string
          const absPosition = position || (currentText.length - EMPTY.length)
          // Get content before and after position
          const contentBefPos = currentText.substring(0, absPosition)
          const contentAftPos = currentText.substring(absPosition)

          parsedData.content = contentBefPos + text + contentAftPos

          this.create(docId, parsedData)
            .then(resolve)
            .catch(reject)
        } catch (e) {
          reject(e)
        }
      }
    ))
  }
}

module.exports = NotesManager

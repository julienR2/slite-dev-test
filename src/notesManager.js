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

  getParsedData(docId) {
    return new Promise((resolve, reject) => fs.readFile(
      this.getPath(docId),
      (err, data) => {
        if (err) {
          reject(err)
        }

        try {
          const parsedData = JSON.parse(data)
          resolve(parsedData)
        } catch (e) {
          reject(e)
        }
      }
    ))
  }

  get(docId, format = 'txt') {
    return this.getParsedData(docId)
      .then(({ content }) => content)
  }

  delete(docId, format = 'txt') {
    return new Promise((resolve, reject) => fs.unlink(
      this.getPath(docId),
      err => err ? reject(err) : resolve()
    ))
  }

  insert(docId, position, text) {
    const path = this.getPath(docId)

    return this.getParsedData(docId)
      .then(({ content, ...data }) => {
        // absPosition is the position where to insert the new content or the last position before empty string
        const absPosition = position || (content.length - EMPTY.length)
        // Get content before and after position
        const contentBefPos = content.substring(0, absPosition)
        const contentAftPos = content.substring(absPosition)

        return this.create(docId, {
          content: contentBefPos + text + contentAftPos,
          ...data,
        })
      })
  }
}

module.exports = NotesManager

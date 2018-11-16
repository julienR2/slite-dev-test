const fs = require('fs')

const EMPTY = '\r\n'

const EMPTY_FILE = {
  content: EMPTY,
  styles: {},
}

const FORMATS = {
  txt: { bold: '', italic: '' },
  md: { bold: '**', italic: '*' },
}

// Helper function to return array of object keys
function mapObject(obj) {
  const props = Object.keys(obj)
  const result = new Array(props.length)

  props.forEach((key, index) => {
    result[index] = key
  })
  return result
}

// Helper function for inserting text in string at a position
function insertAtPosition(str, position, text) {
  const strBefPos = str.substring(0, position)
  const strAftPos = str.substring(position)
  return strBefPos + text + strAftPos
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
    let formatMap = FORMATS[format] || FORMATS.txt

    return this.getParsedData(docId)
      .then(({ content, styles }) => {
        let parsedContent = content
        let insertions = {}

        // Get all the style insertions that have to be made
        for (let style in styles) {
          if (styles.hasOwnProperty(style) && !!formatMap[style]) {
            styles[style].forEach(([ start, end ]) => {
              // Add every style insertion as a 'key: value' pair (e.g: 12: '**')
              insertions = {
                ...insertions,
                [start]: formatMap[style],
                [end]: formatMap[style],
              }
            })
          }
        }

        // We have now all the style insertions described in the 'insertion' object
        // Let's get the keys, corresponding to the position of the insertions,
        // sort them by descending order and apply them to our content
        // this way each insertion won't affect the next one
        mapObject(insertions).sort().reverse().forEach((pos) => {
          parsedContent = insertAtPosition(parsedContent, pos, insertions[pos])
        })

        return parsedContent
      })
  }

  delete(docId) {
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

        return this.create(docId, {
          ...data,
          content: insertAtPosition(content, absPosition, text)
        })
      })
  }

  format(docId, start, end, style) {
    const path = this.getPath(docId)

    return this.getParsedData(docId)
      .then(({ styles, ...data }) => this.create(docId, {
          ...data,
          styles: {
            ...styles,
            [style]: [
              [start, end],
              ...styles[style] || [],
            ]
          },
        })
      )
  }
}

module.exports = NotesManager

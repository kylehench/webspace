const noteListReducer = (noteList, action) => {
  let idx
  switch (action.type) {

    case "SET":
      return action.payload

    case "CREATE":
      return [action.payload, ...noteList]

    case "UPDATE":
      // requires action.id (note id in database)
      // identifies index of note in noteList, updates value, and moves to top of list
      const newNoteList = noteList.slice()
      for (idx=0; idx<newNoteList.length; idx++) {
        if (newNoteList[idx].id===action.id) break
      }
      const note = {...newNoteList.splice(idx, 1)[0], ...action.payload}
      newNoteList.splice(0, 0, note)
      return newNoteList
      
      case "DELETE":
        // requres action.id (note id in database)
        return noteList.filter(note => note.id !== action.id)

    case "CLEAR":
      return []

    default:
      return noteList
  }
}

export default noteListReducer
const noteListReducer = (noteList, action) => {
  let idx
  switch (action.type) {

    case "SET":
      return action.payload

    case "UPDATE_ONE":
      // requires action.id (note id in database)
      // identifies index of note in noteList, updates value, and moves to top of list
      for (idx=0; idx<noteList.length; idx++) {
        if (noteList[idx].id===action.id) break
      }
      const note = {...noteList.splice(idx, 1)[0], ...action.payload}
      noteList.splice(0, 0, note)
      return noteList
      
      case "DELETE_ONE":
        // requres action.id (note id in database)
        for (idx=0; idx<noteList.length; idx++) {
          if (noteList[idx].id===action.id) break
        }
        noteList.splice(idx, 1)
        return noteList

    case "CLEAR":
      return []

    default:
      return noteList
  }
}

export default noteListReducer
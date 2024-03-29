const widgetsReducer = (widgetsList, action) => {

  switch (action.type) {

    case "SET":
      return action.payload.map(widget => ({
        ...widget,
        reactId: widget.reactId || Math.random().toString().slice(2,14)
      }))

    case "CREATE":
      return [...widgetsList, {...action.payload, reactId: action.payload.reactId || Math.random().toString().slice(2,14)}]
    
    case "UPDATE":
      // requires action.reactId to identify widget, and action.payload with updated values
      widgetsList = widgetsList.map(widget => {
        if (widget.reactId===action.reactId) {
          widget = {...widget, ...action.payload}
        }
        return widget
      })
      localStorage.setItem('webspace_widgets', JSON.stringify(widgetsList))
      return widgetsList

    case "DELETE":
      // requres action.reactId
      return widgetsList.filter(widget => widget.reactId !== action.reactId)

    case "DELETE_BY_NOTE_ID":
      // note: will delete all widgets with same note ID
      return widgetsList.filter(widget => widget.noteId !== action.noteId)

    case "CLEAR":
      return []
  
    default:
      return widgetsList

  }
}

export default widgetsReducer
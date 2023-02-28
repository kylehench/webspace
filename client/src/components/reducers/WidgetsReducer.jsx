const widgetsReducer = (widgetsList, action) => {

  switch (action.type) {

    case "CREATE":
      return [...widgetsList, {...action.payload, reactId: Math.random()}]
    
    case "UPDATE":
      // requires action.index to identify widget, and action.payload with updated values
      return widgetsList.map(widget => {
        if (widget.index===action.index) {
          widget = {...widget, ...action.payload}
        }
        return widget
      })

    case "DELETE":
      // requres action.index
      return widgetsList.filter((widget, i) => i !== action.index)

    case "CLEAR":
      return []
  
    default:
      return widgetsList

  }
}

export default widgetsReducer
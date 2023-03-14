const layoutReducer = (layout, action) => {
  switch(action.type) {

    case "SET":
      return action.payload

    case "CREATE":
      return [...layout, {
        x: 0,
        y: 1000,
        w: 1,
        h: 1,
        ...action.payload,
      }]

    default:
      return layout
  }
}

export default layoutReducer
const Contexts = (state = [], action) => {
    switch (action.type) {
      case 'SET_CONTEXTS':
        return [
          ...action.contexts
        ]
      default:
        return state
    }
  }
  
  export default Contexts
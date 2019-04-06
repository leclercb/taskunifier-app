const Filters = (state = [], action) => {
    switch (action.type) {
      case 'SET_FILTERS':
        return [
          ...action.filters
        ]
      default:
        return state
    }
  }
  
  export default Filters
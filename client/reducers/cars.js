export const cars = (state = [], action) => {
  switch(action.type) {
    case 'ADD_CAR':
      return [...state, {...action.car}]
    case 'REMOVE_CAR':
      return state.filter(car => car.id != action.id)
    case 'UPDATE_CAR':
      return state.map(car =>
        car.id == action.id ? {...car, ...action.car, id: action.id} : car
      );
    default:
      return state;
  }
}
export default cars;
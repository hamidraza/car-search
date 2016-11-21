export const add = (car = {}) => {
  return {
    type: 'ADD_CAR',
    car
  }
}

export default {
  add
}
import CarActions from './cars';
describe('actions', () => {
  it('should create an action to add a car', () => {
    const car = {brand: 'ford'};
    const expectedAction = {
      type: 'ADD_CAR',
      car
    }
    expect(CarActions.add(car)).toEqual(expectedAction);
  });
});

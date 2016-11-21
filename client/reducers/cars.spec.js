import carReducer from './cars';
describe('cars reducer', () => {
  it('should return the initial state', () => {
    expect(
      carReducer(undefined, {})
    ).toEqual(
      []
    );
  });
});

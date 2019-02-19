import R from 'ramda'

export default (state = {}, action) =>
  action.type === 'UPDATE'
    ? action.updaters.reduce(
        (state, [path, fn]) =>
          R.over(R.lensPath(path), fn, state),
        state)
    : state
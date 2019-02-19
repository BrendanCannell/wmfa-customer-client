// export default set = obj => ({type: 'SET', ...obj})
import R from 'ramda'

export default set = obj => ({type: 'UPDATE', updaters: R.toPairs(obj).map(([k, v]) => [[k], () => v])})
import R from 'ramda'

export default locationGrantedAndroid = permissions =>
  !R.path(['location', 'ios'], permissions)
  && R.path(['location', 'status'], permissions) === 'granted'
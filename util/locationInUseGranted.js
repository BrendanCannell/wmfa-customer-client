import R from 'ramda'
import locationGrantedAndroid from "./locationGrantedAndroid"

export default locationInUseGranted = permissions =>
  ['always', 'whenInUse'].includes(R.path(['location', 'ios', 'scope'], permissions))
  || locationGrantedAndroid(permissions)
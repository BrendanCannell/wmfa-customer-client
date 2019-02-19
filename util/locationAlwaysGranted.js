import R from 'ramda'
import locationGrantedAndroid from "./locationGrantedAndroid"

export default locationAlwaysGranted = permissions =>
  R.path(['location', 'ios', 'scope'], permissions) === 'always'
  || locationGrantedAndroid(permissions)
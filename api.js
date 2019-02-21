import Frisbee from 'frisbee'

export default new Frisbee({
  baseURI: "https://evening-brushlands-53491.herokuapp.com/api",
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json'
  }
})
import Frisbee from 'frisbee'

export default new Frisbee({
  baseURI: "http://192.168.1.80:3001/api",
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json'
  }
})
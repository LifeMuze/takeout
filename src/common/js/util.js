export function urlParse () {
  let url = window.location.search
  let obj = {}
  let reg = /[?&][^?&]+[^?&]+/g
  let arr = url.match(reg)

  if (arr) {
    arr.forEach((item) => {
      let tmpArr = item.substr(1).split('=')
      let key = tmpArr[0]
      let value = tmpArr[1]
      obj[key] = value
    })
  }
  return obj
}

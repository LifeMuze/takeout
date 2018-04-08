export function formatDate (date, fmt) {
  if (/(y+)/.test(fmt)) {
    fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length))
  }

  let oReg = {
    'M+': date.getMonth() + 1,
    'd+': date.getDate(),
    'h+': date.getHours(),
    'm+': date.getMinutes(),
    's+': date.getSeconds()
  }
  for (let key in oReg) {
    if (new RegExp(`(${key})`).test(fmt)) {
      let str = oReg[key] + ''
      fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? str : addZero(str))
    }
  }
  return fmt
}

function addZero (str) {
  return ('00' + str).substr(str.length)
}

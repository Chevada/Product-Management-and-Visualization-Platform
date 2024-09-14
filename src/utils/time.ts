// 封装函数，获取当前的时段
export const getTime = () => {
  let message = ''
  let hours = new Date().getHours()
  if (hours >= 6 && hours <= 9) {
    message = '早上'
  } else if (hours <= 14) {
    message = '上午'
  } else if (hours <= 18) {
    message = '下午'
  } else {
    message = '晚上'
  }
  return message
}

export const getRequsetTime = () => {
  let nowTime = Date.parse(new Date())
  let oldTime = wx.getStorageSync('oldTime')
  let leadTime = oldTime ? nowTime - oldTime : wx.setStorageSync('oldTime', JSON.stringify(nowTime))
  let isRequest = false
  isRequest = leadTime ? leadTime >= 300 ? true : false : true
  leadTime >= 300 && isRequest && wx.setStorageSync('oldTime', JSON.stringify(nowTime))
  console.log("5分钟时间请求为:", isRequest);
  return isRequest
}
export const loop = function* (list, max = Infinity) {
  let iIndex = wx.getStorageSync('musicMode') ? ['icon-danquxunhuan', "icon-24gl-repeat2", "icon-suijisenlin"].indexOf(JSON.parse(wx.getStorageSync('musicMode'))) : 1

  for (let i = iIndex; i < max; i++) {
    //循环索引
    yield list[i % list.length];
  }
}
// 箭头函数保证跟的唯一性，不被调用污染

let gen = loop(['icon-danquxunhuan', "icon-24gl-repeat2", "icon-suijisenlin"])
export const patternGenerator = function () {
  return gen.next().value

}




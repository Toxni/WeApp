function formatTime(date) {
  var year = date.getFullYear()
  var month = date.getMonth() + 1
  var day = date.getDate()

  var hour = date.getHours()
  var minute = date.getMinutes()
  var second = date.getSeconds()


  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

function formatNumber(n) {
  n = n.toString()
  return n[1] ? n : '0' + n
}

function getMarkers(data) {
  var markers = []
  if (!!data.user) {
    for (var i = 0; i < data.user.length; i++) {
      var temp = {
        latitude: data.user[i].latitude,
        longitude: data.user[i].longitude,
        name: data.user[i].nickname,
        desc: data.user[i].state,
      }
      markers.push(temp)
    }
  }
  return markers
}

function getCovers(data) {
  var covers = []
  if (!!data.user) {
    for (var i = 0; i < data.user.length; i++) {
      var temp = {
        latitude: data.user[i].latitude,
        longitude: data.user[i].longitude,
        iconPath: '../images/N' + data.user[i].order + '.png',
        rotate: 0,
      }
      covers.push(temp)
    }
  }
  return covers
}
function json2Form(json) {  
    var str = [];  
    for(var p in json){  
        str.push(encodeURIComponent(p) + "=" + encodeURIComponent(json[p]));  
    }  
    return str.join("&");  
}  

module.exports = {
  formatTime: formatTime,
  getMarkers: getMarkers,
  getCovers: getCovers,
  json2Form:json2Form,  
}
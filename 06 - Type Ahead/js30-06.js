

//資料來源
const req_url = 'https://raw.githubusercontent.com/donma/TaiwanAddressCityAreaRoadChineseEnglishJSON/master/AllData.json';

//今日主角
var my_data = []

//取資料時用
var call_data_obj = {

  //拿資料過程
  assign_data: function (url) {
    //console.log(typeof url)
    if (typeof url !== 'string' || url === undefined || url.length === 0) return false
    fetch(url)
      .then(function (res) {
        //console.log(res.ok) //true is http 200
        var data = res.json()
        return data
      })
      .then(function (data) {
        my_data = Object.assign([], data)
        return data
      })
  }

}

//過濾有符合的
function filter_data(keyword, data) {

    var result_data = data.filter(function (poet) {
      //console.log(item)
      const regex = new RegExp(keyword, 'gi') //正則找出匹配的
      const item_name = poet.CityName //臺北市

      let areaNames = []
      for (let i = 0; i < poet.AreaList.length; i++) {        
        areaNames.push(
          `
          ${poet.AreaList[i].AreaName}${poet.AreaList[i].ZipCode}
          -${poet.AreaList[i].AreaEngName}
          `
        )
      } //中正區......
      let areanames_string = areaNames.join('')

      //console.log(regex)
      const name_ok = item_name.match(regex)
      const en_name_ok = poet.CityEngName.match(regex)
      const areas_ok = areanames_string.match(regex)

      return name_ok || en_name_ok || areas_ok

    })

    return result_data
  }


//關鍵文字做高亮處理
function highlight_html(keyword, data) {

  let html = data.map(item => {
    // 替換高亮的標籤
    const name = item.CityName.replaceAll(keyword, '<span class="highlight-keyword">' + keyword + '</span>')
    const en = item.CityEngName.replaceAll(keyword, '<span class="highlight-keyword">' + keyword + '</span>')
    const areacount = item.AreaList.length;
    //ZipCode, AreaName, AreaEngName
    let areaNames = []
    for (let i = 0; i < item.AreaList.length; i++) {
      areaNames.push(`${item.AreaList[i].AreaName}${item.AreaList[i].ZipCode}-${item.AreaList[i].AreaEngName}`)
    }
    let areaNamesString = areaNames.join('、')
    const area_html = areaNamesString.replaceAll(keyword, '<span class="highlight-keyword">' + keyword + '</span>')
    // 構造 HTML 值
    return `
        <li class="list-group-item">
          <span class="poet">${name}-${en}</span>
          <span class="title">${area_html}</span>
          <span class="badge">${areacount}</span>
        </li>
      `;
  }).join('')

  return html

}

//取得輸入的關鍵字
function get_keyword() {

  let search = document.querySelector('#search')
  let keyword = search.value
  if (keyword.indexOf('台') >= 0) keyword = keyword.replaceAll('台', '臺')
  return keyword

}

//字串取代
String.prototype.replaceAll = function (string, replaceValue) {
  return this.split(string).join(replaceValue);
}

//綁定在畫面
function bind_html(html) {
  const suggestions = document.querySelector('#suggestions')
  suggestions.innerHTML = html;
}

//取得資料
call_data_obj.assign_data(req_url)

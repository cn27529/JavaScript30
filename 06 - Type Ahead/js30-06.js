//let req_url = 'https://raw.githubusercontent.com/cn27529/JavaScript30/master/06%20-%20Type%20Ahead/TangPoetry.json';
  let req_url = 'https://raw.githubusercontent.com/donma/TaiwanAddressCityAreaRoadChineseEnglishJSON/master/AllData.json';
  const my_data = []

  //讀取資料的物件
  var JSON_data_API = {

    get: function (url) {

      console.log('閞始呼叫get取資料')

      fetch(url)
        .then(function (res) {
          //console.log(res.ok) //true is http 200
          var json_data = res.json()
          return json_data
        })
        .then(function (data) {
          Object.assign(my_data, data)
          console.log('fetch的資料己response')
        })
        .then(function (data) {
          console.log('my_data己assign ok')
        })
    }

  }

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
    console.log('經過filter後筆數' + result_data.length)
    return result_data
  }

  function highlight_html(keyword, data) {

    console.log('將關鍵文字做高亮處理')

    const regex = new RegExp(keyword, 'gi') //正則找出匹配的
    let html = data.map(poet => {
      // 替換高亮的標籤
      const name = poet.CityName.replace(regex, '<span class="highlight-keyword">' + keyword + '</span>')
      const en = poet.CityEngName.replace(regex, '<span class="highlight-keyword">' + keyword + '</span>')
      const areacount = poet.AreaList.length;
      //ZipCode, AreaName, AreaEngName
      let areaNames = []
      for (let i = 0; i < poet.AreaList.length; i++) {
        areaNames.push(poet.AreaList[i].AreaName + '' + poet.AreaList[i].ZipCode + '-' + poet.AreaList[i].AreaEngName)
      }
      let areaNamesString = areaNames.join('、')
      const area_html = areaNamesString.replace(regex, '<span class="highlight-keyword">' + keyword + '</span>')
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

  function get_input_keyword(value) {
    console.log('取得輸入的關鍵字')
    let keyword = ''
    if (typeof value !== 'undefined') keyword = value
    const regex = new RegExp('台', 'gi') //正則找出匹配的
    keyword = keyword.replace(regex,'臺')    
    return keyword
  }
  
  function display_data() {

    let keyword = get_input_keyword(this.value) //取得輸入的關鍵字值
    const res = filter_data(keyword, my_data) //filter有符合的資料
    const html = highlight_html(keyword, res) //關鍵文字做高亮處理
    //console.log(html);
    suggestions.innerHTML = html; //顯示於畫面
    console.log('-------------結束-------------')

  }
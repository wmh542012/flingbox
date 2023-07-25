/**
 * getStorage
 * @param {Array | String} str
 * @return {object} object
 */
export function getStorage(str) {
  if (typeof str == "string") {
    try {
      return JSON.parse(localStorage.getItem(str));
    } catch (error) {
      return localStorage.getItem(str);
    }
  }

  let data = {};
  if (typeof str == "object") {
    for (let i = 0; i < str.length; i++) {
      data[str[i]] = localStorage.getItem(str[i]);
      try {
        data[str[i]] = JSON.parse(data[str[i]]);
      } catch (error) { }
    }
  }
  return data;
}
/**
 * setStorage
 * @param {object} object
 */
export function setStorage(object = {}) {
  try {
    for (let i in object) {
      object[i] = JSON.stringify(object[i]);
      localStorage.setItem(i, object[i]);
    }
  } catch (error) {
    console.log(error);
  }
}
/**
export function removeStorage(str) {
 *
 * @param {Array | String} str
 */

export function removeStorage(str) {
  if (typeof str == "string") return localStorage.removeItem(str);
  if (typeof str == "object") {
    for (let i = 0; i < str.length; i++) {
      localStorage.removeItem(str[i]);
    }
  }
}

/**
 *setCooke
 * @param {object} object
 */
export function setCooke(object) {
  try {
    for (let i in object) {
      object[i] = JSON.stringify(object[i]);
      document.cookie = `${i}=${object[i]}`;
    }
  } catch (error) {
    console.log(error);
  }
}

/**
 *
 * @param {Array} key
 * @returns {object} object
 */

export function getCookie(key = []) {
  let cookieList = {};
  for (let i = 0; i < key.length; i++) {
    let str = `(^| )${key}=([^;]*)(;|$)`;
    let reg = new RegExp(str);
    let s = document.cookie.match(reg);
    if (s) cookieList[key[i]] = s[2];
  }
  return cookieList;
}
/**
 * @name setSessionStorage
 * @param {object} param
 */
export function setSessionStorage(param = {}) {
  for (let i in param) {
    if (typeof param[i] == "object") {
      try {
        param[i] = JSON.stringify(param[i]);
      } catch (error) { }
    }
    sessionStorage.setItem(i, param[i]);
  }
}
/**
 * @name getSessionStorage
 * @param {Array} key
 * @returns
 */
export function getSessionStorage(key = []) {
  let session = {};
  for (let i = 0; i < key.length; i++) {
    session[key[i]] = sessionStorage.getItem(key[i]);

    try {
      session[key[i]] = JSON.parse(session[key[i]]);
    } catch (error) { }
  }
  return session;
}

/**
 * @name removeSessionStorage
 * @param {String} key
 */
export function removeSessionStorage(key) {
  if (key) {
    switch (true) {
      case "forEach" in key:
        key.forEach((i) => {
          sessionStorage.removeItem(i);
        });
        break;
      default:
        sessionStorage.removeItem(key);
        break;
    }
  } else {
    sessionStorage.clear();
  }
}



/**
 * 获取随机数
 * @param {Number} min
 * @param {Number} max
 * @returns
 */
export function getRandom(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * 输入内容校验
 * @param {String} key
 * @param {String} str
 * @returns Boolean
 */
export function verifyInner(key = "", str) {
  switch (key) {
    /**
     * 返回手机号匹配结果
     */
    case "phone":
      return /^((13[0-9])|(14[5,7])|(15[0-3,5-9])|(17[0,3,5-8])|(18[0-9])|166|198|199|(147))\d{8}$/.test(
        str
      );
    /**
     * 返回密码匹配结果
     */
    case "passwrod":
      return true;
    /**
     * 返回验证码匹配
     */
    case "Captcha":
      return /^\d{6}$/.test(str);
    default:
      break;
  }
}

/**
 * 解析首页 html 字符串
 * @param {string} str 
 * @returns {Array}
 */
export async function TrainerListAnalysis(str) {
  if (/ERROR_CODE/g.test(str)) {
    ElMessage.error(str)
    return []
  }

  let allItm = HTML_Content_detection(str)
  if (!allItm || !allItm.length) return
  let data = []

  for (let i = 0; i < allItm.length; i++) {
    let img = allItm[i].querySelector('img').src
    let title = allItm[i].querySelector('.post-title a')
    data[i] = {
      itm_id: parseInt(allItm[i].id.replace('post-', '')),
      itm_img: img,
      itm_preview: [img],
      itm_title: title.innerHTML,
      itm_details_url: title.href,
      itm_details_info: allItm[i].querySelector('.entry p')?.textContent || "--",
      current: 0
    }
  }
  return data
}

/**
 * 解析详情页 html 字符串
 * @param {string} str 
 * @returns {Array}
 */
export async function TrainerDetailsAnalysis(str) {
  if (/ERROR_CODE/g.test(str)) {
    ElMessage.error(str)
    return []
  }

  let temp = document.createElement("div");
  temp.innerHTML = str;
  // let Updating_file_id = temp.querySelector('#title_id')?.innerHTML

  let zip = temp.querySelectorAll('.zip');
  let rar = temp.querySelectorAll('.rar')
  // let exe = temp.querySelector('.exe')

  let data = {
    preview_img: temp.querySelector('.size-full')?.src,
    Downloads: []
  }

  let Downloads = [];

  if (zip.length) {
    Downloads = Downloads.concat(push_downloads(zip, [], {
      type: 'Standalone',
      file_type: 'zip',
      current: 0
    }))
  }

  if (rar.length) {
    Downloads = Downloads.concat(push_downloads(zip, [], {
      type: 'Standalone',
      file_type: 'rar',
      current: 0
    }))
  }

  data.Downloads = Downloads;


  console.log(data)
  return data
}

/**
 * 检测预期内容
 * @param {string} str 
 * @returns {HTMLElement}
 */
function HTML_Content_detection(str) {
  if (!str.length) return []
  let template = document.createElement('div');
  template.innerHTML = str
  let needless = template.querySelector('#post-482')
  if (needless) {
    needless.remove()
    needless = null
  }
  let allItm = template.querySelectorAll('article');
  if (!allItm.length) return []
  return allItm
}

function add_download_temp(node) {
  return {
    file_url: node.querySelector('a')?.href,
    file_name: node.querySelector('a')?.title,
    date: node.querySelector('.attachment-date')?.innerHTML,
    size: node.querySelector('.attachment-size')?.innerHTML,
    downloads: node.querySelector('.attachment-downloads')?.innerHTML
  }
}

/**
 * 获取修改器安装目录
 * @returns {String}
 */
export function getTrainerPath() {
  return getStorage("$TrainerPath") || window.__defaultTrainers
}

/** 文件分类获取 */
function push_downloads(f_s = [], arr = [], ops = {}) {
  for (let i = 0; i < f_s.length; i++) {
    arr.push({
      ...ops,
      ...add_download_temp(f_s[i])
    })
  }
  return arr
}

/**
 * 给数据每一项添加三种状态 0 初始 1 进行中 2 已完成
 * @param {Array} data 
 * @returns 
 */
export function AddDataState(data = [], key = "NULL") {
  for (let i = 0; i < data.length; i++) {
    if (typeof data[i] != "object") return data
    data[i][key] = 0
  }
  return data
}


/**
 * 获取 AcsToken
 * @returns 
 */
export function getAcsToken() {
  if (!window?.Paris) return
  return new Promise((function (t, e) {
    window.Paris.getAcsInstance((function (e, n) {
      if (e) {
        var r = e.code || 600;
        t(r)
      } else
        n.getSign((function (e, n) {
          if (e) {
            var r = e.code || 600;
            t(r)
          } else
            t(n)
        }
        ))
    }
    ))
  }
  ))
}

export function analysisBaiDuFnYitoken({ data, headers }) {
  let fragIndex = data.indexOf("window['common']")
  if (fragIndex === -1) return null
  data = data.slice(fragIndex)
  let iL = 'token:'
  let token = data.slice(data.indexOf(iL) + iL.length, data.indexOf(','))
    .replaceAll("'", "")
    .trim()
  let cok = headers['set-cookie'].split(';')[0]
  document.cookie = cok
  cok = cok.slice(cok.indexOf('=') + 1)
  window.BdFanYi_tk = token
  window.BdFanYi_ck = cok

}
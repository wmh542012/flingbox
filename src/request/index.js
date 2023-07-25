import { invoke } from '@tauri-apps/api/tauri'
import { fetch as rust_fetch, Body } from '@tauri-apps/api/http';
import { getSign } from '../utils/BDfyApi'
import { getAcsToken, getCookie } from '../utils/'
/** flyy */
const base_trainer_list = "https://flingtrainer.com/"
/** 百度翻译 */
const base_baidu_fanyi = "https://fanyi.baidu.com"

export async function APIgetTrainerList(url = '') {
    return invoke('get_trainer_list', { path: base_trainer_list + url })
}



/**
 * 获取百度翻译的 BAIDUID_BFESS 
 * @returns 
 */
export async function APIgetBaiDuFnYiCookieID() {
    return await rust_fetch(base_baidu_fanyi, {
        responseType: 2
    })
}


/**
 * 百度翻译语言类型检测
 * @param {String} str 
 * @returns 
 */
export async function APIBDlangdetect(str) {
    if (!str) return
    let path = "/langdetect"
    return await rust_fetch(base_baidu_fanyi + path, {
        method: 'POST',
        body: Body.form({
            query: str
        })
    })
}

/**
 * 
 * @param {*} param0 
 * @returns 
 */
export async function APIBDtextTranslation({ str }) {
    // const itime = `1689859597657_${+new Date}${baidufyToken}`
    let path = "/v2transapi?from=zh&to=en"
    let sign = getSign(str)
    let ts = (+new Date).toString()
    let cookie = 'BAIDUID_BFESS=' + window.BdFanYi_ck
    let AcsToken = await getAcsToken()
    let token = window.BdFanYi_tk

    return await rust_fetch(base_baidu_fanyi + path, {
        method: 'POST',
        headers: {
            "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
            "Cookie": cookie,
            "Acs-Token": AcsToken,
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36",
            "Host": "fanyi.baidu.com",
            "Origin": "https://fanyi.baidu.com",
            "Referer": "https://fanyi.baidu.com/",
            "Sec-Ch-Ua": "'Not.A/Brand';v='8', 'Chromium';v='114', 'Google Chrome';v='114'",
            "Sec-Ch-Ua-Mobile": "?0",
            "Sec-Ch-Ua-Platform": "Windows",
            "Sec-Fetch-Dest": "empty",
            "Sec-Fetch-Mode": "cors",
            "Sec-Fetch-Site": "same-origin"
        },
        body: Body.form({
            from: 'zh',
            to: 'en',
            query: str,
            transtype: "realtime",
            simple_means_flag: "3",
            sign,
            token: token,
            domain: "common",
            ts: ts
        })
    })

}

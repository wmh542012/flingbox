use std::fs::{create_dir_all, metadata, read_to_string, write, DirBuilder, File};
use std::io::prelude::*;
use std::process::Command;
use std::sync::mpsc::channel;
use std::thread;

#[tokio::main]
pub async fn get_targ_data(url: &str, add_func: i32) -> Result<String, Box<dyn std::error::Error>> {
    println!(">>> {:?}", url);
    let resp = reqwest::get(url).await?;

    let doc_inner = resp.text().await?;
    let init_text = "<article";
    let end_text = "</article>";
    // let verify = "no-js";

    let html_init = doc_inner.find(init_text).unwrap();

    let html_end = doc_inner.rfind(end_text).expect("html_end err") + end_text.len();

    let need_inner = doc_inner.get(html_init..html_end).unwrap();

    match add_func {
        1 => Ok(additional_func1(&doc_inner, need_inner)),
        0 => Ok(String::from(need_inner)),
        _ => Ok(String::from(need_inner)),
    }

    // Ok(String::from(need_inner))
}
/** 获取首页修改器列表 */
#[tauri::command]
pub async fn get_trainer_list(path: String) -> Result<String, ()> {
    // let trainer_list_url = "https://flingtrainer.com/category/trainer/";
    let (sender, receiver) = channel();
    let _get_inner_thread = thread::spawn(move || {
        let inner = get_targ_data(&path, 0);

        match inner {
            Ok(v) => sender.send(v).unwrap(),
            Err(e) => {
                let mut err_msg = String::from("ERROR_CODE：");
                err_msg.push_str(&e.to_string());

                sender.send(err_msg).unwrap();
            }
        }
    });

    match _get_inner_thread.join() {
        Ok(_) => Ok(receiver.recv().unwrap()),
        Err(_) => Ok("ERROR".to_string()),
    }

    // Ok(receiver.recv().unwrap())
}
/** 获取详情文件列表 */
#[tauri::command]
pub async fn get_trainer_details(url: &str) -> Result<String, ()> {
    let details_url = String::from(url);
    let (sender, receiver) = channel();
    let _get_inner_thread = thread::spawn(move || {
        let inner = get_targ_data(&details_url, 0);

        match inner {
            Ok(v) => sender.send(v).unwrap(),
            Err(e) => {
                let mut err_msg = String::from("ERROR_CODE：");
                err_msg.push_str(&e.to_string());

                sender.send(err_msg).unwrap();
            }
        }
    });

    match _get_inner_thread.join() {
        Ok(_) => match receiver.recv() {
            Ok(msg) => Ok(msg),
            Err(e) => {
                println!(">>> {:?} ", e);
                Ok(e.to_string())
            }
        },
        Err(_) => todo!(),
    }
}

/** 获取详情附加内容 */
fn additional_func1(source: &str, team: &str) -> String {
    let text = String::from("title_id=");
    let targ_text = source.find(&text);
    match targ_text {
        Some(_) => {
            let mut index = targ_text.unwrap() + &text.len();

            let mut temp = String::from(team.to_owned() + "<div id='title_id'>");
            loop {
                match source.get(index..index + 1).unwrap().parse::<i32>() {
                    Ok(v) => {
                        let number_id = &v.to_string();
                        temp.push_str(number_id)
                    }
                    Err(_) => {
                        temp.push_str("</div>");
                        return temp;
                    }
                }
                index += 1;
            }
        }
        None => String::from(team),
    }
}

/** 写入文件 */
#[tokio::main]
async fn write_network_file(url: &str, path: &str) -> Result<(), Box<dyn std::error::Error>> {
    println!(" {:?} ", path);
    println!(" {:?} ", url);
    let resp = reqwest::get(url).await?;
    let byt = resp.bytes().await?;
    let _ = write(path, byt);

    Ok(())
}
/** 请求文件 */
#[tauri::command]
pub async fn request_file(url: String, path: String) -> String {
    let (sender, receiver) = channel();

    let _get_inner_thread = thread::spawn(move || {
        let r = write_network_file(&url, &path);

        match r {
            Ok(_) => sender.send("1".to_string()).unwrap(),
            Err(e) => sender.send(e.to_string()).unwrap(),
        }
    });

    match receiver.recv() {
        Ok(msg) => msg,
        Err(e) => e.to_string(),
    }
}

#[tauri::command]
pub async fn get_http_innre() -> String {
    let resp = reqwest::get("https://fanyi.baidu.com/").await;
    let df = String::from("0");
    match resp {
        Ok(d) => {
            let t = d.text().await;
            match t {
                Ok(s) => s,
                Err(_) => df,
            }
        }
        Err(_) => df,
    }
}

/** 创建文件夹 */
#[tauri::command]
pub fn create_dir(path: String) -> String {
    let r = create_dir_all(&path);
    match r {
        Ok(_) => "1".to_string(),
        Err(e) => e.to_string(),
    }
}

/** 检查指定文件 */
#[tauri::command]
pub async fn get_file_attributes(path: String) -> String {
    let attr = metadata(&path);
    match attr {
        Ok(_) => "1".into(),
        Err(_) => "0".into(),
    }
}

/** 读取文件 */
#[tauri::command]
pub async fn get_file_inner(path: String) -> String {
    match read_to_string(&path) {
        Ok(d) => d,
        Err(e) => e.to_string(),
    }
}

/** 写入文件 */
#[tauri::command]
pub async fn write_file(path: String, inner: String) -> String {
    let r = write(&path, &inner);
    match r {
        Ok(_) => "1".into(),
        Err(e) => e.to_string(),
    }
}

/** 打开一个文件或者文件夹 */
#[tauri::command]
pub fn open_targ(path: String) {
    let mut comd = String::from("start ");
    comd.push_str(&path);
    Command::new("cmd")
        .args(["/C", &comd])
        .output()
        .expect("failed to execute process");
}

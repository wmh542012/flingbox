// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

pub mod bin;
use crate::bin::{
    create_dir, get_file_inner, get_http_innre, get_trainer_details, get_trainer_list, open_targ,
    request_file, write_file,
};
// Learn more about Tauri commands at https://tauri.app/v1/guides/features/command
#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello, {}! You've been greeted from Rust!", name)
}

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![
            greet,
            get_trainer_list,
            get_trainer_details,
            request_file,
            create_dir,
            get_file_inner,
            write_file,
            open_targ,
            get_http_innre
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}

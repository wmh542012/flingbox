<script setup>
import { reactive, onMounted } from 'vue';
import { Search, Setting, Files, CloseBold, QuestionFilled } from '@element-plus/icons-vue'
import { getTrainerPath, setStorage, TrainerListAnalysis } from '@/utils'
import { APIgetTrainerList, APIBDlangdetect, APIBDtextTranslation } from '@/request/index'

import { open } from '@tauri-apps/api/dialog';
import { globalEmit } from '@/store/index'

const Data = reactive({
    input: '',
    setting_dialog: false,
    Trainer_path: getTrainerPath(),
    newPath: null,
    inputdisabled: false,
    ShowSearchHint: false,
    Interval: null,
    Lang: '',
    trans_result: ''
})

function open_setting() {
    Data.dialogKey++
    Data.setting_dialog = !Data.setting_dialog
}

async function setTrainerPath() {
    const filePath = await open({
        directory: true
    });
    if (!filePath) return
    Data.Trainer_path = filePath
    Data.newPath = filePath
}

function updateDir() {
    if (Data.newPath) {
        setStorage({ "$TrainerPath": Data.newPath })
        Data.Trainer_path = getTrainerPath()
    }
    Data.setting_dialog = !Data.setting_dialog
}

function closed() {
    Data.Trainer_path = getTrainerPath()
}

async function startSearch() {
    if (!Data.input) return
    Data.inputdisabled = true
    globalEmit('startSearch')


    if (Data.Lang && Data.Lang == 'zh') {
        let result = await APIBDtextTranslation({ str: Data.input })
        console.log(result)
        let dst = result?.data?.trans_result?.data?.[0]?.dst
        if (!dst) return ElMessage.error('翻译接口不可用，请使用英文输入搜索内容')
        Data.trans_result = dst
    } else {
        Data.trans_result = Data.input
    }

    globalEmit('SearchPages', Data.trans_result)

    APIgetTrainerList(`?s=${Data.trans_result}`).then((str) => {
        if (str == "ERROR") {
            globalEmit('SearchResult', [])
            Data.ShowSearchHint = true
            Data.inputdisabled = false
            return
        }
        TrainerListAnalysis(str).then((data) => {
            globalEmit('SearchResult', data)
            Data.ShowSearchHint = true
            Data.inputdisabled = false
        })

    })
}

function Closeresult() {
    Data.ShowSearchHint = false

    Data.trans_result = ''
    Data.Lang = ''
    globalEmit('Closeresult')
    globalEmit('SearchPages', '')
}

function inputLangDetect(text) {
    clearTimeout(Data.Interval)
    Data.Interval = setTimeout(() => {
        APIBDlangdetect(Data.input).then((r) => {
            Data.Lang = r?.data?.lan
        })
    }, 500)
}



</script>

<template>
    <div class="mian-header">
        <el-text class="SearchHint" v-show="Data.ShowSearchHint">
            <el-text class="mx-1">
                <el-icon class="Closeresult" @click="Closeresult">
                    <CloseBold />
                </el-icon></el-text>
            &nbsp;<el-text class="mx-1" type="danger">{{ Data.trans_result }}</el-text>&nbsp;
            的搜索结果
            <el-tooltip class="box-item" effect="dark" content="不支持中文搜索，内容包含中文将被自动翻译" placement="bottom">
                <el-icon class="Closeresult">
                    <QuestionFilled />
                </el-icon>
            </el-tooltip>
        </el-text>

        <div class="input-group">
            <el-input class="" v-model="Data.input" placeholder="Please input" clearable :disabled="Data.inputdisabled"
                @input="inputLangDetect">
            </el-input>
            <el-button :icon="Search" circle @click="startSearch" :disabled="Data.inputdisabled" />
        </div>
        <el-button type="primary" class="Setting" :icon="Setting" circle @click="open_setting" />
    </div>

    <el-dialog v-model="Data.setting_dialog" title="Warning" width="60%" align-center @closed="closed">
        <template #header>设置</template>

        <div class="Trainer-path">
            <div class="pathName">修改器下载目录：{{ Data.Trainer_path }}</div>
            <el-button @click="setTrainerPath" type="warning" :icon="Files" circle />
        </div>

        <template #footer>
            <span class="dialog-footer">
                <el-button @click="updateDir">确定</el-button>
            </span>
        </template>
    </el-dialog>
</template>

<style scoped>
.mian-header {
    box-sizing: border-box;
    height: 50px;
    width: 100%;
    background-color: #dfd8d0;
    display: flex;
    align-items: center;
    justify-content: end;
    padding: 0 10px;
    overflow: hidden;
}

.input-group {
    box-sizing: border-box;
    display: flex;
    align-items: center;
    width: 300px;
    background-color: #fff;
    padding: 2px;
    border-radius: 5px;
}

.Setting {
    margin: 0 20px;
}

.Trainer-path {
    display: flex;
    align-items: center;
    justify-content: space-between;
}

.mian-header :deep() .el-input__wrapper {
    box-shadow: none;
}

.SearchHint {
    margin: 0 10px;
}

.Closeresult {
    cursor: pointer;
}

.pathName {
    overflow: hidden;
    white-space: nowrap;
    max-width: 400px;
    text-overflow: ellipsis;
}
</style>

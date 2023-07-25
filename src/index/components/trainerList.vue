<script setup>
import { Picture as IconPicture, Download, Timer, Picture, Loading, Files } from '@element-plus/icons-vue'
import { reactive, onMounted, ref } from 'vue';
import { invoke } from '@tauri-apps/api/tauri'
import { TrainerDetailsAnalysis, getTrainerPath, AddDataState } from '@/utils/index'
import { globalEmit, emitImp } from '@/store/index'


import { join } from '@tauri-apps/api/path';

const HISTORY = {}

const props = defineProps({
    Trainer_list: Array,
})

let T_scrollbar = ref()

const Data = reactive({
    itm_dialog: false,
    dw_loading: false,
    itm_details: {
        Downloads: []
    },
    DownloadKey: null,
    GetMoreSum: 1,
    scrollbarHeight: 0,
    isSearch: '',
    _A: emitImp('SearchPages'),
})

Data._A = function (str) {
    Data.isSearch = str ? `?s=${str}` : ""
}

function Download_file(itm) {
    Data.DownloadKey = itm.itm_id
    Data.itm_dialog = !Data.itm_dialog
    if (Data.DownloadKey in HISTORY) {
        Data.itm_details = HISTORY[Data.DownloadKey]
        return
    }
    Data.dw_loading = true;
    invoke('get_trainer_details', { url: itm.itm_details_url }).then((str) => {
        TrainerDetailsAnalysis(str).then((data) => {
            Data.dw_loading = false;
            Data.itm_details = data;
            Data.itm_details.id = itm.itm_id
            HISTORY[Data.DownloadKey] = Data.itm_details
        }).catch(() => {
            ElMessage.error("发生异常")
            Data.dw_loading = false;
        })
    })
}

async function handleDownload({ $index }, url) {
    let c = Data.itm_details.Downloads[$index]
    if (c.current == 1) return
    c.current = 1
    let path = await join(getTrainerPath(), `${c.file_name}.${c.file_type}`)
    console.log(path)
    let r = await invoke("create_dir", { path: getTrainerPath() })
    if (r == 1) {
        let fr = await invoke("request_file", { url, path })
        if (fr == 1) {
            ElMessage.success(`${c.file_name}`)
            c.current = 2
            globalEmit('updateTrainerList', Data.DownloadKey, 2)
            return
        }
    }

    ElMessage.error(r)
    c.current = 0
    globalEmit('updateTrainerList', Data.DownloadKey, 0)

}

function setTooltip(str) {
    switch (str) {
        case '-':
            return '无法获取'
        default:
            return str
    }
}


function touchGround({ scrollTop }, e) {
    if (window.trainerListBf) return
    Data.GetMoreSum++
    globalEmit('NextPage', Data.GetMoreSum, Data.isSearch)

}

function uploads() {
    globalEmit('GetMore')
}

function open_path() {
    invoke("open_targ", { path: getTrainerPath() })
}

function touchGroundShow() {
    if (props.Trainer_list.length > 0 && props.Trainer_list.length % 15 === 0) return true
    return false
}

function DownloadShow(code) {
    switch (code) {
        case 0:
            return true
        case 1:
            return true
        default:
            return false
    }
}

onMounted(() => {

})


</script>

<template>
    <div class="trainerList" ref="T_scrollbar">
        <el-scrollbar>
            <el-empty v-show="!props.Trainer_list.length">
                <el-button type="primary" @click="uploads">重新加载</el-button>
            </el-empty>
            <div class="trainer-itm" v-for="itm in props.Trainer_list" :key="itm.itm_id">
                <el-image :src="itm.itm_img" :preview-src-list="itm.itm_preview" :z-index="1" class="trainer-itm-img">
                    <template #error>
                        <div class="image-slot">
                            <el-icon><icon-picture /></el-icon>
                        </div>
                    </template>
                </el-image>
                <div class="itm-details">
                    <div class="itm-title">{{ itm.itm_title }}</div>
                    <div class="itm-author">作者：FLiNG</div>
                    <div class="itm-Updated">说明：{{ itm.itm_details_info }}</div>
                </div>
                <div class="itm-handle">
                    <el-button type="success" :icon="Download" circle @click="Download_file(itm)" />
                    <el-button v-show="itm.current == 2" @click="open_path" type="warning" :icon="Files" circle />
                </div>
            </div>
            <el-divider v-show="touchGroundShow()"> <span class="divider" @click="touchGround">下一页</span>
            </el-divider>
        </el-scrollbar>
    </div>


    <el-dialog v-model="Data.itm_dialog" title="Warning" width="80%" align-center id="downloading">
        <template #header>文件下载</template>

        <el-skeleton :rows="5" animated :loading="Data.dw_loading">
            <template #default>
                <div class="details_preview">预览图：
                    <el-image :src="Data.itm_details.preview_img" :preview-src-list="[Data.itm_details.preview_img]"
                        :z-index="1" class="trainer-itm-img">
                        <template #error>
                            <div class="image-slot">
                                <el-icon><icon-picture /></el-icon>
                            </div>
                        </template>
                    </el-image>
                </div>
                <div class="pathName">下载到：{{ getTrainerPath() }}</div>
                <el-table :data="Data.itm_details.Downloads" style="width: 100%" max-height="400"
                    cell-class-name="set_row_style">

                    <el-table-column label="文件名">
                        <template #default="scope">
                            <el-tooltip class="box-item" effect="dark" :content="setTooltip(scope.row.file_name)"
                                placement="top-start">
                                {{ scope.row.file_name }}
                            </el-tooltip>
                        </template>
                    </el-table-column>

                    <el-table-column label="更新时间">
                        <template #default="scope">
                            <el-tooltip class="box-item" effect="dark" :content="setTooltip(scope.row.date)"
                                placement="top-start">
                                {{ scope.row.date }}
                            </el-tooltip>


                        </template>
                    </el-table-column>

                    <el-table-column label="文件类型">
                        <template #default="scope">
                            <el-tooltip class="box-item" effect="dark" :content="setTooltip(scope.row.file_type)"
                                placement="top-start">
                                {{ scope.row.file_type }}
                            </el-tooltip>

                        </template>
                    </el-table-column>

                    <el-table-column label="文件大小">
                        <template #default="scope">
                            <el-tooltip class="box-item" effect="dark" :content="setTooltip(scope.row.size)"
                                placement="top-start">
                                {{ scope.row.size }}
                            </el-tooltip>

                        </template>
                    </el-table-column>

                    <el-table-column label="下载数量">
                        <template #default="scope">
                            <el-tooltip class="box-item" effect="dark" :content="setTooltip(scope.row.downloads)"
                                placement="top-start">
                                {{ scope.row.downloads }}
                            </el-tooltip>

                        </template>
                    </el-table-column>

                    <el-table-column label="文件标签">
                        <template #default="scope">
                            <el-tooltip class="box-item" effect="dark" :content="setTooltip(scope.row.type)"
                                placement="top-start">
                                {{ scope.row.type }}
                            </el-tooltip>

                        </template>
                    </el-table-column>

                    <el-table-column label="下载链接">
                        <template #default="scope">
                            <el-button v-show="DownloadShow(scope.row.current)" :disabled="scope.row.current == 1"
                                size="small" type="danger" @click="handleDownload(scope, scope.row.file_url)">
                                <span>下载</span>
                                <el-icon v-show="scope.row.current == 1" class="is-loading">
                                    <Loading />
                                </el-icon>
                            </el-button>
                        </template>
                    </el-table-column>

                </el-table>
            </template>
        </el-skeleton>
    </el-dialog>
</template>

<style scoped>
.trainerList {
    width: 100%;
    height: 100%;
}

.trainer-itm {
    box-sizing: border-box;
    height: 80px;
    width: 100%;
    background-color: rgb(245 245 245);
    /* padding: 2px; */
    display: flex;
    justify-content: space-between;
    margin-bottom: 10px;
}

.itm-details {
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
    flex: 1;
}

.trainer-itm-img {
    width: 70px;
    height: 100%;
    border-radius: 5px;
    margin-right: 10px;
}

.itm-title {
    font-size: 20px;
    font-weight: bold;
    margin-bottom: 12px;
}

.itm-author,
.itm-Updated {
    font-size: 14px;
    color: #aba7a7;
}

.itm-Updated {
    font-size: 12px;
}

.image-slot {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 100%;
    background-color: rgb(219 219 219);

}

.itm-handle {
    box-sizing: border-box;
    display: flex;
    align-items: center;
    padding: 5px;
    min-width: 50px;
}

.details_preview {
    height: 18px;
    display: flex;
    align-items: center;
    margin: 5px 0;
}

.details_preview .image-slot {
    width: 70px;
}

.divider {
    cursor: pointer;
}

.pathName {
    overflow: hidden;
    white-space: nowrap;
    max-width: 600px;
    text-overflow: ellipsis;
}
</style>

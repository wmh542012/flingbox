<script setup>
import trainerList from './components/trainerList.vue'
import { ref, reactive, onMounted } from 'vue'
import { invoke } from '@tauri-apps/api/tauri'
import { TrainerListAnalysis, AddDataState } from '@/utils/index'
import { emitImp } from '@/store/index'
import { APIgetTrainerList } from '@/request/index'

let DATASECTION = null /** 数据暂存 */

let TrainerLoading = ref(false)
const tabPosition = ref('left')
const Data = reactive({
    trainerList: [],
    test: [{ a: 1 }, { a: 2 }],
    _B: emitImp('NextPage'),
    G: emitImp('updateTrainerList'),
    _A: emitImp('GetMore'),
    _C: emitImp('SearchResult'),
    _D: emitImp('Closeresult'),
    _E: emitImp('startSearch')
})

Data.G = function (id, state) {
    for (let i = 0; i < Data.trainerList.length; i++) {
        if (Data.trainerList[i].itm_id == id) {
            Data.trainerList[i].current = state
            return
        }
    }
}

Data._A = function () {
    get_trainerList()
}
Data._B = function (index, isSearch = '') {
    let url = index > 1 ? `/page/${index}/${isSearch}` : ''
    get_trainerList(url)
}
Data._C = function (data) {
    DATASECTION = Data.trainerList
    Data.trainerList = data
    TrainerLoading.value = false

}
Data._D = function () {
    Data.trainerList = DATASECTION
    DATASECTION = null
    TrainerLoading.value = false

}
Data._E = function () {
    TrainerLoading.value = true
}


function tabs_click(TabIndex) {
    switch (TabIndex.index * 1) {
        case 0:
            // get_trainerList()
            break;

        default:
            break;
    }
}



function get_trainerList(url = '') {
    console.log('正在获取数据')
    TrainerLoading.value = true
    if (window.trainerListBf) return
    APIgetTrainerList(url).then((str) => {
        TrainerListAnalysis(str).then((data) => {
            Data.trainerList = data
            window.trainerListBf = false
            console.log(data)
            TrainerLoading.value = false
        })
    }).catch(() => {
        window.trainerListBf = false
        TrainerLoading.value = false
    })
    window.trainerListBf = true

}



</script>

<template>
    <div class="mian-inner">
        <el-tabs :tab-position="tabPosition" class="main-tabs" type="border-card" @tab-click="tabs_click">
            <el-tab-pane label="修改器大全" v-loading="TrainerLoading">
                <trainerList :Trainer_list="Data.trainerList"></trainerList>

            </el-tab-pane>
            <!-- <el-tab-pane label="我的下载">

            </el-tab-pane> -->

            <!-- <el-tab-pane label="热键设置">

            </el-tab-pane> -->

        </el-tabs>
    </div>
</template>

<style scoped>
.mian-inner {
    width: 100%;
    height: 100%;
    background-color: aqua;
    overflow: hidden;
    /* display: flex; */
}

.main-tabs {
    width: 100%;
    height: 100%;
    display: flex;
}

.main-tabs :deep() .el-tabs__header {
    width: 150px;
}

.main-tabs :deep() .el-tabs__nav {
    width: 100%;
    z-index: 0;
}

.main-tabs :deep() .el-tabs__item {
    display: flex;
    justify-content: space-around;
}

.main-tabs :deep() .el-tabs__content {
    flex: 1;
}

.main-tabs :deep() .el-tab-pane {
    height: 100%;
}
</style>

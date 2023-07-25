<script setup>
import main_header from './components/header.vue'
import main_inner from './index/index.vue'

import { ref } from "vue";


let box_inner = ref(null)



</script>


<template>
    <main_header></main_header>
    <div class="main-context">
        <main_inner></main_inner>
    </div>
</template>

<style scoped>
.main-context {
    width: 100%;
    height: calc(100% - 50px);
    overflow: hidden;
}
</style>

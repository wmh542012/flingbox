import { reactive, ref } from 'vue'

const store = reactive({

})

export default store

// const store_impl = reactive({

// })

const __core = {}


/**
 * 传入一个由  emitImp  函数注册的函数名
 * @param {String} funcName 
 * @param {Option}  any
 * @returns 
 */
export function globalEmit(funcName) {
    if (!funcName) return;
    if (funcName in __core) {
        __core[funcName].value(...[...arguments].splice(1))
    } else {
        console.warn("未找到函数>>>" + funcName);
    }
}

/**
 * 注册一个可被 globalEmit 函数调用
 * @param {String} funcName 
 * @returns 
 */
export function emitImp(funcName) {
    if (!funcName) return;
    if (funcName in __core) {
        console.warn(funcName + "<< 已经存在，原有的函数将被覆盖")
    }
    __core[funcName] = ref(funcName);

    return __core[funcName]

}

/**
 * 
 * @param {String} funcName 
 * @param {Option}  any
 * @returns 
 */
export function globalEmitAll(funcName) {
    if (!funcName) return;
    let symbols = Object.getOwnPropertySymbols(__core).filter(itm => itm.toString() == `Symbol(${funcName})`)
    if (!symbols.length) return console.warn("未找到函数>>>" + funcName);
    for (let i = 0; i < symbols.length; i++) {
        if (typeof __core[symbols[i]] == "function") {
            __core[itm].value(...[...arguments].splice(1))
        }
    }

}

/**
 * 
 * @param {String} funcName 
 * @returns 
 */
export function emitImpAll(funcName) {
    if (!funcName) return;
    let rep = Symbol(funcName)
    __core[rep] = ref(funcName);
    return __core[rep]
}


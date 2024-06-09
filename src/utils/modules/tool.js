// 将ref转换为Dom
const refToDom = ref => {
    return ref.value
}

// 获取Ref在视口的位置、尺寸
const getRefRect = ref => {
    return refToDom(ref).getBoundingClientRect()
}

// 获取Dom在视口的位置、尺寸
const getDomRect = dom => {
    return dom.getBoundingClientRect()
}

// 通过ref设置css样式
const cssRef = (ref, prop, val) => {
    refToDom(ref).style.setProperty(prop, val)
}

// 设置dom的css样式
const css = (dom, prop, val) => {
    dom.style.setProperty(prop, val)
}

// 频率控制器
class RateCtrl{
    constructor(){
        this.throttleId = null
        this.debounceId = null
    }

    // 节流
    throttle = (func, space=200) => {
        if (this.throttleId === null) {
            this.throttleId = setTimeout(() => {
                func()
                this.throttleId = null
            }, space)
        }
    }

    // 防抖
    debounce = (func, space=200) =>{
        if (this.debounceId) clearTimeout(this.debounceId)
        this.debounceId = setTimeout(()=>{
            func()
        }, space)
    }
}

export default {refToDom, css, getDomRect, RateCtrl, getRefRect, cssRef}


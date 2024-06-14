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

const getRect = obj => {
    if (obj instanceof Element) {
        getDomRect(obj)
    } else if (obj.__v_isRef === true) {
        getRefRect(obj)
    } else {
        throw new Error('无法操作该对象')
    }
}

// 通过ref设置css样式
const cssRef = (ref, prop, val) => {
    refToDom(ref).style.setProperty(prop, val)
}

// 设置dom的css样式
const cssDom = (dom, prop, val) => {
    dom.style.setProperty(prop, val)
}

const css = (obj, prop, val) => {
    if (obj instanceof Element) {
        cssDom(obj, prop, val)
    } else if (obj.__v_isRef === true) {
        cssRef(obj, prop, val)
    } else {
        throw new Error('无法操作该对象')
    }
}

// 延迟设置css属性
const cssDomDelay = (obj, prop, val) => {
    setTimeout(() => {
        css(obj, prop, val)
    }, 10)
}

// 获取ref的css样式
const getCssRef = (ref, prop) => {
    return window.getComputedStyle(refToDom(ref)).getPropertyValue(prop)
}

// 获取dom的css样式
const getCssDom = (dom, prop) => {
    return window.getComputedStyle(dom).getPropertyValue(prop)
}

// 获取css样式
const getCss = (obj, prop) => {
    if (obj instanceof Element) {
        getCssDom(obj, prop)
    } else if (obj.__v_isRef === true) {
        getCssRef(obj, prop)
    } else {
        throw new Error('无法操作该对象')
    }
}

// 设置Dom属性
const setAttrDom = (dom, prop, val) => {
    dom.setAttribute(prop, val)
}

// 根据ref对象设置Dom属性
const setAttrRef = (ref, prop, val) => {
    refToDom(ref).setAttribute(prop, val)
}

// 设置属性
const setAttr = (obj, prop, val) => {
    if (obj instanceof Element) {
        setAttrDom(obj, prop, val)
    } else if (obj.__v_isRef === true) {
        setAttrRef(obj, prop, val)
    } else {
        throw new Error('无法操作该对象')
    }
}

// 批量设置css样式
const setStyle = (obj, style) => {
    let value = ''
    for (let attr in style) {
        value += `${attr}: ${style[attr]}; `
    }
    setAttr(obj, 'style', value)
}

// 样式监听器
class CssListener {
    constructor(config = {
        dom: null, prop: {}, func: () => {
        }, space: 200
    }) {
        this.initVal(config)
    }

    initVal = (config) => {
        if (!config.dom instanceof HTMLElement) throw new Error('无效对象')

        this.obj = config.dom
        this.prop = config.prop
        this.func = config.func
        this.space = config.space

        this.record = {}
        this.timeId = null
    }

    create_listener = () => {
        this.timeId = setInterval(() => {
            const tempProps = window.getComputedStyle(this.obj)
            let flag = false
            for (let i = 0; i < this.prop.length; i++) {
                const p = this.prop[i]
                if (this.record[p] !== tempProps[p]) {
                    flag = true
                    this.record[p] = tempProps[p]
                }
            }
            if (flag) this.func()
        }, this.space)
    }

    update = (config) => {
        this.initVal(config)
    }

    start_listener = () => {
        if (this.timeId) this.clear_listener()
        this.create_listener()
    }

    clear_listener = () => {
        clearInterval(this.timeId)
    }
}

// 频率控制器
class RateCtrl {
    constructor() {
        this.throttleId = null
        this.debounceId = null
    }

    // 节流
    throttle = (func, space = 200) => {
        if (this.throttleId === null) {
            this.throttleId = setTimeout(() => {
                func()
                this.throttleId = null
            }, space)
        }
    }

    // 防抖
    debounce = (func, space = 200) => {
        if (this.debounceId) clearTimeout(this.debounceId)
        this.debounceId = setTimeout(() => {
            func()
        }, space)
    }
}

export default {
    RateCtrl, CssListener,
    refToDom,
    cssDom, cssRef, css, cssDomDelay,
    getDomRect, getRefRect, getRect,
    getCssRef, getCssDom, getCss,
    setAttrDom, setAttrRef, setAttr, setStyle,
}


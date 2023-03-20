// 响应式化
function defineReactive(obj, key, val) {
    Object.defineProperty(obj, key, {
        enumerable: true,
        configurable: true,
        get: function reactiveGetter (val) {
            return val;
        },
        set: function reactiveSetter(newVal) {
            if(newVal == val) return;
            cb(newVal);
        }

    })
}

// 视图更新
function cb(val) {
    console.log(val, 'view update!');
}

// 观察者
function observer(obj) {
    if(!obj || !obj == 'object') {
        return;
    }
    Object.keys(obj).forEach(key => {
        defineReactive(obj, key, obj[key])
    })
}


class Vue {
    constructor(options) {
        // 遍历data，使vue实例的data响应式化
        this._data = options.data
        observer(this._data)
    }
}


let o = new Vue({
    data: {
        name: 'xiaomign',
        age: 12
    }
})

// console.log(o._data.name); 
// console.log(o._data.name = 'gert');
o._data.name = 'gert'
console.log(o._data.name);
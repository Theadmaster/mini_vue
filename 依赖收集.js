// 响应式化
// 此时，该函数的obj是data对象，key、val是data中的一对键值对
function defineReactive(obj, key, val) {

    // 存放watcher对象
    const dep = new Dep()

    Object.defineProperty(obj, key, {
        enumerable: true,
        configurable: true,
        get: function reactiveGetter (val) {
            /* 将Dep.target（即当前的Watcher对象存入dep的subs中） */
            dep.addSub(Dep.target)
            return val;
        },
        set: function reactiveSetter(newVal) {
            if(newVal == val) return;
            /* 在set的时候触发dep的notify来通知所有的Watcher对象更新视图 */
            dep.notify()
        }

    })
}

// 视图更新
function cb(val) {
    console.log(val, 'view update!');
}

// 遍历（递归）data对象内部属性 使data响应式化
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
        /* 新建一个Watcher观察者对象，这时候Dep.target会指向这个Watcher对象 */
        new Watcher()
        /* 在这里模拟render的过程，为了触发test属性的get函数 */
        console.log('render~', this._data.test);
    }
}

// ========================== 依赖收集=====================================
/**
 * get 方法会触发 依赖收集，因为只有当data的属性被访问了之后，才有响应式的需求。
 * 此时就会收集依赖这个属性的watcher观察者依赖
 */
new Vue({
    template:
    `<div>
        <span>{{text1}}</span>
        <span>{{text2}}</span>
    </div>`,
    data: {
        text: 'text1',
        text: 'text2',
        text: 'text3'
    }
})


// Dep 订阅者
class Dep {
    constructor () {
        this.subs = []
    }

    // 增加订阅操作
    addSub (sub) {
        this.subs.add(sub)
    }

    // 通知所有观察者更新视图
    notify () {
        this.subs.forEach(sub => {
            sub.update()
        })
    }
}

Dep.target = null;

// 观察者
class Watcher {
    constructor() {
        // new 一个watcher实例的时候将其赋值给Dep.target，在get中会用到
        Dep.target = this
    }

    update() {
        console.log("视图更新啦～");
    }
}


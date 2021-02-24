import { Dep } from './Dep.js'
// 监听函数
// 通过Watcher这个类创建的实例，都拥有update方法
function Watcher (vm, exp, fn) {
    this.fn = fn   // 将fn放到实例上
    this.vm = vm
    this.exp = exp
    // 添加一个事件
    // 这里我们先定义一个属性
    Dep.target = this
    let arr = exp.split('.')
    let val = vm
    arr.forEach(key => {    // 取值
        val = val[key]     // 获取到this.a.b，默认就会调用get方法,触发数据劫持 Observe 的get 订阅数据
    })
    Dep.target = null
}

Watcher.prototype.update = function () {
    let arr = this.exp.split('.')
    let val = this.vm
    arr.forEach(key => {
        val = val[key]   // 通过get获取到新的值
    })
    this.fn(val);
}

export { Watcher }
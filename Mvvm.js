import { observe } from './Observe.js'
import { Compile } from './Compile.js'
function Mvvm(options = {}){
    this.$options = options
    let data = this._data = this.$options.data

    // 数据劫持
    observe(data)

    // this 代理 this._data
    for(let key in data){
        Object.defineProperty(this, key,{
            configurable:true,
            get(){
                return this._data[key]
            },
            set(newVal){
                this._data[key] = newVal
            }
        })
    }
    // 编译
    new Compile(options.el, this);  
}
export { Mvvm }

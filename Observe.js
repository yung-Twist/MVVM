import { Dep } from './Dep.js'
function Observe(data){
    let dep = new Dep();
    for(let key in data){
        let val = data[key]
        observe(val)

        Object.defineProperty(data, key,{
            configurable:true,
            get(){
                Dep.target && dep.addSub(Dep.target);   // 将watcher添加到订阅事件中 [watcher]
                return val
            },
            set(newVal){
                if(val === newVal){
                    return
                }
                val = newVal
                observe(newVal)
                dep.notify();
            }
        })
    }
}

function observe(data) {
    // 如果不是对象的话就直接return掉
    // 防止递归溢出
    if (!data || typeof data !== 'object') return;
    return new Observe(data);
}
export {observe}
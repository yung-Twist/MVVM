import { Watcher } from './Watcher.js'
function Compile(el, vm){
    // 将el挂载到实例上方便调用
    vm.$el = document.querySelector(el);
    // 在el范围里将内容都拿到，当然不能一个一个的拿
    // 可以选择移到内存中去然后放入文档碎片中，节省开销
    let fragment = document.createDocumentFragment();
    let child;
    while (child = vm.$el.firstChild) {
        fragment.appendChild(child);    // 此时将el中的内容放入内存中
    }
    // 对el里面的内容进行替换
    function replace(frag) {
        Array.from(frag.childNodes).forEach(node => {
            let txt = node.textContent;
            let reg = /\{\{(.*?)\}\}/g;   // 正则匹配{{}}
            
            if (node.nodeType === 3 && reg.test(txt)) { // 即是文本节点又有大括号的情况{{}}
            //............................................................................
                // console.log(RegExp.$1); // 匹配到的第一个分组 如： a.b, c
                // let arr = RegExp.$1.split('.');
                // let val = vm;
                // arr.forEach(key => {
                //     val = val[key];     // 如this.a.b
                // });
                // // 用trim方法去除一下首尾空格
                // node.textContent = txt.replace(reg, val).trim();
                // // 监听变化
                // // 给Watcher再添加两个参数，用来取新的值(newVal)给回调函数传参
                // new Watcher(vm, RegExp.$1, newVal => {
                //     node.textContent = txt.replace(reg, newVal).trim();    
                // });
            //..............................................................................优化
                function replaceTxt() {
                    node.textContent = txt.replace(reg, (matched, placeholder) => {   
                        console.log(placeholder);
                        new Watcher(vm, placeholder, replaceTxt);   // 监听变化，进行匹配替换内容
                        
                        return placeholder.split('.').reduce((val, key) => {
                            return val[key]; 
                        }, vm);
                    });
                };
                // 替换
                replaceTxt();
            }
            // 数据双向绑定

            /*
                html结构
                <input v-model="c" type="text">
                
                数据部分
                data: {
                    a: {
                        b: 1
                    },
                    c: 2
                }
            */
            if (node.nodeType === 1) {  // 元素节点
                let nodeAttr = node.attributes; // 获取dom上的所有属性,是个类数组
                Array.from(nodeAttr).forEach(attr => {
                    let name = attr.name;   // v-model  type
                    let exp = attr.value;   // c        text
                    if (name.includes('v-')){
                        node.value = vm[exp];   // this.c 为 2
                    }
                    // 监听变化
                    new Watcher(vm, exp, function(newVal) {
                        node.value = newVal;   // 当watcher触发时会自动将内容放进输入框中
                    });
                    
                    node.addEventListener('input', e => {
                        let newVal = e.target.value;
                        // 相当于给this.c赋了一个新值
                        // 而值的改变会调用set，set中又会调用notify，notify中调用watcher的update方法实现了更新
                        vm[exp] = newVal;   
                    });
                });
            }
    
            // 如果还有子节点，继续递归replace
            if (node.childNodes && node.childNodes.length) {
                replace(node);
            }
        });
    }
    
    replace(fragment);  // 替换内容
    vm.$el.appendChild(fragment);   // 再将文档碎片放入el中
}
export {Compile}
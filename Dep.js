// 订阅和发布
function Dep(){
    this.subs = []
}

// 订阅
Dep.prototype.addSub = function(sub){
    this.subs.push(sub)
}

// 发布
Dep.prototype.notify = function(){
    this.subs.forEach(sub => sub.update())
}

export { Dep }
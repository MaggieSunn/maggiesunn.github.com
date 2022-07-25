//给需要变化的元素增加一个观察者，当数据变化时执行对应的方法
class Watcher{
    constructor(vm,exp,fn){
        this.vm = vm;
        this.exp = exp;
        //回调函数
        this.fn = fn;
        //发布订阅对象Dep，添加一个属性target = this(当前watcher)
        Dep.target = this;
        let val = vm;
        let arr = exp.split('.');
        //循环调用改对象的get，把该watcher添加到观察数组中
        arr.forEach(function (k) {
            val = val[k];
        });
        Dep.target = null;
    }
    //每个watcher加一个update方法用于发布
    update(){
        //通过最新this对象取到最新的值，触发watcher的回调函数，更新node节点中的数据来更新视图
        let val = this.vm;
        let arr = this.exp.split('.');
        arr.forEach(function (k) {
            val = val[k];
        });
        //传入的val是最新计算出来的值
        this.fn(val);
    }
}
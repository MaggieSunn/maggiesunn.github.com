// 对数据进行劫持
class Observe{
    constructor(data){
        this.deepObserve(data);
    }

    deepObserve(data){
        //创建一个可观察对象，每个变化的数据都会对应一个数组，存放所有更新的操作
        let dep = new Dep();
        for(let key in data){
            let value = data[key];
            //深度递归劫持
            Observe.observeData(value);
            //数据劫持主体方法
            this.mount(data,key,value,dep);
        }
    }

    //定义响应式
    mount(data,key,value,dep){
        //data中的数据递归的通过defineProperty方式创建
        Object.defineProperty(data,key,{
            enumerable:true,
            get(){
                //Dep.target存在的时候，添加到可观察对象数组中
                Dep.target && dep.addSub(Dep.target);
                return value;
            },
            set(newVal){
                if(newVal === value){
                    return;
                }
                value = newVal;
                //手动设置的值也需要劫持
                Observe.observeData(newVal);
                dep.notify();
            }
        })
    }

    static observeData(data){
        //递归的终止条件
        if(typeof data !== 'object'){
            return ;
        }
        return new Observe(data);
    }
}

//发布订阅
class Dep{
    constructor(){
        //存放订阅者的数组
        this.subs = [];
    }
    //添加订阅者
    addSub(sub){
        this.subs.push(sub);
    }
    //通知所有订阅者
    notify(){
        this.subs.forEach(sub=>{
            sub.update();
        })
    }
}
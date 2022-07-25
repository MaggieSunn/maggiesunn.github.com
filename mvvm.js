class Mvvm {
    //接收传入的对象，把对象挂载在实例上
    constructor(options){
        const {el,data} = options;
        this._data = data;
        //把所有前台传来的data中的数据劫持,即把对象的所有属性都提供一个get和set方法
        Observe.observeData(data);
        //把所有的data数据代理到Mvvm对象上
        this.mount(data);
        //解析模板数据
        Mvvm.compile(el,this);
    }
    //把data中的数据挂载到this上
    mount(data){
        //遍历data数据 通过defineProperty进行重新创建属性到this上
        for(let key in data){
            Object.defineProperty(this,key,{
                enumerable:true, // 可枚举
                get(){
                    return this._data[key];
                },
                set(newVal){
                    this._data[key] = newVal;
                }
            })
        }
    }

    //解析模板,编译另建类方便扩展属性
    static compile(el,_that){
        new Compile(el,_that);
    }
}
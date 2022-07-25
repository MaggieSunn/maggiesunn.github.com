class Compile{
    //vm是MVVM的一个实例，和this对应
    constructor(el,vm){
        vm.$el = document.querySelector(el);
        //为了避免每操作一次都要从页面获取元素，通过文档片段将DOM保存到内存
        let fragment = document.createDocumentFragment();
        let child;
        while(child = vm.$el.firstChild){
            //不断遍历DOM，添加到文档片段中
            //注意：添加的过程中会从文档树中移除该节点，该节点会从浏览器上消失
            fragment.appendChild(child);
        }
        //实现编译的核心函数
        this.replace(fragment,this,vm);
        //把更新后的文档片段插入回DOM，达到更新视图的目的
        vm.$el.appendChild(fragment);
    }

    //编译:如果是元素节点，取里面的v-model,如果是文本节点，取{{}}
    replace(fragment,that,vm){
        //将节点集合转换为数组，逐个判断是否是元素节点/文本节点
        Array.from(fragment.childNodes).forEach(function (node) {
            //判断文本节点中的{{}}，通过正则表达式匹配
            let text = node.textContent;
            let reg = /\{\{(.*)\}\}/;
            //nodeType === 3 表示文本节点
            if(node.nodeType === 3 && reg.test(text)){
                // RegExp.$1获取到 b.b , 并通过.转换成数组
                let arr = RegExp.$1.split('.');
                let val = vm;
                arr.forEach(function (k) {
                    val = val[k];
                });
                //创建一个watcher对象，用于后期视图动态更新
                new Watcher(vm,RegExp.$1,function (newVal) {
                    node.textContent = text.replace(reg,newVal);
                });
                //更新视图
                node.textContent = text.replace(reg,val);
            }
            //nodeType === 1 表示元素节点
            if(node.nodeType === 1){
                //判断元素里是否有v-model属性，取出当前节点的属性
                let nodeAttrs = node.attributes;
                Array.from(nodeAttrs).forEach((attr)=>{
                    let name = attr.name;
                    let exp = attr.value;
                    //实现把a的值添加到input输入框内
                    if(name.startsWith('v-')){
                        node.value = vm[exp];
                    }
                    //创建一个watcher对象，用于动态更新视图
                    new Watcher(vm,exp,function (newVal) {
                        node.value = newVal; //更新输入框的值
                    });
                    //输入框添加事件
                    node.addEventListener('input',function (e) {
                        //调用数据劫持中的set方法，触发 dep.notify()
                        vm[exp] = e.target.value;
                    },false);
                })
            }
            //递归检查内部可能的文本节点
            if(node.childNodes){
                that.replace(node,that,vm);
            }
        });
    }
}

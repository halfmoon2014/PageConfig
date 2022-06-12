class MvvM {
    constructor({
        el,
        data
    }) {
        this.data = data;
        this.defineData(data);
        let compile = new Complie(el, this);
        compile.comipleHtml();
    }
    /**
     * 重新定义data,通过set实现数据劫持，同时更新关联的dom数据
     * @param {*} data 
     */
    defineData(data) {
        Object.keys(data).forEach(item => {
            
            if (item == "name") {
                console.log(1)
            } else {
                console.log(2)
            }
            let observe = new Observer();
            Object.defineProperty(this, item, {
                configurable: false,
                enumerable: true,
                get: function () {
                    console.log("get",item)
                    Observer.target && observe.addWatcher(Observer.target);
                    return this.data[item];
                },
                set: function (val) {
                    console.log("set", item)
                    this.data[item] = val;
                    observe.updatePageData(val);
                }

            })            
        })
    }
    //observe(value, vm) {
    //    if (!value || typeof value !== "object") {
    //        return
    //    }
    //    return new Observer(value)
    //}
}
class Observer{
    constructor(){
     this.subs=[];
    }
    //将页面的每一个{{}}对应的watcher实例添加进来
    addWatcher(watcher){
        this.subs.push(watcher);
    }
    /**
     * 更新数据对应的页面节点
     */
    updatePageData(val){
      this.subs.forEach(item=>{
          item.update(val);
      })
    }

}
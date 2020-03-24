class Watcher{
    //对象核心存储被更新的Dom节点
    constructor(node,key){
    this.node=node;
    this.key=key;
    }
     //更新方法更新节点数据
    update(val){
       
    // let newText= this.node.innerText.replace(`{{${this.key}}}`,val)
    // this.node.innerText=newText;
    this.node.innerText=val;
    }
}
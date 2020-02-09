
window.onload = function () {
    tools.getObj("attributeSub").addEventListener("click", function (e) {
        var obj = tools.getObj(tools.getObj("attributeTitle").innerHTML);
        var ctr = obj.getAttribute("ctr")
        //var extObj = obj.ext || {};
        if (ctr == "text") {
            //if (extObj.labelText == undefined) {
            //    extObj.labelText = "label"
            //}
            getChildren(obj, "label").innerHTML = tools.getObj("attributeLabelText").value;

            if (tools.getObj("attributeRemoveLabel").checked) {
                getChildren(obj, "label").style.display = "none";
            } else {
                getChildren(obj, "label").style.display = "";
            }
        }

    }, true);
    //初始化移动控件
    SetDragable.initMoveObj(tools.getObj("workspace"));
    SetDragable.initDrgObj([
        tools.getObj("toolsLabelModel"),
        tools.getObj("toolsTextModel"),
        tools.getObj("toolsSelectModel"), tools.getObj("toolsTableModel"), tools.getObj("toolsButtonModel"), tools.getObj("toolsDateModel"),
        tools.getObj("toolsImageModel")
    ], clonedInit);
    //加载数据
    //SetDragable.loadData();
};
var clonedInit = function (clonedNode) {
    //加载单击事件
    clonedNode.addEventListener("click", showAttribute, true);
    //如果是表格，要初始化
    if (clonedNode.getAttribute("ctr") == "table") {
        var tableScriptModal = tools.getObj("tableScriptModal").innerHTML;
        clonedNode.innerHTML = tableScriptModal;
        //clonedNode.style.width = "300px;"
        //clonedNode.style.heigth = "300px;"
    }
}
function getChildren(parentObj, childrenCtr) {
    var returnObj = null;
    for (var i = 0; i < parentObj.children.length; i++) {
        if (parentObj.children[i].getAttribute("subctr") == childrenCtr) {
            returnObj = parentObj.children[i];
        }
    }
    return returnObj;
}

//显示控件属性
var showAttribute = function (e) {    
    tools.getObj("attributeTitle").innerHTML = getCtrObj(e.target).id;
    
}
//从子对象获取控件对象[拥有ctr属性的]，向外层叠加
var getCtrObj=function(obj){
    if (obj.getAttribute("ctr"))
        return obj;
    else
        return getCtrObj(obj.parentElement);
}
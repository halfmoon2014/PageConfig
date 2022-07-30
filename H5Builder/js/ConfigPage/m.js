
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
        }

    }, true);

    tools.getObj("attributeTable").addEventListener("click", function (e) {
        var obj = tools.getObj(tools.getObj("attributeTitle").innerHTML);
        if ("attributeRemoveLabel" == e.target.name) {//点击了label显示、隐藏属性
            if (e.target.value=="off") {
                getChildren(obj, "label").style.display = "none";
            } else {
                getChildren(obj, "label").style.display = "";
            }
        }
        console.log(e.target)
    }, true);

    //初始化移动控件
    var clonedHandler = {};
    clonedHandler.init = clonedInit;
    clonedHandler.move = cloneMove
    SetDragable.initMoveObj(tools.getObj("workspace"));
    SetDragable.initDrgObj([
        tools.getObj("toolsLabelModel"),
        tools.getObj("toolsTextModel"),
        tools.getObj("toolsSelectModel"), 
        tools.getObj("toolsTableModel"), 
        tools.getObj("toolsButtonModel"), 
        tools.getObj("toolsDateModel"),
        tools.getObj("toolsImageModel")
    ], clonedHandler);
    //加载数据
    //SetDragable.loadData();
};

//控件移动后
//sourceNode移动的对象(位置已经移动),pointOrg原位置,
var cloneMove = function (sourceNode, pointOrg) {
    var workspace = tools.getObj("workspace");
    var moveList = new Array();
    for (var i = 0; i < workspace.children.length; i++) {
        if (workspace.children[i].getAttribute("ctr") && workspace.children[i]!=sourceNode) {
            if (tools.getObj("horizontalMove").checked) {//水平联动
                if (pointOrg.y == workspace.children[i].offsetTop) {
                    moveList.push(workspace.children[i]);
                }
            }
            if (tools.getObj("verticalMove").checked) {//垂直联动
                if (pointOrg.x == workspace.children[i].offsetLeft) {
                    moveList.push(workspace.children[i]);
                }
            }
        }
    }
    if (moveList.length > 0) {
        for (var i = 0; i < moveList.length; i++) {
            moveList[i].style.top = moveList[i].offsetTop + sourceNode.offsetTop - pointOrg.y + "px";
            moveList[i].style.left = moveList[i].offsetLeft + sourceNode.offsetLeft - pointOrg.x + "px";
        }
    }
}
//创建控件后执行
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
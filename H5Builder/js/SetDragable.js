var SetDragable = (function () {
    /* 拖拽元素支持的事件
         ondrag 应用于拖拽元素，整个拖拽过程都会调用
         ondragstart 应用于拖拽元素，当拖拽开始时调用
         ondragleave 应用于拖拽元素，当鼠标离开拖拽元素是调用
         ondragend 应用于拖拽元素，当拖拽结束时调用

         目标元素支持的事件
         ondragenter 应用于目标元素，当拖拽元素进入时调用
         ondragover 应用于目标元素，当停留在目标元素上时调用
         ondrop 应用于目标元素，当在目标元素上松开鼠标时调用
         ondragleave 应用于目标元素，当鼠标离开目标元素时调用
     */
    //画布
    var MoveObj = null;
    ////单击事件
    //var ClickFun = null;
    //创建控件后初始化方法
    var ClonedHandler = null;//ClonedHandler
    var dragstart = function (e) {
        /*通过dataTransfer来实现数据的存储与获取
            setData(format, data)
            format: 数据的类型： text/html  text/uri-list
            Data: 数据： 一般来说是字符串值
        */
        e.target.style.opacity = 0.5
        e.target.ext = { "pageX": e.pageX, "pageY": e.pageY };
        e.dataTransfer.setData("text", e.target.id);
        var test = tools.getpos(e.target);
        console.log(e.target.id + "|ondragstart")
        console.log(e.pageX + "," + e.pageY);
    }

    var dragend = function (e) {
        e.target.style.opacity = 1;
        console.log(e.target.id + "|ondragend")
    }

    /*浏览器默认会阻止ondrop事件：我们必须在ondrapover中阻止默认行为*/
    var dragover = function (e) {
        console.log(e.target.id + "|ondragover")
        e.preventDefault();
    }

    var drop = function (e) {
        /*对于drop,防止浏览器的默认处理数据(在drop中链接是默认打开)*/
        event.preventDefault();
        /*通过e.dataTransfer.setData存储的数据，只能在drop事件中获取*/
        var drgid = e.dataTransfer.getData("text");//被拖动的ID
        var extData = tools.getObj(drgid).ext;//扩展信息
        var sourceNode = tools.getObj(drgid); // 获得被克隆的节点对象      
        if (e.target == MoveObj) {
            //如果是画布里的对象在移动那就不创建
            var clonedNode;
            if (sourceNode.parentElement == e.target) {
                //画布内的元素拖动
                var pointOrg = {
                    "x": sourceNode.offsetLeft,
                    "y": sourceNode.offsetTop
                }
                var point = {
                    "x": (e.pageX - extData.pageX) + pointOrg.x,
                    "y": (e.pageY - extData.pageY) + pointOrg.y
                }
                var newPoint = revisePoint(point, pointOrg);
                sourceNode.style.left = newPoint.x + "px";
                sourceNode.style.top = newPoint.y + "px";
                ClonedHandler.move && ClonedHandler.move(sourceNode, pointOrg);
                //模拟单击一下
                sourceNode.click();
                console.log(e.target.id + "|ondrop|sourceNode.parentElement == e.target")
            } else {
                //从画布外拖入画布
                clonedNode = sourceNode.cloneNode(true)// 克隆节点
                //初始化一下，这个对象才能移动
                initDrgObj([clonedNode])
                clonedNode.setAttribute("id", tools.uuid()); // 修改一下id 值，避免id 重复
                clonedNode.style.position = "absolute";            
                //if (ClonedHandler.init != null) 
                ClonedHandler.init && ClonedHandler.init(clonedNode);
                
                //画布的border会影响定位
                var borderTopWidth = getComputedStyle(e.target, null).borderTopWidth.replace("px", "");
                clonedNode.style.opacity = 1
                //画布的border会影响定位
                var borderLeftWidth = getComputedStyle(e.target, null).borderLeftWidth.replace("px", "");
                var marginTop = getComputedStyle(sourceNode, null).marginTop.replace("px", "");
                //计算鼠标移动距离，然后将移动对象和画布对象位置算出
                var point = {
                    "x": (e.pageX - extData.pageX - (tools.getpos(e.target).l - tools.getpos(sourceNode).l) - borderLeftWidth),
                    "y": e.pageY - extData.pageY - (tools.getpos(e.target).t - tools.getpos(sourceNode).t) - borderTopWidth - marginTop
                }
                var newPoint=revisePoint(point);
                clonedNode.style.left = newPoint.x + "px";
                clonedNode.style.top = newPoint.y + "px";

                e.target.appendChild(clonedNode);
                console.log(e.target.id + "|ondrop|sourceNode.parentElement != e.target")
                //刚刚创建出来的对象，模拟单击一下
                clonedNode.click();
            }
            
        } else {    //画布里的控件A拖到控件B上面了
            var pointOrg = {
                "x": sourceNode.offsetLeft,
                "y": sourceNode.offsetTop
            }
            var point = {
                "x": (e.pageX - extData.pageX) + pointOrg.x,
                "y": (e.pageY - extData.pageY) + pointOrg.y
            }
            var newPoint = revisePoint(point, pointOrg);
            sourceNode.style.left = newPoint.x + "px";
            sourceNode.style.top = newPoint.y + "px";
            ClonedHandler.move && ClonedHandler.move(sourceNode, pointOrg);
            sourceNode.click();
            console.log(e.target.id + "|ondrop|e.target != MoveObj;")
        }
    }
    /*修正坐标，让控件的位置可以有粘性,针对画布里的元素，将元素的位置可以有粘性
    point 是修正的坐标
    pointOrg 原始坐标
    */
    var revisePoint = function (point,pointOrg) {
        //间隔间距
        var minX = 999999; var minY = 999999;
        //算出来的坐标
        var pointX = 0, pointY = 0;
        for (var i = 0; i < MoveObj.children.length; i++) {
            if (pointOrg && pointOrg.x == MoveObj.children[i].offsetLeft && pointOrg.y == MoveObj.children[i].offsetTop)//排除被移动对象本身的原位置
                continue;

            var disX = 0;
            //位置在某个对象的右边(排除掉这个对象的宽度)
            if (MoveObj.children[i].offsetLeft + MoveObj.children[i].width < point.x) {
                disX = point.x - (MoveObj.children[i].offsetLeft + MoveObj.children[i].width);
            } else if (point.x < MoveObj.children[i].offsetLeft) {
                //位置在某个对象的左边
                disX = MoveObj.children[i].offsetLeft - point.x;
            } else if (point.x == MoveObj.children[i].offsetLeft) {
                //重合了
                disX = 0;
            } else {
                //位置在这个对象中。
                disX = point.x - MoveObj.children[i].offsetLeft;
            }
            if (disX < minX) {
                minX = disX;
                pointX = MoveObj.children[i].offsetLeft
            }

            var disY = 0;
            //位置在某个对象的右边(排除掉这个对象的宽度)
            if (MoveObj.children[i].offsetTop + MoveObj.children[i].height < point.y) {
                disY = point.y - (MoveObj.children[i].offsetTop + MoveObj.children[i].height);
            } else if (point.y < MoveObj.children[i].offsetTop) {
                //位置在某个对象的左边
                disY = MoveObj.children[i].offsetTop - point.y;
            } else if (point.y == MoveObj.children[i].offsetTop) {
                //重合了
                disY = 0;
            } else {
                //位置在这个对象中。
                disY = point.y - MoveObj.children[i].offsetTop;
            }
            if (disY < minY) {
                minY = disY;
                pointY = MoveObj.children[i].offsetTop
            }
        }
        var newPoint = point;
        if (minX <= 15) {
            newPoint.x = pointX
        }
        if (minY <= 15) {
            newPoint.y = pointY
        }
        return newPoint;
    }

    var initMoveObj = function (moveObj) {
        moveObj.addEventListener("dragover", dragover, true);
        moveObj.addEventListener("drop", drop, true);
        MoveObj = moveObj;
    }

    //clonedHandler 新创建出来的对象的init事件
    var initDrgObj = function (drgObjList, clonedHandler) {
        if (typeof clonedHandler == "object")
            ClonedHandler = clonedHandler
        for (var i = 0; i < drgObjList.length; i++) {
            var drgObj = drgObjList[i];
            drgObj.draggable = true;
            drgObj.style.cursor = "move";
            //监听拖动事件
            drgObj.addEventListener("dragstart", dragstart, true);
            drgObj.addEventListener("dragend", dragend, true);
        }
    }


    return {
        initMoveObj: initMoveObj,
        initDrgObj: initDrgObj,
        MoveObj: MoveObj
    };
})();

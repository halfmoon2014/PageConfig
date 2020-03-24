<br>1 看了那么多次VUE源码之后，知道了观察者模式+Object.defineProperty数据劫持，动态监测data来渲染页面
<br>2 于是自己动手写一个，更能深刻理解，也能在自己写的时候发现自己哪里没有完全明白。
<br>3 花了俩小时，断断续续的改了几次，写出来了。
<br>4 主要就是四个类
<br>5 MvvM入库类
<br>6 Watcher类 对应于html的每一个{{}}节点
<br>7 Observer类 对应于data里面的属性，维护着多个watcher对象
<br>8 Compile类 初始化加载页面元素，并通过正则表达式解析出对应于data属性的节点，创建对应watcher添加到观察者对象里面

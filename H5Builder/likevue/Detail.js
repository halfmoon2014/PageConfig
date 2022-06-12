
class Detail{
    constructor({
        dom,
        data,
        btuCall,
    }){
        this.data = data;
        this.dom = dom;
        this.defineData(data);
        this.ids = {};
        let divID = this.newGuid();
        this.ids.div = divID;
        let btnID = this.newGuid();
        this.ids.button = btnID;
        let tableID = this.newGuid();
        this.ids.list = tableID;
        let html = `
<div detailID=${divID} >${data.div}</div>
<input detailID=${btnID} type="button" value="${data.button}"
/>

    <table detailID=${tableID}>
        <tr><td>name</td><td>age</td><td>title</td></tr>
        ${data.list.map((item) => { return `<tr><td>${item.name}</td><td>${item.age}</td><td>${item.title}</td></tr>` }).join('')}
    </table>
`
        dom.insertAdjacentHTML("afterbegin", html);
        let btnObj = document.querySelector("[detailID='" + this.ids["button"] + "']")
        btnObj.addEventListener('click', (e)=> {
            console.log("detail.click", e)
            e.srcElement.style.display = "none";
            btuCall();            
        })
    }
    defineData(data) {
        Object.keys(data).forEach(item => {
            new Proxy(item, {
                get: function (target, attr) {
                    return target[attr];
                },
                set: function (target, attr, value) {
                    target[attr] = value;
                }
            });
        
            //Object.defineProperty(this, item, {
            //    configurable: false,
            //    enumerable: true,
            //    get: function () {                    
            //        return this.data[item];
            //    },
            //    set: function (val) {
            //        console.log(val)
            //        this.data[item] = val;
            //        if (item == "button") {
            //            let obj=document.querySelector("[detailID='" + this.ids[item] + "']")
            //            obj.value = val;
            //        } else if (item == "div") {
            //            let obj = document.querySelector("[detailID='" + this.ids[item] + "']")
            //            obj.innerHTML = val;
            //        }
            //    }

            //})
        })
    }
    newGuid() {
        var guid = "";
        for (var i = 1; i <= 32; i++) {
            var n = Math.floor(Math.random() * 16.0).toString(16);
            guid += n;
            if ((i == 8) || (i == 12) || (i == 16) || (i == 20))
                guid += "-";
        }
        return guid;
    }
}
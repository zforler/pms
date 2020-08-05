class LMenu {
    constructor(param = {}){
        this.menuCache = []
        this.container = param.container
        this.elContainer = document.querySelector(`#${this.container}`)
        this.innerContainer = '<ul id="LMenu"></ul>'
        this.flatMenuCache = new Map()
        this.menuElementCache = {}
        this.idSeq = 0
        this.event = {
            click: null
        }
        this._init()
    }
    _init(){
        let me = this
        this.elContainer.innerHTML = this.innerContainer
        this.elInnerContainer = document.querySelector('#LMenu')
        this.elInnerContainer.addEventListener('click',(e)=>{
            let target = e.target
            if(target.dataset.type == 'item'){
                let id = target.dataset.id
                //执行监听的click方法
                if(me.event.click instanceof Function){
                    console.log(me.flatMenuCache)
                    me.event.click(me.flatMenuCache.get(id))
                }
                let childs = me.menuElementCache[id]
                if(childs){
                    let targetJson = me.flatMenuCache.get(id)
                    if(targetJson.extend == true){
                        me.flodUp(id)
                        target.classList.remove('L-item-open')
                    }else{
                        for (let i = 0, len = childs.length; i < len; i++) {
                            childs[i].classList.add('L-item-extend')
                        }
                        targetJson.extend = true
                        target.classList.add('L-item-open')
                    }
                }
            }
        })
    }
    //折叠所有子菜单
    flodUp(id){
        console.log(id)
        let childs = this.menuElementCache[id]
        if(childs){
            for (let i = 0, len = childs.length; i < len; i++) {
                this.flodUp(childs[i].dataset.id)
                childs[i].classList.remove('L-item-extend')
            }
            this.flatMenuCache.get(id).extend = false
        }
    }
    appendRightIcon(element){
        let span1 = document.createElement('span');
        span1.className = 'L-item-c'
        span1.innerText = '>'
        element.appendChild(span1)
        let span2 = document.createElement('span');
        span2.className = 'L-item-o'
        span2.innerText = '∨'
        element.appendChild(span2)

    }
    render(jsonArr = []){
        this.flatMenuCache  = this._flatJson(jsonArr)
        let frag = document.createDocumentFragment();
        console.log(this.flatMenuCache)
        for (let [key,value] of this.flatMenuCache){
            console.log(key)
            let item = document.createElement('li')
            item.innerText = value.text
            item.dataset.type= 'item'
            item.dataset.level= value._level
            item.dataset.id= value._id
            item.dataset.parentId= value._parentId
            item.classList.add('L-item')
            item.style.paddingLeft = (value._level - 1) * 15 + 15 + 'px'
            //有子节点的菜单添加右侧图标
            if(value.children){
                this.appendRightIcon(item)
            }
            frag.appendChild(item)

            if(!this.menuElementCache[value._parentId]){
                this.menuElementCache[value._parentId] = []
            }
            this.menuElementCache[value._parentId].push(item)
        }
        this.elInnerContainer.appendChild(frag)
    }

    //json对象转化为数组
    _flatJson(json, arr = new Map(), level = 1, parentId = 0){
        if(Array.isArray(json)){
            let len = json.length
            for (let i = 0; i < len; i++) {
                json[i]._level = level
                json[i]._id = 'L' + ++this.idSeq
                json[i]._parentId = parentId
                // arr.push(json[i])
                arr.set(json[i]._id, json[i])
                if(json[i].children){
                    this._flatJson(json[i].children, arr, level+1, json[i]._id)
                }
            }
        }else if(this._isObject(json)){
            json._level = level
            json._id = 'L' + ++this.idSeq
            json._parentId = parentId
            // arr.push(json)
            arr.set(json._id, json)

            if(json.children){
                this._flatJson(json.children, arr, level+1, json._id)
            }
        }
        return arr
    }

    _isObject(o){
        return Object.prototype.toString.call(o) === '[object Object]'
    }

    on(type, func){
        this.event[type] = func
    }

    addMenu(){

    }
}

// let lmenu = new LMenu({
//     container: 'menuc'
// })
//
// let obj = [
//     {
//         text: 'title1',
//         children:  [
//             {
//                 text: 'title3-1'
//             }
//         ]
//     },
//     {
//         text: 'title2',
//         children: [
//             {
//                 text: 'title2-1'
//             },
//             {
//                 text: 'title2-2',
//                 children: {
//                     text: 'title2-3-1',
//                     children:
//                         {
//                             text: 'title2-4-1',
//                             children: [
//                                 {
//                                     text: 'title2-5-1'
//                                 }
//                             ]
//                         }
//
//                 }
//             }
//         ]
//     },
//     {
//         text: 'title3',
//         children: [
//             {
//                 text: 'title3-1'
//             }
//         ]
//     },
//     {
//         text: 'title4'
//     }
// ]
// lmenu.render(obj)
// lmenu.on('click', function (e) {
//     console.log(e)
// })
export default LMenu
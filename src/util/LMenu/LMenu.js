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
            if(target.dataset.type){
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
                console.log(childs[i].dataset.type)
                if(childs[i].dataset.type == LMenu.MENU_TYPE.MENU){
                    childs[i].classList.remove('L-item-open')
                }
            }
            this.flatMenuCache.get(id).extend = false
        }
    }
    appendRightIcon(element){
        let span1 = document.createElement('i');
        span1.className = 'el-icon-arrow-right L-item-c'
        element.appendChild(span1)
        let span2 = document.createElement('i');
        span2.className = 'el-icon-arrow-down L-item-o'
        element.appendChild(span2)

    }
    render(jsonArr = []){
        this.flatMenuCache  = this._flatJson(jsonArr)
        let frag = document.createDocumentFragment();
        console.log(this.flatMenuCache)
        for (let [key,value] of this.flatMenuCache){
            let item = document.createElement('li')
            item.innerText = value.name
            item.id = value._id
            item.dataset.type= value.type
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
    setActive(value, type='path') {
        console.log('aaa',this.menuElementCache)
        for(let [key, val] of this.flatMenuCache){
            if(val[type] == value){
                let active = document.querySelector('.L-item-active')
                if(active){
                    active.classList.remove('L-item-active')
                }
                document.getElementById(val._id).classList.add("L-item-active")
                break
            }
        }
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
LMenu.MENU_TYPE={
    MENU: 1,
    ITEM: 2,
}
export default LMenu
<template>
    <div class="menu-container">
        <ul id="LMenu">
            <template v-for="(val,key) in flatMenuCache">
                <li :data-level="(flatMenuCache[val._parentId]&&flatMenuCache[val._parentId].hidden)?1:val._level"
                    class="L-item"
                    v-bind:class="{'L-item-hidden':val.hidden,'L-item-open':val.open,'L-item-extend':val.extend,
                    'L-item-active':val.active}"
                    @click="menuClick(val)" :key="key">
                    <svg-icon v-if="val.icon" :icon-class="val.icon"  width="24px" height="24px"></svg-icon>
                    <span class="L-item-name">{{val.name}}</span>
                    <i v-if="val.children" class="el-icon-arrow-right L-item-c"></i>
                    <i  v-if="val.children" class="el-icon-arrow-down L-item-o"></i>

                </li>
            </template>
            <!--<li v-for="[key,value] in flatMenuCache" :key="key"-->
                <!--:class="['L-item',(value._parentId&&flatMenuCache.get(value._parentId).hidden)?'L-item-level-1':'',-->
                <!--value.hidden?'L-item-hidden':'']"-->
            <!--@click="menuClick(value)">-->
                <!--<span class="L-item-name">{{value.name}}</span>-->
            <!--</li>-->
        </ul>
    </div>
</template>

<script>
    export default {
        name: "Menu",
        data(){
            return {
                flatMenuCache: {},
                menuCache: {},
                idSeq: 0,
                currentMenu: ''
            }
        },
        props:{
          clickHandler:Function
        },
        mounted(){
          this.flatMenuCache = this._flatJson(this.$router.options.routes)
            console.log(this.flatMenuCache)
        },
        methods:{
            setActive(value, type='path') {
                for(let key in this.flatMenuCache){
                    let val = this.flatMenuCache[key]
                    if(val[type] == value){
                        if(this.currentMenu){
                            this.$set(this.currentMenu, 'active', false)
                        }
                        this.$set(this.flatMenuCache[key], 'active', true)
                        this.currentMenu = val
                        break
                    }
                }
            },
            menuClick(item){
                let id = item._id
                let childs = this.menuCache[id]
                let targetJson = this.flatMenuCache[item._id]
                console.log(childs)
                if(childs){
                    if(targetJson.extend == true){
                        this.flodUp(item._id)
                        this.flatMenuCache[item._id].open = false;
                    }else{
                            for (let i = 0, len = childs.length; i < len; i++) {
                                childs[i].extend = true
                            }
                        targetJson.extend = true
                        targetJson.open = true
                    }

                }else{
                    if(this.currentMenu){
                        this.$set(this.currentMenu, 'active', false)
                    }
                    this.$set(targetJson, 'active', true)
                    this.currentMenu = targetJson
                }

                this.clickHandler(item)

            },
            flodUp(id){
                let childs = this.menuCache[id]
                if(childs){
                    for (let i = 0, len = childs.length; i < len; i++) {
                        this.flodUp(childs[i]._id)
                        childs[i].extend = false
                        if(childs[i].type == 1){
                            childs[i].open = false
                        }
                    }
                    this.flatMenuCache[id].extend = false
                }
            },
            addMenuCache(parentId, obj){
                if(!parentId){
                    return
                }
                if(!this.menuCache[parentId]){
                    this.menuCache[parentId] = []
                }
                this.menuCache[parentId].push(obj)
            },
            _flatJson(json, arr = {}, level = 1, parentId = 0){
                if(Array.isArray(json)){
                    let len = json.length
                    for (let i = 0; i < len; i++) {
                        json[i]._level = level
                        json[i]._id = 'L' + ++this.idSeq
                        json[i]._parentId = parentId
                        json[i].extend = false
                        this.addMenuCache(parentId,json[i])
                        arr[json[i]._id] = json[i]
                        if(json[i].children){
                            this._flatJson(json[i].children, arr, level+1, json[i]._id)
                        }
                    }
                }else if(this._isObject(json)){
                    json._level = level
                    json._id = 'L' + ++this.idSeq
                    json._parentId = parentId
                    json.extend = false
                    this.addMenuCache(parentId,json)
                    arr[json._id] = json
                    if(json.children){
                        this._flatJson(json.children, arr, level+1, json._id)
                    }
                }
                return arr
            }
        }
    }
</script>

<style scoped>
    #LMenu{
        list-style: none;
        padding: 0;
        overflow: auto;
        height: calc(100vh - 55px);
    }
    #LMenu::-webkit-scrollbar {
        /*滚动条整体样式*/
        width : 2px;  /*高宽分别对应横竖滚动条的尺寸*/
        height: 1px;
    }
    #LMenu::-webkit-scrollbar-thumb {
        /*滚动条里面小方块*/
        border-radius: 10px;
        box-shadow   : inset 0 0 5px rgba(0, 0, 0, 0.2);
        background   : #535353;
    }
    #LMenu::-webkit-scrollbar-track {
        /*滚动条里面轨道*/
        box-shadow   : inset 0 0 5px rgba(0, 0, 0, 0.2);
        border-radius: 10px;
    }

    .L-item-hidden{
        display: none !important;
    }
    .L-item{
        /*display: block;*/
        display: flex;
        position: relative;
        align-items: center;
        cursor: pointer;
        height: 0px;
        line-height: 0px;
        overflow: hidden;
        background-color: transparent;
        transition: all 0.1s;
        color:#fff;
    }
    .L-item embed{
        width: 25px;
        height: 25px;
    }
    .L-item > .L-item-c{
        /*display: inline-block;*/
        /*float: right;*/
        /*margin-right: 15px;*/
        line-height: unset;
        display: flex;
        position: absolute;
        right: 15px;
    }
    .L-item > .L-item-o{
        display: none;
    }
    .L-item-name{
        margin-left: 15px;
    }
    .L-item-icon{
        font-size: 20px;
    }
    .L-item-extend{
        height: 56px;
        line-height: 56px;
        transition: all 0.1s;
    }
    .L-item-open{
        background-color: #3b5998 !important;
    }
    .L-item-open > .L-item-c{
        display: none;
    }
    .L-item-open > .L-item-o{
        /*display: inline-block;*/
        /*float: right;*/
        /*margin-right: 15px;*/
        line-height: unset;

        display: flex;
        position: absolute;
        right: 15px;
    }
    .L-item-active{
        background-color: #3b5998 !important;
    }
    /***第一层级样式***/
    .L-item[data-level='1']{
        background-color: transparent;
        /*display: block;*/
        height: 56px;
        line-height: 56px;
        color:#fff;
        border-bottom: rgba(255,255,255,0.15) 1px solid;

        display: flex;
        position: relative;
        align-items: center;

        padding-left: 15px;
    }
    .L-item[data-level='2']{
        padding-left: 30px;
    }
</style>
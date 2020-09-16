import store from "./store";
/**
 * 将标题数组转化为html元素
 * @param columns 例如：['编号','名称']
 * @returns {string} 例如：<tr><td>编号</td>名称<td></td></tr>
 */
function isObject(val){
    return Object.prototype.toString.call(val) === '[object Object]'
}
function generateColumnsHeading2 (columns = {}) {
    let columnsHeading = '<tr style="text-align: center;font-weight: bold;height: 35px;color:#000000">'
    for (let key in columns) {
        if(isObject(columns[key])){
            columnsHeading += `<td>${columns[key].title}</td>`
        }else{
            columnsHeading += `<td>${columns[key]}</td>`
        }

    }
    columnsHeading += '</tr>'
    return columnsHeading
}
function generateListHeading2 (data = []) {
    let columnsHeading = '<tr style="text-align: center;font-weight: bold;height: 35px;color:#000000">'
    for (let i = 0, len = data.length; i < len; i++) {
        let row = data[i];
        for (let j = 0, lenj = row.length; j < lenj; j++) {
            columnsHeading += `<td>${row[j]}</td>`
        }

    }
    columnsHeading += '</tr>'
    return columnsHeading
}
let columns = {
    'record_id':'记录编号',
    'customer_id':'客户编号',
    'equipment_id':'设备编号',
    'dispatch_sub_id':'发料终端',
    'delivery_sub_id':'交料终端',
    'dispatch_card_no':'发料卡号',
    'delivery_card_no':'交料卡号',
    'price_type':'计价类型',
    'dispatch_kg':'发料(kg)',
    'delivery_count':'交料(数量)',
    'delivery_kg':'交料(kg)',
    'yield':'出成率(%)',
    'price':'单价(元)',
    'total_price':'总价(元)',
    'price_id':'计价规则编号',
    'staff_no':'员工编号',
    'staff_name':'员工名称',
    'staff_type':'员工类型',
    'department_id':'组编号',
    'department_name':'组名称',
    'production_id':'产品编号',
    'production_name':'产品名称',
    'spec_id':'规格编号',
    'spec_name':'规格名称',
    'technology_id':'工艺编号',
    'technology_name':'工艺名称',
    'shift_id':'班次编号',
    'shift_name':'班次',
    'delay_time':'班次延时',
    'batch_id':'批次编号',
    'batch_name':'批次名称',
    'record_time':'记录时间',
    'report_time':'上报时间',
    'calc_time':'计算时间',
    'year':'年',
    'month':'月',
    'day':'日',
    'append':'备注',
    'yield_t':'出成率(%)',//计算得出
}

let formatter = {
    record_time(val){
        return formateTime(val)
    },
    report_time(val){
        return formateTime(val)
    },
    calc_time(val){
        return formateTime(val)
    },
    price_type(val){
        return store.getters.dicFilter['PRICE_TYPE'+val]
    },
    staff_type(val){
        return store.getters.dicFilter['STAFF_TYPE'+val]
    },
    yield_t(val,row){
        return (row.delivery_kg/row.dispatch_kg* 100).toFixed(2)
    },
    total_price(val){
        return (val/ 100).toFixed(2)
    },
    delivery_kg(val){
        return (val/ 100).toFixed(2)
    },
    dispatch_kg(val){
        return (val/ 100).toFixed(2)
    },
    commonPrice(val){
        return (val/ 100).toFixed(2)
    },
    commonTime(val){
        return formateTime(val)
    }

}

function format(key,val,row){
    if(formatter[key]){
        return formatter[key](val,row)
    }
    if(val===undefined || val === null){
        return '--'
    }
    return val
}
function loadExcel (url, fileName) {
    const link = document.createElement('a') // 生成一个a标签。
    link.href = url // href属性指定下载链接
    link.download = fileName // dowload属性指定文件名
    link.click()
}
function mixColumn(column){

}
/**
 * 将表格数据转化为 excel 表格，并自动下载
 * @param tableData
 * @param columns
 */
export function tableDataToExcel (tableData = [],title, area) {
    let column_ = area?area:columns
    // 初始化表格模板
    let str = generateColumnsHeading2(column_)
    // 循环遍历，每行加入tr标签，每个单元格加td标签
    let row
    for (let i = 0, len = tableData.length; i < len; i++) {
        row = tableData[i]
        str += '<tr>'
        let val
        for (let key in column_) {
            val = row[key]
            let columnVal = column_[key]
            let tempVal = ''
            if(columnVal === undefined || columnVal === null){

            }else if(isObject(columnVal)){
                if(columnVal.fk instanceof Function){
                    tempVal = columnVal.fk(val,row)
                }else{
                    tempVal = format(columnVal.fk, val,row)
                }
            }else{
                tempVal = format(key, val,row)
            }
            str += `<td class="numtostr">${tempVal}</td>`
        }
        str += '</tr>'
    }

    loadExcel(createTemplate(title,str), title)
}
function createTemplate(title,str){
    let workSheet = 'sheet1'
    let uri = 'data:application/vnd.ms-excel;base64,'
    // 下载的表格模板数据
    let template = `<html xmlns:o="urn:schemas-microsoft-com:office:office"
      xmlns:x="urn:schemas-microsoft-com:office:excel"
      xmlns="http://www.w3.org/TR/REC-html40">
      <head><!--[if gte mso 9]><xml><x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet>
        <x:Name>${workSheet}</x:Name>
        <x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions></x:ExcelWorksheet>
        </x:ExcelWorksheets></x:ExcelWorkbook></xml><![endif]-->
        <style type="text/css">
            .numtostr{mso-number-format: "\\@";}
            br {mso-data-placement:same-cell;}
            tr{height: 35px;}
        </style>
        <title>${title}</title>
        </head><body><table>${str}</table></body></html>`
    return uri + window.btoa(unescape(encodeURIComponent(template)))
}

export function tableDataToExcel2 (tableData = [],title) {
    let str = ''
    for (let i = 0, len = tableData.length; i < len; i++) {
        let type = tableData[i].type
        if(type == 'head-map-data'){
            let head = tableData[i].head
            str += generateColumnsHeading2(head)
            let body = tableData[i].body
            let row
            for (let j = 0, lenj = body.length; j < lenj; j++) {
                row = body[j]
                str += '<tr>'
                let val
                for (let key in head) {
                    val = row[key]
                    let columnVal = head[key]
                    let tempVal = ''
                    if(columnVal === undefined || columnVal === null){

                    }else if(isObject(columnVal)){
                        if(columnVal.fk instanceof Function){
                            tempVal = columnVal.fk(val,row)
                        }else{
                            tempVal = format(columnVal.fk, val,row)
                        }
                    }else{
                        tempVal = format(key, val,row)
                    }
                    str += `<td class="numtostr">${tempVal}</td>`
                }
                str += '</tr>'
            }
        }else if(type == 'list-data'){
            let body = tableData[i].body
            for (let j = 0, lenj = body.length; j < lenj; j++) {
                let row = body[j]
                str += '<tr>'
                for (let k = 0, lenk = row.length; k < lenk; k++) {
                    str += `<td class="numtostr">${row[k]}</td>`
                }
                str += '</tr>'
            }
        }else if(type == 'head-list'){
            str += generateListHeading2(tableData[i].body)
        }


    }
    loadExcel(createTemplate(title,str), title)
}



export function formateTime(timestamp, reg='yyyy-MM-dd hh:mm:ss'){
    let dateObj

    if(timestamp instanceof Date){
        dateObj = timestamp
    }else{
        if(!timestamp){
            return '--'
        }
        let tt = parseInt(timestamp)
        if(tt < 9999999999){
            tt *= 1000
        }
        dateObj = new Date(parseInt(tt))
    }

    let str = reg
    str = str.replace(/yyyy|YYYY/, dateObj.getFullYear())

    let month = dateObj.getMonth() + 1
    str = str.replace(/MM/, month < 10 ? '0' + month : month)
    str = str.replace(/M/, month)

    let date = dateObj.getDate()
    str = str.replace(/dd|DD/, date < 10 ? '0' + date : date)
    str = str.replace(/d|D/, date)

    let hour = dateObj.getHours()
    str = str.replace(/hh|HH/, hour < 10 ? '0' + hour : hour)
    str = str.replace(/h|H/, hour)

    let week = dateObj.getDay()
    str = str.replace(/hh|HH/, hour < 10 ? '0' + hour : hour)
    str = str.replace(/h|H/, hour)

    let minute = dateObj.getMinutes()
    str = str.replace(/mm/, minute < 10 ? '0' + minute : minute)
    str = str.replace(/m/, minute)

    let second = dateObj.getSeconds()
    str = str.replace(/ss|SS/, second < 10 ? '0' + second : second)
    str = str.replace(/s|S/, second)

    let milliSecond = dateObj.getMilliseconds()
    str = str.replace(/nnn|NNN/, milliSecond < 10 ? '00' + milliSecond : milliSecond < 100 ? '0' + milliSecond : milliSecond)
    str = str.replace(/n|N/, milliSecond)
    return str
}

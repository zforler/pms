

/**
 * 将标题数组转化为html元素
 * @param columns 例如：['编号','名称']
 * @returns {string} 例如：<tr><td>编号</td>名称<td></td></tr>
 */

function generateColumnsHeading2 (columns = {}) {
    let columnsHeading = '<tr style="text-align: center;font-weight: bold;height: 35px;background-color: #356DB3;color:#ffffff">'
    for (let key in columns) {
        columnsHeading += `<td>${columns[key]}</td>`
    }
    columnsHeading += '</tr>'
    return columnsHeading
}

let columns = {

}
function loadExcel (url, fileName) {
    const link = document.createElement('a') // 生成一个a标签。
    link.href = url // href属性指定下载链接
    link.download = fileName // dowload属性指定文件名
    link.click()
}
/**
 * 将表格数据转化为 excel 表格，并自动下载
 * @param tableData
 * @param columns
 */
export function tableDataToExcel (tableData = [], area) {
    // 初始化表格模板
    let str = generateColumnsHeading2(columns)
    // 循环遍历，每行加入tr标签，每个单元格加td标签
    for (let i = 0; i < tableData.length; i++) {
        let row = tableData[i]
        str += '<tr>'
        for (let key in columns) {
            str += `<td class="numtostr">${(row[key] === undefined || row[key] === null) ? '' : row[key]}</td>`
        }
        str += '</tr>'
    }

    // worksheet名
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
        <title>工单列表</title>
        </head><body><table>${str}</table></body></html>`
    // 下载模板
    // window.location.href = uri + window.btoa(unescape(encodeURIComponent(template)))
    loadExcel(uri + window.btoa(unescape(encodeURIComponent(template))), '工单列表')
}



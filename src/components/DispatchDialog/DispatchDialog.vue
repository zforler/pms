<template>
    <div class="dispatch-dialog-container">
        <el-dialog title="设备选择" :visible.sync="show"
                   @close="addCloseHandler"  width="650px">
            <el-table :data="tableData" border style="width: 100%" @selection-change="handleSelectionChange"
                      ref="multipleTable" v-loading="listLoading">
                <el-table-column type="selection" width="55"></el-table-column>
                <el-table-column prop="equipmentId" label="设备编号"></el-table-column>
                <el-table-column prop="equipmentName" label="设备名称"></el-table-column>
                <el-table-column prop="status" label="设备状态">
                    <template slot-scope="scope">
                        {{scope.row.status | dicFilter('EQUIP_STATUS')}}
                    </template>
                </el-table-column>
             
            </el-table>
            <div slot="footer" class="dialog-footer">
                <el-button @click="show = false">取 消</el-button>
                <el-button type="primary" @click="addConfirm">确 定</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    import { getEquipmentList,dispatch } from '../../api/equipment'
    import localCache from "../../util/localCache";
    export default {
        name: "DispatchDialog",
        props:{
            dispatchType: {
                type: Number,
                default: 0
            }
        },
        data() {
            return {
                listLoading: true,
                tableData: [],
                show:false,
                selectRow: '',
                staffIds:''
            }
        },
        mounted(){
            this.getList()
        },
        methods:{
            open(param = {}){
                this.staffIds = param.staffIds
                this.show = true
            },
            handleSelectionChange(val){
                this.selectRow = val
                console.log(val)
            },
            addCloseHandler(){
                this.$refs.multipleTable.clearSelection();
            },
            addConfirm() {
                if(!this.selectRow){
                    this.$message.error('请选择设备')
                    return
                }
                let equipmentIds = this.selectRow.map(t=>t.equipmentId).join(',')
                dispatch({
                    customerId: localCache.getCurrentCustomerId(),
                    equipmentIds: equipmentIds,
                    type: this.dispatchType,
                    staffIds: this.staffIds
                }).then(res => {
                    if (res.errorcode !== 0) {
                        this.$message.error(res.message)
                    } else {
                        this.$message.success(res.message)
                        this.show = false
                    }
                }).catch((e) => {
                })
            },
            getList() {
                getEquipmentList({
                    customerId: localCache.getCurrentCustomerId()
                }).then(res => {
                    this.listLoading = false
                    if (res.errorcode !== 0) {
                        this.$message.error(res.message)
                    } else {
                        this.tableData = res.data
                    }
                }).catch(() => {
                    this.listLoading = false
                })
            },
        }
    }
</script>

<style scoped>

</style>
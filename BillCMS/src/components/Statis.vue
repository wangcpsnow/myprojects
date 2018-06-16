<template>
    <div class="statis">
        <el-form ref="form" :model="statForm" label-width="100px" :inline='true'>
            <el-form-item label="选择日期">
                <el-col :span="11">
                    <el-date-picker type="date" placeholder="开始时间" v-model="statForm.startTime"
                        style="width: 100%;" value-format='yyyy-MM-dd'></el-date-picker>
                </el-col>
                <el-col class="line center" :span="2">-</el-col>
                <el-col :span="11">
                    <el-date-picker type="date" placeholder="结束时间" v-model="statForm.endTime"
                        style="width: 100%;" value-format='yyyy-MM-dd'></el-date-picker>
                </el-col>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" size='medium' @click="clickStatis">统计</el-button>
                <el-button type='success' size='medium' @click='clickExport'>导出</el-button>
            </el-form-item>
        </el-form>
        <el-form label-width="100px" :inline='true' class='result' v-if='timeStatis'>
            <span class="title">开票时间统计</span>
            <el-form-item label="发票张数">
                <el-input v-model="timeStatis.invoiceTotalCount" :disabled="true"></el-input>
            </el-form-item>
            <el-form-item label="去重后张数">
                <el-input v-model="timeStatis.invoiceDistinctCount" :disabled="true"></el-input>
            </el-form-item>
            <el-form-item label="手机号个数">
                <el-input v-model="timeStatis.mobileCount" :disabled="true"></el-input>
            </el-form-item>
        </el-form>
        <el-form label-width="100px" :inline='true' class='result' v-if='uploadStatis'>
            <span class="title">上传时间统计</span>
            <el-form-item label="发票张数">
                <el-input v-model="uploadStatis.invoiceTotalCount" :disabled="true"></el-input>
            </el-form-item>
            <el-form-item label="去重后张数">
                <el-input v-model="uploadStatis.invoiceDistinctCount" :disabled="true"></el-input>
            </el-form-item>
            <el-form-item label="手机号个数">
                <el-input v-model="uploadStatis.mobileCount" :disabled="true"></el-input>
            </el-form-item>
        </el-form>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                statForm: {
                    startTime: '',
                    endTime: ''
                },
                timeStatis: '',
                uploadStatis: ''
            }
        },
        methods: {
            clickStatis() {
                var params = this.getParams();
                if (!params) {
                    return;
                }
                this.$http.get('/ild/admin/manage/statis', {
                        params: params
                    })
                    .then(res => {
                        var data = res.data.data;
                        this.timeStatis = Object.assign({}, data.invoiceTimeStatis);
                        this.uploadStatis = Object.assign({}, data.invoiceUploadStatis);
                    });
            },
            getParams() {
                if (!this.statForm.startTime) {
                    this.$toast('', '请选择开始日期', 'warning');
                    return;
                }
                if (!this.statForm.endTime) {
                    this.$toast('', '请选择结束日期', 'warning');
                    return;
                }
                return Object.assign({}, this.statForm);
            },
            clickExport() {
                var params = this.getParams();
                if (!params) {
                    return;
                }
                var iframe = document.createElement('iframe');
                iframe.src = '/ild/admin/manage/exportInvoice?startTime=' + params.startTime + '&endTime=' + params.endTime;
                document.body.appendChild(iframe);
            }
        }
    }
</script>

<style lang='stylus' scoped>
    .statis {
        .result {
            border: 1px solid silver;
            padding: 20px;
            margin: 20px 5px;
            position: relative;
            .title {
                position: absolute;
                top: -15px;
                left: 20px;
                background-color: #FFF;
            }
        }
    }
</style>
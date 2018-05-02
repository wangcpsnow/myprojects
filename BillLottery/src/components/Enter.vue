<template>
    <div class="enter">
        <div class="navtitle">
            <h3><s></s>发票录入</h3>
        </div>
        <el-row>
            <el-col :span="6" class='label'>
                <span>发票代码</span>
            </el-col>
            <el-col :span="18">
                <el-input v-model="enterForm.invoiceCode" size='medium'
                    placeholder="请输入10/12位发票代码"></el-input>
            </el-col>
        </el-row>
        <el-row>
            <el-col :span="6" class='label'>
                <span>发票号码</span>
            </el-col>
            <el-col :span="18">
                <el-input v-model="enterForm.invoiceNo" size='medium'
                    placeholder="请输入8位发票号码"></el-input>
            </el-col>
        </el-row>
        <el-row>
            <el-col :span="6" class='label'>
                <span>开票日期</span>
            </el-col>
            <el-col :span="18">
                <el-date-picker v-model="enterForm.invoiceDate"
                    type="date" placeholder="请选择开票日期"></el-date-picker>
            </el-col>
        </el-row>
        <el-row>
            <el-col :span="6" class='label'>
                <span>开票金额</span>
            </el-col>
            <el-col :span="18">
                <el-input v-model="enterForm.invoiceAmount" size='medium'
                    placeholder="请输入开票金额"></el-input>
            </el-col>
        </el-row>
        <el-row>
            <el-col :span="6" class='label'>
                <span>手机号码</span>
            </el-col>
            <el-col :span="18">
                <el-input v-model="enterForm.mobile" size='medium'
                    placeholder="请输入11位手机号码"></el-input>
            </el-col>
        </el-row>
        <el-row class='vcode'>
            <el-col :span="6" class='label'>
                <span>验证码</span>
            </el-col>
            <el-col :span="12">
                <el-input v-model="enterForm.vcode" size='medium'></el-input>
            </el-col>
            <el-col :span="6" style='float: right'>
                <img :src='vcode' alt="" @click='toggleVcode'>
            </el-col>
        </el-row>
        <el-row>
            <el-button plain style='width: 100%;' @click='click_submit'>提交</el-button>
        </el-row>
    </div>
</template>

<script>
export default {
    data() {
        return {
            enterForm: {},
            checkForm: {
                invoiceCode: {
                    no: '请输入发票代码',
                    reg: /^[a-zA-Z0-9]{10,12}$/i,
                    msg: '发票代码输入有误'
                },
                invoiceNo: {
                    no: '请输入发票号码',
                    reg: /^[a-zA-Z0-9]{8}$/i,
                    msg: '发票号码输入有误'
                },
                invoiceDate: {
                    no: '请选择开票日期'
                },
                invoiceAmount: {
                    no: '请输入开票金额',
                    reg: /^[0-9]+$/i,
                    msg: '开票金额输入有误'
                },
                mobile: {
                    no: '请输入手机号码',
                    reg: /^1[0-9]{10}$/i,
                    msg: '手机号码输入有误'
                },
                vcode: {
                    no: '请输入验证码'
                }
            },
            vcodeUrl: '/ild/verify/code.jpg?v=',
            version: ''
        }
    },
    computed: {
        vcode() {
            return this.vcodeUrl + this.version;
        }
    },
    methods: {
        click_submit() {
            var data = this.check_data();
            if (!data) {
                return;
            }
            this.$http.get('/ild/invoice/upload', {
                    params: data
                })
                .then(res => {
                    var data = res.data;
                    if (!data.ret) {
                        this.toast(data.errMsg, 'warning');
                        if (data.code === 1) {
                            this.toggleVcode();
                        }
                        return;
                    }
                    this.toast('发票录入成功', 'success');
                    this.resetData();
                });
        },
        check_data() {
            var self = this;
            var obj = {};
            for (var key in self.checkForm) {
                var item = self.checkForm[key];
                if (!self.enterForm[key]) {
                    self.toast(item['no'], 'warning');
                    return false;
                }
                if (item['reg']) {
                    if (!item['reg'].test(self.enterForm[key])) {
                        self.toast(item['msg'], 'warning');
                        return false;
                    }
                }
                obj[key] = self.enterForm[key];
            }
            return obj;
        },
        resetData() {
            for (var key in this.enterForm) {
                if (this.enterForm.hasOwnProperty(key)) {
                    this.enterForm[key] = '';
                }
            }
            this.toggleVcode();
        },
        toggleVcode() {
            this.version = Date().valueOf();
        },
        toast(txt, type) {
            // this.$notify({
            //     message: txt,
            //     duration: 2000
            // });
            this.$message({
                message: txt,
                type: type
            });
        }
    }
}
</script>

<style lang="stylus" scoped>
    .enter {
        .el-row {
            margin: 5px 20px;
        }
        .label {
            text-align: left;
            line-height: 36px;
        }
        .el-input {
            width: 100%;
            margin: 0;
        }
        .vcode {
            img {
                height: 36px;
                float: right;
                cursor: pointer;
            }
        }
    }
</style>
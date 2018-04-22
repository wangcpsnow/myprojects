<template>
    <div class="enter">
        <div class="title">
            <h3><s></s>发票录入</h3>
        </div>
        <el-row>
            <el-col :span="6" class='label'>
                <span>发票代码</span>
            </el-col>
            <el-col :span="18">
                <el-input v-model="enterForm.code" size='medium'
                    placeholder="请输入10/12位发票代码"></el-input>
            </el-col>
        </el-row>
        <el-row>
            <el-col :span="6" class='label'>
                <span>发票号码</span>
            </el-col>
            <el-col :span="18">
                <el-input v-model="enterForm.num" size='medium'
                    placeholder="请输入8位发票号码"></el-input>
            </el-col>
        </el-row>
        <el-row>
            <el-col :span="6" class='label'>
                <span>开票日期</span>
            </el-col>
            <el-col :span="18">
                <el-date-picker v-model="enterForm.date" 
                    type="date" placeholder="请选择开票日期"></el-date-picker>
            </el-col>
        </el-row>
        <el-row>
            <el-col :span="6" class='label'>
                <span>开票金额</span>
            </el-col>
            <el-col :span="18">
                <el-input v-model="enterForm.money" size='medium'
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
        <el-row>
            <el-col :span="6" class='label'>
                <span>开票商</span>
            </el-col>
            <el-col :span="18">
                <el-input v-model="enterForm.seller" size='medium'
                    placeholder="请输入50位以内的字符"></el-input>
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
                code: '请输入发票代码',
                num: '请输入发票号码',
                date: '请选择开票日期',
                money: '请输入开票金额',
                mobile: '请输入手机号码',
                seller: '请输入开票商'
            }
        }
    },
    methods: {
        click_submit() {
            var data = this.check_data();
            if (!data) {
                return;
            }

        },
        check_data() {
            var self = this;
            var obj = {};
            for (var key in self.checkForm) {
                if (!self.enterForm[key]) {
                    self.toast(self.checkForm[key], 'warning');
                    return;
                }
                obj[key] = self.enterForm[key];
            }
            return obj;
        },
        toast(txt, type='success') {
            this.$notify({
                title: type,
                message: txt,
                type: type
            });
        }
    }
}
</script>

<style lang="stylus" scoped>
    .enter {
        .title {
            border-bottom: 1px solid silver;
            padding-left: 15px;
            h3 {
                line-height: 30px;
                font-weight: bold;
                font-size: 18px;
            }
            s {
                border-left: 2px solid red;
                margin: auto;
                margin-right: 10px;
                font-size: 14px;
            }
        }
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
    }
</style>
<template>
    <div class="enter">
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
                <el-input v-model="enterForm.date" size='medium'
                    placeholder="请选择开票日期"></el-input>
            </el-col>
        </el-row>
        <el-row>
            <el-col :span="6" class='label'>
                <span>开票金额</span>
            </el-col>
            <el-col :span="18">
                <el-input v-model="enterForm.num" size='medium'
                    placeholder="请输入开票金额"></el-input>
            </el-col>
        </el-row>
    </div>
</template>

<script>
export default {
    data() {
        return {
            enterForm: {
                code: ''
            }
        }
    }
}
</script>

<style lang="stylus">
    .enter {
        .el-row {
            margin: 5px 0;
        }
        .label {
            text-align: center;
            line-height: 36px;
        }
        .el-input {
            width: 90%;
            margin: 0 5%;
        }
    }
</style>
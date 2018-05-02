<template>
    <div class="query">
        <div class="navtitle">
            <h3><s></s>发票查询</h3>
        </div>
        <el-row>
            <el-input v-model="mobile" size='medium'
                    placeholder="请输入11位手机号码"></el-input>
        </el-row>
        <el-row>
            <el-button plain style='width: 100%;' @click='click_query'>查询</el-button>
        </el-row>
    </div>
</template>

<script>
export default {
    data() {
        return {
            mobile: ''
        }
    },
    methods: {
        click_query() {
            var self = this;
            if (!self.mobile) {
                self.toast('请输入手机号码', 'warning');
                return;
            }
            self.$http.get(`/ild/invoice/queryWin?mobile=${self.mobile}`)
                .then(res => {
                    var data = res.data;
                    if (!data.ret) {
                        self.toast(data.errMsg, 'warning');
                        return;
                    }
                    self.toast(data.data, 'success');
                })
        },
        toast(txt, type) {
            // this.$notify({
            //     // title: type,
            //     message: txt,
            //     duration: 2000
            //     // type: type
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
    .query {
        .el-row {
            margin: 5px 20px;
        }
        .el-input {
            width: 100%;
            margin: 0;
        }
    }
</style>
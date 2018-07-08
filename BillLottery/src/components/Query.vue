<template>
    <div class="query">
        <Nav activeType='query'></Nav>
        <!-- <div class="navtitle">
            <h3><s></s>发票查询</h3>
        </div> -->
        <div class="wrap">
            <el-row>
                <el-input v-model="mobile" size='medium'
                        placeholder="请输入11位手机号码"></el-input>
            </el-row>
            <el-row>
                <el-button plain style='width: 100%;' @click='click_query'>查询</el-button>
            </el-row>
            <el-row v-if='winData' class='winInfo'>
                <h3 class="title">{{winData.year}}年第{{winData.period}}期中奖结果:</h3>
                <ul v-for='(item,index) in winData.invoiceWinQueryVos'>
                    <li>发票代码：{{item.invoiceCode}}</li>
                    <li>发票号码：{{item.invoiceNo}}</li>
                    <li>发奖日期：{{item.invoiceDate}}</li>
                    <li :class="{border: index != winData.invoiceWinQueryVos.length - 1}">获奖类别：{{item.winLevel}}</li>
                </ul>
                <p class="center">*领奖方式见公告信息领奖规则*</p>
            </el-row>
        </div>
    </div>
</template>

<script>
import Nav from './Nav'
export default {
    data() {
        return {
            mobile: '',
            winData: ''
        }
    },
    components: {
        Nav
    },
    methods: {
        click_query() {
            var self = this;
            self.winData = '';
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
                    if (data.data && data.data.year && data.data.period) {
                        self.winData = data.data;
                    }
                    else {
                        self.toast('非常抱歉,您未中奖', 'success');
                    }
                })
        },
        toast(txt, type) {
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
        .wrap {
            border: 1px solid silver;
            margin: 5px;
            padding-top: 10px;
            padding-bottom: 50px;
        }
        .el-row {
            margin: 5px 20px;
        }
        .el-input {
            width: 100%;
            margin: 0;
        }
        .winInfo {
            .title {
                margin: 10px 0;
                font-weight: bold;
            }
            li {
                margin-left: 20px;
            }
            li.border {
                padding-bottom: 10px;
                margin-bottom: 10px;
                border-bottom: 1px dashed #2c3e50;
            }
            p {
                margin-top: 20px;
            }
        }
    }
</style>
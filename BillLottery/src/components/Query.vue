<template>
    <div class="query">
        <Nav activeType='query'></Nav>
        <!-- <div class="navtitle">
            <h3><s></s>发票查询</h3>
        </div> -->
        <div class="wrap">
            <el-row v-if='imgs.length'>
                <el-carousel :height="imgHeight">
                    <el-carousel-item v-for="item in imgs" :key="item.id">
                        <img ref="imgHeight" :src="item.imagePath" alt="">
                    </el-carousel-item>
                </el-carousel>
            </el-row>
            <el-row>
                <el-input v-model="mobile" size='medium'
                        placeholder="请输入本人11位手机号码"></el-input>
            </el-row>
            <el-row>
                <el-button plain style='width: 100%;' @click='click_query'>查询</el-button>
                <p class="tips">查询结果仅为参考,具体结果请以官方公告页面为准.</p>
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
            winData: '',
            imgs: [],
            imgHeight: '200px'
        }
    },
    components: {
        Nav
    },
    created() {
        this.getAds();
    },
    methods: {
        getAds() {
            var self = this;
            self.$http.get('/ild/invoice/imageList')
                .then(res => {
                    var imgs = res.data.data
                    if (imgs && imgs.length) {
                        this.lazyLoad(imgs[0]['imagePath'])
                    }
                    this.imgs = imgs;
                });
        },
        lazyLoad(url) {
            var self = this;
            var img = new Image();
            img.onload = function (data) {
                setTimeout(function () {
                    self.imgHeight = self.$refs.imgHeight[0]['height'] + 'px';
                }, 100);
            };
            img.src = url;
        },
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
            .tips {
                color: #a1a1a2;
                font-size: 14px;
                margin-top: 10px;
            }
            .el-carousel {
                img {
                    width: 100%;
                }
            }
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
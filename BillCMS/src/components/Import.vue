<template>
    <div class="import">
        <el-form ref="form" :model="form" label-width="60px">
            <el-form-item label="">
                <el-select v-model="form.year" placeholder="请选择年份">
                    <el-option :label="years" :value="years"></el-option>
                </el-select>
                <el-select v-model="form.period" placeholder="请选择期次" @change='changePeriod'>
                    <el-option :value="item" :label='item | showPerLabel' v-for='(item,key) in periods' :key='key'></el-option>
                </el-select>
                <el-radio-group v-model="status" v-if='status' size='medium'>
                    <el-radio-button v-for='(val,key) in winStatus' :key='key'
                        :label='val' :disabled='val != status'></el-radio-button>
                </el-radio-group>
            </el-form-item>
            <el-form-item>
                <div class="filewrap">
                    <p class="fname">{{ftext}}</p>
                    <p class="fsele">浏览</p>
                    <input type="file" />
                </div>
                <el-button type="primary" class='upBtn' @click='clickUpload' size='medium'>确认上传</el-button>
            </el-form-item>
            <el-form-item>
                <div>
                    <el-table :data="fdata" height="250" border style="width: 90%">
                        <el-table-column prop="index" label="序号" width="180"></el-table-column>
                        <el-table-column prop="invoiceNo" label="发票号码" width="180"></el-table-column>
                        <el-table-column prop="invoiceCode" label="发票代码"></el-table-column>
                        <el-table-column prop="mobile" label="手机号" width="180"></el-table-column>
                        <el-table-column prop="winLevel" label="场内/场外" width="180"></el-table-column>
                    </el-table>
                </div>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click='clickPub' size='medium'>发布</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>

<script>
    import $ from 'jquery';
    export default {
        data() {
            return {
                form: {},
                years: '',
                periods: [],
                winStatus: {
                    '0': '未抽奖',
                    '1': '已抽奖未发布',
                    '2': '已发布'
                },
                status: '',
                fdata: [],
                ftext: '请选择文件',
                checks: {
                    year: '请选择年份',
                    period: '请选择日期'
                }
            }
        },
        created() {
            this.$http.get('/ild/admin/manage/condition')
                .then(res => {
                    var data = res.data.data;
                    this.years = data.conditionList[0].year;
                    this.periods = data.conditionList[0].peroidList;
                });
        },
        mounted() {
            this.addEvents();
        },
        filters: {
            showPerLabel(item) {
                return `第${item}期`;
            }
        },
        methods: {
            // 改变批次
            changePeriod() {
                var params = {
                    year: this.form.year,
                    period: this.form.period
                }
                this.$http.get('/ild/admin/manage/period/status', {
                        params: params
                    })
                    .then(res => {
                        this.status = this.winStatus[res.data.data];
                    });
            },
            addEvents() {
                var $file = $('.filewrap input[type="file"]');
                $file.on('change', this.changeUpFile);
            },
            // 改变文件检测文件类型
            changeUpFile() {
                var $file = $('.filewrap input[type="file"]');
                if (!$file.val().trim()) {
                    return;
                }
                var reg = /xlsx$/gi;
                if (!reg.test($file.val().trim())) {
                    this.$toast('', '只能上传Excel文件', 'warning');
                    this.rmFile();
                    return;
                }
                this.ftext = $file.val().trim();
            },
            rmFile() {
                var $file = $('.filewrap input[type="file"]');
                $file.after($file.clone(true).val(''));
                $file.remove();
                this.ftext = '请选择文件';
            },
            // 上传
            clickUpload() {
                var self = this;
                if (!self.form.year) {
                    self.$toast('', '请选择年份', 'warning');
                    return;
                }
                if (!self.form.period) {
                    self.$toast('', '请选择期次', 'warning');
                    return;
                }
                var $file = $('.filewrap input[type="file"]');
                if (!$file.val().trim()) {
                    this.$toast('', '请选择上传文件', 'warning');
                    return;
                }
                var param = new FormData();
                param.append('file', $file[0].files[0]);
                param.append('year', self.form.year);
                param.append('period', self.form.period);
                this.$http.post('/ild/admin/manage/upLoadInvoice', param)
                    .then(res => {
                        if (res.data && res.data.data) {
                            self.fdata = res.data.data;
                        }
                        else {
                            this.$toast('', res.data.errMsg, 'warning');
                        }
                    });
            },
            // 发布
            clickPub() {
                var self = this;
                for (var key in self.checks) {
                    if (self.checks.hasOwnProperty(key)) {
                        if (!self.form[key] && self.form[key] + '' !== '0') {
                            self.$toast('', self.checks[key], 'warning');
                            return;
                        }
                    }
                }
                if (!self.fdata.length) {
                    self.$toast('', '请选择预览文件', 'warning');
                    return;
                }
                var url = `/ild/admin/manage/lockWin?year=${self.form.year}&period=${self.form.period}`;
                this.$http.get(url, {})
                    .then(res => {
                        if (res.data && res.data.data) {
                            this.$toast('', '发布成功');
                        }
                        else {
                            this.$toast('', res.data.errMsg, 'warning');
                        }
                    });
            }
        }
    }
</script>

<style lang="stylus" scoped>
    .import {
        .filewrap {
            overflow: hidden;
            zoom: 1;
            position: relative;
            display: inline-block;
            .fname, .fsele {
                float: left;
                height: 30px;
                line-height: 30px;
                border: 1px solid silver;
                text-align: center;
            }
            .fname {
                border-right: 0 none;
                width: 300px;
            }
            .fsele {
                width: 100px;
                background-color: #c3c3c3;
            }
            input[type='file'] {
                position: absolute;
                top: 0;
                right: 0;
                bottom: 0;
                left: 0;
                opacity: 0;
                width: 400px;
                cursor: pointer;
            }
        }
        .upBtn {
            margin-left: 10px;
            position: relative;
            top: -12px;
        }
    }
</style>
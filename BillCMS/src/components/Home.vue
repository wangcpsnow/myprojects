<template>
    <div class="home">
        <h2 class="center title">发票星摇奖系统</h2>
        <el-form ref="form" :model="form" label-width="120px">
            <el-form-item label="期次">
                <el-select v-model="form.year" placeholder="请选择年份">
                    <el-option :label="years" :value="years"></el-option>
                </el-select>
                <el-select v-model="form.period" placeholder="请选择期次">
                    <el-option :value="item" :label='item | showPerLabel' v-for='item in periods'></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="时间">
                <el-col :span="11">
                    <el-date-picker type="date" placeholder="发票开始日期" @change='changeDate'
                        value-format='yyyy-MM-dd' v-model="form.startDate" style="width: 100%;"></el-date-picker>
                </el-col>
                <el-col class="line center" :span="2">-</el-col>
                <el-col :span="11">
                    <el-date-picker type="date" placeholder="发票截止时间" @change='changeDate'
                        value-format='yyyy-MM-dd' v-model="form.endDate" style="width: 100%;"></el-date-picker>
                </el-col>
            </el-form-item>
            <el-form-item label="场内奖人数">
                <el-input v-model="form.count" @change='changeNum("count")'></el-input>
            </el-form-item>
            <el-form-item label="场外奖人数">
                <el-input v-model="form.highCount" @change='changeNum("highCount")'></el-input>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click='click_win'>抽奖</el-button>
                <el-button type="success" @click='click_export'>导出获奖信息</el-button>
                <el-button type="danger" @click='click_lock'>锁定本期</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                form: {},
                years: '',
                periods: [],
                checks: {
                    year: '请选择年份',
                    period: '请选择期次',
                    startDate: '请选择开始日期',
                    endDate: '请选择结束日期',
                    count: '请输入场内奖人数',
                    highCount: '请输入场外奖人数'
                }
            }
        },
        created() {
            this.$http.get('/ild/admin/manage/condition')
                .then(res => {
                    this.years = res.data.data.year;
                    this.periods = res.data.data.peroidList;
                });
        },
        filters: {
        	showPerLabel(item) {
        		return `第${item}期`;
        	}
        },
        methods: {
            // 抽奖
            click_win() {
                var self = this;
                for (var key in self.checks) {
                    if (self.checks.hasOwnProperty(key)) {
                        if (!self.form[key]) {
                            self.$toast(self.checks[key], '', 'warning');
                            return;
                        }
                    }
                }
                var params = Object.assign({}, self.form);
                self.$http.get(`/ild/admin/manage/choiceWin`, {
                        params: params
                    })
                    .then(res => {
                    	var data = res.data;
                    	if (!data.ret) {
                    		self.$toast(data.errMsg, '', 'warning');
                    		return;
                    	}
                    	self.$toast('抽奖成功');
                    });
            },

            // 导出
            click_export() {
            	var ifr = document.createElement("iframe");
	            ifr.src = '/ild/admin/manage/exportWin';
	            ifr.style.display = "none";
	            document.body.appendChild(ifr);
                // this.$http.get('/ild/admin/manage/exportWin')
                //     .then(res => {});
            },

            // 锁定本期
            click_lock() {
            	var self = this;
                this.$http.get('/ild/admin/manage/lockWin')
                    .then(res => {
                    	var data = res.data;
                    	if (!data.ret) {
                    		self.$toast(data.errMsg, '', 'warning');
                    		return;
                    	}
                    	self.$toast('成功锁定');
                    });
            },
            changeDate() {
                var start = this.form.startDate;
                var end = this.form.endDate;
                if (start && end) {
                    if (new Date(end).valueOf() < new Date(start).valueOf()) {
                        this.$toast('结束日期不能早于开始日期', '', 'warning');
                        this.form.endDate = '';
                    }
                }
            },
            changeNum(type) {
            	var self = this;
            	if (self.form[type]) {
            		var val = parseInt(self.form[type]);
            		if (val.toString() === 'NaN') {
            			val = 0;
            		}
            		self.form[type] = val;
            	}
            }
        }
    }
</script>

<style lang="stylus" scoped>
    .home {
        width: 60%;
        margin: 0 20%;
        margin-top: 30px;
        text-align: left;
        .title {
            margin-bottom: 20px;
        }
        .el-input {
            width: 300px;
        }
    }
</style>
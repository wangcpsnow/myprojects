<template>
    <div class="home">
        <el-form ref="form" :model="form" label-width="120px">
            <el-form-item label="期次">
                <el-select v-model="form.year" placeholder="请选择年份">
                    <el-option :label="years" :value="years"></el-option>
                </el-select>
                <el-select v-model="form.period" placeholder="请选择期次" @change='changePeriod'>
                    <el-option :value="item" :label='item | showPerLabel' v-for='(item,key) in periods' :key='key'></el-option>
                </el-select>
                <span v-if='status'>本期次: {{status}}</span>
            </el-form-item>
            <el-form-item label="时间">
                <el-date-picker type="date" placeholder="发票开始日期" @change='changeDate'
                    value-format='yyyy-MM-dd' v-model="form.startDate"></el-date-picker>
                <el-date-picker type="date" placeholder="发票截止时间" @change='changeDate'
                    value-format='yyyy-MM-dd' v-model="form.endDate"></el-date-picker>
            </el-form-item>
            <el-form-item label="场内奖人数">
                <el-input v-model="form.highCount" @change='changeNum("highCount")'></el-input>
            </el-form-item>
            <el-form-item label="场外奖人数">
                <el-input v-model="form.count" @change='changeNum("count")'></el-input>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click='click_win' :disabled='winDisabled'>抽奖</el-button>
                <el-button type="success" @click='click_export'>导出获奖信息</el-button>
                <el-button type="danger" @click='click_lock' :disabled='lockDisabled'>锁定本期</el-button>
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
                },
                winStatus: {
                    '0': '未抽奖',
                    '1': '已抽奖未发布',
                    '2': '已发布'
                },
                status: '',
                winDisabled: false,
                lockDisabled: false
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
                self.winDisabled = true;
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
                    	self.$toast('奖项已经生成，您可以导出奖项');
                        self.winDisabled = true;
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
                self.lockDisabled = true;
                this.$http.get('/ild/admin/manage/lockWin')
                    .then(res => {
                    	var data = res.data;
                        self.lockDisabled = false;
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
        text-align: left;
        .el-input, .el-select, .el-date-picker {
            width: 300px;
        }
    }
</style>
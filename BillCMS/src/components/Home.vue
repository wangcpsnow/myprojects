<template>
	<div class="home">
		<h3 class="center title">发票星摇奖系统</h3>
		<el-form ref="form" :model="form" label-width="120px">
			<el-form-item label="期次">
				<el-select v-model="form.year" placeholder="请选择年份">
					<el-option label="区域一" value="shanghai"></el-option>
					<el-option label="区域二" value="beijing"></el-option>
				</el-select>
				<el-select v-model="form.period" placeholder="请选择期次">
					<el-option label="区域一" value="shanghai"></el-option>
					<el-option label="区域二" value="beijing"></el-option>
				</el-select>
			</el-form-item>
			<el-form-item label="时间">
				<el-col :span="11">
					<el-date-picker type="date" placeholder="发票开始日期" v-model="form.startDate" style="width: 100%;"></el-date-picker>
				</el-col>
				<el-col class="line center" :span="2">-</el-col>
				<el-col :span="11">
					<el-date-picker type="date" placeholder="发票截止时间" v-model="form.endDate" style="width: 100%;"></el-date-picker>
				</el-col>
			</el-form-item>
			<el-form-item label="场内奖人数">
				<el-input v-model="form.count"></el-input>
			</el-form-item>
			<el-form-item label="场外奖人数">
				<el-input v-model="form.highCount"></el-input>
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
				form: {}
			}
		},
		methods: {
			click_win() {
				var params = Object.assign({}, this.form);
				this.$http.get(`/ild/admin/manage/choiceWin`, {
						params: params
					})
					.then(res => {});
			},
			click_export() {
				this.$http.get('/ild/admin/manage/exportWin')
					.then(res => {});
			},
			click_lock() {
				this.$http.get('/ild/admin/manage/lockWin')
					.then(res => {});
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
	}
</style>
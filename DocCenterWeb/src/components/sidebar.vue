<template>
	<div class="sidebar">
		<ul>
			<li>
				<a href="javascirpt:void(0)">
					综合维修信息<s class="sleft"></s><s></s>
				</a>
			</li>
			<li>
				<a href="javascirpt:void(0)">
					技术信息<s class="sleft"></s><s></s>
				</a>
			</li>
			<li>
				<a href="javascirpt:void(0)">
					主动学习与支持<s class="sleft"></s><s></s>
				</a>
			</li>
			<li>
				<a href="javascirpt:void(0)">
					综合维修信息<s class="sleft"></s><s></s>
				</a>
			</li>
			<li>
				<a href="javascirpt:void(0)">
					技术信息<s class="sleft"></s><s></s>
				</a>
			</li>
			<li>
				<a href="javascirpt:void(0)">
					主动学习与支持<s class="sleft"></s><s></s>
				</a>
			</li>
		</ul>
	</div>
</template>

<script>
	
</script>

<style lang="stylus">
.sidebar {
	background-color: #3e4349;
	color: #FFF;
	padding-top: 40px;
	padding-right: 30px;
}
.sidebar li {
	line-height: 47px;
	margin-bottom: 15px;
	padding-left: 14px;
	background: transparent url('../assets/imgs/menubg.png') no-repeat center;
	background-size: contain;
}
.sidebar li a {
	color: #FFF;
	display: block;
}
.sidebar li s {
	border: 8px solid transparent;
	border-left-color: #FFF;
	float: right;
	margin-top: 13px;
	
}
.sidebar li s.sleft {
	border-left-color: #4e545b;
	position: relative;
	left: -18px;
}
</style>
<template>
	<div class="addcard">
		<ul class="infos">
			<li>
				<label>名称</label>
				<input type="text" placeholder="请输入卡名称"/>
			</li>
			<li>
				<label>价格</label>
				<input type="text" placeholder="请输入卡价格"/>
			</li>
			<li>
				<label>卡次数</label>
				<input type="text" placeholder="请输入卡使用次数"/>
			</li>
		</ul>
		<div class="products">
			<h3>选择商品</h3>
			<ul>
				<li>
					
				</li>
			</ul>
		</div>
		<div class="footer">
			
		</div>
	</div>
</template>
<style scoped>
	input{
		border: 0 none;
	}
	.infos,.products,.footer{
		background-color: #FFF;
		padding-left: .32rem;
	}
	.addcard{
		font-size: .24rem;
	}

	.infos li{
		border-bottom:1px solid silver;
		padding: .2rem 0;
	}
	.infos li:last-child{
		border: 0 none;
	}
	.infos label{
		width: 25%;display:inline-block;
	}
	.infos input{
		line-height:.24rem;font-size:.24rem;
		width: 70%;
		padding: 10px 0;
	}

	.products{
		margin-top: .12rem;
	}

</style>
<script>
export default {
	name: 'addcard'
};
</script>
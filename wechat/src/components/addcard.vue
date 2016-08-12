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
				<li v-for="item in items">
					<dl>
						<dt class="fleft">
							<input type='checkbox' v-model="checked" value="{{item.id}}"/>
						</dt>
						<dd>
							<div class='img_wrap fleft'><img src="../assets/img/logo.png"/></div>
							<div>
								<h4 class='title'>{{item.title}}</h4>
								<p class='desc'>{{item.desc}}</p>
								<p class="price">￥{{item.price}}</p>
							</div>
						</dd>
					</dl>
				</li>
			</ul>
		</div>
		<div class="footer">
			<div class="fleft" @click="click_check_all">
				<label>
					<input type='checkbox' class="all" v-model="allChecked"/>全选
				</label>
			</div>
			<div class="fright">
				<p class='fleft'>共计<span class="num">{{checked.length}}</span>商品</p>
				<a class="ok">确认</a>
			</div>
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
	.products h3{
		line-height:.76rem;
	}
	.products li{
		overflow:hidden;border-top:1px solid silver;padding:.25rem 0;
	}
	.products dt{
		width:.5rem;
		line-height:1.2rem;
	}
	.products .img_wrap{
		width:1.2rem;height:1.2rem;margin:0 .4rem;
	}
	.products .img_wrap img{
		width:100%;height:100%;
	}
	.products .title{
		font-size:.3rem;font-weight:bold;line-height:.45rem;
	}
	.products .desc{
		color: #ababaa;
	}
	.products .price{
		color: red;
	}

	.footer{
		position:fixed;bottom:0;right:0;left:0;height:.9rem;line-height:.9rem;
	}
	.footer .all{
		margin-right:.4rem;vertical-align:middle;
	}
	.footer .num{
		font-weight:bold;margin:0 .1rem;
	}
	.footer a.ok{
		display:inline-block;width:2rem;height:.9rem;background-color: #3bcbcb;color:#FFF;
		text-align:center;line-height:.9rem;margin-left:.24rem;
	}
</style>
<script>
export default {
	name: 'addcard',
	data (){
		return {
			items: [
				{
					id: "1",
					title: '阿是养身组部精油按摩',
					desc: '商品说明',
					price: 120
				},{
					id: "2",
					title: '阿是养身组部精油按摩',
					desc: '商品说明',
					price: 120
				},{
					id: "3",
					title: '阿是养身组部精油按摩',
					desc: '商品说明',
					price: 120
				}
			],
			checked: []
		}
	},
	computed: {
		allChecked: {
			get(){
				return this.checkedCount == this.items.length;
			},
			set: function(value) {
		        if (value) {
		          this.checked = this.items.map(function(item) {
		          	return item.id
		          })
		        } else {
		          this.checked = []
		        }
		      }
		},
		checkedCount: {
			get(){
				return this.checked.length
			}
		}
	},
	methods:{
		
	}
};
</script>
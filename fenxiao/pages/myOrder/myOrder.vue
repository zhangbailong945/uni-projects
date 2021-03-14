<template>
	<view class="container">
		<tui-tabs :tabs="tabs" :isFixed="scrollTop>=0" :currentTab="currentTab" selectedColor="#E41F19" sliderBgColor="#E41F19"
		 @change="change" itemWidth="20%"></tui-tabs>
		 
		 <view class="tui-order-list">
		 	<view class="tui-cart-cell padding-top-lg  tui-mtop text-center" v-if="orders[order_status].length==0">
		 		<view class="flex-sub  text-xl padding-top text-grey">
		 			<iconfont className="icon-tuanduicankaoxian-" size="40" color="#e5e5e5"></iconfont>
		 			没有订单数据
		 		</view>
		 	</view>
		 </view>
		
		 
		 
		<!--选项卡逻辑自己实现即可，此处未做处理-->
		<view :class="{'tui-order-list':scrollTop>=0}">
			<view class="tui-order-item" v-for="item in orders[order_status]"  :key="item.order_id" :data-order_id="item.order_id">
				<tui-list-cell :hover="false" :lineLeft="false">
					<view class="tui-goods-title">
						<view>订单号：{{item.order_no}}</view>
						<view class="tui-order-status">{{item.status_label}}</view>
					</view>
				</tui-list-cell>
				<block v-for="goods in  item.goods" :key="goods.order_goods_id">
					<tui-list-cell padding="0" @click="detail">
						<view class="tui-goods-item">
							<image :src="goods.thumb" class="tui-goods-img padding-sm" mode="widthFix"></image>
							<view class="tui-goods-center">
								<view class="tui-goods-name">{{goods.goods_name}}</view>
								<view class="tui-goods-attr">黑色，50ml</view>
							</view>
							<view class="tui-price-right">
								<view>￥{{goods.goods_price}}</view>
								<view>x{{goods.total_num}}</view>
							</view>
						</view>
					</tui-list-cell>
				</block>
				<tui-list-cell :hover="false" unlined>
					<view class="tui-goods-price">
						<view>共4件商品 合计：</view>
						<view class="tui-size-24">￥</view>
						<view class="tui-price-large">{{item.total_price}}</view>
					</view>
				</tui-list-cell>
				<view class="tui-order-btn">
					
					<view class="tui-btn-ml" :data-order_id="item.order_id"  data-ctype='qxdd' @click="confirms" v-if="item.order_status==0">
						<tui-button type="black" plain width="152rpx" height="56rpx" :size="26" shape="circle">取消</tui-button>
					</view>
					<view class="tui-btn-ml"  @click="detail"  :data-order_id="item.order_id">
						<tui-button type="black" plain width="152rpx" height="56rpx" :size="26" shape="circle">详情</tui-button>
					</view>
					<view class="tui-btn-ml"  :data-order_id="item.order_id" data-ctype='qrsh' @click="confirms" v-if="item.order_status==2">
						<tui-button type="black" plain width="152rpx" height="56rpx" :size="26" shape="circle">确认收货</tui-button>
					</view>
					<view class="tui-btn-ml"  :data-order_id="item.order_id" data-ctype='comment' @click="confirms" v-if="item.order_status==3">
						<tui-button type="black" plain width="152rpx" height="56rpx" :size="26" shape="circle">评价</tui-button>
					</view>
					<view class="tui-btn-ml" 	:data-order_id="item.order_id" 
							:data-body="item.order_body"
							:data-order_no="item.order_no"
							:data-pay_price="item.pay_price"
							@click="wechatpay"
							v-if="item.order_status==0">
						<tui-button type="danger" plain width="152rpx" height="56rpx" :size="26" shape="circle">付款</tui-button>
					</view>
				</view>
			</view>

		</view>
		<!--加载loadding-->
		<tui-loadmore v-if="loadding" :index="3" type="red"></tui-loadmore>
		<tui-nomore v-if="!pullUpOn" backgroundColor="#fafafa"></tui-nomore>
		<!--加载loadding-->

	</view>
</template>

<script>
	export default {
		data() {
			return {
				pages:{
				'-1':1,
				'0':1,
				'2':1,
				'3':1,
				'4':1,
				},	
				tabs: [{
					name: "全部"
				}, {
					name: "待付款"
				}, {
					name: "待收货"
				}, {
					name: "待评价"
				}, {
					name: "已完成"
				}],
				statusVal:[-1,0,2,3,4],
				orders:{
					'-1':[],
					'0':[],
					'2':[],
					'3':[],
					'4':[]
				},
				order_status:-1,
				
				currentTab: 0,
				pageIndex: 1,
				loadding: false,
				pullUpOn: true,
				scrollTop: 0
			}
		},
		onShow(){
			let that = this;
			console.log('打开一次')
			that.orderlist(1,-1);
		},
		methods: {
			change(e) {
				let that = this
				that.currentTab = e.index
				that.order_status = that.statusVal[e.index];
				that.scrollLeft = (e.index - 1) * 60
				that.orderlist(that.pages[that.order_status],that.statusVal[e.index]);
			},
			detail(e) {
				uni.navigateTo({
					url: '../orderDetail/orderDetail?order_id='+e.currentTarget.dataset.order_id
				})
			},
			orderlist(page,order_status){
				console.log('获取订单列表')
				let pageSize = 10;
				let that = this
				// 获取订单列表
				that.tui.request("/diandi_shop/order/list","POST",{
							page:page,
							pageSize:pageSize,
							order_status:order_status
						}).then((res)=>{
						console.log('订单提交',res.code,res)
						if(res.code==200){
							that.orders[order_status] = res.data
							that.pages[order_status]++
							console.log(res.data)
							that.$forceUpdate();
						}else{
							that.tui.toast(res.message);
						}
				}).catch((err)=>{
					console.log("错误",err);
				});
			},
			confirms(e){
				let ctype =e.currentTarget.dataset.ctype
				let that = this;
				let order_id = e.currentTarget.dataset.order_id;
				if(ctype=='comment'){
					uni.navigateTo({
						url:"../comment/comment?order_id"+order_id,
						complete(res) {
							console.log(res)
						}
					})
					return false;
				}
				
				that.tui.request("/diandi_shop/order/confirm","POST",{
							order_id:order_id,
							ctype:ctype
						}).then((res)=>{
						console.log('订单提交',res.code,res)
						if(res.code==200){
							that.orderdetail = res.data;
							console.log('详情',res)
							that.tui.toast(res.message)
							that.orderlist(that.pages[that.order_status],that.order_status)
							console.log(res.data)
						}else{
							that.tui.toast(res.message);
						}
				}).catch((err)=>{
					console.log("错误",err);
				});
			},
			async wechatpay(e){
			   let that = this;	
			   let orderInfo =e.currentTarget.dataset;
			   let fans = uni.getStorageSync('fans');
			   
			   console.log('订单支付信息组合',{
								openid:fans.openid,
								trade_type:'JSAPI',
								body:orderInfo.body,
								out_trade_no:orderInfo.order_no,
								total_fee:orderInfo.pay_price,
							},orderInfo)
					// 获取支付参数
				that.tui.request("/wechat/basics/payparameters","POST",{
							openid:fans.openid,
							trade_type:'JSAPI',
							body:orderInfo.body,
							out_trade_no:orderInfo.order_no,
							total_fee:orderInfo.pay_price,
						}).then((parameters)=>{
							if(parameters.code==200){
								// 获取支付参数
								// 仅作为示例，非真实参数信息。
								uni.requestPayment({
									provider: 'wxpay',
									timeStamp: parameters.data.timestamp,
									nonceStr: parameters.data.nonceStr,
									package: parameters.data.package,
									signType: parameters.data.signType,
									paySign: parameters.data.paySign,
									success: function (res) {
										console.log('success:' + JSON.stringify(res));
										uni.redirectTo({
											url:"detail?order_id="+orderInfo.order_id
										})
									},
									fail: function (err) {
										console.log('fail:' + JSON.stringify(err));
										
										let msg = err.errMsg=='requestPayment:fail cancel'?'取消支付':err.errMsg
										that.tui.toast(res.message)
										return false;
									}
								});
							
								console.log(parameters)
							}else{
								that.tui.toast(res.message);
							}
				}).catch((err)=>{
					console.log("错误",err);
				});
					
			}
		},
		onPullDownRefresh() {
			setTimeout(() => {
				uni.stopPullDownRefresh()
			}, 200);
		},
		onReachBottom() {
			//只是测试效果，逻辑以实际数据为准
			this.loadding = true
			this.pullUpOn = true
			setTimeout(() => {
				this.loadding = false
				this.pullUpOn = false
			}, 1000)
		},
		onPageScroll(e) {
			this.scrollTop = e.scrollTop;
		}
	}
</script>

<style>
	.container {
		padding-bottom: env(safe-area-inset-bottom);
	}

	.tui-order-list {
		margin-top: 80rpx;
	}

	.tui-order-item {
		margin-top: 20rpx;
		border-radius: 10rpx;
		overflow: hidden;
	}

	.tui-goods-title {
		width: 100%;
		font-size: 28rpx;
		display: flex;
		align-items: center;
		justify-content: space-between;
	}

	.tui-order-status {
		color: #888;
		font-size: 26rpx;
	}

	.tui-goods-item {
		width: 100%;
		padding: 20rpx 30rpx;
		box-sizing: border-box;
		display: flex;
		justify-content: space-between;
	}

	.tui-goods-img {
		width: 180rpx;
		height: 180rpx;
		display: block;
		flex-shrink: 0;
	}

	.tui-goods-center {
		flex: 1;
		padding: 20rpx 8rpx;
		box-sizing: border-box;
	}

	.tui-goods-name {
		max-width: 310rpx;
		word-break: break-all;
		overflow: hidden;
		text-overflow: ellipsis;
		display: -webkit-box;
		-webkit-box-orient: vertical;
		-webkit-line-clamp: 2;
		font-size: 26rpx;
		line-height: 32rpx;
	}

	.tui-goods-attr {
		font-size: 22rpx;
		color: #888888;
		line-height: 32rpx;
		padding-top: 20rpx;
		word-break: break-all;
		overflow: hidden;
		text-overflow: ellipsis;
		display: -webkit-box;
		-webkit-box-orient: vertical;
		-webkit-line-clamp: 2;
	}

	.tui-price-right {
		text-align: right;
		font-size: 24rpx;
		color: #888888;
		line-height: 30rpx;
		padding-top: 20rpx;
	}

	.tui-color-red {
		color: #E41F19;
		padding-right: 30rpx;
	}

	.tui-goods-price {
		width: 100%;
		display: flex;
		align-items: flex-end;
		justify-content: flex-end;
		font-size: 24rpx;
	}

	.tui-size-24 {
		font-size: 24rpx;
		line-height: 24rpx;
	}

	.tui-price-large {
		font-size: 32rpx;
		line-height: 30rpx;
		font-weight: 500;
	}

	.tui-order-btn {
		width: 100%;
		display: flex;
		align-items: center;
		justify-content: flex-end;
		background: #fff;
		padding: 10rpx 30rpx 20rpx;
		box-sizing: border-box;
	}

	.tui-btn-ml {
		margin-left: 20rpx;
	}
</style>

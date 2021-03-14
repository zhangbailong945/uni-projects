<template>
	<view class="tui-safe-area">
		<view class="tui-address">
			<block v-for="(item,index) in addressLists" :key="index">
				<tui-list-cell padding="0" >
					<view class="tui-address-flex"  @click="RadioChange" :data-id="item.address_id" :data-index="index">
						<view class="tui-address-left">
							<view class="tui-address-main">
								<view class="tui-address-name tui-ellipsis">{{item.name}}</view>
								<view class="tui-address-tel">{{item.phone}}</view>
							</view>
							<view class="tui-address-detail">
								<view class="tui-address-label" v-if="is_default===0">默认</view>
								<view class="tui-address-label" >{{item.regions.merger_name}}</view>
								<text>{{item.detail}}</text>
							</view>
						</view>
						<view class="tui-address-imgbox" @click="editAddr(index)">
							<image class="tui-address-img" src="/static/images/mall/my/icon_addr_edit.png" />
						</view>
					</view>
				</tui-list-cell>
			</block>
			
			<view class="tui-cart-cell  tui-mtop text-center" v-if="addressLists.length==0">
				<view class="flex-sub  text-xl padding-top text-grey">
					<iconfont className="icon-meiyoudingdan-01" size="100" color="#e5e5e5"></iconfont>
					没有收货地址
				</view>
			</view>
			
		</view>
		<!-- 新增地址 -->
		<view class="tui-address-new">
			<tui-button shadow shape="circle" type="danger" height="88rpx" @click="addAddr">+ 新增收货地址</tui-button>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				addressList: [1,2,3],
				addressLists:[],
			}
		},
		onShow(){
			let that = this
			that.initPage()
		},
		onLoad(){
			
		},
		methods: {
			initPage(){
				let that = this
				that.getlist()
			},
			addAddr(){
				uni.navigateTo({
					url: "../editAddress/editAddress"
				})
			},
			editAddr(index, addressType) {
				let that = this
				console.log(that.addressLists,index)
				uni.navigateTo({
					url: "../editAddress/editAddress?id="+that.addressLists[index].address_id
				})
			},
			RadioChange(e) {
				let that = this
				console.log(e)
				let radio = e.currentTarget.dataset.id
				let index = e.currentTarget.dataset.index
				uni.setStorageSync('addressSet',that.addressLists[index])
				uni.navigateBack({
					delta:1
				})
			},
			getlist(){
				let that = this
				that.tui.request("/diandi_shop/address/lists","POST",{}).then((res)=>{
					uni.hideLoading();
					if(res.code==200){
						that.addressLists = res.data
						res.data.forEach(items=>{
							if(items.is_default==1){
								that.radio = items.address_id
							}
						})
						console.log('默认收货地址',res)
					}else{
						that.tui.toast(res.message);
					}
					console.log('商品详情222',res.data);
				}).catch((err)=>{
					console.log("错误",err);
				});
				
				
			},
			del(e){
				let id = e.currentTarget.dataset.id
					console.log(e,id)
				let that = this
				that.tui.request("/diandi_shop/address/deletes","POST",{
						'address_id':id
				}).then((res)=>{
					uni.hideLoading();
					if(res.code==200){
						that.addressLists = res.data
						res.data.forEach(items=>{
							if(items.is_default==1){
								that.radio = items.address_id
							}
						})
						console.log('默认收货地址',res)
					}else{
						that.tui.toast(res.message);
					}
				}).catch((err)=>{
					console.log("错误",err);
				});
				
			
			}
		}
	}
</script>

<style>
	.tui-address {
		width: 100%;
		padding-top: 20rpx;
		padding-bottom: 160rpx;
	}
	.tui-address-flex {
		display: flex;
		justify-content: space-between;
		align-items: center;
	}

	.tui-address-main {
		width: 600rpx;
		height: 70rpx;
		display: flex;
		font-size: 30rpx;
		line-height: 86rpx;
		padding-left: 30rpx;
	}

	.tui-address-name {
		width: 120rpx;
		height: 60rpx;
	}

	.tui-address-tel {
		margin-left: 10rpx;
	}

	.tui-address-detail {
		font-size: 24rpx;
		word-break: break-all;
		padding-bottom: 25rpx;
		padding-left: 25rpx;
		padding-right: 120rpx;
	}

	.tui-address-label {
		padding: 5rpx 8rpx;
		flex-shrink: 0;
		background: #e41f19;
		border-radius: 6rpx;
		color: #fff;
		display: inline-flex;
		align-items: center;
		justify-content: center;
		font-size: 25rpx;
		line-height: 25rpx;
		transform: scale(0.8);
		transform-origin: center center;
		margin-right: 6rpx;
	}

	.tui-address-imgbox {
		width: 80rpx;
		height: 100rpx;
		position: absolute;
		display: flex;
		justify-content: center;
		align-items: center;
		right: 10rpx;
	}

	.tui-address-img {
		width: 36rpx;
		height: 36rpx;
	}

	.tui-address-new {
		width: 100%;
		position: fixed;
		left: 0;
		bottom: 0;
		z-index: 999;
		padding: 20rpx 25rpx 30rpx;
		box-sizing: border-box;
		background: #fafafa;
	}

	.tui-safe-area {
		padding-bottom: env(safe-area-inset-bottom);
	}
</style>

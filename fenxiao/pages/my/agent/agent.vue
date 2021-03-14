<template>
	<view class="container">
		<view class="tui-mybg-box">
			<image :src="'../../../static/images/mall/img_bg_3x.png'" class="tui-my-bg" mode="widthFix"></image>
			<view class="tui-header-center text-center" v-if="member.fans">
				<image :src="member.fans.avatarUrl" mode="widthFix" class="tui-avatar radius" @tap="href(3)"></image>
			</view>
			<view class="tui-header-btm" @tap="href(5)">
				<view class="tui-btm-item">
					<view class="tui-btm-num">{{nums.total}}人</view>
					<view class="tui-btm-text">总人数</view>
				</view>
				<view class="tui-btm-item">
					<view class="tui-btm-num">{{nums[1]}}人</view>
					<view class="tui-btm-text">一级人数</view>
				</view>
				<view class="tui-btm-item">
					<view class="tui-btm-num">{{nums[2]}}人</view>
					<view class="tui-btm-text">二级人数</view>
				</view>
			</view>
		</view>
		<!--searchbox-->
		<view class="cu-bar search bg-white radius  tui-shadow-gradual">
			<view class="search-form round">
				<text class="cuIcon-search"></text>
				<input @focus="InputFocus" @blur="InputBlur" v-model="keywords" :adjust-position="false" type="text" placeholder="搜索成员"
				 confirm-type="search" @confirm="search"></input>
			</view>
		</view>
		<!--searchbox-->
		
		
		<view class="margin-top-lg">
			<tui-tabs :tabs="tabs" :isFixed="false" :currentTab="currentTab" selectedColor="#E41F19" sliderBgColor="#E41F19"
			 @change="change"   itemWidth="50%"></tui-tabs>
			 
			
		</view>
		


		<block v-for="(item,index) in lists[currentTab+1]" :key="index">
			<tui-list-cell @click="detail" :unlined="true">
				<view class="tui-chat-item">
					<view class="tui-msg-box">
						<image :src="item.wxappfans.avatarUrl" class="tui-msg-pic" mode="widthFix"></image>
						<view class="tui-msg-item">
							<view class="tui-msg-name">{{item.wxappfans.nickname}}</view>
							<view class="tui-msg-content">{{item.create_time}}</view>
						</view>
					</view>
					<view class="tui-msg-right" >
						<view class="tui-msg-time">{{item.level_name}}</view>
					</view>
				</view>
			</tui-list-cell>
		</block>
		<view class="tui-safearea-bottom"></view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				InputBottom: 0,
				current: 0,
				keywords:'',
				member:{},
				pages:{
					'1':1,
					'2':1
				},
				lists:{
					'1':[],
					'2':[]
				},
				tabs: [{
					name: "一级团队"
				}, {
					name: "二级团队"
				}],
				nums:{
					'1':0,'2':0,'total':0
				},
				scrollTop: 60,
				currentTab: 0
			}
		},
		onShow() {
			let that = this;
			that.initPage();
		},
		methods: {
			initPage(){
				let that = this 
				that.getAgent();
				that.getMemberinfo();
			},
			getAgent(){
				let that = this
				that.tui.request("/diandi_distribution/member/myagent","GET",{
					page:that.pages[that.currentTab+1],
					keywords:that.keywords
				}).then((res)=>{
					console.log(res)
					if (res.code == 200) {
						that.nums = res.data.nums
						console.log(res.data)
						that.lists[that.currentTab+1] = res.data.list[that.currentTab+1]
						console.log(that.lists)
						that.list = res.data
					} else {
						that.tui.toast(res.message);
					}
				}).catch((res)=>{
					console.log(res)
				})
			},
			getMemberinfo(){
				let that = this
				that.tui.request("/diandi_distribution/member/info","GET",{}).then((res)=>{
					console.log(res)
					if (res.code == 200) {
						console.log(res.data)
						that.member = res.data
					} else {
						that.tui.toast(res.message);
					}
				}).catch((res)=>{
					console.log(res)
				})
			
			},
			InputFocus(e) {
				this.InputBottom = e.detail.height
			},
			InputBlur(e) {
				this.InputBottom = 0
			},
			tabbarSwitch: function(e) {
				let index = e.currentTarget.dataset.index;
				this.current = index;
				if (index != 0) {
					if (index == 1) {
						uni.navigateTo({
							url: '../friendList/friendList'
						})
					} else {
						this.tui.toast("功能开发中~")
					}
				}
			},
			change(e) {
				let that = this
				that.currentTab = e.index
				let k = e.index+1
				that.scrollLeft = (e.index - 1) * 60
				that.getAgent();
			},
			search: function(e) {
				let that = this
				that.pages[that.currentTab+1] = 1
				console.log(e)
				that.getAgent();
			},
			detail: function() {
				uni.navigateTo({
					url: '../chat/chat'
				})
			}
		},
		onPullDownRefresh: function() {
			uni.stopPullDownRefresh();
		}
	}
</script>

<style>
	.container {
		padding-bottom: 100rpx
	}

	.tui-header-box {
		width: 100%;
		padding: 0 30rpx 0 20rpx;
		box-sizing: border-box;
		position: fixed;
		top: 0;
		left: 0;
		display: flex;
		align-items: center;
		justify-content: flex-end;
		height: 32px;
		transform: translateZ(0);
		z-index: 9999;
	}
	.search{
		position: absolute;
		top: 389.5rpx;
		width: 95%;
		left: 2.5%;

	}
	/* #ifndef MP */
	.tui-header-icon {
		min-width: 120rpx;
		display: flex;
		align-items: center;
		justify-content: space-between;
	}
	
	/* #endif */
	/* #ifdef MP */
	.tui-set-box {
		display: flex;
		align-items: center;
		justify-content: space-between;
	}
	
	/* #endif */
	.tui-icon-box {
		position: relative;
	}
	
	.tui-icon-setup {
		margin-left: 8rpx;
	}
	
	.tui-badge {
		position: absolute;
		font-size: 24rpx;
		height: 32rpx;
		min-width: 20rpx;
		padding: 0 6rpx;
		border-radius: 40rpx;
		right: 10rpx;
		top: -5rpx;
		transform: scale(0.8) translateX(60%);
		transform-origin: center center;
		display: flex;
		align-items: center;
		justify-content: center;
		z-index: 10;
	}
	
	.tui-badge-red {
		background: #F74D54;
		color: #fff;
	}
	
	.tui-badge-white {
		background: #fff;
		color: #F74D54;
	}
	
	.tui-badge-dot {
		position: absolute;
		height: 12rpx;
		width: 12rpx;
		border-radius: 50%;
		right: -12rpx;
		top: 0;
		background: #F74D54;
	}
	
	.tui-mybg-box {
		width: 100%;
		height: 464rpx;
		position: relative;
	}
	
	.tui-my-bg {
		width: 100%;
		height: 464rpx;
		display: block;
	}
	
	.tui-header-center {
		position: absolute;
		width: 100%;
		height: 128rpx;
		left: 0;
		top: 120rpx;
		padding: 0 30rpx;
		box-sizing: border-box;
		display: block;
		align-items: center;
	}
	
	.tui-avatar {
		flex-shrink: 0;
		width: 128rpx;
		height: 128rpx;
	}
	
	.tui-info {
		width: 60%;
		padding-left: 30rpx;
	
	}
	
	.tui-nickname {
		font-size: 30rpx;
		font-weight: 500;
		color: #fff;
		display: flex;
		align-items: center;
	}
	
	.tui-img-vip {
		width: 56rpx;
		height: 24rpx;
		margin-left: 18rpx;
	}
	
	.tui-explain {
		width: 80%;
		font-size: 24rpx;
		font-weight: 400;
		color: #fff;
		opacity: 0.75;
		padding-top: 8rpx;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}
	
	.tui-btn-edit {
		flex-shrink: 0;
		padding-right: 22rpx;
	}
	
	.tui-header-btm {
		width: 100%;
		padding: 0 30rpx;
		box-sizing: border-box;
		position: absolute;
		left: 0;
		top: 280rpx;
		display: flex;
		align-items: center;
		justify-content: space-between;
		color: #fff;
	}
	/*searchbox*/

	.tui-searchbox {
		width: 100%;
		height: 100rpx;
		padding: 0 30rpx;
		box-sizing: border-box;
		background: #fff;
		display: flex;
		align-items: center;
		justify-content: center;
		position: relative;
	}

	.tui-search-input {
		width: 100%;
		height: 72rpx;
		background: #fafafa;
		border-radius: 36rpx;
		font-size: 30rpx;
		color: #A8ABB8;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.tui-search-text {
		padding-left: 16rpx;
	}

	/*searchbox*/

	.tui-chat-item {
		width: 100%;
		display: flex;
		align-items: center;
		justify-content: space-between;
	}

	.tui-msg-box {
		display: flex;
		align-items: center;
	}

	.tui-msg-pic {
		width: 100rpx;
		height: 100rpx;
		border-radius: 50%;
		display: block;
		margin-right: 24rpx;
	}

	.tui-msg-item {
		max-width: 500rpx;
		min-height: 80rpx;
		overflow: hidden;
		display: flex;
		flex-direction: column;
		justify-content: space-between;
	}

	.tui-msg-name {
		overflow: hidden;
		white-space: nowrap;
		text-overflow: ellipsis;
		font-size: 34rpx;
		line-height: 1;
		color: #262b3a;
	}

	.tui-msg-content {
		overflow: hidden;
		white-space: nowrap;
		text-overflow: ellipsis;
		font-size: 28rpx;
		line-height: 1;
		color: #9397a4;
	}

	.tui-msg-right {
		max-width: 120rpx;
		height: 88rpx;
		margin-left: auto;
		text-align: right;
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		align-items: flex-end;
	}

	.tui-msg-right.tui-right-dot {
		height: 76rpx;
		padding-bottom: 10rpx;

	}

	.tui-msg-time {
		width: 100%;
		font-size: 24rpx;
		line-height: 24rpx;
		color: #9397a4;
	}
	
	
	.tui-btm-item {
		flex: 1;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
	}
	
	.tui-btm-num {
		font-size: 32rpx;
		font-weight: 600;
		position: relative;
	}
	
	.tui-btm-text {
		font-size: 24rpx;
		opacity: 0.85;
		padding-top: 4rpx;
	}
	
	.tui-content-box {
		width: 100%;
		padding: 0 30rpx;
		box-sizing: border-box;
		position: relative;
		top: -72rpx;
		z-index: 10;
	}
	
	.tui-box {
		width: 100%;
		background: #fff;
		box-shadow: 0 3rpx 20rpx rgba(183, 183, 183, 0.1);
		border-radius: 10rpx;
		overflow: hidden;
	}
	
	.tui-order-box {
		height: 208rpx;
	}
	
	.tui-cell-header {
		width: 100%;
		height: 74rpx;
		padding: 0 26rpx;
		box-sizing: border-box;
		display: flex;
		align-items: center;
		justify-content: space-between;
	}
	
	.tui-cell-title {
		font-size: 30rpx;
		line-height: 30rpx;
		font-weight: 600;
		color: #333;
	}
	
	.tui-cell-sub {
		font-size: 26rpx;
		font-weight: 400;
		color: #999;
		padding-right: 28rpx;
	}
</style>

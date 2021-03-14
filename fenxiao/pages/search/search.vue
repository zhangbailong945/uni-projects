<template>
	<view class="container">
		<view class="tui-searchbox">
			<view class="tui-search-input">
				<icon type="search" :size='13' color='#333'></icon>
				<input confirm-type="search" placeholder="找你想要的" :focus="true" auto-focus placeholder-class="tui-input-plholder"
				 class="tui-input" v-model.trim="key" @input="inputKey"/>
				<icon type="clear" :size='13' color='#bcbcbc' @tap="cleanKey" v-show="key"></icon>
			</view>
			<view class="tui-cancle" @tap="cleanKey">取消</view>
		</view>

		<view class="tui-search-history" v-show="history.length>0 && !key">
			<view class="tui-history-header">
				<view class="tui-search-title">搜索历史</view>
				<iconfont className="icon-lajixiang" :size='14' color='#333' @tap="openActionSheet" ></iconfont>
			</view>
			<view class="tui-history-content">
				<block v-for="(item,index) in history" :key="index">
					<tui-tag margin="0 24rpx 24rpx 0" type="gray" shape="circle" @click="searchTag(item)">{{item}}</tui-tag>
				</block>
			</view>
		</view>
		<view v-show="key">
			<view class="tui-header">
				<view class="tui-header-left tui-noboredr">搜索 “{{key}}”</view>
			</view>
			<view class="tui-result-box">
				<block v-for="(item,index) in searchList" :key="index"  >
					<view class="tui-result-item" hover-class="tui-opcity" :hover-stay-time="150" :data-goods_id="item.key" @tap="detail($event)">
						<rich-text :nodes="item.showKey"></rich-text>
					</view>
				</block>
			</view>
		</view>

		<view class="tui-search-hot">
			<view class="tui-hot-header">
				<view class="tui-search-title">大家正在搜</view>
			</view>
			<view class="tui-hot-content">
				<block v-for="(item,index) in hot" :key="index">
					<tui-tag type="gray" margin="0 24rpx 24rpx 0"  shape="circle" @click="searchTag(item)">{{item}}</tui-tag>
				</block>
			</view>
		</view>
		<tui-actionsheet :show="showActionSheet" :tips="tips" @click="itemClick" @cancel="closeActionSheet"></tui-actionsheet>
	</view>

</template>

<script>
	const util = require("@/common/utils/util.js")
	export default {
		data() {
			return {
				history: [],
				hot: [],
				key: "",
				showActionSheet: false,
				tips: "确认清空搜索历史吗？",
				searchResult:[],
				searchList:[]
			}
		},
		onShow() {
			let that = this
			uni.getStorage({
			    key: 'historykeywords',
			    success: function (res) {
					
					that.history = res.data
			    }
			});
		},
		onLoad(options) {
			let that = this
			let key = options.key
			if(key){
				that.searchTag(key)
			}
			that.initPage()
		},
		methods: {
			initPage(){
				let that = this
				that.tui.store().then((res)=>{
					that.hot = res.hotSearch.split(',')
					console.log('关键词热搜',res.hotSearch,res.hotSearch.split(','))
				}).catch((res)=>{
					console.log('shibai',res)
				});
			},
			searchTag(keywords){
				let that = this
				that.key = util.trim(keywords)
				that.searchGoods(that.key)
			},
			searchGoods(keywords){
				let that = this;
				let page =  that.page
				let pageSize = that.pageSize
				that.tui.request("/diandi_shop/goods/search","GET",{
					page:1,
					pageSize:20,
					keywords:keywords,
				}).then((res)=>{
					console.log(res)
					if (res.code == 200) {
						let goodsList = res.data;
						if(goodsList.length>0){
							if(that.history.join(',').indexOf(keywords) ==-1){
								that.history.push(keywords)
							}
							
							uni.setStorageSync('historykeywords',that.history)
							//根据关键词查找
							let arr = []
							//实际开发中，根据搜索返回结果集，此处只是做展示提示搜索哪些文字
							goodsList.forEach((item) => {
								arr.push({
									key: item.goods_id,
									showKey: util.replaceAll(item.goods_name, keywords, `<label style="color:#E41F19">${keywords}</label>`)
								})
							})
							console.log(arr)
							this.searchList = arr
							
							that.isShowKeywordList = true;
						}else{
							that.tui.toast('暂无有关的商品，请重新搜索')
						}
					} else {
						that.tui.toast(res.message);
					}
				}).catch((res)=>{
					console.log("错误le ma ",res);
				})
			},
			detail: function(event) {
				let that = this
				let goods_id = event.currentTarget.dataset.goods_id
				console.log('商品idsss',goods_id)
				uni.navigateTo({
					url: '../productDetail/productDetail?goods_id='+goods_id
				});
			},
			back: function() {
				uni.navigateBack();
			},
			cleanKey: function() {
				this.key = ''
			},
			closeActionSheet: function() {
				this.showActionSheet = false
			},
			openActionSheet: function() {
				this.showActionSheet = true
			},
			itemClick: function(e) {
				let index = e.index;
				if (index == 0) {
					this.showActionSheet = false;
					this.history = []
				}
			},
			inputKey: function(e) {
				this.key = util.trim(e.detail.value);
				if (!this.key) {
					this.searchList = [];
					return;
				}
				this.searchGoods(this.key)
			
			}
		}
	}
</script>

<style>
	page {
		color: #333;
		background: #fff;
	}

	.container {
		padding: 0 30rpx 30rpx 30rpx;
		box-sizing: border-box;
	}

	.tui-searchbox {
		padding: 30rpx 0;
		box-sizing: border-box;
		display: flex;
		align-items: center;
	}

	.tui-search-input {
		width: 100%;
		height: 66rpx;
		border-radius: 35rpx;
		padding: 0 30rpx;
		box-sizing: border-box;
		background: #f2f2f2;
		display: flex;
		align-items: center;
		flex-wrap: nowrap;
	}

	.tui-input {
		flex: 1;
		color: #333;
		padding: 0 16rpx;
		font-size: 28rpx;
	}

	.tui-input-plholder {
		font-size: 28rpx;
		color: #b2b2b2;
	}

	.tui-cancle {
		color: #888;
		font-size: 28rpx;
		padding-left: 30rpx;
		flex-shrink: 0;
	}

	.tui-history-header,.tui-hot-header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 30rpx 0;
	}
	.tui-history-content,.tui-hot-content{
		display: flex;
		align-items: center;
		flex-wrap: wrap;
	}

	.tui-icon-delete {
		padding: 10rpx;
	}

	.tui-search-title {
		font-size: 28rpx;
		font-weight: bold;
	}

	.tui-hot-header {
		padding: 30rpx 0;
	}
	
	.tui-header {
		padding: 26rpx 0;
		box-sizing: border-box;
		display: flex;
		align-items: center;
		justify-content: space-between;
	}
	
	.tui-header-left {
		font-size: 30rpx;
		color: #222;
		border-left: 4rpx solid #EB0909;
		padding-left: 10rpx;
		word-break: break-all;
	}
	
	.tui-noboredr {
		border-left: 0 !important;
	}

	.tui-result-box {
		font-size: 28rpx;
	}
	
	.tui-result-item {
		line-height: 28rpx;
		padding: 28rpx 0;
	}
</style>
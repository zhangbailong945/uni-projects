<template>
	<view
		v-if="show"
		class="t-notice-bar"
		:style="{
			background: computeBgColor
		}"
		:class="[
			type ? `u-type-${type}-light-bg` : ''
		]"
	>
		<view class="t-direction-row">
			<view class="t-notice-box" id="t-notice-box">
				<view
					class="t-notice-content"
					id="t-notice-content"
					:style="{
						animationDuration: animationDuration,
						animationPlayState: animationPlayState,
					}"
				>
					<text class="t-notice-text" @tap="click" 
					:class="['u-type-' + type]">{{showText}}</text>
				</view>
			</view>
		</view>
	</view>
</template>
<script>
export default {
	props: {
		// 显示的内容，数组
		list: {
			type: Array,
			default() {
				return [];
			}
		},
		// 是否自动播放
		autoplay: {
			type: Boolean,
			default: true
		},
		// 是否显示
		show: {
			type: Boolean,
			default: true
		},
		// 水平滚动时的滚动速度，即每秒滚动多少rpx，这有利于控制文字无论多少时，都能有一个恒定的速度
		speed: {
			type: [Number, String],
			default: 140
		}
	},
	data() {
		return {
			textWidth: 0, // 滚动的文字宽度
			animationDuration: '10s', // 动画执行时间
			animationPlayState: 'paused', // 动画的开始和结束执行
			showText: '' // 显示的文本
		};
	},
	watch: {
		list: {
			immediate: true,
			handler(val) {
				this.showText = val.join('，');
				this.$nextTick(() => {
					this.initSize();
				});
			}
		},
		speed(val) {
			this.initSize();
		}
	},
	mounted() {
		this.$nextTick(() => {
			this.initSize();
		});
	},
	methods: {
		initSize() {
			let query = [],
				textWidth = 0;
			let textQuery = new Promise((resolve, reject) => {
				uni.createSelectorQuery()
					.in(this)
					.select(`#t-notice-content`)
					.boundingClientRect()
					.exec(ret => {
						this.textWidth = ret[0].width;
						resolve();
					});
			});
			query.push(textQuery);
			Promise.all(query).then(() => {
				this.animationDuration = `${this.textWidth / uni.upx2px(this.speed)}s`;
				this.animationPlayState = 'paused';
				setTimeout(() => {
					if(this.autoplay) this.animationPlayState = 'running';
				}, 10);
			});
		},
		// 点击通告栏
		click(index) {
			this.$emit('click');
		},
		// 点击关闭按钮
		close() {
			this.$emit('close');
		},
		// 点击更多箭头按钮
		getMore() {
			this.$emit('getMore');
		}
	}
};
</script>

<style  scoped>

.t-notice-bar {
	padding: 18rpx 24rpx;
	overflow: hidden;
	background: #f90;
	color:#fff;
}

.t-direction-row {
	display: flex;
	flex-direction: row;
	align-items: center;
	justify-content: space-between;
}


.t-notice-box {
	flex: 1;
	display: flex;
	flex-direction: row;
	overflow: hidden;
	margin-left: 12rpx;
}

.t-notice-content {
	animation: loop-animation 10s linear infinite both;
	text-align: right;
	// 这一句很重要，为了能让滚动左右连接起来
	padding-left: 100%;
	display: flex;
	flex-direction: row;
	flex-wrap: nowrap;
	
}

.t-notice-text {
	font-size: 26rpx;
	word-break: keep-all;
	white-space: nowrap
}

@keyframes loop-animation {
	0% {
		transform: translate3d(0, 0, 0);
	}

	100% {
		transform: translate3d(-100%, 0, 0);
	}
}
</style>

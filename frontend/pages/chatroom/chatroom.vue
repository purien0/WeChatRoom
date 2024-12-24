<template>
	<view>
    <!-- top nav -->
		<view class="status-bar">
      <view class="login-c" @click="navBack">
        <image src="../../static/back.png" class="login-back"></image> 
      </view>

			<scroll-view scroll-x="true" class="scrollv">
				<view class="users">
					<view v-for="(e,index) in users" class="user-l" @tap="otoChat(index)" :key="index">
						<view v-if="e.name!=name">
							<view class="tip" v-if="e.tip"></view>
							<image :src="'../../static/images/'+e.img+'.'+imgExtension[e.img]"></image>
						</view>
					</view>

				</view>
			</scroll-view>
		</view>

    <!-- main -->
		<view class="main">
			<view v-for="(e,index) in chat" :key="index">
				<view class="left msg" v-if="e.id ==1">
					<image :src="'../../static/images/'+e.img+'.'+imgExtension[e.img]"></image>
					<image :src="'data:image/png;base64,' + e.neir" v-if="e.type=='img'" class="sendimg" mode="heightFix" @tap="clickimage(e.neir)"></image>
					<view class="nr">
						<view class="neir" v-if="e.type=='text'">
							{{e.neir}}
						</view>
						<view class="nt">{{e.name}} {{timeDetia(e.time)}}</view>
					</view>
				</view>
				<view class="right msg" v-if="e.id==2">
					<image :src="'../../static/images/'+e.img+'.'+imgExtension[e.img]"></image>
					<image :src="'data:image/png;base64,' + e.neir" v-if="e.type=='img'" class="sendimg" mode="heightFix" @tap="clickimage(e.neir)"></image>
					<view class="nr" >
						<view class="neir" v-if="e.type=='text'">
							{{e.neir}}
						</view>
						<view class="nt">{{timeDetia(e.time)}}</view>
					</view>					
				</view>
				<view class="center" v-if="e.id==3">
					<view class="inner">{{e.name}}</view>				
				</view>
			</view>	
		</view>
		<view class="send">
			<textarea type="text" confirm-type="send" class="chat-send"  v-model="chatm" auto-height="true" show-confirm-bar="false" maxlength="-1" />
			<image class="img1" src="../../static/picture.png" mode="aspectFit" @tap="chooseImg"></image>
			<image class="img2" src="../../static/send.png" mode="aspectFit" @tap="sendMsg"></image>
		</view>

		<!-- 弹出层一对一聊天 -->
		<view class="modify" :animation="animationData">
			<view class="u-name">
				{{uname}}
			</view>
			<scroll-view class="modfiy-mian" scroll-y="true">
				<view v-for="(e,index) in otochat" :key="index">
					<view class="left msg" v-if="e.fid == fid">
						<image :src="'../../static/images/'+e.img+'.'+imgExtension[e.img]"></image>
						<image :src="'data:image/png;base64,' + e.neir" v-if="e.type=='img'" class="sendimg" mode="heightFix"  @tap="clickimage(e.neir)"></image>
						<view class="nr">
							<view class="neir" v-if="e.type=='text'">
								{{e.neir}}
							</view>
							<view class="nt">{{timeDetia(e.time)}}</view>
						</view>
					</view>
					<view class="right msg" v-if="e.fid==uid && e.tid == fid">
						<image :src="'../../static/images/'+e.img+'.'+imgExtension[e.img]"></image>
						<image :src="'data:image/png;base64,' + e.neir" v-if="e.type=='img'" class="sendimg" mode="heightFix" @tap="clickimage(e.neir)"></image>
						<view class="nr">
							<view class="neir" v-if="e.type=='text'">
								{{e.neir}}
							</view>
							<view class="nt">{{timeDetia(e.time)}}</view>
						</view>					
					</view>
					<view class="center" v-if="e.id==3">
						<view class="inner">{{e.name}}</view>				
					</view>
				</view>	
			</scroll-view>
		</view>
		<!-- 图片选择界面 -->
		<!-- <view class="pic-modify" :animation="animationData_pic">
			<view class="u-name">
				选中一张图片再次点击即可发送
			</view>
			<view class="pic-modfiy-mian">
				<view v-for="(e,index) in pic" :key="index" class="us-img" @tap="selected(index)">
					<image :src="'../../static/images/'+e.i+'.png'" mode="aspectFit"></image>	
					<view class="dd">
						<view class="ddd" :style="{opacity:e.x}"></view>
					</view>
				</view>
			</view>
		</view> -->
		
<!-- 		<view class="bg" @tap="outotoChat" :style="{display:bg}"></view> -->
	</view>
</template>

<script>
	import { 
		pathToBase64,
		base64ToPath,
	} from '../../components/image-tools'
	export default {
		
		data() {
			return {
				chatm:'',			//消息内容
				name:'',			//用户名称
				uname:'',
				fid:'',
				uid:'a',
				img:'',				//用户头像
				chat:[],			//聊天内容
				member:0,			//成员个数
				animationData: {},
				animationData_pic:{},
				bb:false,
				bg:'none',
				users:'',
				otochat:[],
				showOtoModal: false, 
				sendimg:'',
				sendimg64:'',
				//picbb:false,
				showpicModal:false,
				//picbg:'none'
				nowpic:'a',
				imgExtension: {
				      a: 'jpg',
				      b: 'jpg',
				      c: 'jpg',
				      d: 'jpg',
				      e: 'jpg',
				      f: 'jpg',
				      g: 'jpg',
				      h: 'jpg',
				      i: 'jpg',
				      j: 'jpg',
				      k: 'jpg',
				      l: 'jpg',
				      m: 'jpg',
				      n: 'jpg',
				      o: 'jpg',
				      p: 'jpg',
				      q: 'jpg',
				      r: 'jpg',
				      s: 'jpg',
				      t: 'jpg',
				    },
				pic:[
					{i:'a',x:1},
					{i:'b',x:0},
					{i:'c',x:0},
					{i:'d',x:0},
					{i:'e',x:0},
					{i:'f',x:0},
					{i:'g',x:0},
					{i:'h',x:0},
					{i:'i',x:0},
					{i:'j',x:0},
					{i:'k',x:0},
					{i:'l',x:0},
					{i:'m',x:0},
					{i:'n',x:0},
					{i:'o',x:0},
					{i:'p',x:0},
					{i:'q',x:0},
					{i:'r',x:0},
					{i:'s',x:0},
					{i:'t',x:0},
				],
			}
		},
		onLoad (e) {
			console.log(`[info] chatroom onload`)
			// 如果没有传参，则返回首页
			if(JSON.stringify(e)=='{}'){
				console.log(`[info] 无传参,回退`)
				uni.redirectTo({ url: '/pages/index/index'})
				return
			}
      
			
			this.name = e.name;
			this.img = e.img;
			// 加入聊天室
			this.join(this.name,this.img);
			// 监听事件
			this.welcome();
				this.myself();
				this.receiveMsg();
				this.getmsg();
				this.listen_quit();
		},
		onShow (){
		  console.log(`[info] chatroom onshow`)
		  if(this.name == '' || this.name == undefined)
			uni.showModal({
			  showCancel: false,
			  title: '提示',
			  content: '请先登录',
			  success: (res) => { if (res.confirm) uni.redirectTo({ url: '/pages/index/index'}) }
			})
		},
		onHide(){
		  console.log(`[info] chatroom onhide`)
		  // this.socket.emit('quit',this.name);
		},
		onBackPress(){
		  if(this.showOtoModal){
			this.outotoChat();
			return true
		  }
		  // if(this.showpicModal){
			 //  this.choosepic();
			 //  return true;
		  // }
		},
		methods: {
			navBack(){
				this.socket.emit('quit',this.name);
				uni.navigateBack();
			},
			clickimage(src){
				// 获取图片的扩展名
				    const fileExtension = src.split('.').pop().toLowerCase();  // 获取图片格式（如 png, jpg）
				
				    // 根据图片格式构建正确的 base64 前缀
				    let prefix = 'data:image/png;base64,';  // 默认格式是 png
				    if (fileExtension === 'jpg' || fileExtension === 'jpeg') {
				        prefix = 'data:image/jpeg;base64,';  // 如果是 jpg 格式
				    } else if (fileExtension === 'gif') {
				        prefix = 'data:image/gif;base64,';   // 如果是 gif 格式
				    }
				
				    // 将图片数据加上正确的前缀
				    let url = prefix + src;
					
				//let url="data:image/png;base64,"+src
				base64ToPath(url).then(path=>{
					let imgs=[];
					imgs[0]=path;
					uni.previewImage({
						urls:imgs,
						current:'',
						// success: function (res) {
						// console.log('预览成功');
						// },
						// fail: function (res) {
						// console.log('预览失败');
						// },
						// complete: function (res) {
						// console.log('预览完成');
						// }
					});
				})
				//console.log(url)
				
			},
			timeDetia(date){
				var time;
				var d = new Date(date);
				var n = new Date();
				//获取时间戳
				var dd = d.getTime();
				var h = d.getHours();
				var m = d.getMinutes();
				var Y = d.getFullYear();
				var M = d.getMonth() + 1;
				var D = d.getDate();
				//现在时间
				var nn = n.getTime();
				var hh = n.getHours();
				var mm = n.getMinutes();
				var YY = n.getFullYear();
				var MM = n.getMonth() + 1;
				var DD = n.getDate();
				
				if( D == DD && M == MM && Y ==YY){
					if(h<10){
					h = '0'+h;
					}
					if(m<10){
						m = '0'+m;
					}
					time = h+':'+m;
					return time;
				}else if(D+1 == DD && M == MM && Y ==YY){
					if(h<10){
					h = '0'+h;
					}
					if(m<10){
						m = '0'+m;
					}
					time = '昨天'+' '+h+':'+m;
					return time;
				}else{
					if(M<10){
						M = '0'+M;
					}
					if(D<10){
						D = '0'+D;
					}
					if(h<10){
					h = '0'+h;
					}
					if(m<10){
						m = '0'+m;
					}
					time = Y+'年'+M+'月'+D+'日'+' '+h+':'+m;
					return time;
				}
			},
			//选择图片
			// choosepic(){
			// 	// console.log(this.bb,this.showpicModal)
			// 	if(this.bb && !this.showOtoModal && this.showpicModal){
			// 		this.bb=false;
			// 		this.bg = 'none';
			// 	}else if(!this.bb && !this.showOtoModal && !this.showpicModal){
			// 		this.bg = 'block';
			// 		this.bb=true;
			// 	}// else if(!this.bb && this.showOtoModal && !showpicModal){
					
			// 	// }
			// 	this.showpicModal=!this.showpicModal
			// 	var animation = uni.createAnimation({
			// 		duration: 400,
			// 	    timingFunction: 'ease',
			// 	})
			// 	 this.animation = animation
			// 	 if(this.showpicModal){
			// 	 	animation.bottom(40).step()
				 				 				  
			// 	 }else{
			// 	 	animation.bottom().step()		  
			// 	 }				
			// 	 this.animationData_pic = animation.export()
			// },
			async submit(){
				let img64=''//await 
				await pathToBase64(this.sendimg).then(base64=>{
					base64 = base64.replace(/^data:image\/\w+;base64,/, '').replace(/[\r\n]/g, '');
					img64=base64;
				})
				//console.log(this.sendimg)
				//console.log(JSON.stringify(img64))
				//this.sendimg64=img64;
				//console.log(this.sendimg64)
				if(this.fid==''){
					let onemsg = {
						neir:img64,
						//src:img64,
						img:this.img,
						type:'img',
						time:new Date(),
						id:2,
					}
					let data = {
						neir:img64,
						img:this.img,
						name:this.name,
						type:'img',
						time:new Date(),
						id:1,
					}
					this.chat.push(onemsg)
					//console.log(onemsg.src)
					this.socket.emit('message',data)	
				}else if(this.fid!=''){
					let onemsg = {
						neir:img64,
						img:this.img,
						type:'img',
						time:new Date(),
						fid:this.uid,
						tid:this.fid,
					}
					let data = {
						neir:img64,
						img:this.img,
						name:this.name,
						type:'img',
						time:new Date(),
						fid: this.uid,
						tid: this.fid,
					}
					this.otochat.push(onemsg)
					this.socket.emit('msg',data)
				}
			},
			chooseImg: function(){
				//if(this.pic[index].x == 1 ){
				uni.chooseImage({
					count:1,
					success: (res) => {
						//console.log(res.tempFilePaths[0])
						this.sendimg=res.tempFilePaths[0]
						//console.log(this.sendimg)
						this.submit()
					}
				})
				//console.log(this.sendimg)
				
				
					// console.log(1)
					// uni.getFileSystemManager().readFile({
					// 	filePath:'../../static/images/'+toString(index)+'.png',
					// 	encoding:'binary',
						
					// 	success:function(res){
					// 		console.log(2)
					// 		const buffer = new Uint8Array(res.data);
					
							
							
					// 	}
					// })
				// }
				// else{
				// 	for(let i = 0;i<this.pic.length;i++){
				// 		this.pic[i].x = 0;
				// 	}
				// 	this.pic[index].x = 1;
				// 	this.nowpic = this.pic[index].i;	
				// }
				
			},
			//发送消息
			sendMsg(){
				if(this.chatm.length>0 && this.fid === ''){
					let onemsg = {
						neir:this.chatm,
						img:this.img,
						type:'text',
						time:new Date(),
						id:2,
					}
					let data = {
						neir:this.chatm,
						img:this.img,
						name:this.name,
						type:'text',
						time:new Date(),
						id:1,
					}
					this.chat.push(onemsg);
					this.chatm = '';//清空
					this.socket.emit('message',data);
				}else if(this.chatm.length>0 && this.fid !== ''){
					//一对一聊天
					let onemsg = {
						neir:this.chatm,
						img:this.img,
						type:'text',
						time:new Date(),
						fid:this.uid,
						tid:this.fid,
					}
					let data = {
						neir:this.chatm,
						img:this.img,
						name:this.name,
						type:'text',
						time:new Date(),
						fid: this.uid,
						tid: this.fid,
					}
					this.otochat.push(onemsg);
					this.chatm = '';//清空
					this.socket.emit('msg',data);
				}		
			},
			//加入群
			join(name,img){
				this.socket.emit('join',name,img);
			},
			//欢迎加入群
			welcome(){
				//获取即时信息渲染
				this.socket.on('welcome', (name,users) => {
					// console.log(data)
					// console.log('数字'+len)
					//插入欢迎信息
					let wel = {
						name:'欢迎 '+name+' 加入群聊',
						id:3,
					}
					this.chat.push(wel);
					for(var i=0;i<users.length;i++){
						if(users[i].id == this.uid){
							users.splice(i,1);
						}
					}
					this.users = users;
					console.log(`[info] user:${JSON.stringify(this.users)}`)
					this.$forceUpdate()
				})
			},
			//获取自己
			myself(){
				//获取即时信息渲染
				this.socket.on('myself', (name,users,id) => {
					// console.log(data)
					// console.log('数字'+len)
					//插入欢迎信息
					this.uid = id;
					let wel = { name:'欢迎 '+name+' 加入群聊', id:3,}
					this.chat.push(wel);
					for(var i=0;i<users.length;i++){
						if(users[i].id == this.uid){
							users.splice(i,1);
						}
					}
					this.users = users;
					console.log(`[info] my info:${JSON.stringify(this.users)}`)
				})
			},
			//退出群提醒
			listen_quit(){
				//获取即时信息渲染
				this.socket.on('quit', (name,users) => {
					//插入退出信息
					let wel = { name:name+' 退出群聊',id:3}
					this.chat.push(wel);
					//更新用户列表
					this.users = users
					console.log(`[info] one user left ,current user: ${JSON.stringify(users)}`)
				})
			},
			//获取消息
			receiveMsg(){
				//获取即时信息渲染
				this.socket.on('sendMsg', data => {
					this.chat.push(data);
				})
			},
			//获取一对一消息
			getmsg(){
				this.socket.on('sMsg', data => {
					let fid = data.fid;
					if(this.fid !=fid){
						for(var i=0;i<this.users.length;i++){
							if(this.users[i].id == fid){
								this.users[i].tip = true;
							}
						}
					}
					//console.log(data);
					this.otochat.push(data);
				})
			},
			//进入一对一聊天
			otoChat(e){
				//console.log(`[info] open oto chat`)
				if(this.showOtoModal===false){
				//获取信息
				this.uname = this.users[e].name;
				this.fid = this.users[e].id;
				this.users[e].tip = false;
				this.showOtoModal = true;
				this.modify();
				}else{
					this.uname = '';
					this.fid = '';
					this.showOtoModal = false;
					this.modify();
				}
			},
			//退出一对一聊天
			outotoChat(){
				if(this.showOtoModal===true){
					this.uname = '';
					this.fid = '';
					this.users[e].tip = true;
					this.showOtoModal = false;
					this.modify();
				}
				
			},
			//一对一动画
			modify(){
				this.bb= !this.bb;
				if(this.bb){
					this.bg = 'block';
				}else{
					this.bg = 'none';
				}
				var animation = uni.createAnimation({
					duration: 400,
				    timingFunction: 'ease',
				})
				this.animation = animation
				if(this.bb){
				 	animation.bottom(0).step() 				 				  
				}else{
				 	animation.bottom().step()		  
				}				
				this.animationData = animation.export()
			},
		}
	}
</script>

<style lang="scss">
	.status-bar{
		position: fixed;
		left: 0;
		width: 100%;
		height: 88rpx;
		padding-top: var(--status-bar-height);
		display: -webkit-box;
		display: -webkit-flex;
		display: flex;
		overflow: hidden;
		-webkit-box-pack: justify;
		-webkit-justify-content: space-between;
		justify-content: space-between;
		z-index: 898;
		color: #272832;
		-webkit-transition-property: all;
		transition-property: all;
		background:rgba(170, 170, 255, 1.0);
		.login-c{
			width: 60rpx;
			height: 60rpx;
			padding-top: 22rpx;
			padding-left: 32rpx;
		}
		.login-back{
			width: 20rpx;
			height: 34rpx;
		}
		.scrollv{
			width: 84%;
			.users{
				//background: #eee;
				display: flex;
				.user-l{
					padding: 12rpx 8rpx;
					position: relative;
					image{
						width:64rpx;
						height:64rpx;
						border-radius: 50%;
					}
					.tip{
						width:14rpx;
						height:14rpx;
						background:rgba(255,77,60,1);
						position: absolute;
						top: 12rpx;
						right: 10rpx;
						border-radius: 50%;
						z-index: 10;
					}
				}
				
			}
		}
	}
	.main{
		padding: 160rpx 28rpx 160rpx;
	}
	.main,.modfiy-mian{
	
		.msg{
			display: flex;
			
			align-items:flex-end;
			padding: 40rpx 0;
			image{
				flex: none;
				width:64rpx;
				height:64rpx;
				border-radius:18rpx;
				margin: 0 20rpx;
				
			}
			.sendimg{
				//width: 200rpx;
				height: 200rpx;
			}
			.nr{
				.neir{
					max-width:380rpx;
					padding:26rpx 32rpx;
					min-height:48rpx;
					font-size:28rpx;
					color:rgba(25,29,35,1);
					line-height:40rpx;
				}
				.nt{
					padding-top: 8rpx;
					position: absolute;
					font-size:24rpx;
					color:rgba(25,29,35,0.5);
					line-height:34rpx;
				}
			}
		}
		.left{
			flex-direction: row;
			.neir{
				background:rgba(244,244,244,1);
				border-radius:24rpx 24rpx 24rpx 0px;
			}
		}
		.right{
			flex-direction: row-reverse;
			.neir{
				background:rgba(170, 255, 255, 1.0);
				border-radius:24rpx 24rpx 0px 24rpx;
			}
			.nt{
				right: 132rpx;
			}
		}
		.center{
			text-align: center;
			padding: 32rpx 0 20rpx;
			.inner{
				font-size:24rpx;
				display: inline-block;
				color:rgba(25,29,35,0.5);
				line-height:34rpx;
			}
		}
	}
	.send{
		position: fixed;
		z-index: 902;
		bottom: 0;
		width: 100%;
		
		padding-bottom:var(--status-bar-height);
		min-height: 100rpx;
		background:rgba(170, 170, 255, 1.0);
		display: flex;
		.chat-send{
			margin: 12rpx 48rpx;
			
			flex: 1;
			width: 100%;
			min-height:40rpx;
			background:rgba(242,242,242,1);
			border-radius:24rpx;
			font-size:28rpx;
			color:rgba(25,29,35,1);
			line-height:40rpx;
			padding: 24rpx 80rpx 24rpx 24rpx;
		}
		.img1{
			width: 48rpx;
			height: 48rpx;
			position: absolute;
			right: 150rpx;
			top: 32rpx;
		}
		.img2{
			width: 48rpx;
			height: 48rpx;
			position: absolute;
			right: 68rpx;
			top: 32rpx;
		}
	}
	.modify{
		position: fixed;
		overflow: hidden;
		left: 0;
		bottom:-90%;
		width: 100%;
		height: 90%;
		z-index: 900;
		background: #fff;
		border-radius:48rpx 48rpx 0px 0px;
	}
	.u-name{
		position: absolute;
		top: 0;
		background-color: #aaaaff;
		height: 80rpx;
		text-align: center;
		width: 100%;
		line-height: 80rpx;
	}
	.modfiy-mian{
		padding: 88rpx 28rpx 120rpx;
		box-sizing: border-box;
		height: 100%;
	}
	.pic-modify{
		position: fixed;
		left: 0;
		bottom:-800rpx;
		width: 100%;
		height: 800rpx;
		z-index: 1000;
		background: #fff;
		border-radius:48rpx 48rpx 0px 0px;
		
	}
	.pic-modfiy-mian{
		padding: 80rpx 36rpx;
		flex-direction: row;
		display: flex;
		flex-wrap:wrap;
		// .pic-send{
		// 	width: 100rpx;
		// 	height: 100rpx;
		// 	position: absolute;
		// 	right: 200rpx;
		// 	top: 100rpx;
		// }
		.us-img{
			flex: auto;
			width: 20%;
			text-align: center;
			image{
				width:80rpx;
				height:80rpx;
				border-radius:18rpx;
			}
			.ddd{
				display: inline-block;
				justify-content:center;
				margin-bottom: 40rpx;
				width: 32rpx;
				height: 32rpx;
				background:rgba(0, 0, 0, 1.0);
				border-radius: 50%;
			}
		}
	}
	.bg{
		width: 100%;
		height: 100%;
		position: fixed;
		top: 0;
		left: 0;
		z-index: 899;
		background-color: rgba(0,0,0,0.4);
		
	}
</style>

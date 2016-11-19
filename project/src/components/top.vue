<template>
	<div class="header">
		<el-row>
			<el-col :span="14">
				<div class="grid-content logo"></div>
			</el-col>
			<el-col :span="10">
				<div class="grid-content user">
					<div v-show="user.log">
						<span>{{user.user_id}}</span>
						<el-button type="primary" @click="logout()">退出</el-button>
					</div>
					<div v-show="!user.log">
						<el-form :inline="true" :model="log" class="log">
						  <el-form-item>
						    <el-input v-model="log.user_id" placeholder="账号"></el-input>
						  </el-form-item>					  
						  <el-form-item>
						    <el-input v-model="log.password" placeholder="密码" type="password"></el-input>
						  </el-form-item>
						  <el-form-item>
						    <el-button type="primary" @click="signIn()">登录</el-button>
						  </el-form-item>
						</el-form>
					</div>	
				</div>
			</el-col>
		</el-row>
		<el-dialog title="提示" size="tiny" v-show="alertInfo.show">
		  <span>{{alertInfo.info}}</span>
		  <span slot="footer" class="dialog-footer">
		    <el-button @click.native="alertInfo.show = false">确定</el-button>
		  </span>
		</el-dialog>
	</div>
</template>


<script>
import eventHub from '../components/eventHub.vue';
import 'element-ui/lib/theme-default/index.css';
import {dialog, form, formItem, row, col, input ,button} from 'element-ui';
	export default {
		components: {
			elInput: input,
			elButton: button,
			elRow: row,
			elCol: col,
			elForm: form,
			elFormItem: formItem,
			elDialog: dialog
		},
		props: {
			user:{
				type: Object,
			}
		},
		data() {
			return {
				alertInfo: {
					show: false,
					info: ''
				},
				log: {
					user_id: '',
					password: ''
				}
			}
		},
		methods: {
			signIn() {
				let params = {
					user_id: this.log.user_id,
					password: this.log.password,
				}
				console.log(this)
				let alert = '';
				this.$http.post('/usercenter/signin', params, {emulateJSON: true}).then((res) => {
					let resData = res.body;
					let errno = resData.errno;
					let errmsg = resData.errmsg;
					if(errno === 0) {
						eventHub.$emit('login' ,this.log.user_id);
						localStorage.setItem('user_id', resData.data);
						this.$router.push('user');
					}else{
						this.alertInfo = {
							show: true,
							info: errmsg
						}
					}
				}, (res) => {
						this.alertInfo = {
							show: true,
							info: errmsg
					}
				})
			},
			logout() {
				localStorage.removeItem('user_id');
				eventHub.$emit('logout');
			},
		},

	}
</script>
<style>
	
</style>

<style scoped>
	.header{
		width: 100%;
		height: 80px;
	}
	.fl{
		float: left;
	}
	.fr{
		float: right;
	}
	.logo{
		width: 60px;
		height: 60px;
		background: url(/assets/css);
	}
	.user{
		height: 60px;
		line-height: 60px;
		text-align: right;
		padding-right: 30px;
	}
</style>
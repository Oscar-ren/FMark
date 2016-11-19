<template>
	<div class="header">
		<el-row>
			<el-col :span="14">
				<div class="grid-content logo"></div>
			</el-col>
			<el-col :span="10">
				<div class="grid-content user">
					<div v-show="user.log">
						<span>{{user.account}}</span>
					</div>
					<div v-show="!user.log">
						<el-form :inline="true" :model="log" class="log">
						  <el-form-item>
						    <el-input v-model="log.account" placeholder="账号"></el-input>
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
		data() {
			return {
				alertInfo: {
					show: false,
					info: ''
				},
				user: {
					log: false,
					account: ''
				},
				log: {
					account: '',
					password: ''
				}
			}
		},
		methods: {
			signIn() {
				let params = {
					account: this.log.account,
					password: this.log.password,
				}
				this.$http.post('/index/signin', params, {emulateJSON: true}).then((res) => {
					let resData = res.body;
					let errno = resData.errno;
					let errmsg = resData.errmsg;
					if(errno === 0) {
						this.user = {
							log: true,
							account: resData.data.account,
						}
						console.log(resData.data)
						this.$router.push('/user');
						this.alertInfo = {
							show: true,
							info: '登录成功！'
						}
					}else{
						this.alertInfo = {
							show: true,
							info: '登录失败！'
						}
					}
				}, (res) => {
						this.alertInfo = {
							show: true,
							info: '登录失败！'
						}
				})
			}
		},
	}
</script>


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
		width: 80px;
		height: 80px;
		background: url(/assets/css);
	}
</style>
<template>
	<div class="signup">
		<el-row>
			<el-col :span="14">
				<div class="grid-content userInfo">
					<el-form :model="register" label-width="80px">
					  <el-form-item label="帐号">
					    <el-input v-model="register.user_id"></el-input>
					  </el-form-item>
					  <el-form-item label="密码">
					    <el-input v-model="register.password" type="password"></el-input>
					  </el-form-item>		
					  <el-form-item label="邮箱">
					    <el-input v-model="register.email" type="email"></el-input>
					  </el-form-item>							  
					  <el-form-item>
					    <el-button type="primary" @click="signUp()">注册</el-button>
					  </el-form-item>
					</el-form>
				</div>
			</el-col>
			<el-col :span="10">
				<div class="grid-content banner">
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
				register: {
					user_id: '',
					password: '',
					email: ''
				},
				alertInfo: {
					show: false,
					info: ''
				},
			}
		},
		methods: {
			signUp() {
				let params = {
					user_id: this.register.user_id,
					password: this.register.password,
				}
				this.$http.post('/usercenter/signup', params, {emulateJSON: true}).then((res) => {
					let resData = res.body;
					let errno = resData.errno;
					let errmsg = resData.errmsg;
					if(errno === 0) {
						this.$router.push('user');
						this.alertInfo.info = '注册成功！';
					}else{
						this.alertInfo.info = '注册失败！';
					}
				}, (res) => {
						this.alertInfo.info = '注册失败！';
				})
				this.alertInfo.show = true;			
			}
		},
	}
</script>


<style scoped>
	.header{
		width: 100%;
		height: 80px;
		/*background: ;*/
	}
	.fl{
		float: left;
	}
	.fr{
		float: right;
	}
	.banner{
		width: 400px;
		height: 400px;
	}
</style>

<template>
	<div class="signup">
		<el-row>
			<el-col :span="8">
				<div class="grid-content seat">
				</div>
			</el-col>
			<el-col :span="8">
				<div class="grid-content userInfo">
					<el-form :model="register">
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
			<el-col :span="8">
				<div class="grid-content seat">
				</div>
			</el-col>
		</el-row>
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
		data() {
			return {
				register: {
					user_id: '',
					password: '',
					email: ''
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
						eventHub.$emit('login' ,this.register.user_id);
						localStorage.setItem('user_id', resData.data);
					}else{
						
					}
				}, (res) => {
				})
			}
		},
	}
</script>


<style scoped>
	.seat{
		height: 1px;
	}
</style>

<template>
	<div class="signin">
		<el-row>
			<el-col :span="8">
				<div class="grid-content seat">
				</div>
			</el-col>
			<el-col :span="8">
				<div class="grid-content user">
					<div>
						<el-form :model="log" class="log">
						  <el-form-item label="账号">
						    <el-input v-model="log.user_id" placeholder="账号"></el-input>
						  </el-form-item>					  
						  <el-form-item label="密码">
						    <el-input v-model="log.password" placeholder="密码" type="password"></el-input>
						  </el-form-item>
						  <el-form-item>
						    <el-button type="primary" @click="signIn()">登录</el-button>
						  </el-form-item>
						</el-form>
					</div>	
				</div>
			</el-col>
			<el-col :span="8" class="seat">
				<div class="grid-content">
				</div>
			</el-col>
		</el-row>
	</div>
</template>


<script>
import eventHub from '../components/eventHub.vue';
import 'element-ui/lib/theme-default/index.css';
import {form, formItem, row, col, input ,button} from 'element-ui';
	export default {
		components: {
			elInput: input,
			elButton: button,
			elRow: row,
			elCol: col,
			elForm: form,
			elFormItem: formItem,
		},
		props: {
			user: {
				type: Object,
			},
		},
		data() {
			return {
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
				this.$http.post('/usercenter/signin', params, {emulateJSON: true}).then((res) => {
					let resData = res.body;
					let errno = resData.errno;
					let errmsg = resData.errmsg;
					if(errno === 0) {
						eventHub.$emit('login' ,this.log.user_id);
						localStorage.setItem('user_id', resData.data);
					}else{
						this.$message({
							message: errmsg,
							type: 'warning'
						})
					}
				}, (res) => {
						this.$message({
							message: '登录失败！',
							type: 'warning'
						})
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
	.seat{
		height: 1px;
	}
	
	
	
</style>
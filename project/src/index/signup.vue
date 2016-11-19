<template>
	<div class="signup">
		<el-row>
			<el-col :span="14">
				<div class="grid-content userInfo">
					<el-form :model="register" label-width="80px">
					  <el-form-item label="帐号">
					    <el-input v-model="register.account"></el-input>
					  </el-form-item>
					  <el-form-item label="密码">
					    <el-input v-model="register.password" type="password"></el-input>
					  </el-form-item>		
					  <el-form-item>
					    <el-button type="primary" @click="signUp()">注册</el-button>
					  </el-form-item>
					</el-form>
				</div>
			</el-col>
			<el-col :span="10">
				<div class="grid-content  banner">
					
				</div>
			</el-col>
		</el-row>

	</div>
</template>

<script>
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
		data() {
			return {
				register: {
					account: '',
					password: ''
				}
			}
		},
		methods: {
			signUp() {
				let params = {
					account: this.register.account,
					password: this.register.password,
				}
				this.$http.post('/index/signup', params, {emulateJSON: true}).then((res) => {
					let errno = res.errno;
					let errmsg = res.errmsg;
					if(errno === 0) {
						router.go('/user');
					}else{
						console.log(res, '注册失败！')
					}
				}, (res) => {

				})
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
	.logo{
		width: 80px;
		height: 80px;
		background: url(/assets/css);
	}
</style>

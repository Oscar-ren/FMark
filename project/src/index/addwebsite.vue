<template>
	<div class="addwebsite">
		<el-form :model="website" label-width="80px">
		  <el-form-item label="网站">
		    <el-input v-model="website.host"></el-input>
		  </el-form-item>
		  <el-form-item label="网站名">
		    <el-input v-model="website.title" type="title"></el-input>
		  </el-form-item>							  
		  <el-form-item>
		    <el-button type="primary" @click="addWebsite()">增加</el-button>
		  </el-form-item>
		</el-form>
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
import {dialog, form, formItem, input ,button} from 'element-ui';
	export default {
		components: {
			elInput: input,
			elButton: button,
			elForm: form,
			elFormItem: formItem,
			elDialog: dialog
		},
		data() {
			return {
				website: {
					host: '',
					title: '',
				},	
				alertInfo: {
					show: false,
					info: ''
				},
			}
		},
		methods: {
			addwebsite() {
				let params = {
					host: this.website.host,
					title: this.website.title,
				}
				this.$http.post('/usercenter/addWebsite', params, {emulateJSON: true}).then((res) => {
					let resData = res.body;
					let errno = resData.errno;
					let errmsg = resData.errmsg;
					if(errno === 0) {
						this.$router.push('user');
						this.alertInfo.info = '添加网站成功！';
					}else{
						this.alertInfo.info = '添加网站失败！';
					}
				}, (res) => {
						this.alertInfo.info = '添加网站失败！';
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

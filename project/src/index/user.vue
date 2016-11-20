<template>
	<div class="user">
		<el-row>
			<el-col :span="24">
				<div class="grid-content user-opt">
					<el-button type="primary" @click.native="website.dialog = true">新增站点</el-button>
				</div>
			</el-col>
		</el-row>

		<el-row :gutter="30">
			<el-col :span="8" v-for="item in list">
				<div class="grid-content user-website">
					<a href="#" @click.prevent="itemDialog">{{item.title}}</a>
					<!-- <router-link :to="{ path: 'host'}">{{item.title}}</router-link> -->
					<el-row>
						<el-col :span="12" class="request">
							<span>{{item.dayR || 0}}</span>
							<h4>24小时请求</h4>
						</el-col>
						<el-col :span="12" class="request">
							<span>{{item.monthR || 0}}</span>
							<h4>30天请求</h4>
						</el-col>
					</el-row>
				</div>
			</el-col>
		</el-row>

		<el-dialog title="站点信息" v-model="website.dialog">
		  <el-form :model="website" label-width="80px">
		  	<el-form-item label="网址">
		      <el-input v-model="website.host"></el-input>
		    </el-form-item>
		    <el-form-item label="网站名称">
		      <el-input v-model="website.title"></el-input>
		    </el-form-item>
		  </el-form>
		  <div slot="footer" class="dialog-footer">
		    <el-button @click.native="website.dialog = false">取消</el-button>
		    <el-button type="primary" @click.native="addWebsite">确定</el-button>
		  </div>
		</el-dialog>	
		
</template>

<script>
import eventHub from '../components/eventHub.vue';
import 'element-ui/lib/theme-default/index.css';
import {MessageBox, dialog, form, formItem, row, col, input ,button} from 'element-ui';
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
			user: {
				type: Object,
			},
		},
		data() {
			return {
				list: [],
				website: {
					dialog: false,
					title: '',
					host: ''
				}
			}
		},
		watch: {
			'website.dialog': function(val) {
				if(!val) {
					this.website.title = '';
					this.website.url = '';
				}
			}
		},
		created() {
			this.getList();
			this.checkLog();
		},
		methods: {
			itemDialog() {
				alert('暂未开发！')			
			},
			checkLog() {
	      let user_id = localStorage.getItem('user_id');
	      if(user_id) {
		      	eventHub.$on('login', user_id);
	      }else{
	        this.$router.push('signin');
	      }
	    },
			addWebsite() {
				let params = {
					user_id: this.user.user_id,
					title: this.website.title,
					host: this.website.host,
				}
				this.$http.post('/usercenter/addwebsite', params, {emulateJSON: true}).then((res) => {
					let resData = res.body;
					let errno = resData.errno;
					let errmsg = resData.errmsg;
					if(errno === 0) {
						this.website.dialog = false;
						this.getList();
					}else{
					}
				}, (res) => {

				})
			},
			getList() {
				let params = {
					user_id: this.user.user_id
				}
				this.$http.post('/usercenter/getwebsite', params, {emulateJSON: true}).then((res) => {
					let resData = res.body;
					let errno = resData.errno;
					let errmsg = resData.errmsg;
					if(errno === 0) {
						this.list = resData.data;
					}else{
					}
				}, (res) => {

				})
			},
		},
	}
</script>


<style scoped>
	.user{
		padding: 15px 30px;
	}
	.user-opt{
		padding-left: 30px;
		padding-bottom: 30px;
	}
	.user-website{
		width: 100%;
		height: 170px;
		margin-top: 20px;
		box-sizing: border-box;
		border: 2px solid #eee;
		font-weight: bold;
		border-radius: 4px;
	}
	.user-website:hover{
		border: 2px solid rgb(48, 144, 228);
	}
	.user-website a{
		display: inline-block;
		width: 100%;
		font-size: 20px;
		line-height: 50px;
		text-align: center;
		color: rgb(48, 144, 228);
	}
	.user-website a:hover{
		text-decoration: none;
		color: rgb(48, 144, 228);
	}
	.user-website .request{
		text-align: center;
	}
	.user-website .request span{
		margin-top: 20px;
		font-size: 26px;
		line-height: 34px;
		color: #999;
	}
	.user-website .request h4{
		color: #999;
		font-size: 12px;
		line-height: 12px;
		text-align: center;
		font-weight: normal;
	}
</style>

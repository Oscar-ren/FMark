<template>
	<div class="header">
		<el-row>
			<el-col :span="14">
				<div class="grid-content logo">
					<router-link :to="{ path: 'index' }">FMark</router-link>
				</div>
			</el-col>
			<el-col :span="10">
				<div class="grid-content user">
					<div v-show="user.log" class="user-log">
						<el-dropdown trigger="click">
						  <span class="el-dropdown-link">
						    {{user.user_id}}
						  </span>
						  <el-dropdown-menu slot="dropdown">
						    <el-dropdown-item>
						    	<router-link :to="{ path: 'user' }">控制台</router-link>
						    </el-dropdown-item>
						    <el-dropdown-item>
						    	<a href="#" @click.prevent="logout">登出</a>
						    </el-dropdown-item>
						  </el-dropdown-menu>
						</el-dropdown>
					</div>
					<div v-show="!user.log" class="user-opt">
						<router-link :to="{ path: 'signin' }">登录</router-link>
						<router-link :to="{ path: 'signup' }">注册</router-link>
					</div>	
				</div>
			</el-col>
		</el-row>
	</div>
</template>


<script>
import eventHub from '../components/eventHub.vue';
import 'element-ui/lib/theme-default/index.css';
import {dropdownMenu, dropdownItem, dropdown, form, formItem, row, col, input ,button} from 'element-ui';
	export default {
		components: {
			elInput: input,
			elButton: button,
			elRow: row,
			elCol: col,
			elForm: form,
			elFormItem: formItem,
			elDropdown: dropdown,
			elDropdownMenu: dropdownMenu,
			elDropdownItem: dropdownItem,
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
			logout() {
				console.log(1)
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
		height: 60px;
		line-height: 60px;
		box-sizing: border-box;
		background: rgba(230,246,255,.2);
		color: #2c97e8;
		font-weight: bold;
	}
	.header a:hover,
	.el-dropdown-menu a:hover{
		text-decoration: none;
		color: #2c97e8;
	}
	.logo{
		padding:0 15px;
		margin-left: 15px;
		width: 60px;
		height: 60px;
	}
	.logo a{
		color: #2c97e8;
		font-size: 24px;
		font-weight: bold;
	}
	.user{
		height: 60px;
		line-height: 60px;
		text-align: right;
		padding-right: 30px;
	}
	.user .user-log, 
	.user .user-opt{
		text-align: left;
		display: inline-block;
		width: 200px;
	} 
	.el-dropdown{
		display: block;
		width: 100%;
		color: #2c97e8;
		font-weight: bold;
		cursor: pointer;
	}
	.el-dropdown-menu{
		width: 200px;
	}
	.el-dropdown-menu span{
		text-align: center;
		display: inline-block;
		width: 100%;
		overflow: hidden;
		white-space: nowrap;
		text-overflow: ellipsis;
	}

	.el-dropdown-menu li:hover,
	.el-dropdown-menu a,
	.el-dropdown-menu li{
		color: #2c97e8;
		font-weight: bold;
	}
	
</style>
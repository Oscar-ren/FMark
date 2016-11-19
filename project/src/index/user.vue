<template>
	<div class="user">
		<el-row>
			<el-col :span="8">
				<div class="grid-content user-info">

				</div>
			</el-col>
			<el-col :span="16">
				<div class="grid-content user-website">
					<el-tree :data="list"  @node-click="changeUrl"></el-tree>
				</div>
			</el-col>
		</el-row>

	</div>
</template>

<script>
import 'element-ui/lib/theme-default/index.css';
import {tree, row, col} from 'element-ui';
	export default {
		components: {
			elTree: tree,
			elRow: row,
			elCol: col,
		},
		props: ['user'],
		data() {
			return {
				list: [],
			}
		},
		created() {
			this.getList();
		},
		methods: {
			getList() {
				let params = {
					user_id: '123',
				}
				this.$http.post('/usercenter/getpages', params, {emulateJSON: true}).then((res) => {
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
			changeUrl(data) {
				// location.href = data.url;
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

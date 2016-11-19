<template>
	<div class="user">
		<el-row>
			<el-col :span="8">
				<div class="grid-content user-info">

				</div>
			</el-col>
			<el-col :span="16">
				<div class="grid-content user-website">
					<el-tree :data="list"></el-tree>
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
		data() {
			return {
				list: [{
          label: '一级 1',
          children: [{
            label: '二级 1-1'
          }]
        }, {
          label: '一级 2',
          children: [{
            label: '二级 2-1'
          }, {
            label: '二级 2-2'
          }]
        }, {
          label: '一级 3',
          children: [{
            label: '二级 3-1'
          }, {
            label: '二级 3-2'
          }]
        }],
			}
		},
		methods: {
			getList() {
				let params = {
				
				}
				this.$http.post('/index/pages', params, {emulateJSON: true}).then((res) => {
					let resData = res.data;
					let errno = resData.errno;
					let errmsg = resData.errmsg;
					if(errno === 0) {
						me.list = resData;
					}else{
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

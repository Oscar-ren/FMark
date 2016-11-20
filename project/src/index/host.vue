<template>
	<div class="host">
	  <el-tabs :active-name="first">
	    <el-tab-pane v-for="item in page.pageList" :label="item.title" :key="item.id" name="first"></el-tab-pane>
	  </el-tabs>
	</div>
</template>

<script>
import eventHub from '../components/eventHub.vue';
import 'element-ui/lib/theme-default/index.css';
import {tabs, tabPane} from 'element-ui';
	export default {
		components: {
			elTabs: tabs,
			elTabPane: tabPane
		},
		data() {
			return {
				page: {
					pageList: [{
						title: ''
					}]
				},
				host: '',
				urls: [{}],
			}
		},
		created() {
			eventHub.$on('gethost', this.gethostvalue);
		},
		watch: {
			'host': function() {
				this.getHosts();
			}
		},
		methods: {
			gethostvalue(host) {
				console.log(this.host)
				this.host = host;
				console.log(this.host)
			},
			getHosts() {
				let params = {
					host: this.host
				};
				this.$http.post('/usercenter/gethost', params, {emulateJSON: true}).then((res) => {
					let resData = res.body;
					let errno = resData.errno;
					let errmsg = resData.errmsg;
					if(errno === 0) {
						let len = resData.data.length;
						for(let i = 0; i < len; i++) {
							this.$set(this.page, 'pageList', resData.data);
						}

					}else{
					}
				}, (res) => {

				})
			},
			show(url) {
				let params = {
					url: url,
				}
				this.$http.post('/usercenter/geturl', params, {emulateJSON: true}).then((res) => {
					let resData = res.body;
					let errno = resData.errno;
					let errmsg = resData.errmsg;
					if(errno === 0) {
						this.urls = resData.data;
					}else{
					}
				}, (res) => {

				})
			},
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

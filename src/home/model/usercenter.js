'use strict';
/**
 * model
 */
export default class extends think.model.base {
	async getUser(user_id){
		let instance = this.model('user');
		let data = await instance.where({user_id: user_id}).select();
		return data;
	}
	async addUser(params){
		let instance = this.model('user');
		let data = await instance.add({user_id: params.user_id, password: params.password});
		return data;
	}
	async addWebsite(params){
		let instance = this.model('website');
		let websites = await instance.add({user_id: params.user_id, title: params.title, host: params.host});
		return websites;
	}
	async getWebsite(params){
		let instance = this.model('website');
		let websites = await instance.where({user_id: params.user_id}).select();
		return websites;
	}
	async getReqs(host, time){
		let instance = this.model('comment');
		let reqs = await instance.where({createtime: {'>': time}, host: host}).select();
	    // let reqs = this.join("comment ON discuss.comment_id=comment.id").select();
		return reqs;
	}
	async getHost(host){
		let instance = this.model('comment');
		let hosts = await instance.where({host: host}).select();
		return hosts;
	}
	async getUrl(url){
		let instance = this.model('comment');
		let urls = await instance.where({url: url}).select();
		return urls;
	}
	async getDiscuss(id){
		let instance = this.model('discuss');
		let discuss = await instance.where({comment_id: id}).select();
		return discuss;
	}
	// async getPages(host){
	// 	let instance = this.model('comment');
	// 	let hosts = await instance.where({host: host}).select();
	// 	return hosts;
	// }


	// async getPage(host){
	// 	let instance = this.model('comment');
	// 	let pages = await instance.where({host: host}).select();
	// 	return pages;
	// }
	// async getCount(url){
	// 	let instance = this.model('comment');
	// 	let urls = await instance.where({url: url}).select();
	// 	return urls.length;
	// }
}
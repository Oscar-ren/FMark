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
	async getWebsite(user_id){
		let instance = this.model('website');
		let websites = await instance.where({user_id: user_id}).select();
		return websites;
	}
	async getPage(host){
		let instance = this.model('comment');
		let pages = await instance.where({host: host}).select();
		return pages;
	}
	async getCount(url){
		let instance = this.model('comment');
		let urls = await instance.where({url: url}).select();
		return urls.length;
	}
}
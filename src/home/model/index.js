'use strict';
/**
 * model
 */
export default class extends think.model.base {
	async getUser(account){
		let instance = this.model('users');
		let data = await instance.where({account: account}).select();
		return data;
	}
	async addUser(params){
		let instance = this.model('users');
		let data = await instance.add({account: params.account, password: params.password});
		return data;
	}
	async getUserWebsite(){
		let instance = this.model('website');
	}
}
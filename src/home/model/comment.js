'use strict';
/**
 * model
 */
export default class extends think.model.base {
	addComment(data) {
		let model = this.model("comment");
		data['createtime'] = Date.now();

		return model.add(data);
	}
	addDiscuss(data) {
		let model = this.model("discuss");
		data['createtime'] = Date.now();

		return model.add(data);
	}
	getMarkbyId(id) {
		
	}
}
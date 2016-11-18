'use strict';
/**
 * model
 */
export default class extends think.model.base {
	addComment(data) {
		let model = this.model("comment");

		return model.add(data);
	}
	addDiscuss(data) {
		let model = this.model("discuss");

		data['thumbs'] = 0;
		return model.add(data);
	}
	getDiscussbyId(id) {
		let model = this.model("discuss");

		return model.where({
			comment_id: id
		}).select();
	}
	deleteComment(id) {
		let model = this.model("comment");

		return model.where({
			id: id
		}).delete();
	}
	getComment(url, title) {
		let model = this.model("comment");

		return model.where({
			url: url,
			title: title
		}).select();
	}
}
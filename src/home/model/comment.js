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
	thumbsIncre(id) {
		let model = this.model("discuss");

		return model.where({id: id}).increment('thumbs').then(function() {
			return model.where({id: id}).find();
		});
	}
	thumbsDecre(id) {
		let model = this.model("discuss");

		return model.where({id: id}).decrement('thumbs').then(function() {
			return model.where({id: id}).find();
		});
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
		let self = this;
		let commentData;
		return model.where({
			url: url,
			title: title
		}).select().then(function(data) {
			commentData = data;
			let promises = [];
			data.forEach(function(item) {
				promises.push(self.getDiscussbyId(item.id));
			});
			return Promise.all(promises);
		}).then(function(data) {
			commentData.forEach(function(item, index) {
				item['discuss'] = data[index];
			});
			return Promise.resolve(commentData);
		})
	}
}
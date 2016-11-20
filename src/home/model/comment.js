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
	getDiscussbyId(id, ct) {
		let model = this.model("discuss");
		let discussData;
		return model.where({
			comment_id: id
		}).select().then(function(data) {
			discussData = data;
			let promises = [];
			data.forEach(function(item) {
				promises.push(ct.session('thumbs'+item.id));
			});
			return Promise.all(promises);
		}).then(function(data) {
			discussData.forEach(function(item, index) {
				if (data[index] == '+') {
					item['hasThumbs'] = 1;
				} else {
					item['hasThumbs'] = 0;
				}
			});
			return Promise.resolve(discussData);
		});
	}
	delDiscussbyId(id) {
		let model = this.model("discuss");

		return model.where({id: id}).delete();
	}
	deleteComment(id) {
		let model = this.model("comment");
		let discuss = this.model("discuss");
		return model.where({
			id: id
		}).delete().then(function() {
			return discuss.where({
				comment_id: id
			}).delete();
		});
	}
	getComment(url, title, ct) {
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
				promises.push(self.getDiscussbyId(item.id, ct));
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
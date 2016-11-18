'use strict';

import Base from './base.js';

export default class extends Base {
  /**
   * index action
   * @return {Promise} []
   */
  indexAction() {
    //auto render template file index_index.html
    return this.display();
  }
  async commentAction() {
    let comment_id = this.get('id');
    let data = await this.model('comment').getDiscussbyId(comment_id);
    this.assign('discuss', data);
    return this.display();
  }
  async addAction() {
  	let data = this.get();
    let createtime = Date.now();
    let comment_id;
    if (data['comment_id']) {
      comment_id = data['comment_id'];
    } else {
      data['createtime'] = createtime;
      comment_id = await this.model('comment').addComment(data);
  	}
    if (data.type == 1) {
      return this.jsonp(comment_id);
    }

    let discuss = {};
    discuss['discuss_content'] = data['discuss_content'];
    discuss['createtime'] = createtime;
    discuss['comment_id'] = comment_id;
    await this.model('comment').addDiscuss(discuss);

    return this.jsonp(comment_id);
  }
  async getdiscussAction() {
    let comment_id = this.get('id');
    let data = await this.model('comment').getDiscussbyId(comment_id);

    return this.jsonp(data);
  }
  async getcommentAction() {
    let url = this.get('url');
    let title = this.get('title');

    let data = await this.model('comment').getComment(url, title);

    return this.jsonp(data);
  }
  async deletecommentAction() {
    let id = this.get('id');

    let data = await this.model('comment').deleteComment(id);

    return this.jsonp(data);
  }
}
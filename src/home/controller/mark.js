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
  underlineAction() {
  	return this.display();
  }
  commentAction() {
    return this.display();
  }
  async addAction() {
  	let data = this.post();
    let createtime = Date.now();
    let comment_id;
    if (data['comment_id']) {
      comment_id = data['comment_id'];
    } else {
      data['createtime'] = createtime;
      comment_id = await this.model('comment').addComment(data);
  	}
    if (data.type == 1) {
      return this.success(comment_id);
    }

    let discuss = JSON.parse( data['discuss'] );
    discuss['createtime'] = createtime;
    discuss['comment_id'] = comment_id;
    console.log(discuss);
    await this.model('comment').addDiscuss(discuss);

    return this.success(comment_id);
  }
  async getcommentAction() {
    let url = this.post('url');
    let title = this.post('title');

    let data = await this.model('comment').getComment(url, title);

    return this.success(data);
  }
}
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
  async thumbsAction() {
    let discuss_id = this.get('id');
    let data, code;
    let thumbs = await this.session('thumbs'+discuss_id);
    if (thumbs == '+') {
      data = await this.model('comment').thumbsDecre(discuss_id);
      await this.session('thumbs'+discuss_id, '-');
      code = '赞';
    } else {
      data = await this.model('comment').thumbsIncre(discuss_id);
      await this.session('thumbs'+discuss_id, '+');
      code = '取消赞';
    }
    return this.jsonp((data['thumbs'] || '')+code);
  }
  randomName() {
    return '游客' + Math.floor(Math.random() * 1000);
  }
  async addAction() {
  	let data = this.get();
      console.log(data, data.cookie);
    let createtime = Date.now();
    let comment_id;
    delete data.id;
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
    discuss['name'] = data['name'] || this.randomName();
    discuss['createtime'] = createtime;
    discuss['comment_id'] = comment_id;
    let discuss_id = await this.model('comment').addDiscuss(discuss);

    let discussData = await this.model('discuss').where({id: discuss_id}).find();

    return this.jsonp({comment_id:comment_id, discuss: discussData});
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
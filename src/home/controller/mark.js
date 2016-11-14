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
    let comment_id;
    if (data['comment_id']) {
      
    } else {
      let comment_id = await this.model('ct').addComment(data);
  	}
    if (comment_id) {
      await this.model('ct').addDiscuss(data);
    } else {
      return this.error('error');
    }
    return this.success(comment_id);
  }
}
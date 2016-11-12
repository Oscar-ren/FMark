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
  async addAction() {
  	let data  = this.post();

  	let res = await think.model('ct').add(data);
  	return this.success(res);
  }
}
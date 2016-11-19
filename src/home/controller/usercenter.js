'use strict';

import Base from './base.js';

export default class extends Base {
  /**
   * index action
   * @return {Promise} []
   */
  async indexAction(){
    //auto render template file index/index.html
    return this.display();
  }

  async signinAction(){

    let params = this.post();
    let model = this.model('usercenter');
    let userInfo = await model.getUser(params.user_id);
    let password = String(userInfo[0].password);
    if(password === params.password) {
      return this.success(userInfo[0].user_id);
    }else{
      return this.fail(101);
    }

  }
  async signupAction(){
    let params = this.post();
    let model = this.model('usercenter');
    let data = await model.addUser(params);
    this.success();
  }
  async getpagesAction() {
    let params = this.post();
    let model = this.model('usercenter');
    let data = await model.getWebsite(params.user_id);
    let len = data.length;
    let list = [];
    for(let i = 0; i < len; i++) {
      let item = {};
      item.label = data[i].title;
      item.url = data[i].host;
      item.children = await this.getChilds(data[i].host);
      list.push(item);
    }
    this.success(list)
  }
  async getChilds(host) {
    let model = this.model('usercenter');
    let data = await model.getPage(host);
    let len = data.length;
    let list = [];
    for(let i = 0; i < len; i++) {
      let item = {};
      item.label = data[i].title;
      item.url = data[i].url;
      item.count = await model.getCount(data[i].url);
      list.push(item);
    }
    return list;
  }
}
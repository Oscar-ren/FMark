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
  async addwebsiteAction(){
    let params = this.post();
    let model = this.model('usercenter');
    let data = await model.addWebsite(params);
    this.success();
  }
  async getwebsiteAction(){
    let params = this.post();
    let model = this.model('usercenter');
    let sites = await model.getWebsite(params);
    let websites = [];
    let len = sites.length;
    let thisMonth = new Date() - 1000*60*60*24*30;
    let thisDay = new Date() - 1000*60*60*24*30;
    for(let i = 0; i < len; i++) {
      let item = {};
      item.host = sites[i].host;
      item.title = sites[i].title;
      item.dayR = await this.getreqs(sites[i].host, thisDay);
      item.monthR = await this.getreqs(sites[i].host, thisMonth);
        websites.push(item);
    }
    this.success(websites);
  }
  async getreqs(host,time) {
    let model = this.model('usercenter');
    let data = await model.getReqs(host, time);
    return data.length;
  }  
  async gethostAction() {
    let params = this.post();
    let model = this.model('usercenter');
    let data = await model.getHost(params.host);
    return this.success(data);
  }  
  async geturlAction() {
    let params = this.post();
    let model = this.model('usercenter');
    let data = await model.getUrl(params.url);
    let urlInfo = [];
    let len = data.length;
    for(let i = 0; i < len; i++) {
      let item = {};
      item.title = data[i].title;
      item.discuss = getdiscuss(data[i].id);
      userInfo.push(item);
    }
    return this.success(userInfo);
  }  
  async getdiscuss(id) {
    let params = this.post();
    let model = this.model('usercenter');
    let data = await model.getdiscuss(id);
    return this.success(data);
  }  

  // async getpagesAction() {
  //   let params = this.post();
  //   let model = this.model('usercenter');
  //   let data = await model.getPages(params.host);
  //   let len = data.length;
  //   let list = [];
  //   for(let i = 0; i < len; i++) {
  //     let item = {};
  //     item.label = data[i].title;
  //     item.url = data[i].host;
  //     item.children = await this.getChilds(data[i].host);
  //     list.push(item);
  //   }
  //   this.success(list)
  // }
  // async getChilds(host) {
  //   let model = this.model('usercenter');
  //   let data = await model.getPage(host);
  //   let len = data.length;
  //   let list = [];
  //   for(let i = 0; i < len; i++) {
  //     let item = {};
  //     item.label = data[i].title;
  //     item.url = data[i].url;
  //     item.count = await model.getCount(data[i].url);
  //     list.push(item);
  //   }
  //   return list;
  // }
}
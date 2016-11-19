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
    let model = this.model('index');
    let userInfo = await model.getUser(params.account);
    let password = String(userInfo[0].password);
    if(password === params.password) {
      return this.success(userInfo[0]);
    }else{
      return this.fail(101);
    }

  }
  async signupAction(){
    let params = this.post();
    let model = this.model('index');

    let data = await model.addUser(params);

    console.log(data);
  }
}
<template>
  <div id="main">
    <top :user="user"></top>
  	<div class="content">
    <router-view :user="user"></router-view>
  	</div>
  </div>
</template>

<script>
import './assets/css/common.css';
import eventHub from './components/eventHub.vue';
import top from './components/top';

export default {
  components: {
    top,
  },
  data() {
  	return {
  		user: {
        log: false,
        user_id: ''
      },
  	}
  },
  created() {
    this.checkLog();
    eventHub.$on('login', this.logIn);
    eventHub.$on('logout', this.logOut);
  },
  methods: {
    checkLog() {
      let user_id = localStorage.getItem('user_id');
      console.log(user_id)
      
      if(user_id) {
        this.$router.push('user');
        this.user.log = true;
        this.user.user_id = user_id;
      }else{
        this.$router.push('signup');
      }
    },
    logIn(user_id) {
      this.user = {
        user_id: user_id,
        log: true
      }
      this.$router.push('user');
    },
    logOut() {
      this.user.log = false;
      this.user.user_id = '';
      this.$router.push('signup');
    }
  },
}
</script>

<style>

</style>

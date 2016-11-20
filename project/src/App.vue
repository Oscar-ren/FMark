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
import 'bootstrap/dist/css/bootstrap.css';
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
    eventHub.$on('login', this.logIn);
    eventHub.$on('logout', this.logOut);
  },
  methods: {

    logIn(user_id) {
      this.user.user_id = user_id;
      this.user.log = true;
      console.log(this.user);
      this.$router.push('index');
    },
    logOut() {
      this.user.log = false;
      this.user.user_id = '';
      console.log(this.user);

      this.$router.push('index');
    }
  },
}
</script>

<style scoped>
  .content{
    margin-top: 30px;
  }
</style>

import Vue from 'vue';
import vueRouter from 'vue-router';
Vue.use(vueRouter);
import vueResource from 'vue-resource';
Vue.use(vueResource);
import signup from './index/signup.vue';
import user from './index/user.vue';
import App from './App.vue';

const routes = [
	{path: '/signup', component: signup},
	{path: '/user', component: user},
	{path: '*', redirect: '/user'},
];
const router = new vueRouter({
	routes
});

const app = new Vue({
	router,
	render: h => h(App),
}).$mount('#app')

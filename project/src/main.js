import Vue from 'vue';
import vueRouter from 'vue-router';
Vue.use(vueRouter);
import vueResource from 'vue-resource';
Vue.use(vueResource);
import signup from './index/signup.vue';
import user from './index/user.vue';
import addwebsite from './index/addwebsite.vue';
import App from './App.vue';

const routes = [
	{path: '/signup', component: signup},
	{path: '/user', component: user},
	{path: '/addwebsite', component: addwebsite},
];

const router = new vueRouter({
	routes
});

const app = new Vue({
	router,
	render: h => h(App),
}).$mount('#app')

import Vue from 'vue';
import vueRouter from 'vue-router';
Vue.use(vueRouter);
import vueResource from 'vue-resource';
Vue.use(vueResource);
import index from './index/index.vue';
import signin from './index/signin.vue';
import signup from './index/signup.vue';
import user from './index/user.vue';
import host from './index/host.vue';
import App from './App.vue';

const routes = [
	{path: '/index', component: index},
	{path: '/signin', component: signin},
	{path: '/signup', component: signup},
	{path: '/user', component: user},
	{path: '/host', component: host},
];

const router = new vueRouter({
	routes
});

const app = new Vue({
	router,
	render: h => h(App),
}).$mount('#app')

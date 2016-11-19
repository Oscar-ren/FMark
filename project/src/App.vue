<template>
  <div id="main">
    <top></top>
  	<div class="content">
    <router-view></router-view>
  	</div>
  </div>
</template>

<script>
import top from './components/top';

export default {
  components: {
    top,
  },
  data() {
  	return {
  		user: {},
  	}
  },
}
</script>

<style>

</style>

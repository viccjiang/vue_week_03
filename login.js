import { createApp } from 'https://unpkg.com/vue@3/dist/vue.esm-browser.js';

const app = createApp({
	data() {
		return {
			user: {
				username: '',
				password: '',
			}
		}
	},
	methods: {
		login() {
			const api = 'https://vue3-course-api.hexschool.io/v2/admin/signin'
			// console.log(api);
			axios.post(api, this.user)
				.then(res => {
					// console.log(res.data);
					const {expired,token} = res.data
					// console.log(expired,token);
					// 存入 cookie
					document.cookie = `jiangvue3=${token};expires=${new Date(expired)};`
					window.location = 'products.html'
				})
				.catch(err=>{
					console.log(err.data.message);
				})
		}
	},
	mounted() {

	},
})

app.mount('#app')
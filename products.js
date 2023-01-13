import { createApp } from 'https://unpkg.com/vue@3/dist/vue.esm-browser.js';

const app = createApp({
  data() {
    return {
      apiUrl: 'https://vue3-course-api.hexschool.io/v2',
      apiPath: 'jiangs2023',
      allProducts: [],
      tempProduct: {
        imagesUrl: [],
      },
      isNew: false, // 判斷是否為新產品或編輯 ( 新增或編輯 )
      productModal: null,
      delProductModal: null,
    };
  },
  methods: {
    checkLogin() {
      axios.post(`${this.apiUrl}/api/user/check`)
        .then((res) => {
          // console.log(res);
          this.getProduct();
        })
        .catch((err) => {
          console.log(err.data.message);
          window.location = 'index.html';
        });
    },
    getProduct() {
      axios.get(`${this.apiUrl}/api/${this.apiPath}/admin/products`)
        .then((res) => {
          console.log(res.data);
          this.allProducts = res.data.products;
        })
        .catch((err) => {
          console.log(err.data.message);
        });
    },
    openModal(status, item) {
      if (status === 'add') {
        console.log('add');
        this.tempProduct = {
          imagesUrl: [],
        };
        this.isNew = true;
        this.productModal.show();
      } else if (status === 'edit') {
        console.log('edit');
        this.tempProduct = { ...item };
        this.isNew = false;
        this.productModal.show();
      } else if (status === 'delete') {
        console.log('delete');
        this.tempProduct = { ...item };
        this.delProductModal.show();
      }
    },
    updateProduct() {
      // console.log(this.tempProduct);
      let url = `${this.apiUrl}/api/${this.apiPath}/admin/product`;
      let httpMethod = 'post' // 注意這裡要寫字串

      // 若不是新增而是編輯狀態
      if (!this.isNew) {
        url = `${this.apiUrl}/api/${this.apiPath}/admin/product/${this.tempProduct.id}`;
        httpMethod = 'put'
      }

      axios[httpMethod](url, { data: this.tempProduct })
        .then(res => {
          console.log(res);
          this.productModal.hide();
          this.getProduct();
        })
        .catch(err => {
          alert(err.data.message);
        })

    },
    delProduct() {
      const url = `${this.apiUrl}/api/${this.apiPath}/admin/product/${this.tempProduct.id}`
      axios.delete(url)
        .then(res => {
          console.log(res);
          alert(res.data.message);
          this.delProductModal.hide();
          this.getProduct();
        })
        .catch((err) => {
          alert(err.data.message);
          console.dir(err)
        })
    },
    createImages() {
      this.tempProduct.imagesUrl = [];
      this.tempProduct.imagesUrl.push('');
    },
  },
  mounted() {
    this.productModal = new bootstrap.Modal(document.getElementById('productModal'), { keyboard: false,backdrop: 'static' })
    this.delProductModal = new bootstrap.Modal(document.getElementById('delProductModal'), { keyboard: false })


    // 取出 Token
    const token = document.cookie.replace(/(?:(?:^|.*;\s*)jiangvue3\s*=\s*([^;]*).*$)|^.*$/, '$1');
    axios.defaults.headers.common.Authorization = token;
    this.checkLogin();
  },
});

app.mount('#app');

import Vue from 'vue';
import Router from 'vue-router';
import ImageUpload from '@/components/ImageUpload';
import Images from '@/components/Images';

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: '/',
      name: 'ImageUpload',
      component: ImageUpload,
    },
    {
      path: '/images',
      name: 'Images',
      component: Images,
    },
  ],
});

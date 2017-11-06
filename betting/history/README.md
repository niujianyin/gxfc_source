# sell

> sell app

## Build Setup

``` bash
# install dependencies
npm install

# serve with hot reload at localhost:8080
npm run dev

# build for production with minification
npm run build

# run unit tests
npm run unit

# run e2e tests
npm run e2e

# run all tests
npm test
```

For detailed explanation on how things work, checkout the [guide](http://vuejs-templates.github.io/webpack/) and [docs for vue-loader](http://vuejs.github.io/vue-loader).



1.https://github.com/vuejs/vue-touch
2.webStorm 的.idea 目录加入.gitignore无效的解决方法
  先执行 git rm -r --cached .idea
  再重新加入.gitignore文件


开奖新闻接口：http://interface.sina.cn/sports/caitong/get_open_newslsit.d.json?gameCode=101&issueNo=2017051
gameCode是彩种号，issueNo是期号

判断
result.status.code=0时，正常显示开奖新闻列表
result.status.code=1时，隐藏掉开奖新闻模块

url:
http://lotto.sina.cn/open/#!/
cms:
http://cms.pub.sina.com.cn/index.php?r=pubport%2Fadmin&showTabs=1&searchFlag=pubport&node_id=56510&searchInput=http%3A%2F%2Flotto.sina.cn%2Fopen%2Findex.d.html



app内嵌页面
config/index.js  wap 变为 app
assetsPublicPath: '//n.sinaimg.cn/sports/sina_lotto/topen/app/',
App.vue 去掉<v-header></v-header> 和  <v-win></v-win>
mixin.styl  变fixed_top=44px 为 0px

url:
http://lotto.sina.cn/open/app.d.html#!/
cms:
http://cms.pub.sina.com.cn/index.php?r=pubport%2Fadmin&showTabs=1&searchFlag=pubport&node_id=56510&searchInput=lotto.sina.cn%2Fopen%2Fapp.d.html
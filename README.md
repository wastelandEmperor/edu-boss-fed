### 项目注意点
#### SCSS变量的问题
1. 样式变量在自身中私有 
   * c1.scss -> c1.css
   * c2.scss -> c2.css
   * 组件样式并非 c1.scss + c2.scss -> c3.css , 而是 c1.css + c2.css -> c3.css 它们的变量不共享
2. 定义的全局样式变量，想在每个组件中应用 
   1. 每个地方都引用 @import '~@/styles/variables.scss'
   2. 脚手架帮忙，自动帮我们把全局样式导入到每个.vue中(插入到头部)
      * sass-loader = 8 : prepenData
      * sass-loader > 8 : additionalData

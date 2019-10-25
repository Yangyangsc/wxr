# 前后端部署
## 前端配置
1.  ueditor.config.js 中serverUrl需指向接收上传富文本文件的接口地址
2.  ueditor.config.js 中textarea的属性值对应为表单提交到后台富文本内容的属性名

## 后端配置
1. 返回的config.json中需要配置图片或者视频等保存后的网络路劲前缀（eg："imageUrlPrefix": "http://localhost:3000/upload/",）.
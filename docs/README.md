---
home: true
heroImage: /images/logo.png
heroText: 前端小站
tagline: 快速入门前端必备技能，帮助更多想要学习前端的同学。
---

<template>
    <div>
        <div class="technology-stack">
            <span>前端：</span>
            <a href="https://developer.mozilla.org/zh-CN/docs/Web/JavaScript" target="_blank">
                Javascript
            </a>
            <a href="https://v2.cn.vuejs.org/" target="_blank">
                Vue2
            </a>
            <a href="https://v3.vuejs.org/" target="_blank">
                Vue3
            </a>
            <a href="https://react.dev/" target="_blank">
                React
            </a>
            <a href="https://developers.weixin.qq.com/miniprogram/dev/framework/" target="_blank">
                微信小程序
            </a>
            <a href="https://www.typescriptlang.org/" target="_blank">
                TypeScript
            </a>
            <a href="https://webpack.js.org/" target="_blank">
                Webpack
            </a>
            <a href="https://eslint.org/" target="_blank">
                Eslint
            </a>
            <a href="https://babeljs.io/" target="_blank">
                Bable
            </a>
        </div>
        <div class="technology-stack">
            <span>混合开发：</span>
            <a href="https://uniapp.dcloud.net.cn/" target="_blank">
                uni-app
            </a>
            <a href="https://taro-docs.jd.com/docs/" target="_blank">
                taro
            </a>
            <a href=" https://flutter.cn/docs" target="_blank">
                flutter
            </a>
            <a href="https://www.electronjs.org/" target="_blank">
                electron
            </a>
            <a href="https://tauri.app/" target="_blank">
                tauri
            </a>
        </div>
        <div class="technology-stack">
            <span>后端：</span>
            <a href="https://nodejs.cn/" target="_blank">
                Nodejs
            </a>
            <a href="https://docs.nginx.com/" target="_blank">
                Nginx
            </a>
            <a href="https://docs.docker.com/" target="_blank">
                Docker
            </a>
            <a href="https://dev.mysql.com/doc/" target="_blank">
                Mysql
            </a>
            <a href="https://www.w3cschool.cn/linux/" target="_blank">
                Linux
            </a>
        </div>
        <div class="btns">
            <a href="/note/vue2/" class="start-button">快速入门</a>
        </div>
        <div class="description">
            <div class="description-item">
                <div class="description-item__title">简洁</div>
                <div class="description-item__text">基于各文档的精华，提取关键的技术点</div>
            </div>
            <div class="description-item">
                <div class="description-item__title">重点</div>
                <div class="description-item__text">选取重点知识，避免大量时间咬文嚼字</div>
            </div>
            <div class="description-item">
                <div class="description-item__title">主流</div>
                <div class="description-item__text">现代主流框架，与时俱进</div>
            </div>
        </div>
        <div class="page-footer">
            <p class="made">Made by zihao</p>
            <p class="made">非盈利网站，属于个人笔记，个人博客，纯属爱好建站。</p>
            <div class="beian">
                <a style="color: #4e6e8e;" target="_blank" href="http://beian.miit.gov.cn/">
                粤ICP备2024164766号-1
                </a>
                <!-- <span class="beian-gov-cn">
                    <img src="/images/beian.png" width="20" alt="" />
                    <a style="color: #4e6e8e;" href="http://www.beian.gov.cn/portal/registerSystemInfo?recordcode=公案备案号"></a>
                </span> -->
            </div>
        </div>
    </div>
</template>

<script lang="ts">
export default {
    data() {
        return {
            hostname: ''
        }
    },
    mounted() {
        this.hostname = window.location.hostname
    }
}
</script>

<style scoped>
.technology-stack {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-wrap: wrap;
    margin-bottom: 10px;
}

.technology-stack a {
    margin: 0 5px;
}

.btns {
    margin-top: 20px;
    display: flex;
    align-items: center;
    justify-content: center;
}

.start-button {
    display: inline-block;
    font-size: 1.2rem;
    color: #fff;
    background-color: #3eaf7c;
    padding: 0.8rem 1.6rem;
    border-radius: 4px;
    transition: background-color .1s ease;
    box-sizing: border-box;
    border-bottom: 1px solid #389d70;
}

.description {
    margin-top: 20px;
}

.description-item {
    margin-bottom: 20px;
}


.description-item__title {
    color: #42b983;
    font-size: 1.5rem;
    font-weight: 400;
    margin: 0;
    padding: 0.5rem 0;
    text-align: center;
}

.description-item__text {
    color: #4f5959;
    text-align: center;
}


.page-footer {
    padding: 2rem;
    text-align: center;
    color: #4e6e8e;
}
.made{
    margin-bottom: 10px;
}

.footer.content__footer {
    display: none;
}

.beian {
    display: inline-flex;
}

.beian-gov-cn {
    display: inline-flex;
    margin-left: 5px;
}

.beian-gov-cn img {
    margin-right: 2px;
}
</style>

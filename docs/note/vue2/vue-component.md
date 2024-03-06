# 组件



## 创建组件

创建一个组件和编写vue页面类似，它具有vue页面所有的选项，也有它特有的选项。例如props选项

custom-component.vue 或者 customComponent.vue

组件文件名可以是驼峰，也可以是横杠连接，根据团队风格来

```vue
<template>
    <div id="example">
        {{ text }}
    </div>
</template>

<script>
export default {
    props: {
        // 组件的参数选项
    },
    data() {
        return {
            text: '我是一个组件',
        }
    },
    methods: {
        // ...
    },
    // ...
}
</script>
```



## 注册组件

### 局部注册

在页面中局部注册只有当前页面可以使用，引入的组件可以使用驼峰标签，也可以使用横杠标签

> custom-component 或者 customComponent 都可以

```vue
<template>
    <div id="example">
        <custom-component></custom-component>
        或者
        <customComponent></customComponent>
    </div>
</template>

<script>
import customComponent from './components/custom-component.vue'

export default {
    components:{
        customComponent
    },
    data() {
        return {
            // ...
        }
    },
    // ...
}
</script>
```

### 全局注册

全局注册的组件可以在任意位置使用，也可以组件中使用组件

```js
import Vue from 'vue'
import customComponent from '@/components/custom-component.vue'
Vue.component('custom-component', customComponent)

new Vue({
    // ...其他选项
    render: h => h(App),
}).$mount('#app')
```



## 组件通信

组件通信分为多种情况，如下

### 父子组件通信

#### 父传子

通过父级绑定属性值传给子组件

```vue
<!-- 父组件 :属性名 --> 
<custom-component :value="text"></custom-component>
```

```js
// 子组件使用props接收
export default {
    props: {
        value: { // 属性名
            type: String, // 类型
            default: () => '' // 默认值
        },
    },
}
```

#### 子传父

子组件通过事件触发把值传给父组件

```vue
<!-- 父组件 @事件名，如@changeText="changeText" --> 
<custom-component :value="text" @changeText="changeText"></custom-component>
```

```js
// 子组件使用$emit触发，$emit(事件名, 参数1, 参数2, ...)
this.$emit('changeValue', '子传父')
```

通过props传递父级函数，然后调用传值

```vue
<!-- 父组件 :属性名 --> 
<custom-component :value="text" :changeText="changeText"></custom-component>
```

```js
// 子组件就像调用自己的函数一样执行，需要使用props接收

export default {
    props: {
        changeText: {
            type: Function,
            default: () => null
        },
    },
    methods: {
        setParentText2() {
            this.changeText('子传父')
        }
    }
}
```

#### 完整代码

```vue
<!-- 子组件 -->
<template>
    <div class="">
        输入框输入的内容：{{ value }}
        <button @click="setParentText">通过$emit传给父级</button>
        <button @click="setParentText2">通过props函数传给父级</button>
    </div>
</template>
 
<script>
export default {
    props: {
        value: {
            type: String,
            default: () => ''
        },
        changeText: {
            type: Function,
            default: () => null
        },
    },
    methods: {
        setParentText() {
            this.$emit('changeValue', '子传父')
        },
        setParentText2() {
            this.changeText('子传父')
        }
    }
}
</script>
```



```vue
<!-- 父组件 -->
<template>
    <div id="example">
        <input type="text" v-model="text">
        <custom-component :value="text" @changeText="changeText" :changeText="changeText"></custom-component>
    </div>
</template>

<script>
import customComponent from './components/custom-component.vue'

export default {
    components: {
        customComponent
    },
    data() {
        return {
            text: ''
        }
    },
    methods: {
        changeText(val) {
            this.text = val
        },
    },
    // ...
}
</script>
```

### 非父子组件通信

#### 使用发布订阅模式

修改vue原型，添加一个$event，使得在全局组件或者页面都可以访问

```js
// main.js
import Vue from 'vue'
// ... 其他代码

// 往vue原型上添加一个$event 属性
Vue.prototype.$event = new Vue()

// ... 其他代码
new Vue({
    router,
    store,
    render: h => h(App),
}).$mount('#app')
```

这里忽略页面和组件的概念，把任何vue文件都当作一个vue的实例对象，组件和页面本质是一样的

```js
// A-component.vue
this.$event.$on(事件名, 事件触发函数)

```



```js
// B-component.vue
this.$event.$emit(事件名, 参数1, 参数2, ...)

```



> 注意：
>
> 页面和页面之间使用此方法，只要页面没有被销毁，事件是会被触发的。
>
> 非父子组件使用，当调用和监听组件都在同一个页面下，不管是否是同一层级都会被触发。
>
> 页面监听，子组件触发也是可以的

除了使用new Vue() 这种，也可以自己实现一个发布订阅，然后绑定在vue原型上，本质是一样的

#### 使用vuex

详见vuex篇章



## 插槽

```vue
<!-- 子组件 -->
<template>
    <div class="">
        组件的其他内容，默认的插槽内容将会显示在下方
        <slot></slot>
        指定名字的插槽内容将会显示在下方
        <slot name="name1"></slot>
        <slot name="name2"></slot>
        还可以给插槽内容传递参数，就像组件传值一样 :text="text"
        <slot name="name3" :text="text"></slot>
    </div>
</template>
```

父组件使用子组件插槽格式 v-slot:插槽名="{ 插槽参数 }" ，不需要参数可以省略 "=" 号后面的值，不写指令就是默认插槽位置

可以使用解构赋值 {}，结构对象中的属性。

> <slot></slot>等价于<slot name="default"></slot>
>
> 使用默认插槽可以不写指令，也可以写 v-slot:default

```vue
<!-- 父组件 -->
<template>
    <div id="example">
        <custom-component>
            <div>默认插槽内容</div>
            
            <template v-slot:name1>
                <div>显示在name1插槽</div>
            </template>

            <template v-slot:name2>
                <div>显示在name2插槽</div>
            </template>

		   接收slot传过来的值，使用解构提取 text 可以在当前模板上使用
            <template v-slot:name3="{ text }">
                <div>显示在name3插槽{{ text }}</div>
            </template>

        </custom-component>
    </div>
</template>
```

## 动态组件

使用component组件is属性可以动态的显示不同的组件，使用keep-alive还可以保持组件切换的状态

```vue
<keep-alive>
	<component is="custom-component"></component>
	<component :is="componentName"></component>
</keep-alive>
```


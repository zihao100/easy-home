# 基础

## 指令

### v-model

双向绑定，可以绑定在任意支持input事件和value属性的标签上，包括自定义组件

```vue
<input type="text" v-model="text">
```

> v-model="text" 可以拆开成 :value="text" @input="onTextInput"
>
> 两者是等价的，随着输入框里的值变化，text也会随之改变

拆开写成:value和@input，需要自己实现input事件赋值给绑定的变量。

```vue
<input type="text" :value="text" @input="onTextInput">
```

```js
export default {
    methods: {
        onTextInput(event){ // 由于事件函数第一个参数是event对象，所以从event.target.value取值并赋值给text
            this.text = event.target.value
        },
    },
}
```



#### 组件的v-model

```vue
<!-- 父组件 -->
<template>
    <div id="example">    
		<custom-component v-model="status" />
        <!-- 两者是等价的
        <custom-component :value="status" @input="onStatusInput" />
        -->
    	状态：{{ status }}
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
            status: ''
        }
    },
}
</script>

```

想要实现组件的v-model指令，则需要在组件内部实现一个value属性和触发input事件

```vue
<!-- 子组件 -->
<template>
    <div class="">
        选择一个状态：
        <button @click="setStatus('上线')">上线</button>
        <button @click="setStatus('离线')">离线</button>
    </div>
</template>
 
<script>
export default {
    props: {
        value: {
            type: String,
            default: () => ''
        },
    },
    methods: {
        setStatus(value) {
            this.$emit('input', value)
        },
    }
}
</script>
```



### v-if&v-else&v-else-if

条件判断才会渲染

```html
<div v-if="type === 'A'">
  A
</div>
<div v-else-if="type === 'B'">
  B
</div>
<div v-else-if="type === 'C'">
  C
</div>
<div v-else>
  Not A/B/C
</div>
```

### v-show

根据条件展示元素

```html
<h1 v-show="ok">Hello!</h1>
```

### v-if vs v-show

v-if = false 惰性不创建dom，v-show = false 渲染不显示相当于display=none，v-if有切换开销，v-show有初始化开销



### v-bind

v-bind:属性 可以简写成 :属性，如v-bind:class可以写成v-bind:

```vue
<p v-bind:class="isActive ? 'active' : ''">v-bind:class</p>
<p :class="isActive ? 'active' : ''">:class</p>
```

应用场景

动态class，支持三元运算符，支持数组，支持对象

```vue
<p :class="isActive ? 'active' : ''">三元运算符</p>
<p :class="['default', isActive ? 'active' : '']">数组</p>
<p :class="{active: isActive}">对象</p>
```

动态style，支持对象，支持对象数组

```vue
<template>
    <div id="example">
        <p :style="styleObj">绑定对象</p>
        <p :style="{ color: '#000', fontSize: fontSize }">行内对象</p>
        <p :style="[styleObj, styleObj]">对象数组</p>
    </div>
</template>

<script>
export default {
    data() {
        return {
            styleObj: {
                color: '#000'
            },
            fontSize: '12px'
        }
    },
}
</script>
```



### v-for 

循环一个数组，达到渲染这个数组的目的，注意给循环的dom绑定key属性，主要用在 Vue 的虚拟 DOM 算法，在新旧 nodes 对比时辨识 VNodes。一句话总结就是避免渲染错误，所以要加上唯一标识，不推荐使用index作为key

```vue
<template>
    <div id="example">
        <div v-for="(item, index) in list" :key="item.id">
            <span>数组的索引从0开始：{{ index }}</span>
            <span>可以取元素上存在的属性{{ item.name }}</span>
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            list: [
                { name: '张三', id: 1 },
                { name: '李四', id: 2 }
            ]
        }
    },
}
</script>
```

你也可以用 `of` 替代 `in` 作为分隔符，因为它更接近 JavaScript 迭代器的语法：

```html
<div v-for="item of list"></div>
```

### v-on

事件处理器，v-on:click可以简写成@click，实际开发中有多种事件写法，如下

```vue
<template>
    <div id="example">
        <button @click="onClick">点击一下</button>
        <button @click="onClick2('携带参数')">点击一下</button>
        <button @click="onClick3($event, '携带参数，并带上event')">点击一下</button>
        <button @click="(event) => onClick4(event, '携带参数，并带上event')">点击一下</button>
    </div>
</template>

<script>
export default {
    data() {
        return {
            count: 0,
        }
    },
    methods: {
        onClick(evrnt) {
            console.log('不带参数，第一个参数是 evrnt 对象:', evrnt)
            this.count++
        },
        onClick2(val) {
            console.log('携带参数，第一个参数是 val:', val)
            this.count++
        },
        onClick3(evrnt, val) {
            console.log('包含evrnt 对象，并且带上参数:', evrnt, val)
            this.count++
        },
        onClick4(evrnt, val) {
            console.log('包含evrnt 对象，并且带上参数:', evrnt, val)
            this.count++
        }
    }
}
</script>
```

#### 事件修饰符

- .stop

  阻止冒泡

- .prevent

  阻止浏览器默认行为

- .capture

  可以在捕获阶段阶段触发

- .self

  只有事件元素自己才能触发

- .once

  事件函数之执行一次

- .passive

  它告诉浏览器该事件监听器不会调用 `preventDefault()`，也就是说，它是一个被动的监听器。这可以提高页面的滚动性能。

  

  注意：

  使用修饰符时，顺序很重要；相应的代码会以同样的顺序产生。因此，用 `v-on:click.prevent.self` 会阻止**所有的点击**，而 `v-on:click.self.prevent` 只会阻止对元素自身的点击。

  

  不要把 `.passive` 和 `.prevent` 一起使用，因为 `.prevent` 将会被忽略，同时浏览器可能会向你展示一个警告。请记住，`.passive` 会告诉浏览器你*不*想阻止事件的默认行为。

```vue
<!-- 阻止单击事件继续传播 -->
<a v-on:click.stop="doThis"></a>

<!-- 提交事件不再重载页面 -->
<form v-on:submit.prevent="onSubmit"></form>

<!-- 修饰符可以串联 -->
<a v-on:click.stop.prevent="doThat"></a>

<!-- 只有修饰符 -->
<form v-on:submit.prevent></form>

<!-- 添加事件监听器时使用事件捕获模式 -->
<!-- 即内部元素触发的事件先在此处理，然后才交由内部元素进行处理 -->
<div v-on:click.capture="doThis">...</div>

<!-- 只当在 event.target 是当前元素自身时触发处理函数 -->
<!-- 即事件不是从内部元素触发的 -->
<div v-on:click.self="doThat">...</div>

<!-- 点击事件将只会触发一次 -->
<a v-on:click.once="doThis"></a>

<!-- 滚动事件的默认行为 (即滚动行为) 将会立即触发 -->
<!-- 而不会等待 `onScroll` 完成  -->
<!-- 这其中包含 `event.preventDefault()` 的情况 -->
<div v-on:scroll.passive="onScroll">...</div>
```

#### 按键修饰符

vue支持给键盘事件添加修饰符，格式如下

@键盘事件.按键修饰符="事件函数"

```vue
<!-- 只有在 `key` 是 `Enter` 时调用 `submit` -->
<input @keyup.enter="submit">

<!-- 可以是任意有效的按键名，转为 kebab-case 来作为修饰符 -->
<input @keyup.page-down="onPageDown">


```

##### 键盘事件

1. **keydown：** 按下键盘上的任意键时触发，按住不放会重复触发。
2. **keyup：** 释放键盘上的键时触发。
3. **keypress：** 在按下能够产生字符的键时触发，会在 `keydown` 之后触发，但在 `keyup` 之前触发。在现代 Web 开发中，一般更倾向于使用 `keydown` 和 `keyup`。
4. keydown、keyup、keypress 的 event 对象中的属性：
   - `event.key`：表示按下或释放的是哪个键。
   - `event.code`：表示按下或释放的是哪个物理键，不受键盘布局的影响。
   - `event.ctrlKey`、`event.shiftKey`、`event.altKey`、`event.metaKey`：表示是否同时按下了 Ctrl、Shift、Alt 和 Meta（在 Windows 上通常是 Windows 键）键。

##### 按键码

使用 `keyCode` 作为修饰符 

> 注意：`keyCode` 的事件用法已经被废弃了，并可能不会被最新的浏览器支持。

```vue
<input @keyup.13="submit">
```

为了在必要的情况下支持旧浏览器，Vue 提供了绝大多数常用的按键码的别名：

- `.enter`
- `.tab`
- `.delete` (捕获“删除”和“退格”键)
- `.esc`
- `.space`
- `.up`
- `.down`
- `.left`
- `.right`

> 注意：有一些按键 (`.esc` 以及所有的方向键) 在 IE9 中有不同的 `key` 值, 如果你想支持 IE9，这些内置的别名应该是首选。

你还可以通过全局 `config.keyCodes` 对象[自定义按键修饰符别名](https://v2.cn.vuejs.org/v2/api/#keyCodes)：

```js
// 可以使用 `v-on:keyup.f1`
Vue.config.keyCodes.f1 = 112
```

#### 系统修饰键

可以用如下修饰符来实现仅在按下相应按键时才触发鼠标或键盘事件的监听器。

- `.ctrl`
- `.alt`
- `.shift`
- `.meta`

> 注意：在 Mac 系统键盘上，meta 对应 command 键 (⌘)。在 Windows 系统键盘 meta 对应 Windows 徽标键 (⊞)。在 Sun 操作系统键盘上，meta 对应实心宝石键 (◆)。在其他特定键盘上，尤其在 MIT 和 Lisp 机器的键盘、以及其后继产品，比如 Knight 键盘、space-cadet 键盘，meta 被标记为“META”。在 Symbolics 键盘上，meta 被标记为“META”或者“Meta”。

例如：

```vue
<!-- Alt + C -->
<input v-on:keyup.alt.67="clear">

<!-- Ctrl + Click -->
<div v-on:click.ctrl="doSomething">Do something</div>
```

> 请注意修饰键与常规按键不同，在和 `keyup` 事件一起用时，事件触发时修饰键必须处于按下状态。换句话说，只有在按住 `ctrl` 的情况下释放其它按键，才能触发 `keyup.ctrl`。而单单释放 `ctrl` 也不会触发事件。如果你想要这样的行为，请为 `ctrl` 换用 `keyCode`：`keyup.17`。

##### .exact 修饰符

.exact 修饰符允许你控制由精确的系统修饰符组合触发的事件。

```vue
<!-- 即使 Alt 或 Shift 被一同按下时也会触发 -->
<button v-on:click.ctrl="onClick">A</button>

<!-- 有且只有 Ctrl 被按下的时候才触发 -->
<button v-on:click.ctrl.exact="onCtrlClick">A</button>

<!-- 没有任何系统修饰符被按下的时候才触发 -->
<button v-on:click.exact="onClick">A</button>
```

##### 鼠标按钮修饰符

- `.left`
- `.right`
- `.middle`

这些修饰符会限制处理函数仅响应特定的鼠标按钮。

### v-pre

跳过这个元素和它的子元素的编译过程

### v-cloak

和 CSS 规则如 [v-cloak] { display: none } 一起用时，在Vue加载完成前不会显示，所以不会出现暂时性未编译的{{}}符号

### v-once

只渲染元素和组件一次

过度效果：Vue 在插入、更新或者移除 DOM 时，提供多种不同方式的应用过渡效果。

## computed

```vue
<template>
    <div id="example">
        <p>Original message: "{{ message }}"</p>
        <p>Computed reversed message: "{{ reversedMessage }}"</p>
    </div>
</template>

<script>
export default {
    data() {
        return {
            message: 'Hello'
        }
    },
    computed: {
        reversedMessage: function () {
            return this.message.split('').reverse().join('')
        }
    }
}
</script>
```

## methods

可以在模板中调用方法

```vue
<template>
    <div id="example">
        <p>调用方法获取返回值: "{{ reversedMessage() }}"</p>
    </div>
</template>

<script>
export default {
    data() {
        return {
            message: 'Hello'
        }
    },
    methods: {
        reversedMessage: function () {
            return this.message.split('').reverse().join('')
        }
    }
}
</script>
```



## computed vs methods

computed计算属性是基于依赖进行缓存的，只有依赖发生改变才会重新计算

methods方法都每次都执行，如果是复杂的计算会浪费性能

## watch

监听目标发生改变就执行函数

**选项：handler**

 当监听的数据发生变化会调用此函数，函数接收两个参数，newVal,oldVal

**选项：immediate**

在选项参数中指定 `immediate: true` 将立即以表达式的当前值触发回调：

**选项：deep**

为了发现对象内部值的变化，可以在选项参数中指定 `deep: true`。注意监听数组的变更不需要这么做。

```vue
<template>
    <div id="example">
        <button @click="onClick">点击一下</button>
    </div>
</template>

<script>
export default {
    data() {
        return {
            count: 0
        }
    },
    watch: {
        count: {
            handler(newVal,oldVal) { 
                console.log(newVal,oldVal)
            },
            immediate: true,
            deep: true
        }
    },
}
</script>
```

## MVC MVP MVVM 架构模型对比

MVC：Controller薄，View厚，业务逻辑大都部署在View

MVVM：双向数据绑定，View的变动，映射在 ViewModel，反之一样

MVP：View薄，不部署任何业务逻辑，称为“被动视图”(Passive View)，Presenter厚，逻辑都部署在这里
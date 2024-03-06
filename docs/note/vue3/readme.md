# 基础

## 介绍

### vue3六大亮点

1. performance：性能比vue2快1.2-2倍
2. tree shaking support：按需编译，体积比vue2更小
3. composition API：组合API
4. better typescript support：更好的TS支持
5. custom renderer API：堡垒了自定义渲染API
6. Fragment,Teleport (Protal),Suspense：更先进的组件

### vue3是如何变快的?

#### diff方法优化:

Vue2中的虚拟dom是进行全量的对比

Vue3新增了静态标记(PatchFlag)在与上次虚拟节点进行对比时候，只对比带有patch flag的节点，并且可以通过flag的信息得知当前节点要对比的具体内容

2.x:

生成dom树，当数据发生改变的时候，生成新的dom树，新旧dom树全量进行比较

3.x

生成dom树，并给会改变的地方添加标记，比如<span v-pre>{{val}}</span>动态class 等，枚举标记都是不一样的，对比时只对比会该表的地方

#### hoistStatic 静态提升

Vue2中无论元素是否参与更新，每次都会重新创建

Vue3中对于不参与更新的元素，只会被创建一次，之后会在每次渲染时候被不停的复用

cacheHandlers 事件侦听器缓存

默认情况下onClick会被视为动态绑定，所以每次都会去追踪它的变化，但是因为是同一个函数，所以没有追踪变化，直接缓存起来复用即可

#### ssr渲染

当有大量静态的内容时候，这些内容会被当做纯字符串推进一个buffer里面,即使存在动态的绑定，会通过模板插值嵌入进去。这样会比通过虚拟dmo来渲染的快上很多很多

当静态内容大到一定量级时候，会用 createStaticVNode方法在客户端去生成一个static node,这些静态node，会被直接innerHtml，就不需要创建对象，然后根据对象渲染。

## 响应式

### reactive

仅对对象类型有效（对象、数组和 Map、Set 这样的[集合类型](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects#使用键的集合对象)），而对 string、number 和 boolean 这样的 [原始类型](https://developer.mozilla.org/zh-CN/docs/Glossary/Primitive) 无效。

```vue
<script>
    import { reactive } from 'vue'
    export default {
      setup() {
        const state = reactive({ count: 0 })
        function increment() {
          state.count++
        }
        return {
          state,
          increment// 不要忘记同时暴露 increment 函数
        }
      }
    }
</script>

<template>
    <button @click="increment">
      {{ state.count }}
    </button>
</template>
```



### shallowReactive

**reactive是深层级监听响应式，shallowReactive则是浅层级**

```js
const state = shallowReactive({
  foo: 1,
  nested: {
    bar: 2
  }
})

// 更改状态自身的属性是响应式的
state.foo++

// ...但下层嵌套对象不会被转为响应式
isReactive(state.nested) // false

// 不是响应式的
state.nested.bar++
```

### setup

构建工具简化代码

```vue
<script setup>
    import { reactive } from 'vue'
    
    const state = reactive({ count: 0 })
    
    function increment() {
      state.count++
    }
</script>

<template>
  <button @click="increment">
    {{ state.count }}
  </button>
</template>
```

### ref

适用于任何数据类型的响应式

```vue
<script setup>
    import { ref } from 'vue'
    const count = ref(0)

    function increment() {
      count.value++
    }
</script>

<template>
  <button @click="increment">
    {{ count }} <!-- 无需 .value -->
  </button>
</template>
```

如果值是对象则会使用reactive自动转换它的value

```js
const objectRef = ref({ count: 0 })

// 这是响应式的替换
objectRef.value = { count: 1 }
```

注意：如果是引用数据类型，ref的本质还是reactive

```js
let objRef = ref({ count: 1 })
let numRef = ref(1)
console.log(isReactive(objRef.value)) // true
console.log(isReactive(numRef)) // false
```

###  ref解包

#### 在摸板中解包ref不需要加上.value

```
  const count = ref(0)
  
  <button>
    {{ count }} <!-- 无需 .value -->
  </button>
```



#### 对象中的ref解包

```vue
const object = { foo: ref(1) }

<div>{{ object.foo }}</div> // 1：相当于 {{ object.foo.value }}
<div>{{ object.foo + 1 }}</div> // 错误，不会像预期那样工作

// 可以这样解决
const { foo } = object
<div>{{ foo + 1 }}</div> // 2
```



#### 在响应式对象中解包

只有在深层响应式对象内才会自动解包，**shallowReactive浅层响应式不会自动解包**

```
const count = ref(0)
const state = reactive({
  count
})

console.log(state.count) // 0  自动解包，和普通属性一样

state.count = 1
console.log(count.value) // 1
```

 

```
const otherCount = ref(2)

state.count = otherCount // 重新赋值将会替换就得ref
console.log(state.count) // 2
// 原始 ref 现在已经和 state.count 失去联系
console.log(count.value) // 1
```



#### 数组和集合类型的 ref 解包[](https://cn.vuejs.org/guide/essentials/reactivity-fundamentals.html#ref-unwrapping-in-arrays-and-collections)

当 ref 作为响应式数组或像 Map 这种原生集合类型的元素被访问时，不会进行解包。

```
const books = reactive([ref('Vue 3 Guide')])
// 这里需要 .value
console.log(books[0].value)

const map = reactive(new Map([['count', ref(0)]]))
// 这里需要 .value
console.log(map.get('count').value)
```



## 计算属性

### 只读计算属性

```
<script setup>
import { reactive, computed } from 'vue'

const author = reactive({
  name: 'John Doe',
  books: [
    'Vue 2 - Advanced Guide',
    'Vue 3 - Basic Guide',
    'Vue 4 - The Mystery'
  ]
})

// 一个计算属性 ref
const publishedBooksMessage = computed(() => {
  return author.books.length > 0 ? 'Yes' : 'No'
})
 
</script>

<template>
  <p>Has published books:</p>
  <span>{{ publishedBooksMessage }}</span>
</template>
```



### 可写计算属性

```
<script setup>
import { ref, computed } from 'vue'

const firstName = ref('John')
const lastName = ref('Doe')

const fullName = computed({
  // getter
  get() {
    return firstName.value + ' ' + lastName.value
  },
  // setter
  set(newValue) {
    // 注意：我们这里使用的是解构赋值语法
    [firstName.value, lastName.value] = newValue.split(' ')
  }
})

fullName.value = 'John Doe' // setter 会被调用而 firstName 和 lastName 会随之更新
</script>
```



### 注意事项

#### Getter 不应有副作用[](https://cn.vuejs.org/guide/essentials/computed.html#getters-should-be-side-effect-free)

计算属性的 getter 应只做计算而没有任何其他的副作用，这一点非常重要，请务必牢记。举例来说，**不要在 getter 中做异步请求或者更改 DOM**！一个计算属性的声明中描述的是如何根据其他值派生一个值。因此 getter 的职责应该仅为计算和返回该值。在之后的指引中我们会讨论如何使用[监听器](https://cn.vuejs.org/guide/essentials/watchers.html)根据其他响应式状态的变更来创建副作用。

#### 避免直接修改计算属性值[](https://cn.vuejs.org/guide/essentials/computed.html#avoid-mutating-computed-value)

从计算属性返回的值是派生状态。可以把它看作是一个“临时快照”，每当源状态发生变化时，就会创建一个新的快照。更改快照是没有意义的，因此计算属性的返回值应该被视为只读的，并且永远不应该被更改——应该更新它所依赖的源状态以触发新的计算。

 

## v-model

```
<input
  :value="text"
  @input="event => text = event.target.value">


// 等价于上面
<input v-model="text">
```

v-model 绑定的值通常是静态的字符串，也可以通过v-bind绑定其他数据类型

```
<!-- `picked` 在被选择时是字符串 "a" -->
<input type="radio" v-model="picked" value="a" />

<!-- `toggle` 只会为 true 或 false -->
<input type="checkbox" v-model="toggle" />

<!-- `selected` 在第一项被选中时为字符串 "abc" -->
<select v-model="selected">
  <option value="abc">ABC</option>
</select>
```

true-value 和 false-value 是 Vue 特有的 attributes，仅支持和 v-model 配套使用。

这里 toggle 属性的值会在选中时被设为 'yes'，取消选择时设为 'no'。

你同样可以通过 v-bind 将其绑定为其他动态值：

```
<input
  type="checkbox"
  v-model="toggle"
  true-value="yes"
  false-value="no" />


<input
  type="checkbox"
  v-model="toggle"
  :true-value="dynamicTrueValue"
  :false-value="dynamicFalseValue" />
```

 

## 生命周期

```
<script setup>
import { ref, onMounted } from 'vue'

const el = ref()

onMounted(() => {
  el.value // <div>
})

</script>

<template>
  <div ref="el"></div>
</template>
```



### onMounted()

注册一个回调函数，在组件挂载完成后执行。

### onUpdated()

注册一个回调函数，在组件因为响应式状态变更而更新其 DOM 树之后调用。

### onUnmounted()

注册一个回调函数，在组件实例被卸载之后调用。

### onBeforeMount()

注册一个钩子，在组件被挂载之前被调用。

### onBeforeUpdate()

注册一个钩子，在组件即将因为响应式状态变更而更新其 DOM 树之前调用。

### onBeforeUnmount()

注册一个钩子，在组件实例被卸载之前调用。

### onErrorCaptured()

注册一个钩子，在捕获了后代组件传递的错误时调用。

### onRenderTracked()

注册一个调试钩子，当组件渲染过程中追踪到响应式依赖时调用。

这个钩子仅在开发模式下可用，且在服务器端渲染期间不会被调用。

### onRenderTriggered()

注册一个调试钩子，当响应式依赖的变更触发了组件渲染时调用。

这个钩子仅在开发模式下可用，且在服务器端渲染期间不会被调用。

### onActivated()

注册一个回调函数，若组件实例是缓存树的一部分，当组件被插入到 DOM 中时调用。

这个钩子在服务器端渲染期间不会被调用。

### onDeactivated()

注册一个回调函数，若组件实例是缓存树的一部分，当组件从 DOM 中被移除时调用。

这个钩子在服务器端渲染期间不会被调用。

### onServerPrefetch()

注册一个异步函数，在组件实例在服务器上被渲染之前调用。

#  

## 监听器

### watch ref

watch 的第一个参数可以是不同形式的“数据源”：

它可以是一个 ref (包括计算属性)、一个响应式对象、一个 getter 函数、或多个数据源组成的数组：

```
const x = ref(0)
const y = ref(0)

// 单个 ref
watch(x, (newX) => {
  console.log(`x is ${newX}`)
})

// getter 函数
watch(
  () => x.value + y.value,
  (sum) => {
    console.log(`sum of x + y is: ${sum}`)
  }
)

// 多个来源组成的数组
watch([x, () => y.value], ([newX, newY]) => {
  console.log(`x is ${newX} and y is ${newY}`)
})
```



### watch reactive

```
const obj = reactive({ count: 0 })

// 错误，因为 watch() 得到的参数是一个 number
watch(obj.count, (count) => {
  console.log(`count is: ${count}`)
})

// 提供一个 getter 函数，只有count改变才会触发回调函数
watch(
  () => obj.count,
  (count) => {
    console.log(`count is: ${count}`)
  }
)

// 直接传入一个响应式对象，会隐式地创建一个深层侦听器(deep: true)，该回调函数在所有嵌套的变更时都会被触发
watch(obj, (newValue, oldValue) => {
  // 在嵌套的属性变更时触发
  // 注意：`newValue` 此处和 `oldValue` 是相等的
  // 因为它们是同一个对象！
})

obj.count++
```



### watch props

```
const props = defineProps(['someObject']) // props是一个reactive

// 将someObj转为深层监听
watch(() => props.someObject, (newValue, oldValue) => {
        // 在嵌套的属性变更时触发
        // 注意：`newValue` 此处和 `oldValue` 是相等的
        // *除非* props.someObject 被整个替换了
    },
    { deep: true } // 不加上deep不会监听someObject嵌套属性
)

watch(props, (newValue, oldValue) => {
        // 在嵌套的属性变更时触发
        // 注意：`newValue` 此处和 `oldValue` 是相等的
        // 因为它们是同一个对象！
    }
)
```



### deep 深层侦听器

```
// 直接传入响应式对象才会深层监听，如果是响应式对象下的对象或属性，只有被替换了才会促发
watch(
  () => state.someObject,
  () => {
    // 仅当 state.someObject 被替换时触发
  }
)
```

 

```
// 将响应式对象下的对象或属性转为深层侦听器，开销很大谨慎使用，留意性能
watch(
  () => state.someObject,
  (newValue, oldValue) => {
    // 在嵌套的属性变更时触发
    // 注意：`newValue` 此处和 `oldValue` 是相等的
    // *除非* state.someObject 被整个替换了
  },
  { deep: true }
)
```



### immediate 即时回调的侦听器

创建监听器时就执行

```
watch(source, (newValue, oldValue) => {
  // 立即执行，且当 `source` 改变时再次执行
}, { immediate: true })

```

### watchEffect

对于有多个依赖项的侦听器来说，使用 watchEffect() 可以消除手动维护依赖列表的负担。

侦听一个嵌套数据结构中的几个属性，watchEffect() 会比深度侦听器更有效，因为它将只跟踪回调中被使用到的属性，而不是递归地跟踪所有的属性。

```
const todoId = ref(1)
const data = ref(null)

// 当 todoId 发生变化需要获取数据
watch(todoId, async () => {
  const response = await fetch(
    `https://jsonplaceholder.typicode.com/todos/${todoId.value}`
  )
  data.value = await response.json()
}, { immediate: true })

// 使用watchEffect更合适，他会追钟回调中用到的属性(todoId.value)，避免递归追踪深层响应数据
watchEffect(async () => {
  const response = await fetch(
    `https://jsonplaceholder.typicode.com/todos/${todoId.value}`
  )
  data.value = await response.json()
})  

```

TIP： watchEffect 仅会在其同步执行期间，才追踪依赖。在使用异步回调时，只有在第一个 await 正常工作前访问到的属性才会被追踪。

 

### watch vs watchEffect

watch 和 watchEffect 都能响应式地执行有副作用的回调。它们之间的主要区别是追踪响应式依赖的方式：

- watch

只追踪明确侦听的数据源。它不会追踪任何在回调中访问到的东西。另外，仅在数据源确实改变时才会触发回调。watch 会避免在发生副作用时追踪依赖，因此，我们能更加精确地控制回调函数的触发时机。

- watchEffect

在副作用发生期间追踪依赖。它会在同步执行过程中，自动追踪所有能访问到的响应式属性。这更方便，而且代码往往更简洁，但有时其响应性依赖关系会不那么明确。

 

### 回调的触发时机

数据源发生变化也许会触发DOM更新，监听回调执行是在Vue更新之前的，如果要访问DOM，需要添加 flush: 'post' 选项

```
watch(source, callback, {
  flush: 'post'
})

watchEffect(callback, {
  flush: 'post'
})
```

后置刷新的 watchEffect() 有个更方便的别名 watchPostEffect()

```
import { watchPostEffect } from 'vue'

watchPostEffect(() => {
  /* 在 Vue 更新后执行 */
})
```



### 停止侦听器

在 `setup()` 或 `<script setup>` 中用同步语句创建的侦听器，会自动绑定到宿主组件实例上，并且会在宿主组件卸载时自动停止。因此，在大多数情况下，你无需关心怎么停止一个侦听器。

一个关键点是，侦听器必须用同步语句创建：如果用异步回调创建一个侦听器，那么它不会绑定到当前组件上，你必须手动停止它，以防内存泄漏。

```
<script setup>
import { watchEffect } from 'vue'

// 它会自动停止
watchEffect(() => {})

// ...这个则不会！
setTimeout(() => {
  watchEffect(() => {})
}, 100)
</script>

```



#### 手动停止

```
const unwatch = watchEffect(() => {})

// ...当该侦听器不再需要时
unwatch()

```

注意，需要异步创建侦听器的情况很少，请尽可能选择同步创建。如果需要等待一些异步数据，你可以使用条件式的侦听逻辑

```
// 需要异步请求得到的数据
const data = ref(null)

watchEffect(() => {
  if (data.value) {
    // 数据加载后执行某些操作...
  }
})
```

 

 

 

## nextTick 

```
import { nextTick } from 'vue'

function increment() {
  state.count++
  nextTick(() => {
    // 访问更新后的 DOM
  })
}
```



## 模板引用（ref获取dom元素）

### `<script setup>`中引用组件

```
<template>
  <input ref="input" />
</template>

<script setup>
import { ref, onMounted } from 'vue'

// 声明一个 ref 来存放该元素的引用
// 必须和模板里的 ref 同名
const input = ref(null)

onMounted(() => {
  input.value.focus()
})
</script>



```



### 不使用`<script setup>`

如果不使用 `<script setup>`，需确保从 setup() 返回 ref：

```
export default {
  setup() {
    const input = ref(null)
    // ...
    return {
      input
    }
  }
}

```

注意，你只可以**在组件挂载后**才能访问模板引用。如果你想在模板中的表达式上访问 input，在初次渲染时会是 null。这是因为在初次渲染前这个元素还不存在呢！

如果你需要侦听一个模板引用 ref 的变化，确保考虑到其值为 null 的情况：

```
watchEffect(() => {
  if (input.value) {
    input.value.focus()
  } else {
    // 此时还未挂载，或此元素已经被卸载（例如通过 v-if 控制）
  }
})
```

 

### v-for 中的模板引用

> 需要 v3.2.25 及以上版本
>
> ref 数组**并不**保证与源数组相同的顺序

当在 v-for 中使用模板引用时，对应的 ref 中包含的值是一个数组，它将在元素被挂载后包含对应整个列表的所有元素：

```
<script setup>
import { ref, onMounted } from 'vue'

const list = ref([
  /* ... */
])

const itemRefs = ref([])

onMounted(() => console.log(itemRefs.value))
</script>

<template>
  <ul>
    <li v-for="item in list" ref="itemRefs">
      {{ item }}
    </li>
  </ul>
</template>
```

 

### 函数模板引用

除了使用字符串值作名字，ref attribute 还可以绑定为一个函数，会在每次组件更新时都被调用。该函数会收到元素引用作为其第一个参数：

```
<input :ref="(el) => { /* 将 el 赋值给一个数据属性或 ref 变量 */ }">
```

注意我们这里需要使用动态的 :ref 绑定才能够传入一个函数。当绑定的元素被卸载时，函数也会被调用一次，此时的 el 参数会是 null。你当然也可以绑定一个组件方法而不是内联函数。

 

### 组件上的 ref

```
<script setup>
import { ref, onMounted } from 'vue'
import Child from './Child.vue'

const child = ref(null)

onMounted(() => {
  // child.value 是 <Child /> 组件的实例
})
</script>

<template>
  <Child ref="child" />
</template>

```

 

注意：

如果一个子组件使用的是选项式 API 或没有使用 `<script setup>`，被引用的组件实例和该子组件的 this 完全一致，这意味着父组件对子组件的每一个属性和方法都有完全的访问权。这样会使得父子组件之间创建紧密耦合的实现细节变得很容易，因此只在绝对需要时才使用组件引用。大多数情况下，你应该首先使用标准的 props 和 emit 接口来实现父子组件交互。

 

有一个例外的情况，使用了 `<script setup>` 的组件是默认私有的：

一个父组件无法访问到一个使用了 `<script setup>` 的子组件中的任何东西，除非子组件在其中通过 defineExpose 宏显式暴露：

```
<script setup>
import { ref } from 'vue'

const a = 1
const b = ref(2)

defineExpose({
  a,
  b
})
</script>
```

当父组件通过模板引用获取到了该组件的实例时，得到的实例类型为 

{ a: number, b: number } (ref 都会自动解包，和一般的实例一样)。
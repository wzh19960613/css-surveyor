# css-surveyor

[English](README.md) | 中文

轻松计算 CSS 尺寸表达式的像素值结果

## 安装

```bash
npm i css-surveyor
```

## 使用方法

```javascript
import { CssSurveyor } from 'css-surveyor'

const surveyor = new CssSurveyor()

surveyor.widthExpr = '100%'
surveyor.heightExpr = 'calc(100vh - 50px)'

console.log(surveyor.width, surveyor.height)

surveyor.events.on('widthChanged', w => console.log('宽度更新为:', w))
surveyor.events.on('heightChanged', h => console.log('高度更新为:', h))

// 不再使用时需要调用 cleanup 方法释放资源
surveyor.cleanup()
```

## API

### 构造函数

```javascript
new CssSurveyor(connectTo?: HTMLElement | string | null)
```

`connectTo`: 可选参数，指定要连接到的元素，此后的尺寸计算将基于该元素

- 如果为字符串，则表示选择器，会调用 `document.querySelector` 方法查找元素
- 如果为 HTMLElement，则直接使用该元素
- 如果不传入或为 undefined，则默认连接到 `document.body`
- 如果为 null，则不会立即连接，需要之后手动调用 `connect` 方法

### 方法

- `connect(elemOrSelector?: HTMLElement | string)`: 连接到指定的元素。与构造函数参数相同但不能为 null
- `disconnect()`: 断开与当前元素的连接
- `remeasure()`: 手动触发重新测量，一般情况下不需要手动调用
- `cleanup()`: 不再使用时需要调用此函数。将断开连接并清除所有事件监听器

### 属性

- `widthExpr?: string`: 获取或设置宽度表达式
- `heightExpr?: string`: 获取或设置高度表达式
- `width: number`: 获取当前测量的宽度
- `height: number`: 获取当前测量的高度
- `connected?: HTMLElement`: 获取当前连接的元素
- `events`: 事件发射器，用于订阅 `widthChanged` 和 `heightChanged` 事件。参考 [mitt](https://github.com/developit/mitt)

## 注意事项

- CssSurveyor 使用一个隐藏的 `div` 元素来进行测量，不会影响页面布局，但可能影响 `:empty` 伪类选择器的结果
- 确保在不再需要监测时调用 `cleanup()` 方法以释放资源
- 可以使用一切合法的 CSS 尺寸表达式，但 CssSurveyor 不会对表达式进行任何验证
- 分为 `widthExpr` 和 `heightExpr` 两个表达式是因为 CSS 百分比值的参考来源可能为宽度或高度。所以如果要计算的表达式不包含百分比值，则放在两者中的哪一个都没有关系
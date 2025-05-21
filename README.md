# css-surveyor

English | [中文](README_CN.md)

Easily calculate pixel values for CSS length expressions

## Installation

```bash
npm i css-surveyor
```

## Usage

```javascript
import { CssSurveyor } from 'css-surveyor'

const surveyor = new CssSurveyor()

surveyor.widthExpr = '100%'
surveyor.heightExpr = 'calc(100vh - 50px)'

console.log(surveyor.width, surveyor.height)

surveyor.events.on('widthChanged', w => console.log('Width updated to:', w))
surveyor.events.on('heightChanged', h => console.log('Height updated to:', h))

// Call cleanup method to release resources when no longer in use
surveyor.cleanup()
```

## API

### Constructor

```javascript
new CssSurveyor(connectTo?: HTMLElement | string | null)
```

`connectTo`: Optional parameter specifying the element to connect to. Subsequent size calculations will be based on this element.

- If a string, it represents a selector and will use `document.querySelector` to find the element
- If an HTMLElement, it will use that element directly
- If not provided or undefined, it will default to connecting to `document.body`
- If null, it won't connect immediately, and you'll need to manually call the `connect` method later

### Methods

- `connect(elemOrSelector?: HTMLElement | string)`: Connect to the specified element. Same as constructor parameter but cannot be null
- `disconnect()`: Disconnect from the current element
- `remeasure(forceUpdate = false)`: Manually trigger remeasurement, usually not needed to call manually. If `forceUpdate` is true, it will emit the event even if the value is the same as the previous value
- `cleanup()`: Call this function when no longer in use. It will disconnect and clear all event listeners

### Properties

- `widthExpr?: string`: Get or set the width expression
- `heightExpr?: string`: Get or set the height expression
- `width: number`: Get the currently measured width
- `height: number`: Get the currently measured height
- `connected?: HTMLElement`: Get the currently connected element
- `events`: Event emitter for subscribing to `widthChanged` and `heightChanged` events. Refer to [mitt](https://github.com/developit/mitt)

## Attention

- CssSurveyor uses a hidden `div` element for measurements, which won't affect page layout but may impact the results of `:empty`, `:has`, `::last-child` or other pseudo-class selectors
- Make sure to call the `cleanup()` method when monitoring is no longer needed to release resources
- You can use any valid CSS size expression, but CssSurveyor won't perform any validation on the expressions
- There are separate `widthExpr` and `heightExpr` expressions because CSS percentage values may reference either width or height. So if the expression you want to calculate doesn't include percentage values, it doesn't matter which one you use

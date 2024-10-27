import mitt from 'mitt'

export class CssSurveyor {
    #connected: HTMLElement | undefined
    #element = document.createElement('div')
    #observer: ResizeObserver = new ResizeObserver(([{ contentRect: { width, height } }]) => {
        if (this.#widthExpr && (this.#width !== width))
            this.events.emit('widthChanged', this.#width = width)
        if (this.#heightExpr && (this.#height !== height))
            this.events.emit('heightChanged', this.#height = height)
    })
    #width = 0
    #height = 0
    #widthExpr: string | undefined
    #heightExpr: string | undefined
    #appended = false
    events = mitt<{ widthChanged: number; heightChanged: number }>()

    constructor(connectTo?: HTMLElement | string | null) {
        const { style } = this.#element
        style.position = 'absolute'
        style.visibility = 'hidden'
        style.pointerEvents = 'none'
        if (connectTo !== null) this.connect(connectTo)
    }

    connect(elemOrSelector?: HTMLElement | string) {
        const elem = elemOrSelector
            ? typeof elemOrSelector === 'string'
                ? document.querySelector<HTMLElement>(elemOrSelector)
                : elemOrSelector instanceof HTMLElement ? elemOrSelector : undefined
            : document.body
        if (!elem) throw new ReferenceError(elem === null
            ? `CssSurveyor: Can't find ${elemOrSelector}`
            : 'CssSurveyor: Trying to connect an object that is not an HTMLElement')
        if (this.#connected === elem) return
        this.disconnect()
        this.#connected = elem
        this.#updateMeasurement()
    }

    get connected() { return this.#connected }

    get widthExpr() { return this.#widthExpr }
    set widthExpr(value) {
        this.#widthExpr = value
        this.#updateMeasurement()
    }

    get heightExpr() { return this.#heightExpr }
    set heightExpr(value) {
        this.#heightExpr = value
        this.#updateMeasurement()
    }

    get width() { return this.#width }
    get height() { return this.#height }

    remeasure() {
        if (!this.#appended) return
        if (this.#widthExpr) {
            const { offsetWidth: width } = this.#element
            if (this.#width !== width) this.events.emit('widthChanged', this.#width = width)
        }
        if (this.#heightExpr) {
            const { offsetHeight: height } = this.#element
            if (this.#height !== height) this.events.emit('heightChanged', this.#height = height)
        }
    }

    cleanup() {
        this.disconnect()
        this.events.all.clear()
    }

    disconnect() {
        if (!this.#connected) return
        this.#observer.disconnect()
        this.#connected.removeChild(this.#element)
        this.#connected = undefined
        this.#appended = false
        this.#width = 0
        this.#height = 0
    }

    #updateMeasurement() {
        const elem = this.#element, wExpr = this.#widthExpr, hExpr = this.#heightExpr
        if (wExpr) elem.style.width = wExpr
        if (hExpr) elem.style.height = hExpr
        const container = this.#connected
        if (!container) return
        const shouldAppend = Boolean(wExpr || hExpr)
        if (this.#appended !== shouldAppend)
            if (this.#appended = shouldAppend) {
                container.appendChild(elem)
                this.#observer.observe(elem)
            } else {
                container.removeChild(elem)
                this.#observer.disconnect()
            }
        this.remeasure()
    }
}
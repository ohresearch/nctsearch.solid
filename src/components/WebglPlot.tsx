import { createEffect, createSignal, For, onMount, Show } from "solid-js"
import { ColorRGBA, WebglLine, WebglPlot } from "webgl-plot"

let canvas: HTMLCanvasElement
let wglp: WebglPlot

export const [lines, setLines] = createSignal({
	probability: new WebglLine(new ColorRGBA(255, 0, 0, 1), 500),
	rms: new WebglLine(new ColorRGBA(0, 0, 255, 1), 500),
})

export default function (props: any) {
	onMount(() => {
		if (props.lines) setLines(props.lines)
		const devicePixelRatio = window.devicePixelRatio || 1
		canvas.width = props.width || canvas.clientWidth * devicePixelRatio
		canvas.height = props.height || canvas.clientHeight * devicePixelRatio
		wglp = new WebglPlot(canvas)

		function newFrame() {
			wglp.update()
			requestAnimationFrame(newFrame)
		}
		requestAnimationFrame(newFrame)
	})

	createEffect(() => {
		const numX = canvas.width
		const list = Object.values(lines()) as WebglLine[]
		list.forEach((line: WebglLine) => {
			line.lineSpaceX(-1, 2 / numX)
			line.arrangeX()
			wglp.addLine(line)
		})
	})

	return (
		<div>
			<Show when={props.key} fallback={<Key />}>
				{props.key}
			</Show>
			<canvas ref={canvas} style={props.style || "width: 100%"} />
		</div>
	)
}

function rgba(color: any) {
	return `rgba(${color.r}, ${color.g}, ${color.b}, ${color.a})`
}

function Key(props: any) {
	const map = props.lines || (lines() as any)
	return (
		<>
			<For each={Object.keys(map)}>
				{(key, i) => (
					<span
						style={{
							color: rgba(map[key].color),
							"margin-left": "10px",
						}}
					>
						━━ {key}
					</span>
				)}
			</For>
		</>
	)
}

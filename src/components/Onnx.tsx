import LinearProgress from "@suid/material/LinearProgress"
import Meyda from "meyda"
import { createEffect, createSignal, onMount, Show } from "solid-js"
import { audioContext, source, state } from "./AudioOptions"
import { lines } from "./WebglPlot"
// import * as ort from 'onnxruntime-web'
// npm ERR! notarget No matching version found for flatbuffers@^1.12.0.
// import * as ort from "https://cdn.jsdelivr.net/npm/onnxruntime-web/dist/ort.min.js"
// I had to import it in index.html :(
export const ort = (window as any).ort

export const [ortSession, setOrtSession] = createSignal({} as any)

// read a file https://www.w3.org/TR/FileAPI/

export default function (props: any) {
	onMount(async () => {
		const sess = await ort.InferenceSession.create(
			props.modelfilename || "breath_detection_no_zipmap.onnx"
		)
		setOrtSession(sess)
		console.log({ onnx: sess })
	})

	let analyzer: any

	createEffect(() => {
		analyzer?.source(source())
	})

	createEffect(() => {
		analyzer?.stop()
		state() // trigger an update
		if (!source()) return
		if (!audioContext()) return
		if (!ortSession()?.handler) return

		// See https://meyda.js.org/guides/online-web-audio.html

		let input_name = ortSession().handler.inputNames[0]
		let output_names = ortSession().handler.outputNames

		let mfccs = []

		analyzer = Meyda.createMeydaAnalyzer({
			audioContext: audioContext(),
			source: source(),
			numberOfMFCCCoefficients: 40,
			bufferSize: 512,
			featureExtractors: ["rms", "mfcc"],

			callback: (data: any) => {
				if (!data.rms) return

				mfccs.push(data.mfcc)
				console.log({ mfccs })

				lines().rms.shiftAdd(new Float32Array([data.rms * 20]))

				const tensor = new ort.Tensor(
					"float32",
					Float32Array.from(data.mfcc),
					[1, 40]
				)

				const feeds = { [input_name]: tensor }
				//console.log(feeds)
				ortSession()
					.run(feeds, output_names)
					.then((results: any) => {
						const temp = results.probabilities.data[1]
						//console.log({ results })
						lines().probability.shiftAdd(new Float32Array([temp]))
					})
			},
		})
		analyzer.start()
		console.log("meyda analyzer started")
	})

	console.log("loading onnx model...")
	return (
		<Show when={!ortSession().handler && (props.showProgress ?? true)}>
			<LinearProgress />
		</Show>
	)
}

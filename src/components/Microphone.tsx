import Meyda from "meyda"
import { onMount } from "solid-js"

// see https://pulakk.github.io/Live-Audio-MFCC/tutorial.html

function createAudioCtx() {
	let AudioContext = window.AudioContext || window.webkitAudioContext
	return new AudioContext()
}

function createMicSrcFrom(audioCtx: AudioContext) {
	return new Promise((resolve, reject) => {
		/* only audio */
		let constraints = { audio: true, video: false }

		/* get microphone access */
		navigator.mediaDevices
			.getUserMedia(constraints)
			.then((stream) => {
				/* create source from microphone input stream */
				let src = audioCtx.createMediaStreamSource(stream)
				resolve(src)
			})
			.catch((err) => {
				reject(err)
			})
	})
}

function callback(features: any) {
	let mfcc = features["mfcc"]
	let rms = features["rms"]

	// if ( rms > THRESHOLD_RMS )
	mfcc_history.push(mfcc) /* only push mfcc where some audio is present */

	// if(mfcc_history.length > MFCC_HISTORY_MAX_LENGTH)
	// 	mfcc_history.splice(0,1) /* remove past mfcc values */
}

function setupMeydaAnalzer() {
	let audioCtx = createAudioCtx()

	createMicSrcFrom(audioCtx)
		.then((src) => {
			let analyzer = Meyda.createMeydaAnalyzer({
				audioContext: audioCtx,
				source: src,
				bufferSize: 512,
				featureExtractors: ["mfcc", "rms"],
				callback: callback,
			})
			analyzer.start()
		})
		.catch((err) => {
			console.log({ err })
		})
}

function read(file: string, callback: Function) {
	const reader = new FileReader()
	reader.addEventListener("load", (event) => {
		callback(event.target?.result)
	})
	reader.readAsDataURL(file)
}

const SAMPLE_RATE = 16000

export default function () {
	onMount(async (eval_feats: any) => {
		try {
			const sess = await ort.InferenceSession.create(
				"breath_detection.onnx"
			)

			let input_name = sess.handler.inputNames[0]
			let prediction_name = sess.handler.outputNames[0]
			let probability_name = sess.handler.outputNames[1]

			let pred_onx = sess.run([prediction_name, probability_name], {
				input_name: eval_feats,
			})

			let predictions = pred_onx[0]
			let probabilities = pred_onx[1]

			console.log({ predictions, probabilities })
		} catch (e) {
			document.write(`failed to inference ONNX model: ${e}.`)
		}
	})

	return <div>onnx</div>
}

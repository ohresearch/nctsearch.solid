import MicIcon from "@suid/icons-material/MicRounded"
import StopIcon from "@suid/icons-material/StopCircleRounded"
import Box from "@suid/material/Box"
import Button from "@suid/material/Button"
import { createSignal, Show } from "solid-js"
import Onnx from "./Onnx"
import UploadButton from "./UploadButton"

let refAudio: HTMLMediaElement

export const [fileSrc, setFileSrc] = createSignal("")
export const [audioContext, setAudioContext] = createSignal(null as any)
export const [source, setSource] = createSignal(null as any)
export const [fileName, setFileName] = createSignal("")
export const [state, setState] = createSignal("stop")

// read a file https://www.w3.org/TR/FileAPI/

export default function (props: any) {
	function onPlay() {
		setAudioContext(audioContext() || new AudioContext())
		setSource(audioContext().createMediaElementSource(refAudio))
		source().connect(audioContext().destination)
	}

	async function onMic() {
		setAudioContext(audioContext() || new AudioContext())

		if (state() != "recording") {
			let audioOnly = { audio: true, video: false }
			navigator.mediaDevices.getUserMedia(audioOnly).then((stream) => {
				setSource(audioContext().createMediaStreamSource(stream))
			})
		} else {
			setAudioContext(null)
			setSource(null)
		}
	}

	return (
		<>
			<Onnx />
			<Box>
				<Box>
					<Button
						sx={{ m: 1 }}
						size="small"
						variant="contained"
						component="span"
						startIcon={
							state() == "recording" ? <StopIcon /> : <MicIcon />
						}
						onClick={() => {
							onMic()
							setState(
								state() == "recording" ? "stop" : "recording"
							)
						}}
					>
						{state() == "recording" ? "Stop" : "Record"}
					</Button>

					<UploadButton
						onClick={() => {
							setState("upload")
						}}
						onChange={(event: any) => {
							const files = event?.target?.files as any
							setFileName(files[0].name)
							setFileSrc(URL.createObjectURL(files[0]))
						}}
					/>
				</Box>
			</Box>
			<Box style={{ margin: "1rem" }}>
				<Show when={state() == "upload"}>
					<Box>
						<audio
							controls={props.controls ?? true}
							//loop={props.loop ?? true}
							crossorigin="anonymous"
							src={fileSrc()}
							ref={refAudio!}
							onplay={onPlay}
						></audio>
					</Box>
					<Box>Filename: {fileName()}</Box>
				</Show>
			</Box>
		</>
	)
}

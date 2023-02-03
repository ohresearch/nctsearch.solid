import Container from "@suid/material/Container"
import { createSignal } from "solid-js"
import MainAppBar from "../components/MainAppBar"
import Sunburst from "../components/Sunburst"
import UploadButton from "../components/UploadButton"
import Barchart from "../components/Barchart"

export const [json, setJson] = createSignal()
export const [fileName, setFileName] = createSignal()

const reader = new FileReader()
reader.onload = (event: any) => {
	setJson(JSON.parse(event.target.result))
}

export default function HomePage(props: any) {
	return (
		<>
			<MainAppBar />
			<Container>
				NCT Analysis
				<div>
					<UploadButton
						onChange={(event: any) => {
							const files = event?.target?.files as any
							setFileName(files[0].name)
							reader.readAsText(files[0])
						}}
					/>
				</div>
				<Barchart />
				<Sunburst />
			</Container>
		</>
	)
}

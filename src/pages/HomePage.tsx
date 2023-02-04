import Container from "@suid/material/Container"
import { createSignal, Match, Show, Switch } from "solid-js"
import MainAppBar from "../components/MainAppBar"
import Sunburst from "../components/Sunburst"
import UploadButton from "../components/UploadButton"
import Barchart from "../components/Barchart"
import Alert from "@suid/material/Alert"
import LinearProgress from "@suid/material/LinearProgress"

export const [json, setJson] = createSignal()
export const [fileName, setFileName] = createSignal("")

export default function HomePage(props: any) {
	const [loading, setLoading] = createSignal(false)

	const reader = new FileReader()
	reader.onload = (event: any) => {
		setJson(JSON.parse(event.target.result))
		setLoading(false)
	}

	return (
		<>
			<MainAppBar />
			<Container>
				<div>
					<UploadButton
						onChange={(event: any) => {
							setLoading(true)
							const files = event?.target?.files as any
							setFileName(files[0].name)
							reader.readAsText(files[0])
						}}
					/>
				</div>
				<Show when={loading()}>
					<LinearProgress />
				</Show>
				<h1>{fileName()}</h1>
				<Switch
					fallback={
						<Alert severity="info">
							Please upload a well formatted file
						</Alert>
					}
				>
					<Match when={fileName().includes(".count.")}>
						<Barchart json={json()} />
					</Match>
					<Match when={fileName().includes(".trie.")}>
						<Sunburst json={json()} />
					</Match>
				</Switch>
			</Container>
		</>
	)
}

import Container from "@suid/material/Container"
import AudioPlayer from "../components/AudioOptions"
import MainAppBar from "../components/MainAppBar"
import WebglPlot from "../components/WebglPlot"

export default function HomePage(props: any) {
	return (
		<>
			<MainAppBar />
			<Container>
				Breathrate Analysis
				<div>
					<AudioPlayer />
					<WebglPlot />
				</div>
			</Container>
		</>
	)
}

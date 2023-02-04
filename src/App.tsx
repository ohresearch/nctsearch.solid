import { Component } from "solid-js"

import { Route, Routes } from "@solidjs/router"
import Stack from "@suid/material/Stack"
import dayjs from "dayjs"
import { Cache } from "./components/Cache"
import HomePage from "./pages/HomePage"

const App: Component = () => {
	const clinicianId = new Cache("ids").read().clinicianId

	return (
		<>
			<div style={{ "min-height": "90vh" }}>
				<Routes>
					<Route path="/:id?" component={HomePage} />
				</Routes>
			</div>
			{/* <Footer>Clinician ID {clinicianId}</Footer> */}
			<Footer />
		</>
	)
}

function Footer(props: any) {
	return (
		<>
			<div style={{ height: "50px" }}></div>
			<div
				style={{
					color: "gray",
					"font-size": "0.5rem",
					margin: "1rem",
				}}
			>
				<Stack direction="row" spacing={2}>
					<div>
						&copy;{dayjs(Date.now()).format("YYYY")}{" "}
						ObvioHealth,&nbsp;inc.
					</div>
					<div>
						visit{" "}
						<a href="https://obviohealth.com">ObvioHealth.com</a>
					</div>

					<div>{props.children}</div>
				</Stack>
			</div>
		</>
	)
}

export default App

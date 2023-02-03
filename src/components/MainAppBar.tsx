import BackIcon from "@suid/icons-material/ChevronLeftRounded"
import HomeIcon from "@suid/icons-material/Home"
import DataIcon from "@suid/icons-material/InsertChartOutlinedRounded"
import MenuIcon from "@suid/icons-material/Menu"
import Button from "@suid/material/Button"
import LogoIcon from "./icons/LogoIcon.svg"

import { useLocation, useParams } from "@solidjs/router"
import IconButton from "@suid/material/IconButton"
import { createEffect, createSignal, Show } from "solid-js"
import config from "./config"

import ShowMobile, { isMobile } from "./IsMobile"

export default function (props: any) {
	const location = useLocation()
	const [id, setID] = createSignal("")
	const [path, setPath] = createSignal("")

	createEffect(() => {
		setPath(location.pathname || "")
		setID(useParams().id)
	})

	return (
		<>
			<div class="is-fixed-top">
				<nav
					class="navbar "
					role="navigation"
					aria-label="main navigation"
					style={{ "background-color": "black", color: "white" }}
				>
					<div>
						<Show when={isMobile() && history.length > 2 && path()}>
							<div class="navbar-item">
								<IconButton
									component="label"
									color="inherit"
									onClick={() => {
										history.back()
									}}
								>
									<BackIcon />
								</IconButton>
							</div>
						</Show>

						<div class="navbar-item">
							<Button
								component="label"
								color="inherit"
								onClick={() => {}}
								startIcon={<HomeIcon />}
							>
								<ShowMobile fallback="Home" />
							</Button>
						</div>

						<Show when={!isMobile()}>
							<div
								class="navbar-item hide-mobile"
								style={{ margin: "0 20px 0 20px" }}
							>
								<Button
									component="label"
									color="inherit"
									onClick={() => {
										window.open(
											config.appstore,
											"oCapture appstore"
										)
									}}
									startIcon={
										<LogoIcon
											style={{
												position: "relative",
												top: "4px",
											}}
										/>
									}
								>
									{config.name}
								</Button>
							</div>
						</Show>

						<Show when={!path()?.includes("/data/")}>
							<div class="navbar-item">
								<Button
									component="label"
									color="inherit"
									onClick={() => {}}
									startIcon={<DataIcon />}
								>
									<ShowMobile fallback="Data" />
								</Button>
							</div>
						</Show>
					</div>

					<div class="navbar-item">
						<IconButton component="label" color="inherit">
							<MenuIcon />
						</IconButton>
					</div>
				</nav>
			</div>
			<div style={{ height: "60px" }}></div>
		</>
	)
}

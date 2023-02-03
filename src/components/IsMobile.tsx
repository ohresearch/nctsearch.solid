import { onMount, createSignal, Show } from "solid-js"
import config from "./config"

export const [isMobile, setMobile] = createSignal(false)

export default function ShowMobile(props: any) {
	onMount(() => {
		setMobile(window.innerWidth < (config.mobilewidth || 767))
	})

	window.onresize = () => {
		setMobile(window.innerWidth < (config.mobilewidth || 767))
	}

	return (
		<Show when={isMobile()} fallback={props.fallback}>
			{props.children}
		</Show>
	)
}

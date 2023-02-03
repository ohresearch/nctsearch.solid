import config from "./config"

export function tryDeepLink(
	deeplink = config.deeplink,
	store = config.appstore
) {
	setTimeout(() => {
		window.open(store, "_blank") // fallback, open in new tab
	}, 3000)
	window.location.href = deeplink // if this succeeds the timeout will never trigger
}

export default function (props: any) {
	return (
		<>
			<div
				onClick={() => {
					tryDeepLink(props.deeplink, props.store)
				}}
			>
				{props.children}
			</div>
		</>
	)
}

export default {
	name: "Respirate",
	colors: {
		icon: "#fc0a7e",
		// https://coolors.co/5d4938-855F44-b59c8c-b2cb95-ddc173-dc8644-d5452f
		bristol: [
			"fff",
			"5d4938",
			"855F44",
			"b59c8c",
			"b2cb95",
			"ddc173",
			"dc8644",
			"d5452f",
		],
	},
	gap: 4, //  maximum gap between sessions in hours, e.g. 2.5 hours
	bucketName: "gs://ocapture-unity.appspot.com",
	days: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
	months: [
		...["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
		...["Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
	],

	appstore: "https://testflight.apple.com/join/D7Te0CC7",
	deeplink: "oCapture://start/",
	mobilewidth: 767,
}

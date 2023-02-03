import UploadIcon from "@suid/icons-material/UploadFileRounded"
import Button from "@suid/material/Button"

export default function (props: any) {
	let refFile: any

	return (
		<>
			<Button
				sx={props.sx || { m: 1 }}
				size={props.size || "small"}
				variant={props.variant || "contained"}
				component="span"
				startIcon={props.startIcon || <UploadIcon />}
				onClick={() => {
					refFile?.click()
				}}
			>
				{props.children || "Upload"}
			</Button>
			<input
				style={{ display: "none" }}
				type="file"
				ref={refFile}
				onChange={props.onChange}
			/>
		</>
	)
}

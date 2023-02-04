import LinearProgress from "@suid/material/LinearProgress"
import { createEffect, Show, createSignal } from "solid-js"

let ref

export default function (props) {


	createEffect(() => {
		try {
			ref.innerHTML = ""
			const data = props.json
			if (!data) return


			const width = 1200
			const radius = width / 6
			console.log({ data })

			const color = d3.scaleOrdinal(
				d3.quantize(d3.interpolateRainbow, data.children.length + 1)
			)

			const arc = d3
				.arc()
				.startAngle((d) => d.x0)
				.endAngle((d) => d.x1)
				.padAngle((d) => Math.min((d.x1 - d.x0) / 2, 0.005))
				.padRadius(radius * 1.5)
				.innerRadius((d) => d.y0 * radius)
				.outerRadius((d) => Math.max(d.y0 * radius, d.y1 * radius - 1))

			function partition (data) {
				const root = d3
					.hierarchy(data)
					.sum((d) => d.size)
					.sort((a, b) => b.size - a.size)
				return d3.partition().size([2 * Math.PI, root.height + 1])(root)
			}

			const root = partition(data)
			console.log({ root })

			root.each((d) => (d.current = d))

			const svg = d3
				.select("#sunburst")
				.append("svg")
				.attr("viewBox", [0, 0, width, width])
				.attr("width", width)
				.attr("height", width)
				.attr(
					"style",
					"max-width: 100%; height: auto; height: intrinsic;"
				)
				.style("font", "10px sans-serif")

			const g = svg
				.append("g")
				.attr("transform", `translate(${width / 2},${width / 2})`)

			const path = g
				.append("g")
				.selectAll("path")
				.data(root.descendants().slice(1))
				.join("path")
				.attr("fill", (d) => {
					while (d.depth > 1) d = d.parent
					return color(d.data.name)
				})
				.attr("fill-opacity", (d) =>
					arcVisible(d.current) ? (d.children ? 0.6 : 0.4) : 0
				)
				.attr("pointer-events", (d) =>
					arcVisible(d.current) ? "auto" : "none"
				)

				.attr("d", (d) => arc(d.current))

			path.filter((d) => d.children)
				.style("cursor", "pointer")
				.on("click", clicked)

			function getMouseOverText (d) {
				var leaves = d.leaves()
				var text = `Number of Studies: ${d.value.toLocaleString("en")}`
				text = text.concat("\n\nChild Endpoints + Num Studies")
				for (let i = 0; i < leaves.length; i++) {
					text = text.concat(
						`\n${leaves[i].data.name.toLocaleString("en")} ${leaves[
							i
						].data.size.toLocaleString("en")}`
					)
				}
				return text
			}

			path.append("title").text((d) => getMouseOverText(d))

			const label = g
				.append("g")
				.attr("pointer-events", "none")
				.attr("text-anchor", "middle")
				.style("user-select", "none")
				.selectAll("text")
				.data(root.descendants().slice(1))
				.join("text")
				.attr("dy", "0.35em")
				.attr("fill-opacity", (d) => +labelVisible(d.current))
				.attr("transform", (d) => labelTransform(d.current))
				.text((d) => d.data.name)

			const parent = g
				.append("circle")
				.datum(root)
				.attr("r", radius)
				.attr("fill", "none")
				.attr("pointer-events", "all")
				.on("click", clicked)


			// d3.select("body")
			//     .selectAll("div")
			//         .data(data)
			//     .enter().append("div")
			//         .style("width", function(d) { return x(d) + "px"; })
			//         .text(function(d) { return d; })
			//         .on("mouseover", function(d){tooltip.text(d); return tooltip.style("visibility", "visible");})
			//         .on("mousemove", function(){return tooltip.style("top", (d3.event.pageY-10)+"px").style("left",(d3.event.pageX+10)+"px");})
			//         .on("mouseout", function(){return tooltip.style("visibility", "hidden");});

			function clicked (event, p) {
				parent.datum(p.parent || root)

				root.each(
					(d) =>
					(d.target = {
						x0:
							Math.max(
								0,
								Math.min(1, (d.x0 - p.x0) / (p.x1 - p.x0))
							) *
							2 *
							Math.PI,
						x1:
							Math.max(
								0,
								Math.min(1, (d.x1 - p.x0) / (p.x1 - p.x0))
							) *
							2 *
							Math.PI,
						y0: Math.max(0, d.y0 - p.depth),
						y1: Math.max(0, d.y1 - p.depth),
					})
				)

				const t = g.transition().duration(750)

				// Transition the data on all arcs, even the ones that aren’t visible,
				// so that if this transition is interrupted, entering arcs will start
				// the next transition from the desired position.
				path.transition(t)
					.tween("data", (d) => {
						const i = d3.interpolate(d.current, d.target)
						return (t) => (d.current = i(t))
					})
					.filter(function (d) {
						return (
							+this.getAttribute("fill-opacity") ||
							arcVisible(d.target)
						)
					})
					.attr("fill-opacity", (d) =>
						arcVisible(d.target) ? (d.children ? 0.6 : 0.4) : 0
					)
					.attr("pointer-events", (d) =>
						arcVisible(d.target) ? "auto" : "none"
					)

					.attrTween("d", (d) => () => arc(d.current))

				label
					.filter(function (d) {
						return (
							+this.getAttribute("fill-opacity") ||
							labelVisible(d.target)
						)
					})
					.transition(t)
					.attr("fill-opacity", (d) => +labelVisible(d.target))
					.attrTween(
						"transform",
						(d) => () => labelTransform(d.current)
					)
			}

			function arcVisible (d) {
				return d.y1 <= 3 && d.y0 >= 1 && d.x1 > d.x0
			}

			function labelVisible (d) {
				return (
					d.y1 <= 3 &&
					d.y0 >= 1 &&
					(d.y1 - d.y0) * (d.x1 - d.x0) > 0.03
				)
			}

			function labelTransform (d) {
				const x = (((d.x0 + d.x1) / 2) * 180) / Math.PI
				const y = ((d.y0 + d.y1) / 2) * radius
				return `rotate(${x - 90}) translate(${y},0) rotate(${x < 180 ? 0 : 180
					})`
			}
		} catch (error) {
			console.log(error)
		}
	})



	return <>
		<div id="sunburst" ref={ref} />
	</>

}


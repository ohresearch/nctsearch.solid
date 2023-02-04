import { createEffect, Show, createSignal } from "solid-js"


let ref

export default function (props) {



	createEffect(async () => {
		try {
			ref.innerHTML = ""
			const data = props.json
			if (!data) return



			// Copyright 2021 Observable, Inc.
			// Released under the ISC license.
			// https://observablehq.com/@d3/bar-chart
			function BarChart (
				data,
				{
					x = (d, i) => i, // given d in data, returns the (ordinal) x-value
					y = (d) => d, // given d in data, returns the (quantitative) y-value
					title, // given d in data, returns the title text
					marginTop = 20, // the top margin, in pixels
					marginRight = 0, // the right margin, in pixels
					marginBottom = 180, // the bottom margin, in pixels
					marginLeft = 40, // the left margin, in pixels
					width = 640, // the outer width of the chart, in pixels
					height = 400, // the outer height of the chart, in pixels
					xDomain, // an array of (ordinal) x-values
					xRange = [marginLeft, width - marginRight], // [left, right]
					yType = d3.scaleLinear, // y-scale type
					yDomain, // [ymin, ymax]
					yRange = [height - marginBottom, marginTop], // [bottom, top]
					xPadding = 0.1, // amount of x-range to reserve to separate bars
					yFormat, // a format specifier string for the y-axis
					yLabel, // a label for the y-axis
					color = "currentColor", // bar fill color
				} = {}
			) {
				// Compute values.
				const X = d3.map(data, x)
				const Y = d3.map(data, y)

				// Compute default domains, and unique the x-domain.
				if (xDomain === undefined) xDomain = X
				if (yDomain === undefined) yDomain = [0, d3.max(Y)]
				if (yDomain[1] % 10 != 0 && yDomain[1] > 10)
					yDomain[1] = Math.floor(yDomain[1] / 10 + 1) * 10
				xDomain = new d3.InternSet(xDomain)

				// Omit any data not present in the x-domain.
				const I = d3.range(X.length).filter((i) => xDomain.has(X[i]))

				// Construct scales, axes, and formats.
				const xScale = d3.scaleBand(xDomain, xRange).padding(xPadding)
				const yScale = yType(yDomain, yRange)
				const xAxis = d3.axisBottom(xScale).tickSizeOuter(0)
				const yAxisTicks = yScale
					.ticks(height / 40, yFormat)
					.filter((tick) => Number.isInteger(tick))
				const yAxis = d3
					.axisLeft(yScale)
					.tickValues(yAxisTicks)
					.tickFormat(d3.format("d"))

				// Compute titles.
				if (title === undefined) {
					const formatValue = yScale.tickFormat(100, yFormat)
					title = (i) => `${X[i]}\n${formatValue(Y[i])}`
				} else {
					const O = d3.map(data, (d) => d)
					const T = title
					title = (i) => T(O[i], i, data)
				}

				const svg = d3
					.select("#bar")
					.append("svg")
					.attr("width", width)
					.attr("height", height)
					.attr("viewBox", [0, 0, width, height])
					.attr(
						"style",
						"max-width: 100%; height: auto; height: intrinsic;"
					)

				svg.append("g")
					.attr("transform", `translate(${marginLeft},0)`)
					.call(yAxis)
					.call((g) => g.select(".domain").remove())
					.call((g) =>
						g
							.selectAll(".tick line")
							.clone()
							.attr("x2", width - marginLeft - marginRight)
							.attr("stroke-opacity", 0.1)
					)
					.call((g) =>
						g
							.append("text")
							.attr("x", -marginLeft)
							.attr("y", 10)
							.attr("fill", "currentColor")
							.attr("text-anchor", "start")
							.text(yLabel)
					)

				const bar = svg
					.append("g")
					.attr("fill", color)
					.selectAll("rect")
					.data(I)
					.join("rect")
					.attr("x", (i) => xScale(X[i]))
					.attr("y", (i) => yScale(Y[i]))
					.attr("height", (i) => yScale(0) - yScale(Y[i]))
					.attr("width", xScale.bandwidth())

				if (title) bar.append("title").text(title)

				svg.append("g")
					.attr("transform", `translate(0,${height - marginBottom})`)
					.call(xAxis)
					.selectAll("text")
					.style("text-anchor", "end")
					.attr("dx", "-.8em")
					.attr("dy", ".15em")
					.attr("transform", "rotate(-65)")

				return svg.node()
			}


			console.log({ data })

			// Sort data by count decending
			data.sort(function (a, b) {
				if (a.count == b.count) return 0
				if (a.count < b.count) return 1
				if (a.count > b.count) return -1
			})

			console.log({ data })


			// Create chart only with top 30 results
			chart = BarChart(data.slice(0, 30), {
				x: (d) => d.letter,
				y: (d) => d.count,
				yFormat: "",
				yLabel: "↑ Count",
				width: 1600,
				height: 1000,
				color: "steelblue",
			})

		} catch (error) {
			console.log(error)
		}
	})

	return <>
		<div id="bar" ref={ref} />
	</>

}


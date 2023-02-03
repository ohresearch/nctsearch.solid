export class Cache {
	label: string
	data: any

	constructor(label?: string) {
		this.label = label || "data"
	}

	read(): any {
		if (this.data) return this.data
		let temp = localStorage.getItem(this.label)
		temp = temp ? JSON.parse(temp || "") : []
		console.log({ cache: this.label, read: temp })
		this.data = temp
		return temp
	}

	write(data: any): any {
		this.data = data
		console.log({ cache: this.label, write: data })
		localStorage.setItem(this.label, JSON.stringify(data))
		return data
	}

	clear() {
		localStorage.removeItem(this.label)
	}

	append(data: any): any {
		if (!data) return this.read()
		if (!data.length) data = [data]
		const temp = [...this.read(), ...data] // append to existing cache
		this.write(temp)
		return temp
	}
}

export default new Cache()

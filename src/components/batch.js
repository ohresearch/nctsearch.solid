// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app"
import {
	getStorage,
	ref,
	list,
	listAll,
	getDownloadURL,
} from "firebase/storage"
import {
	getFirestore,
	collection,
	doc,
	getDocs,
	setDoc,
	query,
	where,
} from "firebase/firestore"

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
	apiKey: "AIzaSyDWK6ndCvORgZ2fWpqum_yAjxbY04996FY",
	authDomain: "ocapture-unity.firebaseapp.com",
	projectId: "ocapture-unity",
	storageBucket: "ocapture-unity.appspot.com",
	messagingSenderId: "124998579348",
	appId: "1:124998579348:web:af48ef38e1519fbfc3b081",
}

// Initialize Firebase
export const app = initializeApp(firebaseConfig)
// Initialize Cloud Storage and get a reference to the service
export const storage = getStorage(app)
export const firestore = getFirestore()

class DB {
	db = null
	constructor(db = null) {
		this.db = db || firestore
	}

	async set(path, name, data) {
		console.log({ "DB.set": path, name, data })
		await setDoc(doc(this.db, path, name), data)
	}

	async query(path, expr) {
		let q
		if (expr.length != 3) return []

		//see https://firebase.google.com/docs/firestore/query-data/queries
		q = query(collection(this.db, path), where(expr[0], expr[1], expr[2]))

		const snapshot = await getDocs(q)
		const list = []
		snapshot.forEach((doc) => list.push(doc.data()))
		return list
	}

	async all(path) {
		const q = query(collection(this.db, path))
		const snapshot = await getDocs(q)
		const list = []
		snapshot.forEach((doc) => list.push(doc.data()))
		return list
	}
}

const db = new DB()

export async function getUrl(filename) {
	try {
		if (!filename) return ""
		return await getDownloadURL(ref(storage, filename))
	} catch (error) {
		console.log({ getUrl: filename, error })
		return ""
	}
}

async function getJson(filename) {
	try {
		const url = await getUrl(filename)
		const response = await fetch(url)
		const json = await response.json()
		return json
	} catch (error) {
		console.log({ getJson: filename, error })
		json.error = error
		return json
	}
	return {}
}

async function jsonToDb(item) {
	const filename = item._location.path_
	if (!filename.includes(".png")) return
	const json = await getJson(filename.replace(".png", ".json"))
	json.img = await getUrl(filename.replace(".json", ".png"))
	json.filename = filename
	await db.set("imageData", filename.replace(".png", ""), json)
	console.log({ jsonToDb: json })
}

export async function processFiles() {
	const storageRef = ref(storage)
	let response = await list(storageRef, { maxResults: 100 })
	response.items.forEach(async (item) => {
		await jsonToDb(item)
	})

	while (response.nextPageToken) {
		response = await list(storageRef, {
			maxResults: 100,
			pageToken: response.nextPageToken,
		})
		response.items.forEach(async (item) => {
			await jsonToDb(item)
		})
	}
}

const randomInteger = (N) => {
	return Math.floor(N * Math.random())
}

export async function processRecords() {
	const data = await db.all("imageData")

	// update filename
	// data.map((item) => {
	// 	item.patientid = item.filename.split(/[-_]/)[0]
	// 	return item
	// }).forEach((item) => {
	// 	const name = item.filename.split(".")[0]
	// 	db.set("imageData", name, item)
	// })

	//update annotations from imageData
	Array.from(new Set(data.map((item) => item.sessionid))).forEach(
		(sessionid) => {
			if (sessionid) {
				const patientid = sessionid.split(/[-_]/)[0]
				db.set("annotations", sessionid, {
					sessionid,
					patientid,
					parent: randomInteger(8),
					ml: randomInteger(8),
					expert: randomInteger(8),
				})
			}
		}
	)
}

export async function processUrls() {
	const data = await db.all("imageData")

	data.forEach(async (item) => {
		if (!item.img || !item.img.length) {
			console.log({ processUrls: item })
			item.img = await getUrl(item.filename.replace(".png", "") + ".png")
			db.set("imageData", item.filename, item)
		}
	})
}

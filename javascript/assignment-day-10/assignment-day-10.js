let db;

document.addEventListener('DOMContentLoaded', () => {
	const request = indexedDB.open('db_item', 1);

	request.onerror = (e) => {
		console.log('Database failed to open');
	};

	request.onsuccess = (e) => {
		console.log('Database opened successfully');
	};

	request.onupgradeneeded = (e) => {
		let db = e.target.result;
		let objectStore = db.createObjectStore("items", {keyPath: "id", autoIncrement: true})
		objectStore.createIndex("name", "name", {unique: false})
		objectStore.createIndex("price", "price", {unique: false})
		objectStore.createIndex("quantity", "quantity", {unique: false})
		objectStore.createIndex("total", "total", {unique: false})
		console.log('Database setup complete');
	};
});

const form = document.getElementById('item-form');

form.addEventListener('submit', (e) => {
	e.preventDefault();
	let id = document.getElementById('itemId').value;
	let name = document.getElementById('itemName').value;
	let price = document.getElementById('itemPrice').value;

	let transaction = db.transaction(["items"], "readwrite");
	let objectStore = transaction.objectStore("items");

	let request = objectStore.put({
		id: id,
		name: name,
		price: price,
		quantity: quantity,
		total: price * quantity
	});

	request.onsuccess = function () {
		form.reset();
	};
});


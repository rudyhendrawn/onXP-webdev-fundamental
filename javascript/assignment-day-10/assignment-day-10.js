let db;

document.addEventListener('DOMContentLoaded', () => {
	const request = indexedDB.open('db_item', 1);

	request.onerror = (e) => {
		console.log('Database failed to open');
	};

	request.onsuccess = (e) => {
		db = e.target.result;
		console.log('Database opened successfully');
	};

	request.onupgradeneeded = (e) => {
		db = e.target.result;
		let objectStore = db.createObjectStore("items", {keyPath: "id", autoIncrement: true})
		objectStore.createIndex("name", "name", {unique: false})
		objectStore.createIndex("price", "price", {unique: false})
		objectStore.createIndex("quantity", "quantity", {unique: false})
		objectStore.createIndex("total", "total", {unique: false})
		console.log('Database setup complete');
	};

	document.getElementById('itemForm').addEventListener('submit', addItem);
});

function addItem(e) {
	e.preventDefault();
	let id = document.getElementById('itemId').value;
	let name = document.getElementById('itemName').value;
	let price = document.getElementById('itemPrice').value;
	let quantity = document.getElementById('itemQuantity').value;
	let total = price * quantity;

	document.getElementById('itemTotal').value = total;

	let transaction = db.transaction(["items"], "readwrite");
	let objectStore = transaction.objectStore("items");

	let request = objectStore.put({
		id: id,
		name: name,
		price: price,
		quantity: quantity,
		total: total
	});

	request.onsuccess = () => {
		console.log('Item added/updated to the database');
		document.getElementById('itemForm').reset();
		viewItems();
	};

	request.onerror = () => {
		console.log('Error adding/updating item');
	};
}

function viewItems() {
	let transaction = db.transaction(["items"], "readonly");
	let objectStore = transaction.objectStore("items");
	let request = objectStore.openCursor();

	let tbody = document.getElementById('itemTable').getElementsByTagName('tbody')[0];
	tbody.innerHTML = '';

	request.onsuccess = (e) => {
		let cursor = e.target.result;
		if (cursor) {
			let tr = document.createElement('tr');
			tr.innerHTML = `
				<td>${cursor.value.id}</td>
				<td>${cursor.value.name}</td>
				<td>${cursor.value.price}</td>
				<td>${cursor.value.quantity}</td>
				<td>${cursor.value.total}</td>
				<td>
					<button onclick="deleteItem(${cursor.value.id})">Delete</button>
					<button onclie="loadItem(${cursor.value.id})">Edit</button>
				</td>
			`;
			tbody.appendChild(tr);
			cursor.continue();
		}
	};
}
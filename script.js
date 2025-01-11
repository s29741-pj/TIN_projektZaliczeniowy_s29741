const incomeArea = document.querySelector(".income-area");
const expensesArea = document.querySelector(".expenses-area");
const availableMoney = document.querySelector(".available-money");
const addTransactionBtn = document.querySelector(".add-transaction");
const deleteAll = document.querySelector(".delete-all");
const lightMode = document.querySelector(".light");
const darkMode = document.querySelector(".dark");
const validationWarning = document.querySelector(".warning");
const bill = document.querySelector(".bill");
const btc = document.querySelector(".btc-btn");
const usdTicker = document.querySelector(".usd-btc");
const gbpTicker = document.querySelector(".gbp-btc");
const eurTicker = document.querySelector(".eur-btc");
const addTransactionPanel = document.querySelectorAll(".add-transaction-panel");
const transactionName = document.querySelector("#name");
const transactionAmount = document.querySelector("#amount");
const transactionCategory = document.querySelector("#category");
const saveBtn = document.querySelector(".save");
const cancelBtn = document.querySelectorAll(".cancel");
const iconList = [
	'<i class="fas fa-money-bill-wave"></i>',
	'<i class="fas fa-cart-arrow-down"></i>',
	'<i class="fas fa-hamburger"></i>',
	'<i class="fas fa-film"></i>',
];

let incomeList = [];
let expenseList = [];

let root = document.documentElement;
let ID = 0;
let categoryIcon;
let selectedCategory;
let moneyArr = [0];

const showPanel = index => {
	if (index == 0) {
		addTransactionPanel[index].style.display = "flex";
	} else if (index == 1) {
		addTransactionPanel[index].style.display = "flex";
	}
};

const closePanel = index => {
	if (index == 0) {
		addTransactionPanel[index].style.display = "none";
		clearInputs();
	} else if (index == 1) {
		addTransactionPanel[index].style.display = "none";
	}
};

const checkForm = () => {
	if (
		transactionName.value !== "" &&
		transactionAmount.value !== "" &&
		transactionCategory.value !== "none"
	) {
		createNewTransaction();
		validationWarning.classList.add("hidden");
	} else {
		validationWarning.classList.remove("hidden");
	}
};

const clearInputs = () => {
	transactionName.value = "";
	transactionAmount.value = "";
	transactionCategory.selectedIndex = 0;
};

const createNewTransaction = () => {
	const newTransaction = document.createElement("div");
	newTransaction.classList.add("transaction");
	newTransaction.setAttribute("id", ID);
	let newTransactionValue = transactionAmount.value;
	const newTransactionName = transactionName.value;

	checkCategory(selectedCategory);

	if (categoryIcon != iconList[0] && newTransactionValue >= 0) {
		newTransactionValue = newTransactionValue * -1;
		expenseList.push(`${newTransactionName}, ${newTransactionValue}$`);
	} else {
		incomeList.push(`${newTransactionName}, ${newTransactionValue}$`);
	}

	console.log(expenseList);
	console.log(incomeList);

	newTransaction.innerHTML = ` 
        <p class="transaction-name">${categoryIcon} ${newTransactionName}</p>
        <p class="transaction-amount">${newTransactionValue} $
        <button class="delete" onclick="deleteTransaction(${ID})"><i class="fas fa-times"></i></button></p>
        `;
	newTransactionValue > 0 && categoryIcon == iconList[0]
		? incomeArea.appendChild(newTransaction) &&
		  newTransaction.classList.add("income")
		: expensesArea.appendChild(newTransaction) &&
		  newTransaction.classList.add("expense");

	moneyArr.push(parseFloat(newTransactionValue));

	countMoney(moneyArr);
	closePanel(0);
	ID++;
	clearInputs();
};

const selectCategory = () => {
	selectedCategory =
		transactionCategory.options[transactionCategory.selectedIndex].text;
};

const checkCategory = transaction => {
	switch (transaction) {
		case "[ + ] Przychód":
			categoryIcon = iconList[0];
			break;
	}
	switch (transaction) {
		case "[ - ] Zakupy":
			categoryIcon = iconList[1];
			break;
	}
	switch (transaction) {
		case "[ - ] Jedzenie":
			categoryIcon = iconList[2];
			break;
	}
	switch (transaction) {
		case "[ - ] Kino":
			categoryIcon = iconList[3];
			break;
	}
};

const countMoney = money => {
	const newMoney = money.reduce((a, b) => a + b);
	availableMoney.textContent = `${newMoney.toFixed(2)} $`;
};

const deleteTransaction = id => {
	const transactionToDelete = document.getElementById(id);
	const transactionAmount = parseFloat(
		transactionToDelete.childNodes[3].innerText
	);
	const indexOfTransaction = moneyArr.indexOf(transactionAmount);

	moneyArr.splice(indexOfTransaction, 1);

	transactionToDelete.classList.contains("income")
		? incomeArea.removeChild(transactionToDelete)
		: expensesArea.removeChild(transactionToDelete);

	countMoney(moneyArr);
};

const deleteAllTransactions = () => {
	incomeArea.innerHTML = "<h3>Przychody:</h3>";
	expensesArea.innerHTML = "<h3>Wydatki:</h3>";
	availableMoney.textContent = "0$";
	moneyArr = [0];
};

const changeStyleToLight = () => {
	root.style.setProperty("--first-color", "#f3f2f2");
	root.style.setProperty("--second-color", "#14161F");
	root.style.setProperty("--border-color", "rgba(0,0,0,.2");
};

const changeStyleToDark = () => {
	root.style.setProperty("--first-color", "#14161F");
	root.style.setProperty("--second-color", "#F9F9F9");
	root.style.setProperty("--border-color", "rgba(255,255,255,.4");
};

function downloadTxtFile() {
	const maxLength = Math.max(incomeList.length, expenseList.length);

	let content = "Incomes:\t\t\tExpenses:\n";
	for (let i = 0; i < maxLength; i++) {
		const column1 = incomeList[i] !== undefined ? incomeList[i] : "";
		const column2 = expenseList[i] !== undefined ? expenseList[i] : "";
		content += `\t${column1}\t\t\t\t${column2}\n`;
	}

	content += `\n\nSaldo: ${availableMoney.textContent}`;

	const blob = new Blob([content], { type: "text/plain" });
	const url = URL.createObjectURL(blob);

	const a = document.createElement("a");
	a.href = url;
	a.download = "data.txt";
	document.body.appendChild(a);
	a.click();

	document.body.removeChild(a);
	URL.revokeObjectURL(url);
}

async function downloadBtcData() {
	//https://api.coindesk.com/v1/bpi/currentprice.json
	const response = await fetch(
		"https://api.coindesk.com/v1/bpi/currentprice.json"
	);
	const json = await response.json();

	return json;
}

function updateTickers() {
	downloadBtcData().then(response => {
		usdTicker.innerHTML = `${response.bpi.USD.rate} <i class="fa-solid fa-dollar-sign"></i>`;
	});
	downloadBtcData().then(response => {
		gbpTicker.innerHTML = `${response.bpi.GBP.rate} <i class="fa-solid fa-sterling-sign"></i>`;
	});
	downloadBtcData().then(response => {
		eurTicker.innerHTML = `${response.bpi.EUR.rate} <i class="fa-solid fa-euro-sign"></i>`;
	});
}

window.onload = function () {
	setInterval(updateTickers, 2000);
	saveBtn.addEventListener("click", checkForm);
	lightMode.addEventListener("click", changeStyleToLight);
	darkMode.addEventListener("click", changeStyleToDark);
	deleteAll.addEventListener("click", deleteAllTransactions);
	bill.addEventListener("click", downloadTxtFile);

	transactionAmount.addEventListener("input", function (e) {
		let value = e.target.value;

		value = value.replace(",", ".");

		const validValue = value.match(/^\d*\.?\d{0,2}$/);

		if (!validValue) {
			e.target.value = e.target.value.slice(0, -1);
		}
	});

	addTransactionBtn.addEventListener("click", () => {
		showPanel(0);
	});

	btc.addEventListener("click", () => {
		showPanel(1);
	});
	cancelBtn.forEach(cancel => {
		cancel.addEventListener("click", e => {
			closePanel(e.target.attributes.order.value);
		});
	});
};

const incomeArea = document.querySelector(".income-area");
const expensesArea = document.querySelector(".expenses-area");
const availableMoney = document.querySelector(".available-money");
const addTransactionBtn = document.querySelector(".add-transaction");
const deleteAll = document.querySelector(".delete-all");
const lightMode = document.querySelector(".light");
const darkMode = document.querySelector(".dark");
const validationWarning = document.querySelector(".warning");

const addTransactionPanel = document.querySelectorAll(".add-transaction-panel");
const transactionName = document.querySelector("#name");
const transactionAmount = document.querySelector("#amount");
const transactionCategory = document.querySelector("#category");
const saveBtn = document.querySelector(".save");
const cancelBtn = document.querySelector(".cancel");
const iconList = [
	'<i class="fas fa-money-bill-wave"></i>',
	'<i class="fas fa-cart-arrow-down"></i>',
	'<i class="fas fa-hamburger"></i>',
	'<i class="fas fa-film"></i>',
];

let root = document.documentElement;
let ID = 0;
let categoryIcon;
let selectedCategory;
let moneyArr = [0];

const showPanel = index => {
	addTransactionPanel[index].style.display = "flex";
};

const closePanel = index => {
	addTransactionPanel[index].style.display = "none";
	clearInputs();
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
	}

	console.log(newTransactionValue);

	newTransaction.innerHTML = ` 
        <p class="transaction-name">${categoryIcon} ${newTransactionName}</p>
        <p class="transaction-amount">${newTransactionValue} zł
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
	availableMoney.textContent = `${newMoney} zł`;
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
	availableMoney.textContent = "0zł";
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

addTransactionBtn.addEventListener("click", () => {
	showPanel(0);
});
cancelBtn.addEventListener("click", () => {
	closePanel(0);
});
saveBtn.addEventListener("click", checkForm);
lightMode.addEventListener("click", changeStyleToLight);
darkMode.addEventListener("click", changeStyleToDark);
deleteAll.addEventListener("click", deleteAllTransactions);

// ! 08.01 stop
// ! dodać obsługę i przeliczanie
// https://api.coindesk.com/v1/bpi/currentprice.json
// fetch('https://api.coindesk.com/v1/bpi/currentprice.json')
// .then(response => response.json())
// .then(data => console.log(data))
// .catch(error => console.error('Error:', error));
// ! dodać export do txt danych z transakcji
// HTML structure to include in your HTML file
// <button id="download-btn">Download File</button>

// JavaScript code
// const list1 = ["Item1", "Item2", "Item3", "Item4"];
// const list2 = ["Data1", "Data2", "Data3", "Data4"];

// // Function to create and download the text file
// function downloadTxtFile() {
//   if (list1.length !== list2.length) {
//     alert("Lists have different lengths. Ensure both lists have the same number of elements.");
//     return;
//   }

//   let content = "Column 1\tColumn 2\n"; // Header row with tab separator
//   for (let i = 0; i < list1.length; i++) {
//     content += `${list1[i]}\t${list2[i]}\n`; // Add rows with tab separation
//   }

//   // Create a blob with the content
//   const blob = new Blob([content], { type: "text/plain" });
//   const url = URL.createObjectURL(blob);

//   // Create a temporary link and trigger the download
//   const a = document.createElement("a");
//   a.href = url;
//   a.download = "data.txt";
//   document.body.appendChild(a);
//   a.click();

//   // Cleanup
//   document.body.removeChild(a);
//   URL.revokeObjectURL(url);
// }

// // Attach the function to the button
// const button = document.getElementById("download-btn");
// button.addEventListener("click", downloadTxtFile);

const budgetForm = document.querySelector("#budget-form");
const budgetInput = document.querySelector("#budget-input");
const budgetSubmit = document.querySelector("#budget-submit");
const budgetFeedback = document.querySelector(".budget-feedback");
const budget = document.querySelector("#budget");

const expenseForm = document.querySelector("#expense-form");
const expenseInput = document.querySelector("#expense-input");
const amountInput = document.querySelector("#amount-input");
const expenseSubmit = document.querySelector("#expense-submit");
const expenseFeedback = document.querySelector(".expense-feedback");
const expense = document.querySelector("#expense");

const balance = document.querySelector("#balance");
const expenseTable = document.querySelector(".expenseTable");

let budgetTransactions = [];
let newExpense = [];

let expenseEditing = false;
let editingIndex;

let isEditing = false;

let showBudget = "";
let showExpense = "";

const caclBudget = function () {
  if (budgetTransactions.length >= 1) {
    showBudget = budgetTransactions.reduce((a, b) => a + b);
  } else {
    showBudget = 0;
  }
  if (newExpense.length >= 1) {
    showExpense = newExpense.reduce((a, b) => (a += b.amount), 0);
  } else {
    showExpense = 0;
  }

  budget.innerHTML = `$ ${showBudget}`;
  expense.innerHTML = `$ ${showExpense}`;

  const showBalance = `$ ${showBudget - showExpense}`;

  if (showBudget > showExpense) {
    balance.classList.remove("expense");
    balance.classList.remove("text-dark");
    balance.classList.add("budget");
  }
  if (showExpense > showBudget) {
    balance.classList.remove("budget");
    balance.classList.remove("text-dark");
    balance.classList.add("expense");
  }
  if (showBudget == showExpense) {
    balance.classList.remove("budget");
    balance.classList.remove("expense");
    balance.classList.add("text-dark");
  }

  balance.innerHTML = showBalance;
};

const renderNewExpense = function (arr = []) {
  expenseTable.innerHTML = "";
  arr.forEach(function ({ name, amount }, index) {
    const trExpense = document.createElement("tr");

    const tdExpenseName = document.createElement("td");
    const tdExpenseAount = document.createElement("td");
    const tdAction = document.createElement("td");

    tdExpenseName.innerHTML = name;
    tdExpenseAount.innerHTML = amount;

    const deleteBtn = document.createElement("button");
    deleteBtn.classList.add("btn", "btn-danger", "mx-1");
    deleteBtn.innerHTML = `<i class="fa fa-trash" aria-hidden="true"></i>`;

    deleteBtn.addEventListener("click", function () {
      const isConfirmed = confirm(
        `Are you sure you want to delete "${name}" item`,
      );

      if (isConfirmed) {
        newExpense.splice(index, 1);
        renderNewExpense(newExpense);
        caclBudget();
      }
    });
    const editBtn = document.createElement("button");
    editBtn.classList.add("btn", "btn-warning");
    editBtn.innerHTML = `<i class="fa fa-edit" aria-hidden="true"></i>`;

    editBtn.addEventListener("click", function (e) {
      expenseEditing = true;
      editingIndex = index;

      const editExpense = newExpense[index];

      expenseInput.value = editExpense.name;
      amountInput.value = editExpense.amount;

      expenseSubmit.innerHTML = "Edit";

      const deleteButtons = document.querySelectorAll(".btn-danger");
      deleteButtons.forEach((delBtn) => {
        delBtn.disabled = true;
      });
    });
    expenseSubmit.innerHTML = "Add Expense";
    tdAction.append(editBtn, deleteBtn);
    trExpense.append(tdExpenseName, tdExpenseAount, tdAction);
    expenseTable.appendChild(trExpense);
  });
};
const submitExpense = function () {
  const name = expenseInput.value;
  const amount = +amountInput.value;
  const newAddedExpense = {
    name,
    amount,
  };
  if (expenseEditing) {
    expenseEditing = false;

    newExpense[editingIndex].name = name;
    newExpense[editingIndex].amount = amount;

    editingIndex = undefined;
    expenseSubmit.innerText = "Edit";
  } else {
    newExpense = [newAddedExpense, ...newExpense];
  }
  renderNewExpense(newExpense);
  expenseForm.reset();
};

const budgetApp = function (e) {
  e.preventDefault();

  const hasClassNameBudget = e.target.className.includes("budget-submit");
  const hasClassNameExpense = e.target.className.includes("expense-submit");
  const hasClassNameDelete = e.target.className.includes("delete");

  if (hasClassNameBudget) {
    if (budgetInput.value == "" || budgetInput.value < 0) {
      budgetFeedback.classList.add("showItem");
      setTimeout(function () {
        budgetFeedback.classList.remove("showItem");
      }, 2000);

      budgetInput.value = "";
    } else {
      budgetTransactions.push(+budgetInput.value);
      caclBudget();
      budgetInput.value = "";
      budgetFeedback.style.display = "none";
    }
  }

  if (hasClassNameExpense) {
    if (
      expenseInput.value === "" ||
      amountInput.value === "" ||
      amountInput.value < 0
    ) {
      expenseFeedback.classList.add("showItem");
      setTimeout(function () {
        expenseFeedback.classList.remove("showItem");
      }, 2000);
      expenseInput.value = "";
      amountInput.value = "";
    } else {
      expenseFeedback.style.display = "none";
      submitExpense();
      caclBudget();
    }
  }
  if (hasClassNameDelete) {
    caclBudget();
  }
};

window.addEventListener("click", budgetApp);

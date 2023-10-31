'use strict';

// Simply Bank App

const account1 = {
  userName: 'Cecil Ireland',
  transactions: [500.25, 250, -300, 5000, -850, -110, -170, 1100],
  interest: 1.5,
  pin: 1111,
  transactionsDates: [
    '2021-10-02T14:43:31.074Z',
    '2021-10-29T11:24:19.761Z',
    '2021-11-15T10:45:23.907Z',
    '2022-01-22T12:17:46.255Z',
    '2022-02-12T15:14:06.486Z',
    '2022-03-09T11:42:26.371Z',
    '2022-05-21T07:43:59.331Z',
    '2022-06-22T15:21:20.814Z',
  ],
  currency: 'USD',
  locale: 'en-US',
};

const account2 = {
  userName: 'Amani Salt',
  transactions: [2000, 6400, -1350, -70, -210, -2000, 5500, -30],
  interest: 1.3,
  pin: 2222,
  transactionsDates: [
    '2021-10-02T14:43:31.074Z',
    '2021-10-29T11:24:19.761Z',
    '2021-11-15T10:45:23.907Z',
    '2022-01-22T12:17:46.255Z',
    '2022-02-12T15:14:06.486Z',
    '2022-03-09T11:42:26.371Z',
    '2022-05-21T07:43:59.331Z',
    '2022-06-22T15:21:20.814Z',
  ],
  currency: 'CNY',
  locale: 'zh-CN',
};

const account3 = {
  userName: 'Corey Martinez',
  transactions: [900, -200, 280, 300, -200, 150, 1400, -400],
  interest: 0.8,
  pin: 3333,
  transactionsDates: [
    '2021-10-02T14:43:31.074Z',
    '2021-10-29T11:24:19.761Z',
    '2021-11-15T10:45:23.907Z',
    '2022-01-22T12:17:46.255Z',
    '2022-02-12T15:14:06.486Z',
    '2022-03-09T11:42:26.371Z',
    '2022-05-21T07:43:59.331Z',
    '2022-06-22T15:21:20.814Z',
  ],
  currency: 'RUB',
  locale: 'ru-RU',
};

const account4 = {
  userName: 'Kamile Searle',
  transactions: [530, 1300, 500, 40, 190],
  interest: 1,
  pin: 4444,
  transactionsDates: [
    '2021-10-02T14:43:31.074Z',
    '2021-10-29T11:24:19.761Z',
    '2021-11-15T10:45:23.907Z',
    '2022-01-22T12:17:46.255Z',
    '2022-02-12T15:14:06.486Z',
  ],
  currency: 'EUR',
  locale: 'fr-CA',
};

const account5 = {
  userName: 'Oliver Avila',
  transactions: [630, 800, 300, 50, 120],
  interest: 1.1,
  pin: 5555,
  transactionsDates: [
    '2021-10-02T14:43:31.074Z',
    '2021-10-29T11:24:19.761Z',
    '2021-11-15T10:45:23.907Z',
    '2022-01-22T12:17:46.255Z',
    '2022-02-12T15:14:06.486Z',
  ],
  currency: 'USD',
  locale: 'en-US',
};

const accounts = [account1, account2, account3, account4, account5];

let currentAccount, currentLogoutTimer;
let transactionsSorted = false;

// Timer
const startLogoutTimer = function () {
  let time = 300;
  const timerCallback = function () {
    const minutes = String(Math.trunc(time / 60)).padStart(2, '0');
    const seconds = String(time % 60).padStart(2, '0');
    labelTimer.textContent = `${minutes}:${seconds}`;
    if (time === 0) {
      clearInterval(logoutTimer);
      containerApp.style.opacity = '0';
      labelWelcome.textContent = 'Войдите в свой аккаунт';
    }
    time--;
  };
  timerCallback();
  const logoutTimer = setInterval(timerCallback, 1000);
  return logoutTimer;
};

// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.total__value--in');
const labelSumOut = document.querySelector('.total__value--out');
const labelSumInterest = document.querySelector('.total__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerTransactions = document.querySelector('.transactions');

// Buttons
const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

// Inputs
const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseNickname = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

// Code

const formatTransDay = function (date, locale) {
  const getDaysBetwen2Dates = (date1, date2) =>
    Math.round(Math.abs(date2 - date1) / (1000 * 60 * 60 * 24));
  const daysPassed = getDaysBetwen2Dates(new Date(), date);
  if (daysPassed === 0) return 'Сегодня';
  if (daysPassed === 1) return 'Вчера';
  if (daysPassed <= 4) return `${daysPassed} дня назад`;
  else {
    return new Intl.DateTimeFormat(locale).format(date);
  }
};

const formatNumber = function (number, account) {
  return new Intl.NumberFormat(account.locale, {
    style: 'currency',
    currency: account.currency,
  }).format(number);
};

const displayTransaction = function (account, sort = false) {
  startLogoutTimer();
  containerTransactions.innerHTML = '';
  // Sort
  const allTransactions = sort
    ? account.transactions.slice().sort((x, y) => x - y)
    : account.transactions;
  // Display
  allTransactions.forEach((transaction, num) => {
    const transactionType = transaction > 0 ? 'deposit' : 'withdrawal';
    const date = new Date(account.transactionsDates[num]);
    const transDate = formatTransDay(date, account.locale);
    const formattedTrans = formatNumber(transaction, account);
    containerTransactions.insertAdjacentHTML(
      'afterbegin',
      `
    <div class="transactions__row">
          <div class="transactions__type transactions__type--${transactionType}">
            ${num + 1} ${transactionType}
          </div>
          <div class="transactions__date">${transDate}</div>
          <div class="transactions__value">${formattedTrans}</div>
        </div>
    `
    );
  });
};

const createNicknames = function (accounts) {
  accounts.forEach(account => {
    account.nickName = account.userName
      .toLowerCase()
      .split(' ')
      .map(word => word[0])
      .join('');
  });
};
createNicknames(accounts);

const displayBalance = function (account) {
  const balance = account.transactions.reduce((acc, item) => acc + item, 0);
  const formattedBalance = formatNumber(balance, account);
  labelBalance.innerHTML = `${formattedBalance}`;
  account.balance = balance;
};

const displayTotal = function (account) {
  const depositsTotal = account.transactions
    .filter(trans => trans > 0)
    .reduce((acc, dep) => acc + dep, 0);
  labelSumIn.textContent = formatNumber(depositsTotal, account);
  const withdrawTotal = account.transactions
    .filter(trans => trans < 0)
    .reduce((acc, dep) => acc + dep, 0);
  labelSumOut.textContent = formatNumber(withdrawTotal, account);
  const interestTotal = account.transactions
    .filter(trans => trans > 0)
    .map(trans => (trans * account.interest) / 100)
    .filter(interest => interest >= 5)
    .reduce((acc, interest) => acc + interest, 0);
  labelSumInterest.textContent = formatNumber(interestTotal, account);
};

const updateUi = function (account) {
  displayTransaction(account);
  displayBalance(account);
  displayTotal(account);
};

// Event handlers
// Login
btnLogin.addEventListener('click', event => {
  event.preventDefault();
  currentAccount = accounts.find(
    account => account.nickName === inputLoginUsername.value
  );
  if (currentAccount?.pin === +inputLoginPin.value) {
    containerApp.style.opacity = '1';
    labelWelcome.textContent = `Рады, что вы снова с нами, ${
      currentAccount.userName.split(' ')[0]
    }`;
    // Set date
    const now = new Date();
    const options = {
      hour: '2-digit',
      minute: '2-digit',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      weekday: 'long',
    };
    labelDate.textContent = new Intl.DateTimeFormat(
      currentAccount.locale,
      options
    ).format(now);
    //
    inputLoginUsername.value = '';
    inputLoginPin.value = '';
    if (currentLogoutTimer) clearInterval(currentLogoutTimer);
    currentLogoutTimer = startLogoutTimer();
    updateUi(currentAccount);
  }
});

// Transfer money
btnTransfer.addEventListener('click', e => {
  e.preventDefault();
  const transferAmount = +inputTransferAmount.value;
  const recipientNickname = inputTransferTo.value;
  const recipientAccount = accounts.find(
    account => account.nickName === recipientNickname
  );
  inputTransferTo.value = '';
  inputTransferAmount.value = '';
  if (
    transferAmount > 0 &&
    recipientAccount &&
    currentAccount.balance >= transferAmount &&
    currentAccount.nickName !== recipientAccount.nickName
  ) {
    currentAccount.transactions.push(-transferAmount);
    currentAccount.transactionsDates.push(new Date());
    recipientAccount.transactions.push(transferAmount);
    recipientAccount.transactionsDates.push(new Date());
    if (currentLogoutTimer) clearInterval(currentLogoutTimer);
    currentLogoutTimer = startLogoutTimer();
    updateUi(currentAccount);
  }
});

// Close the bill
btnClose.addEventListener('click', e => {
  e.preventDefault();
  if (
    inputCloseNickname.value === currentAccount.nickName &&
    +inputClosePin.value === currentAccount.pin
  ) {
    const currentAccountIndex = accounts.findIndex(
      account => account.nickName === currentAccount.nickName
    );
    accounts.splice(currentAccountIndex, 1);
    containerApp.style.opacity = '0';
    labelWelcome.textContent = 'Войдите в свой аккаунт';
  }
  inputCloseNickname.value = '';
  inputClosePin.value = '';
});

// Loan (if one of deposits > 10% of loan amount)
btnLoan.addEventListener('click', e => {
  e.preventDefault();
  const loanAmount = Math.floor(inputLoanAmount.value);
  if (
    loanAmount > 0 &&
    currentAccount.transactions.some(
      transaction => transaction >= loanAmount / 10
    )
  ) {
    setTimeout(function () {
      currentAccount.transactions.push(loanAmount);
      currentAccount.transactionsDates.push(new Date());
      updateUi(currentAccount);
    }, 5000);
  }
  inputLoanAmount.value = '';
  clearInterval(logoutTimer);
  currentLogoutTimer = startLogoutTimer();
});

// Sort transactions
btnSort.addEventListener('click', e => {
  e.preventDefault();
  displayTransaction(currentAccount, !transactionsSorted);
  transactionsSorted = !transactionsSorted;
});

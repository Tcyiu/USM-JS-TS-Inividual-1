import data from "./transaction.json";
console.clear()

class TransactionAnalyzer {
  constructor (transactionsArray) {
    this.transactionsArray = transactionsArray
    this.transactionsArray.forEach(transaction => transaction.string = () => JSON.stringify(transaction));
  }
  
  addTransaction = (transaction) => this.transactionsArray.push(transaction);

  getAllTransaction = () => this.transactionsArray;
  
  getUniqueTransactionType = () => [...new Set(this.transactionsArray.map(t => t.transaction_type))];

  calculateTotalAmount = () => this.transactionsArray.map(t => t.transaction_amount).reduce((accumulator, current) => accumulator+ current, 0)

  calculateTotalAmountByDate = (year, month, day) => {
    month = month<10 ? `0${month}` : month;
    day = day<10 ? `0${day}` : day;
    const date = `${year ? year : ''}${month ? '-' + month : ''}${day ? '-' + day : ''}`;
    const matchedTransactions = this.transactionsArray.filter(t => t.transaction_date.includes(date));
    return matchedTransactions.map(t => t.transaction_amount).reduce((accumulator, current) => accumulator+ current, 0);
  }

  getTransactionByType = (type) => this.transactionsArray.filter(t => t.transaction_type === type);

  getTransactionsInDateRange = (startDate, endDate) => this.transactionsArray.filter(t => new Date(t.transaction_date) >= new Date(startDate) && new Date(t.transaction_date) <= new Date(endDate));

  getTransactionsByMerchant = (merchantName) => this.transactionsArray.filter(t => t.merchant_name === merchantName)

  calculateAverageTransactionAmount = () => this.calculateTotalAmount() / this.getAllTransaction().length;

  getTransactionsByAmountRange = (minAmount, maxAmount) => this.transactionsArray.filter(t => t.transaction_amount >= minAmount && t.transaction_amount <= maxAmount)
  
  calculateTotalDebitAmount = () => this.transactionsArray.filter(t => t.transaction_type === 'debit').map(t => t.transaction_amount).reduce((accumulator, current) => accumulator+ current, 0);
  
  findMostTransactionsMonth = () => {
    const transactionCounts = {};

    this.transactionsArray.forEach(transaction => {
        const month = transaction.transaction_date.substring(0, 7);
        transactionCounts[month] ? transactionCounts[month] +=1 : transactionCounts[month] = 1;
    });

    let maxTransactions = 0;
    let mostTransactionsMonth = '';

    for (const month in transactionCounts) {
        if (transactionCounts[month] > maxTransactions) {
            maxTransactions = transactionCounts[month];
            mostTransactionsMonth = month;
        }
    }

    return mostTransactionsMonth;
  }
  
  findMostDebitTransactionMonth = () => {
    const transactionCounts = {};

    this.transactionsArray.filter(t => t.transaction_type === 'debit').forEach(transaction => {
        const month = transaction.transaction_date.substring(0, 7);
        transactionCounts[month] ? transactionCounts[month] +=1 : transactionCounts[month] = 1;
    });

    let maxTransactions = 0;
    let mostTransactionsMonth = '';

    for (const month in transactionCounts) {
        if (transactionCounts[month] > maxTransactions) {
            maxTransactions = transactionCounts[month];
            mostTransactionsMonth = month;
        }
    }

    return mostTransactionsMonth;
  }
  
  mostTransactionTypes = () => {
    const debit = this.transactionsArray.filter(t => t.transaction_type === 'debit').length;
    const credit = this.transactionsArray.filter(t => t.transaction_type === 'credit').length;
    return debit === credit ? 'equal' : debit > credit ? 'debit' : credit;
  }
  
  getTransactionsBeforeDate = (date) => this.transactionsArray.filter(t => new Date(t.transaction_date) <= new Date(date));

  findTransactionById = (id) => this.transactionsArray.find(t => t.transaction_id === id);
  
  mapTransactionDescriptions = () => this.transactionsArray.map(t => t.transaction_description);
}

const transactions = new TransactionAnalyzer(data);
console.log(transactions.getAllTransaction());
console.log('Appending new transaction');
transactions.addTransaction({
  transaction_id: "121",
  transaction_date: "2019-01-01",
  transaction_amount: 100,
  transaction_type: "debit",
  transaction_description: "Payment for groceries",
  merchant_name: "SuperMart",
  card_type: "Visa",
})

console.log(transactions.getAllTransaction());
console.log('Unique transaction types: ' + transactions.getUniqueTransactionType());
console.log('Total amount: ' + transactions.calculateTotalAmount());
console.log('Total amount by 2019-02: ' + transactions.calculateTotalAmountByDate(2019, 2));
console.log('Transactions by type "credit": ', transactions.getTransactionByType('credit'));
console.log('Transactions in date range 2019-01-01 / 2019-01-31: ', transactions.getTransactionsInDateRange('2019-01-01', '2019-01-31'));
console.log('Transactions by merchant "SuperMart": ', transactions.getTransactionsByMerchant('SuperMart'));
console.log('Average transaction amount: ' + transactions.calculateAverageTransactionAmount());
console.log('Transactions in amount range 20 - 50: ', transactions.getTransactionsByAmountRange(20, 50));
console.log('Total debit amount: ' + transactions.calculateTotalDebitAmount());
console.log('Month with the most transactions: ' + transactions.findMostTransactionsMonth());
console.log('Month with the most dibit transactions: ' + transactions.findMostDebitTransactionMonth());
console.log('Most transaction type: ' + transactions.mostTransactionTypes());
console.log('Transactions before 2019-01-15: ', transactions.getTransactionsBeforeDate('2019-01-15'));
console.log('Transaction by id 25', transactions.findTransactionById('25'));
console.log('All transaction descriprions: ', transactions.mapTransactionDescriptions());
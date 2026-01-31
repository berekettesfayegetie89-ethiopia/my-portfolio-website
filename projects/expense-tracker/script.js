class ExpenseTracker {
    constructor() {
        this.transactions = JSON.parse(localStorage.getItem('transactions')) || [];
        this.budgets = JSON.parse(localStorage.getItem('budgets')) || this.getDefaultBudgets();
        this.currentPage = 1;
        this.itemsPerPage = 10;
        this.currentFilter = 'all';
        this.currentSearch = '';
        this.categoryChart = null;
        this.trendChart = null;
        this.init();
    }

    init() {
        this.renderOverview();
        this.renderTransactions();
        this.renderBudgets();
        this.initCharts();
        this.setupEventListeners();
    }

    getDefaultBudgets() {
        return [
            { category: 'food', name: 'Food & Dining', amount: 400, spent: 0 },
            { category: 'transport', name: 'Transportation', amount: 200, spent: 0 },
            { category: 'shopping', name: 'Shopping', amount: 300, spent: 0 },
            { category: 'housing', name: 'Housing', amount: 1000, spent: 0 },
            { category: 'entertainment', name: 'Entertainment', amount: 150, spent: 0 },
            { category: 'health', name: 'Health', amount: 100, spent: 0 }
        ];
    }

    setupEventListeners() {
        // Add Expense/Income buttons
        document.getElementById('addExpenseBtn').addEventListener('click', () => {
            this.openTransactionModal('expense');
        });
        
        document.getElementById('addIncomeBtn').addEventListener('click', () => {
            this.openTransactionModal('income');
        });

        // Export button
        document.getElementById('exportBtn').addEventListener('click', () => this.exportData());

        // Modal Close buttons
        document.querySelectorAll('.close-btn').forEach(btn => {
            btn.addEventListener('click', () => this.closeTransactionModal());
        });

        // Transaction Form Submission
        document.getElementById('transactionForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.saveTransaction();
        });

        // Search and Filter
        document.getElementById('searchTransactions').addEventListener('input', (e) => {
            this.currentSearch = e.target.value;
            this.currentPage = 1;
            this.renderTransactions();
        });

        document.getElementById('filterCategory').addEventListener('change', (e) => {
            this.currentFilter = e.target.value;
            this.currentPage = 1;
            this.renderTransactions();
        });

        // Pagination
        document.getElementById('prevPage').addEventListener('click', () => {
            if (this.currentPage > 1) {
                this.currentPage--;
                this.renderTransactions();
            }
        });

        document.getElementById('nextPage').addEventListener('click', () => {
            const totalPages = Math.ceil(this.getFilteredTransactions().length / this.itemsPerPage);
            if (this.currentPage < totalPages) {
                this.currentPage++;
                this.renderTransactions();
            }
        });

        // Chart period changes
        document.getElementById('chartPeriod').addEventListener('change', () => {
            this.updateCategoryChart();
        });

        document.getElementById('trendPeriod').addEventListener('change', () => {
            this.updateTrendChart();
        });

        // Close modal when clicking outside
        document.getElementById('transactionModal').addEventListener('click', (e) => {
            if (e.target.id === 'transactionModal') {
                this.closeTransactionModal();
            }
        });

        // Initialize date to today
        document.getElementById('transDate').value = new Date().toISOString().split('T')[0];
    }

    generateId() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2);
    }

    openTransactionModal(type = 'expense', transactionId = null) {
        const modal = document.getElementById('transactionModal');
        const modalTitle = document.getElementById('modalTitle');
        
        if (transactionId) {
            // Edit existing transaction
            const transaction = this.transactions.find(t => t.id === transactionId);
            if (transaction) {
                modalTitle.textContent = 'Edit Transaction';
                document.getElementById('transType').value = transaction.type;
                document.getElementById('transAmount').value = transaction.amount;
                document.getElementById('transDescription').value = transaction.description;
                document.getElementById('transCategory').value = transaction.category;
                document.getElementById('transDate').value = transaction.date;
                document.getElementById('transNotes').value = transaction.notes || '';
                document.getElementById('transId').value = transaction.id;
                
                // Update category options based on type
                this.updateCategoryOptions(transaction.type);
            }
        } else {
            // Create new transaction
            modalTitle.textContent = type === 'income' ? 'Add Income' : 'Add Expense';
            document.getElementById('transactionForm').reset();
            document.getElementById('transType').value = type;
            document.getElementById('transDate').value = new Date().toISOString().split('T')[0];
            document.getElementById('transId').value = '';
            
            // Update category options based on type
            this.updateCategoryOptions(type);
        }
        
        modal.classList.add('active');
    }

    updateCategoryOptions(type) {
        const categorySelect = document.getElementById('transCategory');
        const currentValue = categorySelect.value;
        
        // Clear existing options except "income" and "other"
        Array.from(categorySelect.options).forEach(option => {
            if (option.value !== 'income' && option.value !== 'other') {
                option.remove();
            }
        });

        if (type === 'income') {
            // For income, only show income category
            categorySelect.innerHTML = '<option value="income">Income</option>';
        } else {
            // For expenses, show all expense categories
            const expenseCategories = [
                { value: 'food', label: 'Food & Dining' },
                { value: 'transport', label: 'Transportation' },
                { value: 'shopping', label: 'Shopping' },
                { value: 'housing', label: 'Housing' },
                { value: 'entertainment', label: 'Entertainment' },
                { value: 'health', label: 'Health' },
                { value: 'other', label: 'Other' }
            ];
            
            expenseCategories.forEach(cat => {
                const option = document.createElement('option');
                option.value = cat.value;
                option.textContent = cat.label;
                categorySelect.appendChild(option);
            });
        }
        
        // Try to restore previous value if it exists in new options
        const options = Array.from(categorySelect.options).map(opt => opt.value);
        if (options.includes(currentValue)) {
            categorySelect.value = currentValue;
        }
    }

    closeTransactionModal() {
        document.getElementById('transactionModal').classList.remove('active');
        document.getElementById('transactionForm').reset();
    }

    saveTransaction() {
        const transactionData = {
            id: document.getElementById('transId').value || this.generateId(),
            type: document.getElementById('transType').value,
            amount: parseFloat(document.getElementById('transAmount').value),
            description: document.getElementById('transDescription').value.trim(),
            category: document.getElementById('transCategory').value,
            date: document.getElementById('transDate').value,
            notes: document.getElementById('transNotes').value.trim(),
            createdAt: new Date().toISOString()
        };

        if (!transactionData.description || transactionData.amount <= 0) {
            alert('Please fill in all required fields with valid values');
            return;
        }

        if (document.getElementById('transId').value) {
            // Update existing transaction
            const index = this.transactions.findIndex(t => t.id === transactionData.id);
            if (index !== -1) {
                this.transactions[index] = transactionData;
            }
        } else {
            // Add new transaction
            this.transactions.push(transactionData);
        }

        this.saveToLocalStorage();
        this.renderOverview();
        this.renderTransactions();
        this.renderBudgets();
        this.updateCharts();
        this.closeTransactionModal();
    }

    deleteTransaction(transactionId) {
        if (confirm('Are you sure you want to delete this transaction?')) {
            this.transactions = this.transactions.filter(t => t.id !== transactionId);
            this.saveToLocalStorage();
            this.renderOverview();
            this.renderTransactions();
            this.renderBudgets();
            this.updateCharts();
        }
    }

    saveToLocalStorage() {
        localStorage.setItem('transactions', JSON.stringify(this.transactions));
        localStorage.setItem('budgets', JSON.stringify(this.budgets));
    }

    getFilteredTransactions() {
        return this.transactions.filter(transaction => {
            const matchesSearch = this.currentSearch === '' || 
                transaction.description.toLowerCase().includes(this.currentSearch.toLowerCase()) ||
                transaction.notes.toLowerCase().includes(this.currentSearch.toLowerCase());

            const matchesCategory = this.currentFilter === 'all' || 
                transaction.category === this.currentFilter;

            return matchesSearch && matchesCategory;
        }).sort((a, b) => new Date(b.date) - new Date(a.date));
    }

    renderTransactions() {
        const filteredTransactions = this.getFilteredTransactions();
        const startIndex = (this.currentPage - 1) * this.itemsPerPage;
        const endIndex = startIndex + this.itemsPerPage;
        const pageTransactions = filteredTransactions.slice(startIndex, endIndex);

        const tbody = document.getElementById('transactionsBody');
        tbody.innerHTML = '';

        if (pageTransactions.length === 0) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="6" style="text-align: center; padding: 40px;">
                        <i class="fas fa-receipt" style="font-size: 3rem; color: var(--text-light); margin-bottom: 15px; display: block;"></i>
                        <p>No transactions found</p>
                        ${this.currentSearch || this.currentFilter !== 'all' ? 
                            '<p>Try adjusting your search or filter</p>' : 
                            '<p>Add your first transaction using the "Add Expense" or "Add Income" buttons</p>'}
                    </td>
                </tr>
            `;
        } else {
            pageTransactions.forEach(transaction => {
                const row = document.createElement('tr');
                
                const formattedDate = new Date(transaction.date).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric'
                });
                
                const amountClass = transaction.type === 'income' ? 'income' : 'expense';
                const amountSign = transaction.type === 'income' ? '+' : '-';
                
                row.innerHTML = `
                    <td>${formattedDate}</td>
                    <td>
                        <div class="transaction-description">${transaction.description}</div>
                        ${transaction.notes ? `<div class="transaction-notes">${transaction.notes}</div>` : ''}
                    </td>
                    <td><span class="transaction-category">${this.getCategoryName(transaction.category)}</span></td>
                    <td><span class="transaction-type ${transaction.type}">${transaction.type}</span></td>
                    <td class="transaction-amount ${amountClass}">${amountSign}$${transaction.amount.toFixed(2)}</td>
                    <td>
                        <div class="table-actions">
                            <button class="action-btn edit-btn" title="Edit" data-id="${transaction.id}">
                                <i class="fas fa-edit"></i>
                            </button>
                            <button class="action-btn delete-btn" title="Delete" data-id="${transaction.id}">
                                <i class="fas fa-trash"></i>
                            </button>
                        </div>
                    </td>
                `;
                
                tbody.appendChild(row);
            });

            // Add event listeners to action buttons
            tbody.querySelectorAll('.edit-btn').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    const transactionId = e.target.closest('button').dataset.id;
                    this.openTransactionModal(null, transactionId);
                });
            });

            tbody.querySelectorAll('.delete-btn').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    const transactionId = e.target.closest('button').dataset.id;
                    this.deleteTransaction(transactionId);
                });
            });
        }

        // Update pagination controls
        const totalPages = Math.ceil(filteredTransactions.length / this.itemsPerPage);
        document.getElementById('pageInfo').textContent = `Page ${this.currentPage} of ${totalPages}`;
        document.getElementById('prevPage').disabled = this.currentPage === 1;
        document.getElementById('nextPage').disabled = this.currentPage === totalPages || totalPages === 0;
    }

    getCategoryName(category) {
        const categoryMap = {
            'food': 'Food & Dining',
            'transport': 'Transportation',
            'shopping': 'Shopping',
            'housing': 'Housing',
            'entertainment': 'Entertainment',
            'health': 'Health',
            'income': 'Income',
            'other': 'Other'
        };
        return categoryMap[category] || category;
    }

    renderOverview() {
        const now = new Date();
        const currentMonth = now.getMonth();
        const currentYear = now.getFullYear();
        
        // Calculate totals
        const totalIncome = this.transactions
            .filter(t => t.type === 'income')
            .reduce((sum, t) => sum + t.amount, 0);
            
        const totalExpenses = this.transactions
            .filter(t => t.type === 'expense')
            .reduce((sum, t) => sum + t.amount, 0);
            
        const currentBalance = totalIncome - totalExpenses;
        
        // Calculate monthly totals
        const monthlyIncome = this.transactions
            .filter(t => t.type === 'income' && 
                new Date(t.date).getMonth() === currentMonth &&
                new Date(t.date).getFullYear() === currentYear)
            .reduce((sum, t) => sum + t.amount, 0);
            
        const monthlyExpenses = this.transactions
            .filter(t => t.type === 'expense' && 
                new Date(t.date).getMonth() === currentMonth &&
                new Date(t.date).getFullYear() === currentYear)
            .reduce((sum, t) => sum + t.amount, 0);
            
        const lastMonthIncome = this.transactions
            .filter(t => t.type === 'income' && 
                new Date(t.date).getMonth() === (currentMonth - 1 + 12) % 12)
            .reduce((sum, t) => sum + t.amount, 0);
            
        const lastMonthExpenses = this.transactions
            .filter(t => t.type === 'expense' && 
                new Date(t.date).getMonth() === (currentMonth - 1 + 12) % 12)
            .reduce((sum, t) => sum + t.amount, 0);
        
        // Calculate percentages
        const incomeChange = lastMonthIncome > 0 ? 
            ((monthlyIncome - lastMonthIncome) / lastMonthIncome * 100).toFixed(1) : 0;
            
        const expenseChange = lastMonthExpenses > 0 ? 
            ((monthlyExpenses - lastMonthExpenses) / lastMonthExpenses * 100).toFixed(1) : 0;
            
        const balanceChange = (monthlyIncome - monthlyExpenses) - (lastMonthIncome - lastMonthExpenses);
        const balanceChangePercent = (lastMonthIncome - lastMonthExpenses) > 0 ? 
            (balanceChange / (lastMonthIncome - lastMonthExpenses) * 100).toFixed(1) : 0;
        
        // Calculate budget usage
        const totalBudget = this.budgets.reduce((sum, b) => sum + b.amount, 0);
        const budgetUsed = this.budgets.reduce((sum, b) => sum + b.spent, 0);
        const budgetUsage = totalBudget > 0 ? (budgetUsed / totalBudget * 100).toFixed(1) : 0;
        
        // Update DOM
        document.getElementById('totalIncome').textContent = `$${totalIncome.toFixed(2)}`;
        document.getElementById('totalExpenses').textContent = `$${totalExpenses.toFixed(2)}`;
        document.getElementById('currentBalance').textContent = `$${currentBalance.toFixed(2)}`;
        
        document.getElementById('incomeChange').textContent = 
            `${incomeChange >= 0 ? '+' : ''}${incomeChange}% this month`;
        document.getElementById('incomeChange').style.color = incomeChange >= 0 ? 'var(--income-color)' : 'var(--expense-color)';
        
        document.getElementById('expenseChange').textContent = 
            `${expenseChange >= 0 ? '+' : ''}${expenseChange}% this month`;
        document.getElementById('expenseChange').style.color = expenseChange >= 0 ? 'var(--expense-color)' : 'var(--income-color)';
        
        document.getElementById('balanceChange').textContent = 
            `${balanceChange >= 0 ? '+' : ''}${balanceChangePercent}% this month`;
        document.getElementById('balanceChange').style.color = balanceChange >= 0 ? 'var(--income-color)' : 'var(--expense-color)';
        
        document.getElementById('budgetUsage').textContent = `${budgetUsage}% used`;
        document.getElementById('budgetUsage').style.color = budgetUsage > 80 ? 'var(--expense-color)' : 
            budgetUsage > 50 ? 'var(--warning-color)' : 'var(--income-color)';
    }

    renderBudgets() {
        // Reset spent amounts
        this.budgets.forEach(budget => {
            budget.spent = 0;
        });
        
        // Calculate spent amounts for current month
        const now = new Date();
        const currentMonth = now.getMonth();
        const currentYear = now.getFullYear();
        
        this.transactions
            .filter(t => t.type === 'expense' && 
                new Date(t.date).getMonth() === currentMonth &&
                new Date(t.date).getFullYear() === currentYear)
            .forEach(transaction => {
                const budget = this.budgets.find(b => b.category === transaction.category);
                if (budget) {
                    budget.spent += transaction.amount;
                }
            });
        
        // Render budget cards
        const budgetCards = document.getElementById('budgetCards');
        budgetCards.innerHTML = '';
        
        this.budgets.forEach(budget => {
            const usagePercent = budget.amount > 0 ? (budget.spent / budget.amount * 100) : 0;
            
            const card = document.createElement('div');
            card.className = `budget-card ${budget.category}`;
            card.innerHTML = `
                <div class="budget-card-header">
                    <div class="budget-category">${budget.name}</div>
                    <div class="budget-amount">$${budget.spent.toFixed(2)} / $${budget.amount.toFixed(2)}</div>
                </div>
                <div class="budget-progress">
                    <div class="progress-bar">
                        <div class="progress-fill" style="width: ${Math.min(usagePercent, 100)}%"></div>
                    </div>
                    <div class="progress-text">
                        <span>Spent</span>
                        <span>${usagePercent.toFixed(1)}%</span>
                    </div>
                </div>
                <div class="budget-status">
                    ${usagePercent > 100 ? 
                        '<span style="color: var(--expense-color); font-weight: 600;">Over budget!</span>' : 
                        usagePercent > 80 ? 
                        '<span style="color: var(--warning-color); font-weight: 600;">Almost there</span>' :
                        '<span style="color: var(--income-color); font-weight: 600;">On track</span>'}
                </div>
            `;
            
            budgetCards.appendChild(card);
        });
        
        this.saveToLocalStorage();
    }

    initCharts() {
        this.initCategoryChart();
        this.initTrendChart();
    }

    initCategoryChart() {
        const ctx = document.getElementById('categoryChart').getContext('2d');
        
        // Calculate category totals for current month
        const categoryTotals = {};
        const now = new Date();
        const currentMonth = now.getMonth();
        const currentYear = now.getFullYear();
        
        this.transactions
            .filter(t => t.type === 'expense' && 
                new Date(t.date).getMonth() === currentMonth &&
                new Date(t.date).getFullYear() === currentYear)
            .forEach(transaction => {
                if (!categoryTotals[transaction.category]) {
                    categoryTotals[transaction.category] = 0;
                }
                categoryTotals[transaction.category] += transaction.amount;
            });
        
        const categories = Object.keys(categoryTotals);
        const amounts = Object.values(categoryTotals);
        
        // Generate colors based on category
        const colors = categories.map(category => {
            switch(category) {
                case 'food': return '#8b5cf6';
                case 'transport': return '#3b82f6';
                case 'shopping': return '#ec4899';
                case 'housing': return '#f59e0b';
                case 'entertainment': return '#10b981';
                case 'health': return '#ef4444';
                default: return '#64748b';
            }
        });
        
        this.categoryChart = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: categories.map(cat => this.getCategoryName(cat)),
                datasets: [{
                    data: amounts,
                    backgroundColor: colors,
                    borderWidth: 2,
                    borderColor: '#ffffff'
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'right',
                        labels: {
                            padding: 20,
                            usePointStyle: true,
                            pointStyle: 'circle'
                        }
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                let label = context.label || '';
                                if (label) {
                                    label += ': ';
                                }
                                label += '$' + context.raw.toFixed(2);
                                return label;
                            }
                        }
                    }
                },
                cutout: '65%'
            }
        });
    }

    initTrendChart() {
        const ctx = document.getElementById('trendChart').getContext('2d');
        
        // Get last 6 months of data
        const months = [];
        const incomeData = [];
        const expenseData = [];
        
        const now = new Date();
        for (let i = 5; i >= 0; i--) {
            const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
            const monthName = date.toLocaleDateString('en-US', { month: 'short', year: '2-digit' });
            months.push(monthName);
            
            // Calculate income and expenses for this month
            const monthIncome = this.transactions
                .filter(t => t.type === 'income' && 
                    new Date(t.date).getMonth() === date.getMonth() &&
                    new Date(t.date).getFullYear() === date.getFullYear())
                .reduce((sum, t) => sum + t.amount, 0);
                
            const monthExpenses = this.transactions
                .filter(t => t.type === 'expense' && 
                    new Date(t.date).getMonth() === date.getMonth() &&
                    new Date(t.date).getFullYear() === date.getFullYear())
                .reduce((sum, t) => sum + t.amount, 0);
            
            incomeData.push(monthIncome);
            expenseData.push(monthExpenses);
        }
        
        this.trendChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: months,
                datasets: [
                    {
                        label: 'Income',
                        data: incomeData,
                        borderColor: 'var(--income-color)',
                        backgroundColor: 'rgba(16, 185, 129, 0.1)',
                        borderWidth: 3,
                        fill: true,
                        tension: 0.4
                    },
                    {
                        label: 'Expenses',
                        data: expenseData,
                        borderColor: 'var(--expense-color)',
                        backgroundColor: 'rgba(239, 68, 68, 0.1)',
                        borderWidth: 3,
                        fill: true,
                        tension: 0.4
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'top',
                    },
                    tooltip: {
                        mode: 'index',
                        intersect: false,
                        callbacks: {
                            label: function(context) {
                                return `${context.dataset.label}: $${context.raw.toFixed(2)}`;
                            }
                        }
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            callback: function(value) {
                                return '$' + value;
                            }
                        }
                    }
                },
                interaction: {
                    intersect: false,
                    mode: 'nearest'
                }
            }
        });
    }

    updateCategoryChart() {
        if (this.categoryChart) {
            this.categoryChart.destroy();
        }
        this.initCategoryChart();
    }

    updateTrendChart() {
        if (this.trendChart) {
            this.trendChart.destroy();
        }
        this.initTrendChart();
    }

    updateCharts() {
        this.updateCategoryChart();
        this.updateTrendChart();
    }

    exportData() {
        const exportData = {
            exportedAt: new Date().toISOString(),
            transactions: this.transactions,
            budgets: this.budgets,
            summary: {
                totalIncome: this.transactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0),
                totalExpenses: this.transactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0),
                currentBalance: this.transactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0) -
                              this.transactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0)
            }
        };

        const dataStr = JSON.stringify(exportData, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(dataBlob);
        
        const a = document.createElement('a');
        a.href = url;
        a.download = `expense_tracker_export_${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }
}

// Initialize the expense tracker when the page loads
document.addEventListener('DOMContentLoaded', () => {
    const expenseTracker = new ExpenseTracker();
    
    // Add some sample data if none exists
    if (expenseTracker.transactions.length === 0) {
        const sampleTransactions = [
            {
                id: expenseTracker.generateId(),
                type: 'income',
                amount: 3500,
                description: 'Monthly Salary',
                category: 'income',
                date: new Date().toISOString().split('T')[0],
                notes: 'Regular monthly salary',
                createdAt: new Date().toISOString()
            },
            {
                id: expenseTracker.generateId(),
                type: 'expense',
                amount: 125.50,
                description: 'Grocery Shopping',
                category: 'food',
                date: new Date(Date.now() - 86400000 * 2).toISOString().split('T')[0],
                notes: 'Weekly groceries',
                createdAt: new Date(Date.now() - 86400000 * 2).toISOString()
            },
            {
                id: expenseTracker.generateId(),
                type: 'expense',
                amount: 65.30,
                description: 'Gas Station',
                category: 'transport',
                date: new Date(Date.now() - 86400000 * 5).toISOString().split('T')[0],
                notes: 'Car fuel',
                createdAt: new Date(Date.now() - 86400000 * 5).toISOString()
            },
            {
                id: expenseTracker.generateId(),
                type: 'expense',
                amount: 89.99,
                description: 'Online Shopping',
                category: 'shopping',
                date: new Date(Date.now() - 86400000 * 7).toISOString().split('T')[0],
                notes: 'New headphones',
                createdAt: new Date(Date.now() - 86400000 * 7).toISOString()
            },
            {
                id: expenseTracker.generateId(),
                type: 'expense',
                amount: 1200,
                description: 'Monthly Rent',
                category: 'housing',
                date: new Date(Date.now() - 86400000 * 10).toISOString().split('T')[0],
                notes: 'Apartment rent',
                createdAt: new Date(Date.now() - 86400000 * 10).toISOString()
            }
        ];
        
        expenseTracker.transactions = sampleTransactions;
        expenseTracker.saveToLocalStorage();
        expenseTracker.renderOverview();
        expenseTracker.renderTransactions();
        expenseTracker.renderBudgets();
        expenseTracker.updateCharts();
    }
});
// Declare globally accessible variables
let userData;
let stocksData;

// Wait for the DOM to load
document.addEventListener('DOMContentLoaded', () => {
    stocksData = JSON.parse(stockContent);
    userData = JSON.parse(userContent);

    // Generate the user list
    generateUserList(userData);

    // Attach event listener to the user list
    const userList = document.querySelector('.user-list');
    if (userList) {
        userList.addEventListener('click', (event) => handleUserListClick(event));
    }
});

// Select the delete and save buttons
const deleteButton = document.querySelector('#btnDelete');
const saveButton = document.querySelector('#btnSave');

// Delete button functionality
if (deleteButton) {
    deleteButton.addEventListener('click', (event) => {
        event.preventDefault();

        const userId = document.querySelector('#userID').value;
        const userIndex = userData.findIndex(user => user.id == userId);

        if (userIndex !== -1) {
            userData.splice(userIndex, 1);
            generateUserList(userData);

            // Clear the form and portfolio display
            clearForm();
            clearPortfolio();
        } else {
            console.error("User not found for deletion.");
        }
    });
}

// Save button functionality
if (saveButton) {
    saveButton.addEventListener('click', (event) => {
        event.preventDefault();

        const id = document.querySelector('#userID').value;
        const user = userData.find(u => u.id == id);

        if (user) {
            user.user.firstname = document.querySelector('#firstname').value;
            user.user.lastname = document.querySelector('#lastname').value;
            user.user.address = document.querySelector('#address').value;
            user.user.city = document.querySelector('#city').value;
            user.user.email = document.querySelector('#email').value;

            generateUserList(userData);
        } else {
            console.error("User not found for saving.");
        }
    });
}

/**
 * Generates the user list
 * @param {*} users 
 */
function generateUserList(users) {
    const userList = document.querySelector('.user-list');
    if (userList) {
        userList.innerHTML = ''; // Clear existing list
        users.forEach(({ user, id }) => {
            const listItem = document.createElement('li');
            listItem.innerText = `${user.lastname}, ${user.firstname}`;
            listItem.setAttribute('id', id);
            userList.appendChild(listItem);
        });
    }
}

/**
 * Handles the click event on the user list
 * @param {*} event 
 */
function handleUserListClick(event) {
    const userId = event.target.id;
    const user = userData.find(user => user.id == userId);
    if (user) {
        populateForm(user);
        renderPortfolio(user);
    }
}

/**
 * Populates the form with the user's data
 * @param {*} data 
 */
function populateForm(data) {
    const { user, id } = data;
    document.querySelector('#userID').value = id;
    document.querySelector('#firstname').value = user.firstname;
    document.querySelector('#lastname').value = user.lastname;
    document.querySelector('#address').value = user.address;
    document.querySelector('#city').value = user.city;
    document.querySelector('#email').value = user.email;
}

/**
 * Renders the portfolio items for the user
 * @param {*} user 
 */
function renderPortfolio(user) {
    const { portfolio } = user;
    const portfolioDetails = document.querySelector('.portfolio-list');
    if (portfolioDetails) {
        portfolioDetails.innerHTML = ''; // Clear existing portfolio

        portfolio.forEach(({ symbol, owned }) => {
            const symbolEl = document.createElement('p');
            const sharesEl = document.createElement('p');
            const actionEl = document.createElement('button');

            symbolEl.innerText = symbol;
            sharesEl.innerText = `Shares Owned: ${owned}`;
            actionEl.innerText = 'View';
            actionEl.setAttribute('id', symbol);

            portfolioDetails.appendChild(symbolEl);
            portfolioDetails.appendChild(sharesEl);
            portfolioDetails.appendChild(actionEl);
        });

        // Remove existing event listeners to prevent duplication
        const newPortfolioDetails = portfolioDetails.cloneNode(true);
        portfolioDetails.parentNode.replaceChild(newPortfolioDetails, portfolioDetails);

        // Attach event listener to the portfolio list
        newPortfolioDetails.addEventListener('click', (event) => {
            if (event.target.tagName === 'BUTTON') {
                viewStock(event.target.id);
            }
        });
    }
}

/**
 * Renders the stock information for the symbol
 * @param {*} symbol 
 */
function viewStock(symbol) {
    const stockArea = document.querySelector('.stock-form');
    if (stockArea) {
        const stock = stocksData.find(s => s.symbol == symbol);

        if (stock) {
            document.querySelector('#stockName').textContent = stock.name;
            document.querySelector('#stockSector').textContent = stock.sector;
            document.querySelector('#stockIndustry').textContent = stock.subIndustry;
            document.querySelector('#stockAddress').textContent = stock.address;
            document.querySelector('#logo').src = `logos/${symbol}.svg`;
        } else {
            console.error("Stock not found.");
        }
    }
}

/**
 * Clears the user form fields
 */
function clearForm() {
    document.querySelector('#userID').value = '';
    document.querySelector('#firstname').value = '';
    document.querySelector('#lastname').value = '';
    document.querySelector('#address').value = '';
    document.querySelector('#city').value = '';
    document.querySelector('#email').value = '';
}

/**
 * Clears the portfolio display
 */
function clearPortfolio() {
    const portfolioDetails = document.querySelector('.portfolio-list');
    if (portfolioDetails) {
        portfolioDetails.innerHTML = '';
    }
    const stockArea = document.querySelector('.stock-form');
    if (stockArea) {
        stockArea.innerHTML = ''; // Or reset specific fields as needed
    }
}

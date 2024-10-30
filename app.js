document.addEventListener('DOMContentLoaded', () => {
    const stocksData = JSON.parse(stockContent);
    const userData = JSON.parse(userContent);

    // Ensure generateUserList is called with both userData and stocksData
    generateUserList(userData, stocksData);

    const userList = document.querySelector('.user-list');
    if (userList) {
        // Register click event once to handle user list clicks
        userList.addEventListener('click', (event) => handleUserListClick(event, userData, stocksData));
    }
});

// Define `deleteButton` and `saveButton` properly
const deleteButton = document.querySelector('#deleteButton');
const saveButton = document.querySelector('#saveButton');

// Ensure delete button exists before adding event listener
if (deleteButton) {
    deleteButton.addEventListener('click', (event) => {
        event.preventDefault();
        const userId = document.querySelector('#userID').value;
        const userIndex = userData.findIndex(user => user.id == userId);

        if (userIndex !== -1) {  // Check if user exists
            userData.splice(userIndex, 1);
            generateUserList(userData, stocksData);  // Re-render list after delete
        } else {
            console.error("User not found for deletion.");
        }
    });
}

// Ensure save button exists before adding event listener
if (saveButton) {
    saveButton.addEventListener('click', (event) => {
        event.preventDefault();

        const id = document.querySelector('#userID').value;

        for (let i = 0; i < userData.length; i++) {
            if (userData[i].id == id) {
                userData[i].user.firstname = document.querySelector('#firstname').value;
                userData[i].user.lastname = document.querySelector('#lastname').value;
                userData[i].user.address = document.querySelector('#address').value;
                userData[i].user.city = document.querySelector('#city').value;
                userData[i].user.email = document.querySelector('#email').value;

                generateUserList(userData, stocksData);  // Re-render list after save
            }
        }
    });
}

/**
 * Generates the user list
 * @param {*} users 
 * @param {*} stocks 
 */
function generateUserList(users, stocks) {
    const userList = document.querySelector('.user-list');
    if (userList) {
        userList.innerHTML = '';  // Clear out list before rendering
        users.map(({ user, id }) => {
            const listItem = document.createElement('li');
            listItem.innerText = user.lastname + ', ' + user.firstname;
            listItem.setAttribute('id', id);
            userList.appendChild(listItem);
        });
    }
}

/**
 * Handles the click event on the user list
 * @param {*} event 
 * @param {*} users 
 * @param {*} stocks 
 */
function handleUserListClick(event, users, stocks) {
    const userId = event.target.id;
    const user = users.find(user => user.id == userId);
    if (user) {
        populateForm(user);
        renderPortfolio(user, stocks);
    }
}

/**
 * Populates the form with the user's data
 * @param {*} user 
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
 * @param {*} stocks 
 */
function renderPortfolio(user, stocks) {
    const { portfolio } = user;
    const portfolioDetails = document.querySelector('.portfolio-list');
    portfolioDetails.innerHTML = '';  // Clear out list before rendering

    portfolio.map(({ symbol, owned }) => {
        const symbolEl = document.createElement('p');
        const sharesEl = document.createElement('p');
        const actionEl = document.createElement('button');
        symbolEl.innerText = symbol;
        sharesEl.innerText = owned;
        actionEl.innerText = 'View';
        actionEl.setAttribute('id', symbol);
        portfolioDetails.appendChild(symbolEl);
        portfolioDetails.appendChild(sharesEl);
        portfolioDetails.appendChild(actionEl);
    });

    // Attach the event listener once
    portfolioDetails.addEventListener('click', (event) => {
        if (event.target.tagName === 'BUTTON') {
            viewStock(event.target.id, stocks);
        }
    }, { once: true });
}

/**
 * Renders the stock information for the symbol
 * @param {*} symbol 
 * @param {*} stocks 
 */
function viewStock(symbol, stocks) {
    const stockArea = document.querySelector('.stock-form');
    if (stockArea) {
        const stock = stocks.find(s => s.symbol == symbol);

        if (stock) {
            document.querySelector('#stockName').textContent = stock.name;
            document.querySelector('#stockSector').textContent = stock.sector;
            document.querySelector('#stockIndustry').textContent = stock.subIndustry;
            document.querySelector('#stockAddress').textContent = stock.address;
            document.querySelector('#logo').src = `logos/${symbol}.svg`;
        }
    }
}

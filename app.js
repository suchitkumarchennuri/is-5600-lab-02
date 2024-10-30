// Declare globally accessible variables
let userData;
let stocksData;

// Wait for the DOM to load
document.addEventListener('DOMContentLoaded', () => {
    console.log("DOM fully loaded");

    try {
        // Check if stockContent and userContent are defined
        if (typeof stockContent === 'undefined' || typeof userContent === 'undefined') {
            throw new Error("stockContent or userContent is not defined.");
        }
        
        // Parse and store data
        stocksData = JSON.parse(stockContent);
        userData = JSON.parse(userContent);
        console.log("Data loaded successfully:", { stocksData, userData });

        // Generate the user list on load
        if (userData && userData.length > 0) {
            generateUserList(userData);
        } else {
            console.error("No user data available.");
        }
    } catch (error) {
        console.error("Error loading data:", error);
    }

    // Attach event listeners to save and delete buttons
    const deleteButton = document.querySelector('#btnDelete');
    const saveButton = document.querySelector('#btnSave');

    if (!deleteButton || !saveButton) {
        console.error("Save or Delete button not found in DOM.");
    } else {
        console.log("Buttons found, adding event listeners");

        // Delete button functionality
        deleteButton.addEventListener('click', (event) => {
            event.preventDefault();
            const userId = document.querySelector('#userID').value;
            deleteUser(userId);
        });

        // Save button functionality
        saveButton.addEventListener('click', (event) => {
            event.preventDefault();
            const userId = document.querySelector('#userID').value;
            saveUser(userId);
        });
    }
});

// Function to delete a user
function deleteUser(userId) {
    const userIndex = userData.findIndex(user => user.id == userId);

    if (userIndex !== -1) {
        userData.splice(userIndex, 1); // Remove the user from data
        generateUserList(userData);    // Refresh user list
        clearForm();                   // Clear the form fields
        clearPortfolio();              // Clear the portfolio display
        console.log("User deleted successfully");
    } else {
        console.error("User not found for deletion.");
    }
}

// Function to save user information
function saveUser(userId) {
    const user = userData.find(u => u.id == userId);

    if (user) {
        // Update user details from form inputs
        user.user.firstname = document.querySelector('#firstname').value;
        user.user.lastname = document.querySelector('#lastname').value;
        user.user.address = document.querySelector('#address').value;
        user.user.city = document.querySelector('#city').value;
        user.user.email = document.querySelector('#email').value;

        generateUserList(userData);  // Refresh user list to show updated info
        console.log("User information saved successfully");
    } else {
        console.error("User not found for saving.");
    }
}

/**
 * Generates the user list and adds event listeners to each user item
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
            listItem.classList.add("user-item");
            listItem.addEventListener('click', () => handleUserListClick(id)); // Add click event to each item
            userList.appendChild(listItem);
        });
        console.log("User list generated:", users);
    } else {
        console.error("User list element not found.");
    }
}

/**
 * Handles the click event on a user item and populates the form with that user's data
 * @param {*} userId 
 */
function handleUserListClick(userId) {
    const user = userData.find(user => user.id == userId);
    if (user) {
        populateForm(user);
        renderPortfolio(user);
    } else {
        console.error("User not found when handling list click.");
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
    console.log("Form populated with user data:", data);
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

        newPortfolioDetails.addEventListener('click', (event) => {
            if (event.target.tagName === 'BUTTON') {
                viewStock(event.target.id);
            }
        });
        console.log("Portfolio rendered for user:", user);
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
    console.log("Form cleared.");
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
        stockArea.innerHTML = '';
    }
    console.log("Portfolio cleared.");
}

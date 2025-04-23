
// Simulating a database for users
let users = {
    admin: {
        userId: "admin",
        password: "Admin@123",
        role: "admin"
    }
};

// Initial underwriters (can be added by admin later)
let underwriters = [];

// Function to get next underwriter ID
function getNextUnderwriterId() {
    return 'UW' + (underwriters.length + 1).toString().padStart(3, '0');
}

// Function to validate password complexity
function isValidPassword(password) {
    // Password must be at least 8 characters with at least one special character
    const specialChars = /[`!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/;
    const hasLetters = /[a-zA-Z]/.test(password);
    const hasNumbers = /[0-9]/.test(password);
    
    return password.length >= 8 && 
           specialChars.test(password) && 
           hasLetters && 
           hasNumbers;
}

// Function to handle admin login
function handleAdminLogin(event) {
    event.preventDefault();
    
    const userId = document.getElementById('adminUserId').value;
    const password = document.getElementById('adminPassword').value;
    const loginMessage = document.getElementById('loginMessage');
    
    if (users.admin.userId === userId && users.admin.password === password) {
        // Save login status
        sessionStorage.setItem('currentUser', JSON.stringify({
            userId: userId,
            role: 'admin'
        }));
        
        // Redirect to admin dashboard
        window.location.href = 'src/pages/admin-dashboard.html';
    } else {
        loginMessage.textContent = "Invalid admin credentials.";
        loginMessage.className = "text-danger";
    }
}

// Function to handle underwriter login
function handleUnderwriterLogin(event) {
    event.preventDefault();
    
    const userId = document.getElementById('underwriterUserId').value;
    const password = document.getElementById('underwriterPassword').value;
    const loginMessage = document.getElementById('loginMessage');
    
    // Check if underwriter exists in session storage
    const storedUnderwriters = JSON.parse(sessionStorage.getItem('underwriters')) || [];
    const underwriter = storedUnderwriters.find(u => u.underwriterId === userId && u.password === password);
    
    if (underwriter) {
        // Save login status
        sessionStorage.setItem('currentUser', JSON.stringify({
            userId: userId,
            role: 'underwriter',
            name: underwriter.name
        }));
        
        // Redirect to underwriter dashboard
        window.location.href = 'src/pages/underwriter-dashboard.html';
    } else {
        loginMessage.textContent = "Invalid underwriter credentials.";
        loginMessage.className = "text-danger";
    }
}

// Authentication check function
function checkAuth() {
    const currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
    
    if (!currentUser) {
        window.location.href = '/index.html';
        return false;
    }
    
    return currentUser;
}

// Check if on login page and attach event listeners
if (window.location.pathname === '/' || window.location.pathname === '/index.html') {
    const adminForm = document.getElementById('adminForm');
    const underwriterForm = document.getElementById('underwriterForm');
    
    if (adminForm && underwriterForm) {
        adminForm.addEventListener('submit', handleAdminLogin);
        underwriterForm.addEventListener('submit', handleUnderwriterLogin);
    }
    
    // Initialize underwriters from session storage if exists
    if (!sessionStorage.getItem('underwriters')) {
        sessionStorage.setItem('underwriters', JSON.stringify([]));
    }
}

// Function to logout
function logout() {
    sessionStorage.removeItem('currentUser');
    window.location.href = '/index.html';
}

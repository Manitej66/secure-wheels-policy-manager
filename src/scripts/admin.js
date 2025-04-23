
// Check if user is authorized as admin
document.addEventListener('DOMContentLoaded', function() {
    const currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
    
    if (!currentUser || currentUser.role !== 'admin') {
        window.location.href = '/index.html';
    } else {
        // Display admin name
        const adminNameElement = document.getElementById('adminName');
        if (adminNameElement) {
            adminNameElement.textContent = currentUser.userId;
        }
        
        // Load underwriters if viewing the list
        if (document.getElementById('underwritersTable')) {
            loadUnderwriters();
        }
    }
    
    // Add event listeners for form submissions
    const registerUnderwriterForm = document.getElementById('registerUnderwriterForm');
    if (registerUnderwriterForm) {
        registerUnderwriterForm.addEventListener('submit', handleRegisterUnderwriter);
    }
    
    const searchUnderwriterForm = document.getElementById('searchUnderwriterForm');
    if (searchUnderwriterForm) {
        searchUnderwriterForm.addEventListener('submit', handleSearchUnderwriter);
    }
    
    const updatePasswordForm = document.getElementById('updatePasswordForm');
    if (updatePasswordForm) {
        updatePasswordForm.addEventListener('submit', handleUpdatePassword);
    }
    
    const deleteUnderwriterForm = document.getElementById('deleteUnderwriterForm');
    if (deleteUnderwriterForm) {
        deleteUnderwriterForm.addEventListener('submit', handleDeleteUnderwriter);
    }
});

// Function to handle underwriter registration
function handleRegisterUnderwriter(event) {
    event.preventDefault();
    
    const name = document.getElementById('underwriterName').value.trim();
    const dob = document.getElementById('underwriterDOB').value;
    const joiningDate = document.getElementById('joiningDate').value;
    const password = document.getElementById('underwriterPassword').value;
    const formMessage = document.getElementById('formMessage');
    
    // Validate inputs
    if (name.length > 50) {
        formMessage.textContent = "Name cannot exceed 50 characters";
        formMessage.className = "text-danger";
        return;
    }
    
    if (!isValidPassword(password)) {
        formMessage.textContent = "Password must be at least 8 characters with letters, numbers, and a special character";
        formMessage.className = "text-danger";
        return;
    }
    
    // Generate underwriter ID
    const underwriters = JSON.parse(sessionStorage.getItem('underwriters')) || [];
    const underwriterId = 'UW' + (underwriters.length + 1).toString().padStart(3, '0');
    
    // Create underwriter object
    const underwriter = {
        underwriterId: underwriterId,
        name: name,
        dob: dob,
        joiningDate: joiningDate,
        password: password
    };
    
    // Add to underwriters list
    underwriters.push(underwriter);
    sessionStorage.setItem('underwriters', JSON.stringify(underwriters));
    
    // Show success message
    formMessage.textContent = `Underwriter registered successfully with ID: ${underwriterId}`;
    formMessage.className = "text-success";
    
    // Reset form
    document.getElementById('registerUnderwriterForm').reset();
    
    // Show the underwriter ID
    document.getElementById('generatedId').textContent = underwriterId;
    document.getElementById('idContainer').classList.remove('hidden');
}

// Function to search for an underwriter by ID
function handleSearchUnderwriter(event) {
    event.preventDefault();
    
    const underwriterId = document.getElementById('searchId').value.trim();
    const resultContainer = document.getElementById('searchResult');
    const formMessage = document.getElementById('formMessage');
    
    // Get underwriters from session storage
    const underwriters = JSON.parse(sessionStorage.getItem('underwriters')) || [];
    const underwriter = underwriters.find(u => u.underwriterId === underwriterId);
    
    if (underwriter) {
        // Display underwriter details
        resultContainer.innerHTML = `
            <div class="card">
                <div class="card-header">
                    <h3>Underwriter Details</h3>
                </div>
                <div class="card-body">
                    <p><strong>ID:</strong> ${underwriter.underwriterId}</p>
                    <p><strong>Name:</strong> ${underwriter.name}</p>
                    <p><strong>DOB:</strong> ${underwriter.dob}</p>
                    <p><strong>Joining Date:</strong> ${underwriter.joiningDate}</p>
                </div>
            </div>
        `;
        resultContainer.classList.remove('hidden');
        formMessage.textContent = "";
    } else {
        formMessage.textContent = "Underwriter not found with the provided ID";
        formMessage.className = "text-danger";
        resultContainer.classList.add('hidden');
    }
}

// Function to update underwriter password
function handleUpdatePassword(event) {
    event.preventDefault();
    
    const underwriterId = document.getElementById('updateId').value.trim();
    const newPassword = document.getElementById('newPassword').value;
    const formMessage = document.getElementById('formMessage');
    
    // Validate password
    if (!isValidPassword(newPassword)) {
        formMessage.textContent = "Password must be at least 8 characters with letters, numbers, and a special character";
        formMessage.className = "text-danger";
        return;
    }
    
    // Get underwriters from session storage
    const underwriters = JSON.parse(sessionStorage.getItem('underwriters')) || [];
    const underwriterIndex = underwriters.findIndex(u => u.underwriterId === underwriterId);
    
    if (underwriterIndex !== -1) {
        // Update password
        underwriters[underwriterIndex].password = newPassword;
        sessionStorage.setItem('underwriters', JSON.stringify(underwriters));
        
        formMessage.textContent = "Password updated successfully";
        formMessage.className = "text-success";
        document.getElementById('updatePasswordForm').reset();
    } else {
        formMessage.textContent = "Underwriter not found with the provided ID";
        formMessage.className = "text-danger";
    }
}

// Function to delete underwriter
function handleDeleteUnderwriter(event) {
    event.preventDefault();
    
    const underwriterId = document.getElementById('deleteId').value.trim();
    const formMessage = document.getElementById('formMessage');
    
    // Get underwriters from session storage
    const underwriters = JSON.parse(sessionStorage.getItem('underwriters')) || [];
    const underwriterIndex = underwriters.findIndex(u => u.underwriterId === underwriterId);
    
    if (underwriterIndex !== -1) {
        // Remove underwriter
        underwriters.splice(underwriterIndex, 1);
        sessionStorage.setItem('underwriters', JSON.stringify(underwriters));
        
        formMessage.textContent = "Underwriter deleted successfully";
        formMessage.className = "text-success";
        document.getElementById('deleteUnderwriterForm').reset();
    } else {
        formMessage.textContent = "Underwriter not found with the provided ID";
        formMessage.className = "text-danger";
    }
}

// Function to load underwriters into table
function loadUnderwriters() {
    const tableBody = document.getElementById('underwritersTableBody');
    if (!tableBody) return;
    
    const underwriters = JSON.parse(sessionStorage.getItem('underwriters')) || [];
    
    // Clear existing rows
    tableBody.innerHTML = '';
    
    if (underwriters.length === 0) {
        const row = document.createElement('tr');
        row.innerHTML = `<td colspan="4" class="text-center">No underwriters found</td>`;
        tableBody.appendChild(row);
    } else {
        // Add each underwriter to table
        underwriters.forEach(underwriter => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${underwriter.underwriterId}</td>
                <td>${underwriter.name}</td>
                <td>${underwriter.dob}</td>
                <td>${underwriter.joiningDate}</td>
            `;
            tableBody.appendChild(row);
        });
    }
}

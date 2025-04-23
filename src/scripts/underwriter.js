
// Check if user is authorized as underwriter
document.addEventListener('DOMContentLoaded', function() {
    const currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
    
    if (!currentUser || currentUser.role !== 'underwriter') {
        window.location.href = '/index.html';
    } else {
        // Display underwriter name
        const underwriterNameElement = document.getElementById('underwriterName');
        if (underwriterNameElement) {
            underwriterNameElement.textContent = currentUser.name;
        }
        
        // Load policies if viewing the list
        if (document.getElementById('policiesTable')) {
            loadPolicies();
        }
    }
    
    // Add event listener for policy creation form
    const createPolicyForm = document.getElementById('createPolicyForm');
    if (createPolicyForm) {
        createPolicyForm.addEventListener('submit', handleCreatePolicy);
        
        // Set default underwriter ID
        const underwriterIdField = document.getElementById('underwriterId');
        if (underwriterIdField && currentUser) {
            underwriterIdField.value = currentUser.userId;
            underwriterIdField.readOnly = true;
        }
    }
});

// Function to handle policy creation
function handleCreatePolicy(event) {
    event.preventDefault();
    
    const vehicleNo = document.getElementById('vehicleNo').value.trim();
    const vehicleType = document.getElementById('vehicleType').value;
    const customerName = document.getElementById('customerName').value.trim();
    const engineNo = document.getElementById('engineNo').value.trim();
    const chasisNo = document.getElementById('chasisNo').value.trim();
    const phoneNo = document.getElementById('phoneNo').value.trim();
    const premiumAmount = document.getElementById('premiumAmount').value;
    const insuranceType = document.getElementById('insuranceType').value;
    const fromDate = document.getElementById('fromDate').value;
    const toDate = document.getElementById('toDate').value;
    const underwriterId = document.getElementById('underwriterId').value;
    
    const formMessage = document.getElementById('formMessage');
    
    // Validation
    if (vehicleNo.length > 10) {
        formMessage.textContent = "Vehicle Number cannot exceed 10 characters";
        formMessage.className = "text-danger";
        return;
    }
    
    if (customerName.length > 50) {
        formMessage.textContent = "Customer Name cannot exceed 50 characters";
        formMessage.className = "text-danger";
        return;
    }
    
    if (phoneNo.length !== 10 || isNaN(phoneNo)) {
        formMessage.textContent = "Phone Number must be 10 digits";
        formMessage.className = "text-danger";
        return;
    }
    
    if (new Date(fromDate) >= new Date(toDate)) {
        formMessage.textContent = "From Date must be before To Date";
        formMessage.className = "text-danger";
        return;
    }
    
    // Generate policy ID
    const policies = JSON.parse(sessionStorage.getItem('policies')) || [];
    const policyId = 'POL' + (policies.length + 1).toString().padStart(4, '0');
    
    // Create policy object
    const policy = {
        policyId,
        vehicleNo,
        vehicleType,
        customerName,
        engineNo,
        chasisNo,
        phoneNo,
        premiumAmount,
        insuranceType,
        fromDate,
        toDate,
        underwriterId,
        createdAt: new Date().toISOString()
    };
    
    // Add to policies list
    policies.push(policy);
    sessionStorage.setItem('policies', JSON.stringify(policies));
    
    // Show success message
    formMessage.textContent = `Policy created successfully with ID: ${policyId}`;
    formMessage.className = "text-success";
    
    // Show the policy ID
    document.getElementById('generatedPolicyId').textContent = policyId;
    document.getElementById('policyIdContainer').classList.remove('hidden');
    
    // Reset form
    document.getElementById('createPolicyForm').reset();
    
    // Re-set the underwriter ID
    const currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
    if (currentUser) {
        document.getElementById('underwriterId').value = currentUser.userId;
    }
}

// Function to load policies
function loadPolicies() {
    const tableBody = document.getElementById('policiesTableBody');
    if (!tableBody) return;
    
    const currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
    const policies = JSON.parse(sessionStorage.getItem('policies')) || [];
    
    // Filter policies for current underwriter
    const underwriterPolicies = policies.filter(p => p.underwriterId === currentUser.userId);
    
    // Clear existing rows
    tableBody.innerHTML = '';
    
    if (underwriterPolicies.length === 0) {
        const row = document.createElement('tr');
        row.innerHTML = `<td colspan="7" class="text-center">No policies found</td>`;
        tableBody.appendChild(row);
    } else {
        // Add each policy to table
        underwriterPolicies.forEach(policy => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${policy.policyId}</td>
                <td>${policy.vehicleNo}</td>
                <td>${policy.customerName}</td>
                <td>${policy.vehicleType}</td>
                <td>${policy.insuranceType}</td>
                <td>${policy.premiumAmount}</td>
                <td>${new Date(policy.fromDate).toLocaleDateString()} - ${new Date(policy.toDate).toLocaleDateString()}</td>
            `;
            tableBody.appendChild(row);
        });
    }
}

// CareerCatalyst JavaScript Application

// Application State
let appState = {
    profile: {
        personalInfo: {
            fullName: "Sample User",
            email: "user@example.com",
            phone: "+91-9999999999",
            location: "Gurgaon, Haryana",
            linkedIn: "linkedin.com/in/sampleuser"
        },
        summary: "Experienced data entry operator with advanced Excel skills and 3+ years of corporate experience seeking new opportunities in data management and analysis.",
        skills: ["Advanced Excel", "Data Entry", "Data Analysis", "Microsoft Office", "Attention to Detail", "Time Management"]
    },
    applications: [
        {
            id: "1",
            company: "TCS",
            position: "Data Analyst",
            status: "Applied",
            dateApplied: "2024-10-01",
            salary: "4-6 LPA",
            location: "Gurgaon",
            notes: "Applied through company website",
            followUpDate: "2024-10-08"
        },
        {
            id: "2", 
            company: "Wipro",
            position: "MIS Executive",
            status: "Under Review",
            dateApplied: "2024-09-28",
            salary: "3.5-5 LPA",
            location: "Noida",
            notes: "Recruiter contacted via LinkedIn",
            followUpDate: "2024-10-05"
        },
        {
            id: "3",
            company: "Infosys",
            position: "Data Entry Specialist",
            status: "Interview Scheduled",
            dateApplied: "2024-09-25",
            salary: "3-4.5 LPA",
            location: "Gurgaon",
            notes: "Interview scheduled for Oct 10th",
            interviewDate: "2024-10-10"
        }
    ],
    dashboardStats: {
        totalApplications: 15,
        pendingApplications: 8,
        interviewsScheduled: 2,
        rejections: 4,
        offers: 1
    }
};

// DOM Elements
const navItems = document.querySelectorAll('.nav__item');
const sections = document.querySelectorAll('.section');
const addApplicationBtn = document.getElementById('addApplicationBtn');
const addApplicationModal = document.getElementById('addApplicationModal');
const cancelBtn = document.getElementById('cancelBtn');
const closeBtn = document.querySelector('.close');

// Initialize Application
document.addEventListener('DOMContentLoaded', function() {
    initializeNavigation();
    initializeCharts();
    initializeModals();
    initializeForms();
    loadDashboardData();
});

// Navigation System
function initializeNavigation() {
    navItems.forEach(item => {
        item.addEventListener('click', () => {
            const targetSection = item.getAttribute('data-section');
            switchSection(targetSection);
            
            // Update active nav item
            navItems.forEach(nav => nav.classList.remove('nav__item--active'));
            item.classList.add('nav__item--active');
        });
    });
}

function switchSection(sectionName) {
    sections.forEach(section => {
        section.classList.remove('section--active');
    });
    
    const targetSection = document.getElementById(sectionName);
    if (targetSection) {
        targetSection.classList.add('section--active');
    }
}

// Charts Initialization
function initializeCharts() {
    // Status Chart
    const statusCtx = document.getElementById('statusChart');
    if (statusCtx) {
        new Chart(statusCtx, {
            type: 'doughnut',
            data: {
                labels: ['Applied', 'Under Review', 'Interview', 'Rejected', 'Offered'],
                datasets: [{
                    data: [8, 3, 2, 1, 1],
                    backgroundColor: [
                        '#3B82F6',
                        '#F59E0B',
                        '#10B981',
                        '#EF4444',
                        '#8B5CF6'
                    ]
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        position: 'bottom'
                    }
                }
            }
        });
    }

    // Monthly Chart
    const monthlyCtx = document.getElementById('monthlyChart');
    if (monthlyCtx) {
        new Chart(monthlyCtx, {
            type: 'line',
            data: {
                labels: ['Aug', 'Sep', 'Oct'],
                datasets: [{
                    label: 'Applications',
                    data: [5, 7, 3],
                    borderColor: '#667eea',
                    backgroundColor: 'rgba(102, 126, 234, 0.1)',
                    fill: true
                }]
            },
            options: {
                responsive: true,
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });
    }
}

// Modal System
function initializeModals() {
    if (addApplicationBtn) {
        addApplicationBtn.addEventListener('click', () => {
            addApplicationModal.classList.add('modal--active');
        });
    }

    if (cancelBtn) {
        cancelBtn.addEventListener('click', closeModal);
    }

    if (closeBtn) {
        closeBtn.addEventListener('click', closeModal);
    }

    // Close modal when clicking outside
    window.addEventListener('click', (event) => {
        if (event.target === addApplicationModal) {
            closeModal();
        }
    });
}

function closeModal() {
    addApplicationModal.classList.remove('modal--active');
}

// Form Handling
function initializeForms() {
    // Profile form
    const profileForm = document.querySelector('.profile-form');
    if (profileForm) {
        profileForm.addEventListener('submit', handleProfileSubmit);
    }

    // Application form
    const applicationForm = document.querySelector('.application-form');
    if (applicationForm) {
        applicationForm.addEventListener('submit', handleApplicationSubmit);
    }

    // Skills input
    const skillInput = document.getElementById('skillInput');
    if (skillInput) {
        skillInput.addEventListener('keypress', handleSkillInput);
    }
}

function handleProfileSubmit(event) {
    event.preventDefault();
    const formData = new FormData(event.target);
    
    // Update profile in state
    // In a real app, this would make an API call
    showNotification('Profile updated successfully!', 'success');
}

function handleApplicationSubmit(event) {
    event.preventDefault();
    const formData = new FormData(event.target);
    
    // Add new application to state
    const newApplication = {
        id: Date.now().toString(),
        company: formData.get('company'),
        position: formData.get('position'),
        status: formData.get('status'),
        dateApplied: formData.get('date'),
        location: formData.get('location'),
        salary: formData.get('salary'),
        notes: formData.get('notes')
    };
    
    appState.applications.push(newApplication);
    refreshApplicationsDisplay();
    closeModal();
    showNotification('Application added successfully!', 'success');
    
    // Reset form
    event.target.reset();
}

function handleSkillInput(event) {
    if (event.key === 'Enter') {
        event.preventDefault();
        const skill = event.target.value.trim();
        if (skill && !appState.profile.skills.includes(skill)) {
            appState.profile.skills.push(skill);
            refreshSkillsDisplay();
            event.target.value = '';
        }
    }
}

// Data Loading and Display
function loadDashboardData() {
    // Update stats cards
    const statsCards = document.querySelectorAll('.stats__number');
    if (statsCards.length >= 4) {
        statsCards[0].textContent = appState.dashboardStats.totalApplications;
        statsCards[1].textContent = appState.dashboardStats.pendingApplications;
        statsCards[2].textContent = appState.dashboardStats.interviewsScheduled;
        statsCards[3].textContent = appState.dashboardStats.offers;
    }
}

function refreshApplicationsDisplay() {
    // This would refresh the applications grid
    // Implementation depends on the specific DOM structure
    console.log('Refreshing applications display...');
}

function refreshSkillsDisplay() {
    const skillsList = document.querySelector('.skills-list');
    if (skillsList) {
        skillsList.innerHTML = '';
        appState.profile.skills.forEach(skill => {
            const skillTag = document.createElement('span');
            skillTag.className = 'skill-tag';
            skillTag.textContent = skill;
            skillsList.appendChild(skillTag);
        });
    }
}

// Utility Functions
function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification--${type}`;
    notification.textContent = message;
    
    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 1rem 2rem;
        background: ${type === 'success' ? '#10B981' : '#3B82F6'};
        color: white;
        border-radius: 8px;
        box-shadow: 0 4px 15px rgba(0,0,0,0.2);
        z-index: 1001;
        opacity: 0;
        transform: translateY(-20px);
        transition: all 0.3s ease;
    `;
    
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.opacity = '1';
        notification.style.transform = 'translateY(0)';
    }, 100);
    
    // Remove after 3 seconds
    setTimeout(() => {
        notification.style.opacity = '0';
        notification.style.transform = 'translateY(-20px)';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

function formatDate(dateString) {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
}

// Resume Builder Functions
function selectTemplate(templateName) {
    // Remove active class from all templates
    document.querySelectorAll('.template').forEach(template => {
        template.classList.remove('template--active');
    });
    
    // Add active class to selected template
    event.target.closest('.template').classList.add('template--active');
    
    // Update resume preview based on template
    updateResumePreview(templateName);
}

function updateResumePreview(templateName) {
    const resumeContent = document.querySelector('.resume-content');
    if (resumeContent) {
        // This would update the resume preview based on the selected template
        // For now, we'll just show a notification
        showNotification(`Template "${templateName}" selected`, 'success');
    }
}

function downloadResume() {
    // This would generate and download a PDF of the resume
    // For now, we'll just show a notification
    showNotification('Resume download started!', 'success');
}

// Search and Filter Functions
function filterApplications(status) {
    const applicationCards = document.querySelectorAll('.application-card');
    applicationCards.forEach(card => {
        const cardStatus = card.querySelector('.status').textContent;
        if (status === '' || cardStatus.includes(status)) {
            card.style.display = 'block';
        } else {
            card.style.display = 'none';
        }
    });
}

function searchApplications(searchTerm) {
    const applicationCards = document.querySelectorAll('.application-card');
    applicationCards.forEach(card => {
        const company = card.querySelector('.card-header h3').textContent;
        const position = card.querySelector('.card-body p').textContent;
        
        if (company.toLowerCase().includes(searchTerm.toLowerCase()) || 
            position.toLowerCase().includes(searchTerm.toLowerCase())) {
            card.style.display = 'block';
        } else {
            card.style.display = 'none';
        }
    });
}

// Local Storage Functions
function saveToLocalStorage() {
    try {
        localStorage.setItem('careerCatalystData', JSON.stringify(appState));
    } catch (error) {
        console.error('Error saving to localStorage:', error);
    }
}

function loadFromLocalStorage() {
    try {
        const savedData = localStorage.getItem('careerCatalystData');
        if (savedData) {
            appState = { ...appState, ...JSON.parse(savedData) };
        }
    } catch (error) {
        console.error('Error loading from localStorage:', error);
    }
}

// Export Functions (for future use)
function exportData() {
    const dataStr = JSON.stringify(appState, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = 'career-catalyst-data.json';
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
}

function importData(event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            try {
                const importedData = JSON.parse(e.target.result);
                appState = { ...appState, ...importedData };
                loadDashboardData();
                refreshApplicationsDisplay();
                showNotification('Data imported successfully!', 'success');
            } catch (error) {
                showNotification('Error importing data. Please check the file format.', 'error');
            }
        };
        reader.readAsText(file);
    }
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    loadFromLocalStorage();
    
    // Save to localStorage whenever data changes
    window.addEventListener('beforeunload', saveToLocalStorage);
    
    // Add event listeners for filter and search
    const filterSelect = document.querySelector('.filter-select');
    if (filterSelect) {
        filterSelect.addEventListener('change', (e) => filterApplications(e.target.value));
    }
    
    const searchInput = document.querySelector('.search-input');
    if (searchInput) {
        searchInput.addEventListener('input', (e) => searchApplications(e.target.value));
    }
});

// Global function to make it available from HTML
window.selectTemplate = selectTemplate;
window.downloadResume = downloadResume;
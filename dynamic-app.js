// CareerCatalyst Pro - Dynamic JavaScript Application

class CareerCatalystApp {
    constructor() {
        this.currentSection = 'dashboard';
        this.userData = {
            profile: {
                name: 'Sample User',
                email: 'user@example.com',
                phone: '+91-9999999999',
                location: 'Gurgaon, Haryana',
                title: 'Data Entry Specialist',
                summary: 'Experienced data entry operator with advanced Excel skills...',
                skills: ['Advanced Excel', 'Data Entry', 'Data Analysis', 'Microsoft Office']
            },
            applications: [
                {
                    id: '1',
                    company: 'TCS',
                    position: 'Data Analyst',
                    status: 'applied',
                    dateApplied: '2024-10-01',
                    salary: '4-6 LPA',
                    location: 'Gurgaon',
                    notes: 'Applied through company website'
                },
                {
                    id: '2',
                    company: 'Wipro',
                    position: 'MIS Executive',
                    status: 'review',
                    dateApplied: '2024-09-28',
                    salary: '3.5-5 LPA',
                    location: 'Noida',
                    notes: 'Recruiter contacted via LinkedIn'
                },
                {
                    id: '3',
                    company: 'Infosys',
                    position: 'Data Entry Specialist',
                    status: 'interview',
                    dateApplied: '2024-09-25',
                    salary: '3-4.5 LPA',
                    location: 'Gurgaon',
                    notes: 'Interview scheduled for Oct 10th'
                }
            ],
            stats: {
                totalApplications: 15,
                pending: 8,
                interviews: 2,
                offers: 1
            }
        };
        
        this.jobSearchData = {
            liveJobCount: 45147,
            categories: [
                { name: 'IT & Software', icon: 'fas fa-laptop-code', count: 15234 },
                { name: 'Banking & Finance', icon: 'fas fa-chart-line', count: 8456 },
                { name: 'Sales & Marketing', icon: 'fas fa-handshake', count: 12789 },
                { name: 'Data & Analytics', icon: 'fas fa-database', count: 5672 }
            ],
            trendingJobs: [
                {
                    title: 'Senior Data Analyst',
                    company: 'Google',
                    location: 'Bangalore',
                    salary: '15-25 LPA',
                    type: 'Full-time',
                    posted: '2 hours ago'
                },
                {
                    title: 'Excel Specialist',
                    company: 'Microsoft',
                    location: 'Hyderabad',
                    salary: '8-12 LPA',
                    type: 'Full-time',
                    posted: '4 hours ago'
                }
            ]
        };
        
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.loadInitialData();
        this.startLiveUpdates();
        this.setupCharts();
        this.loadFromLocalStorage();
    }

    setupEventListeners() {
        // Navigation
        document.querySelectorAll('.nav-item').forEach(item => {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                const section = item.getAttribute('data-section');
                this.switchSection(section);
            });
        });

        // Global search
        const globalSearch = document.querySelector('.global-search');
        if (globalSearch) {
            globalSearch.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    this.performGlobalSearch(e.target.value);
                }
            });
        }

        // Stat cards
        document.querySelectorAll('.stat-card').forEach(card => {
            card.addEventListener('click', () => {
                const filter = card.getAttribute('onclick')?.match(/'([^']+)'/)?.[1];
                if (filter) {
                    this.switchSection('applications');
                    this.filterApplications(filter);
                }
            });
        });

        // Content editing
        this.setupContentEditing();
        
        // Modal controls
        this.setupModals();
    }

    setupContentEditing() {
        // Profile editing
        document.querySelectorAll('.btn-edit').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const target = e.target.closest('.btn-edit').getAttribute('onclick')?.match(/'([^']+)'/)?.[1];
                if (target) {
                    this.toggleEdit(target);
                }
            });
        });

        // Skill management
        const skillInput = document.querySelector('.skill-input');
        if (skillInput) {
            skillInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    this.addSkill(e.target.value);
                    e.target.value = '';
                }
            });
        }
    }

    setupModals() {
        const modalOverlay = document.getElementById('modalOverlay');
        const modalClose = document.querySelector('.modal-close');
        
        if (modalClose) {
            modalClose.addEventListener('click', () => this.closeModal());
        }
        
        if (modalOverlay) {
            modalOverlay.addEventListener('click', (e) => {
                if (e.target === modalOverlay) {
                    this.closeModal();
                }
            });
        }
    }

    switchSection(sectionName) {
        // Update navigation
        document.querySelectorAll('.nav-item').forEach(item => {
            item.classList.remove('active');
        });
        
        document.querySelector(`[data-section="${sectionName}"]`)?.classList.add('active');
        
        // Update content
        document.querySelectorAll('.content-section').forEach(section => {
            section.classList.remove('active');
        });
        
        const targetSection = document.getElementById(sectionName);
        if (targetSection) {
            targetSection.classList.add('active');
            this.currentSection = sectionName;
        }
        
        // Load section-specific data
        this.loadSectionData(sectionName);
    }

    loadSectionData(sectionName) {
        switch (sectionName) {
            case 'dashboard':
                this.loadDashboardData();
                break;
            case 'job-search':
                this.loadJobSearchData();
                break;
            case 'applications':
                this.loadApplicationsData();
                break;
            case 'profile':
                this.loadProfileData();
                break;
        }
    }

    loadDashboardData() {
        // Update stats
        const statNumbers = document.querySelectorAll('.stat-number');
        if (statNumbers.length >= 4) {
            this.animateCounter(statNumbers[0], this.userData.stats.totalApplications);
            this.animateCounter(statNumbers[1], this.userData.stats.pending);
            this.animateCounter(statNumbers[2], this.userData.stats.interviews);
            this.animateCounter(statNumbers[3], this.userData.stats.offers);
        }

        // Load recent activity
        this.loadRecentActivity();
    }

    loadJobSearchData() {
        // Update live job count
        const liveJobCount = document.getElementById('liveJobCount');
        if (liveJobCount) {
            this.animateCounter(liveJobCount, this.jobSearchData.liveJobCount);
        }

        // Load job categories
        this.loadJobCategories();
        
        // Load trending jobs
        this.loadTrendingJobs();
    }

    loadJobCategories() {
        const categoriesGrid = document.querySelector('.categories-grid');
        if (!categoriesGrid) return;

        categoriesGrid.innerHTML = this.jobSearchData.categories.map(category => `
            <div class="category-card" onclick="searchByCategory('${category.name}')">
                <i class="${category.icon}"></i>
                <h4>${category.name}</h4>
                <span>${category.count.toLocaleString()} jobs</span>
            </div>
        `).join('');
    }

    loadTrendingJobs() {
        const jobsList = document.querySelector('.jobs-list');
        if (!jobsList) return;

        jobsList.innerHTML = this.jobSearchData.trendingJobs.map(job => `
            <div class="job-card">
                <div class="job-header">
                    <h4>${job.title}</h4>
                    <span class="job-type">${job.type}</span>
                </div>
                <div class="job-company">${job.company}</div>
                <div class="job-details">
                    <span><i class="fas fa-map-marker-alt"></i> ${job.location}</span>
                    <span><i class="fas fa-money-bill-wave"></i> ${job.salary}</span>
                    <span><i class="fas fa-clock"></i> ${job.posted}</span>
                </div>
                <div class="job-actions">
                    <button class="btn btn-outline btn-sm">Save</button>
                    <button class="btn btn-primary btn-sm" onclick="applyToJob('${job.title}', '${job.company}')">
                        Apply Now
                    </button>
                </div>
            </div>
        `).join('');
    }

    loadApplicationsData() {
        const applicationsList = document.getElementById('applicationsList');
        if (!applicationsList) return;

        applicationsList.innerHTML = this.userData.applications.map(app => `
            <div class="application-item" data-status="${app.status}">
                <div class="application-info">
                    <h4>${app.company}</h4>
                    <p>${app.position}</p>
                    <div class="application-meta">
                        <span><i class="fas fa-map-marker-alt"></i> ${app.location}</span>
                        <span><i class="fas fa-money-bill-wave"></i> ${app.salary}</span>
                        <span><i class="fas fa-calendar"></i> Applied ${this.formatDate(app.dateApplied)}</span>
                    </div>
                </div>
                <div class="status-badge ${app.status}">
                    ${this.getStatusText(app.status)}
                </div>
                <div class="application-actions">
                    <button class="btn btn-outline btn-sm-icon" onclick="editApplication('${app.id}')" title="Edit">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn btn-primary btn-sm-icon" onclick="viewApplication('${app.id}')" title="View">
                        <i class="fas fa-eye"></i>
                    </button>
                </div>
            </div>
        `).join('');
    }

    loadProfileData() {
        // Update profile information
        const profileName = document.querySelector('.profile-name');
        const profileTitle = document.querySelector('.profile-title');
        
        if (profileName) profileName.textContent = this.userData.profile.name;
        if (profileTitle) profileTitle.textContent = this.userData.profile.title;

        // Update skills
        this.updateSkillsDisplay();
        
        // Update profile completion
        this.updateProfileCompletion();
    }

    loadRecentActivity() {
        // This would typically load from an API
        const activities = [
            {
                type: 'applied',
                icon: 'fas fa-paper-plane',
                title: 'Applied to TCS',
                description: 'Data Analyst position',
                time: '2 hours ago'
            },
            {
                type: 'interview',
                icon: 'fas fa-calendar-alt',
                title: 'Interview Scheduled',
                description: 'Infosys - Data Entry Specialist',
                time: '1 day ago'
            },
            {
                type: 'profile',
                icon: 'fas fa-user-edit',
                title: 'Profile Updated',
                description: 'Added new skill: Advanced Excel',
                time: '3 days ago'
            }
        ];

        const activityList = document.querySelector('.activity-list');
        if (activityList) {
            activityList.innerHTML = activities.map(activity => `
                <div class="activity-item">
                    <div class="activity-icon ${activity.type}">
                        <i class="${activity.icon}"></i>
                    </div>
                    <div class="activity-content">
                        <h4>${activity.title}</h4>
                        <p>${activity.description}</p>
                        <span class="activity-time">${activity.time}</span>
                    </div>
                </div>
            `).join('');
        }
    }

    setupCharts() {
        this.createStatusChart();
        this.createTrendChart();
    }

    createStatusChart() {
        const ctx = document.getElementById('statusChart');
        if (!ctx) return;

        new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: ['Applied', 'Under Review', 'Interview', 'Rejected', 'Offered'],
                datasets: [{
                    data: [8, 3, 2, 1, 1],
                    backgroundColor: [
                        '#667eea',
                        '#f093fb',
                        '#4facfe',
                        '#f093fb',
                        '#43e97b'
                    ],
                    borderWidth: 0
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom'
                    }
                }
            }
        });
    }

    createTrendChart() {
        const ctx = document.getElementById('trendChart');
        if (!ctx) return;

        new Chart(ctx, {
            type: 'line',
            data: {
                labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
                datasets: [{
                    label: 'Applications',
                    data: [2, 4, 3, 5, 7, 6],
                    borderColor: '#667eea',
                    backgroundColor: 'rgba(102, 126, 234, 0.1)',
                    fill: true,
                    tension: 0.4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });
    }

    // Utility Functions
    animateCounter(element, target) {
        const start = parseInt(element.textContent) || 0;
        const increment = (target - start) / 20;
        let current = start;

        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                element.textContent = target.toLocaleString();
                clearInterval(timer);
            } else {
                element.textContent = Math.floor(current).toLocaleString();
            }
        }, 50);
    }

    formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { 
            month: 'short', 
            day: 'numeric',
            year: 'numeric'
        });
    }

    getStatusText(status) {
        const statusMap = {
            'applied': 'Applied',
            'review': 'Under Review',
            'interview': 'Interview',
            'rejected': 'Rejected',
            'offered': 'Offered'
        };
        return statusMap[status] || status;
    }

    // Interactive Functions
    toggleEdit(sectionId) {
        const section = document.getElementById(sectionId);
        if (!section) return;

        const editableElements = section.querySelectorAll('[contenteditable]');
        const isEditing = editableElements[0]?.getAttribute('contenteditable') === 'true';

        editableElements.forEach(element => {
            element.setAttribute('contenteditable', !isEditing);
            if (!isEditing) {
                element.focus();
            }
        });

        // Show/hide additional editing elements
        const addSkillContainer = section.querySelector('.add-skill-container');
        if (addSkillContainer) {
            addSkillContainer.style.display = !isEditing ? 'flex' : 'none';
        }

        // Save changes if exiting edit mode
        if (isEditing) {
            this.saveProfileChanges(sectionId);
        }
    }

    saveProfileChanges(sectionId) {
        if (sectionId === 'personal-info') {
            const infoItems = document.querySelectorAll('#personal-info .info-item span');
            if (infoItems.length >= 4) {
                this.userData.profile.name = infoItems[0].textContent;
                this.userData.profile.email = infoItems[1].textContent;
                this.userData.profile.phone = infoItems[2].textContent;
                this.userData.profile.location = infoItems[3].textContent;
            }
        }
        
        this.saveToLocalStorage();
        this.showToast('Profile updated successfully!', 'success');
    }

    addSkill(skillName) {
        if (!skillName || skillName.trim() === '') return;
        
        const trimmedSkill = skillName.trim();
        if (!this.userData.profile.skills.includes(trimmedSkill)) {
            this.userData.profile.skills.push(trimmedSkill);
            this.updateSkillsDisplay();
            this.saveToLocalStorage();
            this.showToast(`Skill "${trimmedSkill}" added!`, 'success');
        }
    }

    updateSkillsDisplay() {
        const skillsList = document.querySelector('.skills-list');
        if (!skillsList) return;

        skillsList.innerHTML = this.userData.profile.skills.map(skill => `
            <span class="skill-badge" onclick="removeSkill('${skill}')">
                ${skill}
                <i class="fas fa-times" style="margin-left: 8px; opacity: 0.7;"></i>
            </span>
        `).join('');
    }

    removeSkill(skillName) {
        this.userData.profile.skills = this.userData.profile.skills.filter(skill => skill !== skillName);
        this.updateSkillsDisplay();
        this.saveToLocalStorage();
        this.showToast(`Skill "${skillName}" removed!`, 'info');
    }

    filterApplications(status) {
        const applicationItems = document.querySelectorAll('.application-item');
        applicationItems.forEach(item => {
            if (status === 'all' || status === '' || item.dataset.status === status) {
                item.style.display = 'grid';
            } else {
                item.style.display = 'none';
            }
        });
    }

    performGlobalSearch(query) {
        if (!query.trim()) return;
        
        this.switchSection('job-search');
        this.showToast(`Searching for "${query}"...`, 'info');
        
        // Simulate search results
        setTimeout(() => {
            this.showToast(`Found 234 jobs matching "${query}"`, 'success');
        }, 1500);
    }

    applyToJob(title, company) {
        const newApplication = {
            id: Date.now().toString(),
            company: company,
            position: title,
            status: 'applied',
            dateApplied: new Date().toISOString().split('T')[0],
            salary: 'Not specified',
            location: 'Remote',
            notes: 'Applied via CareerCatalyst Pro'
        };

        this.userData.applications.unshift(newApplication);
        this.userData.stats.totalApplications++;
        this.userData.stats.pending++;
        
        this.saveToLocalStorage();
        this.showToast(`Applied to ${title} at ${company}!`, 'success');
        
        // Update dashboard if currently viewing
        if (this.currentSection === 'dashboard') {
            this.loadDashboardData();
        }
    }

    openQuickAdd() {
        this.showModal('addApplicationModal', {
            title: 'Quick Add Job Application',
            content: this.getQuickAddForm()
        });
    }

    getQuickAddForm() {
        return `
            <form id="quickAddForm" class="modal-form">
                <div class="form-group">
                    <label>Company Name *</label>
                    <input type="text" name="company" required class="form-input">
                </div>
                <div class="form-group">
                    <label>Position *</label>
                    <input type="text" name="position" required class="form-input">
                </div>
                <div class="form-row">
                    <div class="form-group">
                        <label>Location</label>
                        <input type="text" name="location" class="form-input">
                    </div>
                    <div class="form-group">
                        <label>Salary Range</label>
                        <input type="text" name="salary" class="form-input">
                    </div>
                </div>
                <div class="form-group">
                    <label>Status</label>
                    <select name="status" class="form-select">
                        <option value="applied">Applied</option>
                        <option value="review">Under Review</option>
                        <option value="interview">Interview Scheduled</option>
                    </select>
                </div>
                <div class="form-group">
                    <label>Notes</label>
                    <textarea name="notes" class="form-input" rows="3"></textarea>
                </div>
                <div class="form-actions">
                    <button type="button" class="btn btn-outline" onclick="closeModal()">Cancel</button>
                    <button type="submit" class="btn btn-primary">Add Application</button>
                </div>
            </form>
        `;
    }

    showModal(modalId, options = {}) {
        const modalOverlay = document.getElementById('modalOverlay');
        const modal = document.getElementById(modalId);
        
        if (options.title) {
            const modalHeader = modal.querySelector('.modal-header h3');
            if (modalHeader) modalHeader.textContent = options.title;
        }
        
        if (options.content) {
            const modalBody = modal.querySelector('.modal-body');
            if (modalBody) modalBody.innerHTML = options.content;
        }
        
        modalOverlay.classList.add('active');
        
        // Setup form submission if it's a form modal
        const form = modal.querySelector('form');
        if (form) {
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleFormSubmission(form);
            });
        }
    }

    closeModal() {
        const modalOverlay = document.getElementById('modalOverlay');
        modalOverlay.classList.remove('active');
    }

    handleFormSubmission(form) {
        const formData = new FormData(form);
        const data = Object.fromEntries(formData);
        
        if (form.id === 'quickAddForm') {
            const newApplication = {
                id: Date.now().toString(),
                company: data.company,
                position: data.position,
                status: data.status,
                dateApplied: new Date().toISOString().split('T')[0],
                salary: data.salary || 'Not specified',
                location: data.location || 'Not specified',
                notes: data.notes || ''
            };
            
            this.userData.applications.unshift(newApplication);
            this.userData.stats.totalApplications++;
            this.userData.stats.pending++;
            
            this.saveToLocalStorage();
            this.closeModal();
            this.showToast('Application added successfully!', 'success');
            
            if (this.currentSection === 'applications') {
                this.loadApplicationsData();
            }
        }
    }

    showToast(message, type = 'info') {
        const toastContainer = document.getElementById('toastContainer');
        if (!toastContainer) return;

        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        toast.textContent = message;

        toastContainer.appendChild(toast);

        // Auto remove after 3 seconds
        setTimeout(() => {
            toast.style.animation = 'slideOut 0.3s ease forwards';
            setTimeout(() => {
                toastContainer.removeChild(toast);
            }, 300);
        }, 3000);
    }

    startLiveUpdates() {
        // Simulate live job count updates
        setInterval(() => {
            this.jobSearchData.liveJobCount += Math.floor(Math.random() * 10);
            const liveJobCountElement = document.getElementById('liveJobCount');
            if (liveJobCountElement) {
                liveJobCountElement.textContent = this.jobSearchData.liveJobCount.toLocaleString();
            }
        }, 30000); // Update every 30 seconds
    }

    updateProfileCompletion() {
        let completionScore = 0;
        const profile = this.userData.profile;
        
        if (profile.name) completionScore += 20;
        if (profile.email) completionScore += 20;
        if (profile.phone) completionScore += 15;
        if (profile.location) completionScore += 15;
        if (profile.summary) completionScore += 15;
        if (profile.skills && profile.skills.length > 0) completionScore += 15;
        
        const progressFill = document.querySelector('.progress-fill');
        const completionText = document.querySelector('.profile-completion span');
        
        if (progressFill) progressFill.style.width = `${completionScore}%`;
        if (completionText) completionText.textContent = `Profile Completion: ${completionScore}%`;
    }

    // Data Persistence
    saveToLocalStorage() {
        try {
            localStorage.setItem('careerCatalystProData', JSON.stringify(this.userData));
        } catch (error) {
            console.error('Error saving to localStorage:', error);
        }
    }

    loadFromLocalStorage() {
        try {
            const savedData = localStorage.getItem('careerCatalystProData');
            if (savedData) {
                const parsedData = JSON.parse(savedData);
                this.userData = { ...this.userData, ...parsedData };
            }
        } catch (error) {
            console.error('Error loading from localStorage:', error);
        }
    }

    exportData() {
        const dataStr = JSON.stringify(this.userData, null, 2);
        const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
        
        const exportFileDefaultName = 'career-catalyst-pro-data.json';
        
        const linkElement = document.createElement('a');
        linkElement.setAttribute('href', dataUri);
        linkElement.setAttribute('download', exportFileDefaultName);
        linkElement.click();
        
        this.showToast('Data exported successfully!', 'success');
    }

    loadInitialData() {
        this.loadDashboardData();
    }
}

// Global Functions (for HTML onclick handlers)
window.switchSection = (section) => app.switchSection(section);
window.openQuickAdd = () => app.openQuickAdd();
window.closeModal = () => app.closeModal();
window.exportData = () => app.exportData();
window.showQuickActions = () => app.showToast('Quick actions menu', 'info');
window.refreshChart = () => app.showToast('Chart refreshed!', 'success');
window.searchByCategory = (category) => {
    app.performGlobalSearch(category);
};
window.applyToJob = (title, company) => app.applyToJob(title, company);
window.filterApplications = (status) => app.filterApplications(status);
window.addNewApplication = () => app.openQuickAdd();
window.editApplication = (id) => app.showToast('Edit application feature coming soon!', 'info');
window.viewApplication = (id) => app.showToast('View application details coming soon!', 'info');
window.toggleEdit = (section) => app.toggleEdit(section);
window.addSkill = () => {
    const input = document.querySelector('.skill-input');
    if (input) {
        app.addSkill(input.value);
        input.value = '';
    }
};
window.removeSkill = (skill) => app.removeSkill(skill);

// Initialize App
let app;
document.addEventListener('DOMContentLoaded', () => {
    app = new CareerCatalystApp();
});
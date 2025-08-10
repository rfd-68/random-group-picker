class GroupGenerator {
    constructor() {
        this.names = [];
        this.groups = [];
        this.initializeEventListeners();
        this.initializeParticles();
        this.updateNameCounter();
        this.startLiveStats();
    }

    initializeEventListeners() {
        const generateBtn = document.getElementById('generate-btn');
        const clearBtn = document.getElementById('clear-btn');
        const exportBtn = document.getElementById('export-btn');
        const copyBtn = document.getElementById('copy-btn');
        const randomizeBtn = document.getElementById('randomize-btn');
        const shareBtn = document.getElementById('share-btn');

        generateBtn.addEventListener('click', () => this.generateGroups());
        clearBtn.addEventListener('click', () => this.clearAll());
        exportBtn.addEventListener('click', () => this.exportToCSV());
        copyBtn.addEventListener('click', () => this.copyToClipboard());
        randomizeBtn.addEventListener('click', () => this.randomizeNames());
        shareBtn.addEventListener('click', () => this.shareResults());

        // Auto-update group count when group size changes
        document.getElementById('group-size').addEventListener('input', () => this.updateGroupCount());
        
        // Handle Enter key in textarea
        document.getElementById('names-input').addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && e.ctrlKey) {
                this.generateGroups();
            }
        });

        // Update name counter as user types
        document.getElementById('names-input').addEventListener('input', () => this.updateNameCounter());
    }

    initializeParticles() {
        if (typeof particlesJS !== 'undefined') {
            particlesJS('particles-js', {
                particles: {
                    number: {
                        value: 80,
                        density: {
                            enable: true,
                            value_area: 800
                        }
                    },
                    color: {
                        value: ['#00ffff', '#ff00ff', '#ffff00']
                    },
                    shape: {
                        type: 'circle',
                        stroke: {
                            width: 0,
                            color: '#000000'
                        }
                    },
                    opacity: {
                        value: 0.5,
                        random: false,
                        anim: {
                            enable: false,
                            speed: 1,
                            opacity_min: 0.1,
                            sync: false
                        }
                    },
                    size: {
                        value: 3,
                        random: true,
                        anim: {
                            enable: false,
                            speed: 40,
                            size_min: 0.1,
                            sync: false
                        }
                    },
                    line_linked: {
                        enable: true,
                        distance: 150,
                        color: '#00ffff',
                        opacity: 0.4,
                        width: 1
                    },
                    move: {
                        enable: true,
                        speed: 6,
                        direction: 'none',
                        random: false,
                        straight: false,
                        out_mode: 'out',
                        bounce: false,
                        attract: {
                            enable: false,
                            rotateX: 600,
                            rotateY: 1200
                        }
                    }
                },
                interactivity: {
                    detect_on: 'canvas',
                    events: {
                        onhover: {
                            enable: true,
                            mode: 'repulse'
                        },
                        onclick: {
                            enable: true,
                            mode: 'push'
                        },
                        resize: true
                    },
                    modes: {
                        grab: {
                            distance: 400,
                            line_linked: {
                                opacity: 1
                            }
                        },
                        bubble: {
                            distance: 400,
                            size: 40,
                            duration: 2,
                            opacity: 8,
                            speed: 3
                        },
                        repulse: {
                            distance: 200,
                            duration: 0.4
                        },
                        push: {
                            particles_nb: 4
                        },
                        remove: {
                            particles_nb: 2
                        }
                    }
                },
                retina_detect: true
            });
        }
    }

    updateNameCounter() {
        const namesInput = document.getElementById('names-input').value;
        const names = this.parseNames(namesInput);
        const counter = document.getElementById('name-count');
        counter.textContent = names.length;
        
        // Add visual feedback
        if (names.length > 0) {
            counter.style.color = '#00ffff';
            counter.style.textShadow = '0 0 10px rgba(0, 255, 255, 0.5)';
        } else {
            counter.style.color = 'rgba(176, 176, 176, 0.8)';
            counter.style.textShadow = 'none';
        }
    }

    startLiveStats() {
        // Simulate live user count
        setInterval(() => {
            const liveUsers = document.getElementById('live-users');
            const currentUsers = parseInt(liveUsers.textContent.replace(',', ''));
            const variation = Math.floor(Math.random() * 10) - 5;
            const newUsers = Math.max(1000, currentUsers + variation);
            liveUsers.textContent = newUsers.toLocaleString();
        }, 5000);

        // Simulate groups created
        setInterval(() => {
            const groupsTotal = document.getElementById('groups-created-total');
            const currentGroups = parseInt(groupsTotal.textContent.replace(',', ''));
            const newGroups = currentGroups + Math.floor(Math.random() * 5) + 1;
            groupsTotal.textContent = newGroups.toLocaleString();
        }, 3000);
    }

    randomizeNames() {
        const namesInput = document.getElementById('names-input');
        const names = this.parseNames(namesInput.value);
        
        if (names.length === 0) {
            this.showError('No names to randomize.');
            return;
        }

        const shuffledNames = this.shuffleArray([...names]);
        namesInput.value = shuffledNames.join('\n');
        this.updateNameCounter();
        this.showSuccess('Names randomized successfully!');
    }

    shareResults() {
        if (this.groups.length === 0) {
            this.showError('No groups to share.');
            return;
        }

        let shareText = '🚀 Random Groups Generated:\n\n';
        
        this.groups.forEach((group, groupIndex) => {
            shareText += `📦 Group ${groupIndex + 1}:\n`;
            group.forEach(member => {
                shareText += `• ${member}\n`;
            });
            shareText += '\n';
        });

        if (navigator.share) {
            navigator.share({
                title: 'Random Groups Generated',
                text: shareText,
                url: window.location.href
            }).then(() => {
                this.showSuccess('Shared successfully!');
            }).catch(() => {
                this.fallbackShare(shareText);
            });
        } else {
            this.fallbackShare(shareText);
        }
    }

    fallbackShare(text) {
        if (navigator.clipboard) {
            navigator.clipboard.writeText(text).then(() => {
                this.showSuccess('Results copied to clipboard for sharing!');
            }).catch(() => {
                this.showError('Failed to copy to clipboard.');
            });
        } else {
            this.showError('Sharing not supported on this device.');
        }
    }

    parseNames(input) {
        if (!input.trim()) return [];
        
        // Split by newlines or commas and clean up
        const names = input
            .split(/[\n,]/)
            .map(name => name.trim())
            .filter(name => name.length > 0);
        
        return names;
    }

    updateGroupCount() {
        const groupSize = parseInt(document.getElementById('group-size').value) || 3;
        const namesInput = document.getElementById('names-input').value;
        const names = this.parseNames(namesInput);
        
        if (names.length > 0 && groupSize > 0) {
            const calculatedGroups = Math.ceil(names.length / groupSize);
            document.getElementById('group-count').value = calculatedGroups;
        }
    }

    generateGroups() {
        const namesInput = document.getElementById('names-input').value;
        const groupSize = parseInt(document.getElementById('group-size').value) || 3;
        const groupCount = parseInt(document.getElementById('group-count').value) || 0;

        this.names = this.parseNames(namesInput);

        if (this.names.length === 0) {
            this.showError('Please enter at least one name.');
            return;
        }

        if (groupSize < 2) {
            this.showError('Group size must be at least 2.');
            return;
        }

        // Show loading overlay
        this.showLoading();

        // Simulate processing time for futuristic feel
        setTimeout(() => {
            // Shuffle names for randomness
            const shuffledNames = this.shuffleArray([...this.names]);
            
            // Generate groups
            this.groups = this.createGroups(shuffledNames, groupSize, groupCount);
            
            // Hide loading overlay
            this.hideLoading();
            
            // Display results
            this.displayGroups();
            this.updateStatistics();
            this.showResults();
            this.updateTimestamp();
        }, 800);
    }

    showLoading() {
        const overlay = document.getElementById('loading-overlay');
        overlay.style.display = 'flex';
    }

    hideLoading() {
        const overlay = document.getElementById('loading-overlay');
        overlay.style.display = 'none';
    }

    updateTimestamp() {
        const now = new Date();
        const timestamp = now.toLocaleString('en-US', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: false
        });
        document.getElementById('generation-time').textContent = `Generated: ${timestamp}`;
    }

    createGroups(names, groupSize, groupCount) {
        const groups = [];
        
        if (groupCount > 0) {
            // Create specified number of groups
            const totalSlots = groupCount * groupSize;
            const adjustedNames = names.length > totalSlots ? names.slice(0, totalSlots) : names;
            
            for (let i = 0; i < groupCount; i++) {
                const startIndex = i * groupSize;
                const endIndex = Math.min(startIndex + groupSize, adjustedNames.length);
                const groupMembers = adjustedNames.slice(startIndex, endIndex);
                
                if (groupMembers.length > 0) {
                    groups.push(groupMembers);
                }
            }
        } else {
            // Auto-calculate groups based on size
            for (let i = 0; i < names.length; i += groupSize) {
                const groupMembers = names.slice(i, i + groupSize);
                groups.push(groupMembers);
            }
        }

        return groups;
    }

    shuffleArray(array) {
        const shuffled = [...array];
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        return shuffled;
    }

    displayGroups() {
        const container = document.getElementById('groups-container');
        container.innerHTML = '';

        this.groups.forEach((group, index) => {
            const groupCard = document.createElement('div');
            groupCard.className = 'group-card';
            groupCard.style.animationDelay = `${index * 0.1}s`;

            const groupHeader = document.createElement('div');
            groupHeader.className = 'group-header';

            const groupTitle = document.createElement('div');
            groupTitle.className = 'group-title';
            groupTitle.innerHTML = `<i class="fas fa-cube"></i> Group ${index + 1}`;

            const groupSize = document.createElement('div');
            groupSize.className = 'group-size';
            groupSize.innerHTML = `<i class="fas fa-users"></i> ${group.length} members`;

            groupHeader.appendChild(groupTitle);
            groupHeader.appendChild(groupSize);

            const groupMembers = document.createElement('div');
            groupMembers.className = 'group-members';

            group.forEach(member => {
                const memberTag = document.createElement('div');
                memberTag.className = 'member-tag';
                memberTag.innerHTML = `<i class="fas fa-user-astronaut"></i> ${member}`;
                groupMembers.appendChild(memberTag);
            });

            groupCard.appendChild(groupHeader);
            groupCard.appendChild(groupMembers);
            container.appendChild(groupCard);
        });
    }

    updateStatistics() {
        document.getElementById('total-names').textContent = this.names.length;
        document.getElementById('groups-created').textContent = this.groups.length;
        
        if (this.groups.length > 0) {
            const groupSizes = this.groups.map(group => group.length);
            document.getElementById('largest-group').textContent = Math.max(...groupSizes);
            document.getElementById('smallest-group').textContent = Math.min(...groupSizes);
        }
    }

    showResults() {
        document.getElementById('results-section').style.display = 'block';
        document.getElementById('stats-section').style.display = 'block';
        
        // Smooth scroll to results
        document.getElementById('results-section').scrollIntoView({ 
            behavior: 'smooth',
            block: 'start'
        });
    }

    showError(message) {
        // Create a futuristic error notification
        const errorDiv = document.createElement('div');
        errorDiv.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: linear-gradient(135deg, rgba(220, 53, 69, 0.9), rgba(220, 53, 69, 0.7));
            color: white;
            padding: 20px 25px;
            border-radius: 15px;
            box-shadow: 0 8px 32px rgba(220, 53, 69, 0.4), 0 0 20px rgba(220, 53, 69, 0.3);
            z-index: 1000;
            animation: slideInRight 0.4s ease;
            backdrop-filter: blur(15px);
            border: 1px solid rgba(220, 53, 69, 0.3);
            max-width: 300px;
            font-weight: 500;
        `;
        errorDiv.innerHTML = `<i class="fas fa-exclamation-triangle" style="margin-right: 10px; color: #ffcc00;"></i>${message}`;
        
        document.body.appendChild(errorDiv);
        
        // Auto-remove after 4 seconds
        setTimeout(() => {
            errorDiv.style.animation = 'slideOutRight 0.4s ease';
            setTimeout(() => {
                if (errorDiv.parentNode) {
                    errorDiv.parentNode.removeChild(errorDiv);
                }
            }, 400);
        }, 4000);
    }

    clearAll() {
        document.getElementById('names-input').value = '';
        document.getElementById('group-size').value = '3';
        document.getElementById('group-count').value = '0';
        document.getElementById('results-section').style.display = 'none';
        document.getElementById('stats-section').style.display = 'none';
        
        this.names = [];
        this.groups = [];
        this.updateNameCounter();
        this.showSuccess('All data cleared successfully!');
    }

    exportToCSV() {
        if (this.groups.length === 0) {
            this.showError('No groups to export.');
            return;
        }

        let csvContent = 'Group,Member\n';
        
        this.groups.forEach((group, groupIndex) => {
            group.forEach(member => {
                csvContent += `Group ${groupIndex + 1},${member}\n`;
            });
        });

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        
        if (link.download !== undefined) {
            const url = URL.createObjectURL(blob);
            link.setAttribute('href', url);
            link.setAttribute('download', `random_groups_${new Date().toISOString().split('T')[0]}.csv`);
            link.style.visibility = 'hidden';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            this.showSuccess('Groups exported to CSV successfully!');
        }
    }

    copyToClipboard() {
        if (this.groups.length === 0) {
            this.showError('No groups to copy.');
            return;
        }

        let textContent = '🚀 Random Groups Generated:\n\n';
        
        this.groups.forEach((group, groupIndex) => {
            textContent += `📦 Group ${groupIndex + 1}:\n`;
            group.forEach(member => {
                textContent += `• ${member}\n`;
            });
            textContent += '\n';
        });

        if (navigator.clipboard) {
            navigator.clipboard.writeText(textContent).then(() => {
                this.showSuccess('Groups copied to clipboard!');
            }).catch(() => {
                this.fallbackCopyTextToClipboard(textContent);
            });
        } else {
            this.fallbackCopyTextToClipboard(textContent);
        }
    }

    fallbackCopyTextToClipboard(text) {
        const textArea = document.createElement('textarea');
        textArea.value = text;
        textArea.style.position = 'fixed';
        textArea.style.left = '-999999px';
        textArea.style.top = '-999999px';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        
        try {
            document.execCommand('copy');
            this.showSuccess('Groups copied to clipboard!');
        } catch (err) {
            this.showError('Failed to copy to clipboard.');
        }
        
        document.body.removeChild(textArea);
    }

    showSuccess(message) {
        const successDiv = document.createElement('div');
        successDiv.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: linear-gradient(135deg, rgba(40, 167, 69, 0.9), rgba(40, 167, 69, 0.7));
            color: white;
            padding: 20px 25px;
            border-radius: 15px;
            box-shadow: 0 8px 32px rgba(40, 167, 69, 0.4), 0 0 20px rgba(40, 167, 69, 0.3);
            z-index: 1000;
            animation: slideInRight 0.4s ease;
            backdrop-filter: blur(15px);
            border: 1px solid rgba(40, 167, 69, 0.3);
            max-width: 300px;
            font-weight: 500;
        `;
        successDiv.innerHTML = `<i class="fas fa-check-circle" style="margin-right: 10px; color: #ffcc00;"></i>${message}`;
        
        document.body.appendChild(successDiv);
        
        setTimeout(() => {
            successDiv.style.animation = 'slideOutRight 0.4s ease';
            setTimeout(() => {
                if (successDiv.parentNode) {
                    successDiv.parentNode.removeChild(successDiv);
                }
            }, 400);
        }, 3000);
    }
}

// Add CSS animations for notifications
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    
    @keyframes slideOutRight {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
    }
`;
document.head.appendChild(style);

// Initialize the application
document.addEventListener('DOMContentLoaded', () => {
    new GroupGenerator();
    
    // Add some sample names for demonstration
    const sampleNames = [
        'Ahmad Rizki',
        'Siti Nurhaliza',
        'Budi Santoso',
        'Dewi Sartika',
        'Eko Prasetyo',
        'Fatimah Azzahra',
        'Gunawan Setiawan',
        'Hani Safitri',
        'Indra Kusuma',
        'Joko Widodo'
    ];

    document.getElementById('names-input').value = sampleNames.join('\n');
    
    // Trigger initial name counter update
    setTimeout(() => {
        const event = new Event('input');
        document.getElementById('names-input').dispatchEvent(event);
    }, 100);
});

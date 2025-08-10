class GroupGenerator {
    constructor() {
        this.names = [];
        this.groups = [];
        this.initializeEventListeners();
    }

    initializeEventListeners() {
        const generateBtn = document.getElementById('generate-btn');
        const clearBtn = document.getElementById('clear-btn');
        const exportBtn = document.getElementById('export-btn');
        const copyBtn = document.getElementById('copy-btn');

        generateBtn.addEventListener('click', () => this.generateGroups());
        clearBtn.addEventListener('click', () => this.clearAll());
        exportBtn.addEventListener('click', () => this.exportToCSV());
        copyBtn.addEventListener('click', () => this.copyToClipboard());

        // Auto-update group count when group size changes
        document.getElementById('group-size').addEventListener('input', () => this.updateGroupCount());
        
        // Handle Enter key in textarea
        document.getElementById('names-input').addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && e.ctrlKey) {
                this.generateGroups();
            }
        });
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

        // Shuffle names for randomness
        const shuffledNames = this.shuffleArray([...this.names]);
        
        // Generate groups
        this.groups = this.createGroups(shuffledNames, groupSize, groupCount);
        
        // Display results
        this.displayGroups();
        this.updateStatistics();
        this.showResults();
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
            groupTitle.textContent = `Group ${index + 1}`;

            const groupSize = document.createElement('div');
            groupSize.className = 'group-size';
            groupSize.textContent = `${group.length} members`;

            groupHeader.appendChild(groupTitle);
            groupHeader.appendChild(groupSize);

            const groupMembers = document.createElement('div');
            groupMembers.className = 'group-members';

            group.forEach(member => {
                const memberTag = document.createElement('div');
                memberTag.className = 'member-tag';
                memberTag.textContent = member;
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
        // Create a simple error notification
        const errorDiv = document.createElement('div');
        errorDiv.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: #dc3545;
            color: white;
            padding: 15px 20px;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            z-index: 1000;
            animation: slideInRight 0.3s ease;
        `;
        errorDiv.textContent = message;
        
        document.body.appendChild(errorDiv);
        
        // Auto-remove after 3 seconds
        setTimeout(() => {
            errorDiv.style.animation = 'slideOutRight 0.3s ease';
            setTimeout(() => {
                if (errorDiv.parentNode) {
                    errorDiv.parentNode.removeChild(errorDiv);
                }
            }, 300);
        }, 3000);
    }

    clearAll() {
        document.getElementById('names-input').value = '';
        document.getElementById('group-size').value = '3';
        document.getElementById('group-count').value = '0';
        document.getElementById('results-section').style.display = 'none';
        document.getElementById('stats-section').style.display = 'none';
        
        this.names = [];
        this.groups = [];
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
            link.setAttribute('download', 'random_groups.csv');
            link.style.visibility = 'hidden';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
    }

    copyToClipboard() {
        if (this.groups.length === 0) {
            this.showError('No groups to copy.');
            return;
        }

        let textContent = 'Random Groups:\n\n';
        
        this.groups.forEach((group, groupIndex) => {
            textContent += `Group ${groupIndex + 1}:\n`;
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
            background: #28a745;
            color: white;
            padding: 15px 20px;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            z-index: 1000;
            animation: slideInRight 0.3s ease;
        `;
        successDiv.textContent = message;
        
        document.body.appendChild(successDiv);
        
        setTimeout(() => {
            successDiv.style.animation = 'slideOutRight 0.3s ease';
            setTimeout(() => {
                if (successDiv.parentNode) {
                    successDiv.parentNode.removeChild(successDiv);
                }
            }, 300);
        }, 2000);
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
});

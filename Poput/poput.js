// Chrome Challenge 2025 - Chalamandra QuantumMind Popup
class ChalamandraPopup {
    constructor() {
        this.demoData = this.generateDemoData();
        this.initialize();
        this.loadUserData();
        this.setupEventListeners();
        this.setupDemoMode();
    }

    initialize() {
        console.log('🦎 Chalamandra Popup initialized - Chrome Challenge 2025');
        this.updateStatus();
    }

    generateDemoData() {
        return {
            userMetrics: {
                clarity: 87,
                tone: 92,
                todayCount: 15,
                trend: 'up'
            },
            recentAnalyses: [
                {
                    text: "Project deadline negotiation with team",
                    riskLevel: "MEDIUM",
                    timestamp: Date.now() - 300000,
                    sentiment: 0.7
                },
                {
                    text: "Client feedback response draft",
                    riskLevel: "LOW", 
                    timestamp: Date.now() - 600000,
                    sentiment: 0.9
                },
                {
                    text: "Urgent request handling",
                    riskLevel: "HIGH",
                    timestamp: Date.now() - 900000,
                    sentiment: 0.3
                }
            ],
            ritualEffectiveness: {
                'Enki Whisper': 94,
                'Tun Spiral': 88,
                'Maat Mirror': 76,
                'Ziggurat Breath': 91
            }
        };
    }

    setupDemoMode() {
        this.showHackathonWelcome();
        this.startDemoAnimation();
    }

    showHackathonWelcome() {
        // Banner already in HTML, just ensure it's visible
        console.log('🚀 Chrome Challenge 2025 Demo Mode Active');
    }

    async loadUserData() {
        try {
            // Load recent analyses
            const recentData = await this.getRecentAnalyses();
            this.displayRecentAnalyses(recentData);

            // Load user metrics
            const metrics = await this.getUserMetrics();
            this.updateMetrics(metrics);

            // Load protocol settings
            const protocols = await this.getProtocolSettings();
            this.updateProtocols(protocols);

        } catch (error) {
            console.error('Error loading user data:', error);
            this.showError('Failed to load user data');
        }
    }

    setupEventListeners() {
        // Analyze Current Page
        document.getElementById('analyzeCurrent').addEventListener('click', () => {
            this.analyzeCurrentPage();
        });

        // Open Dashboard
        document.getElementById('openDashboard').addEventListener('click', () => {
            this.openDashboard();
        });

        // Settings
        document.getElementById('settingsBtn').addEventListener('click', () => {
            this.openSettings();
        });

        // Help
        document.getElementById('helpBtn').addEventListener('click', () => {
            this.openHelp();
        });

        // Protocol toggles
        this.setupProtocolToggles();

        // Metric card clicks
        this.setupMetricInteractions();
    }

    setupProtocolToggles() {
        const protocolItems = document.querySelectorAll('.protocol-item');
        protocolItems.forEach(item => {
            item.addEventListener('click', () => {
                this.toggleProtocol(item);
            });
        });
    }

    setupMetricInteractions() {
        const metricCards = document.querySelectorAll('.metric-card');
        metricCards.forEach((card, index) => {
            card.addEventListener('click', () => {
                this.showMetricExplanation(index);
            });
        });
    }

    async analyzeCurrentPage() {
        try {
            // Show loading state
            this.setButtonLoading('analyzeCurrent', true);

            // Get current active tab
            const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
            
            if (!tab) {
                throw new Error('No active tab found');
            }

            // Simulate analysis for demo
            setTimeout(() => {
                const analysis = this.generateDemoAnalysis(tab.url);
                this.displayAnalysisResults(analysis);
                this.addRecentAnalysis(analysis);
                this.setButtonLoading('analyzeCurrent', false);
                this.showSuccess('Analysis completed! Communication insights ready.');
            }, 1500);

        } catch (error) {
            console.error('Analysis error:', error);
            this.showError('Could not analyze current page');
            this.setButtonLoading('analyzeCurrent', false);
        }
    }

    generateDemoAnalysis(url) {
        const platforms = {
            'gmail': {
                platform: 'Gmail',
                sentiment: Math.random() > 0.3 ? 0.8 : 0.4,
                clarity: 0.9,
                risk: Math.random() > 0.7 ? 'HIGH' : Math.random() > 0.4 ? 'MEDIUM' : 'LOW',
                recommendation: this.getRandomRecommendation()
            },
            'slack': {
                platform: 'Slack',
                sentiment: Math.random() > 0.4 ? 0.7 : 0.5,
                clarity: 0.8,
                risk: Math.random() > 0.8 ? 'HIGH' : Math.random() > 0.5 ? 'MEDIUM' : 'LOW',
                recommendation: this.getRandomRecommendation()
            },
            'general': {
                platform: 'Web Page',
                sentiment: 0.6,
                clarity: 0.7,
                risk: 'LOW',
                recommendation: 'Communication patterns normal. Consider proactive ritual practice.'
            }
        };

        const platform = url.includes('mail.google.com') ? 'gmail' : 
                        url.includes('slack.com') ? 'slack' : 'general';
        
        return platforms[platform];
    }

    getRandomRecommendation() {
        const recommendations = [
            "Use Enki Whisper with 'clarity' seed word to enhance focus",
            "Try Ziggurat Breath before responding to maintain calm",
            "Consider Maat Mirror for perspective shift",
            "Apply Ghost Symbol priming for subconscious alignment",
            "Use Tun Spiral to track communication improvements"
        ];
        return recommendations[Math.floor(Math.random() * recommendations.length)];
    }

    displayAnalysisResults(analysis) {
        const resultsContainer = document.getElementById('analysisResults');
        const platformElement = document.getElementById('resultPlatform');
        const sentimentElement = document.getElementById('resultSentiment');
        const clarityElement = document.getElementById('resultClarity');
        const riskElement = document.getElementById('resultRisk');
        const recommendationElement = document.getElementById('resultRecommendation');

        // Update elements
        platformElement.textContent = analysis.platform;
        platformElement.className = 'result-value';
        
        sentimentElement.textContent = `${Math.round(analysis.sentiment * 100)}%`;
        sentimentElement.className = `result-value ${analysis.sentiment > 0.6 ? 'positive' : 'negative'}`;
        
        clarityElement.textContent = `${Math.round(analysis.clarity * 100)}%`;
        clarityElement.className = 'result-value';
        
        riskElement.textContent = analysis.risk;
        riskElement.className = `result-value risk-${analysis.risk.toLowerCase()}`;
        
        recommendationElement.innerHTML = `<strong>Recommendation:</strong> ${analysis.recommendation}`;

        // Show results
        resultsContainer.style.display = 'block';
        resultsContainer.classList.add('fade-in');
    }

    async getRecentAnalyses() {
        return new Promise((resolve) => {
            chrome.storage.local.get(['recentAnalyses'], (result) => {
                resolve(result.recentAnalyses || this.demoData.recentAnalyses);
            });
        });
    }

    displayRecentAnalyses(analyses) {
        const recentList = document.getElementById('recentList');
        
        if (analyses.length === 0) {
            recentList.innerHTML = `
                <div class="empty-state">
                    <span class="empty-icon">📝</span>
                    <p>No recent analysis</p>
                </div>
            `;
            return;
        }

        recentList.innerHTML = analyses.slice(0, 3).map(analysis => `
            <div class="recent-item fade-in">
                <div class="recent-text" title="${analysis.text}">
                    ${this.truncateText(analysis.text, 40)}
                </div>
                <div class="recent-risk risk-${analysis.riskLevel?.toLowerCase() || 'low'}">
                    ${analysis.riskLevel || 'LOW'}
                </div>
            </div>
        `).join('');
    }

    async addRecentAnalysis(analysis) {
        const recentAnalyses = await this.getRecentAnalyses();
        recentAnalyses.unshift({
            text: `Analysis on ${analysis.platform}`,
            riskLevel: analysis.risk,
            timestamp: Date.now(),
            sentiment: analysis.sentiment
        });

        // Keep only last 5 analyses
        const updatedAnalyses = recentAnalyses.slice(0, 5);
        
        chrome.storage.local.set({ recentAnalyses: updatedAnalyses });
        this.displayRecentAnalyses(updatedAnalyses);
    }

    async getUserMetrics() {
        return new Promise((resolve) => {
            chrome.storage.local.get(['userMetrics'], (result) => {
                resolve(result.userMetrics || this.demoData.userMetrics);
            });
        });
    }

    updateMetrics(metrics) {
        const clarityElement = document.querySelector('.metric-card:nth-child(1) .metric-value');
        const toneElement = document.querySelector('.metric-card:nth-child(2) .metric-value');
        const todayElement = document.querySelector('.metric-card:nth-child(3) .metric-value');

        if (clarityElement) clarityElement.textContent = `${metrics.clarity}%`;
        if (toneElement) toneElement.textContent = `${metrics.tone}%`;
        if (todayElement) todayElement.textContent = metrics.todayCount;
    }

    async getProtocolSettings() {
        return new Promise((resolve) => {
            chrome.storage.local.get(['protocolSettings'], (result) => {
                resolve(result.protocolSettings || {
                    trojanHorses: true,
                    matrixBreaker: true,
                    reversePsychology: false
                });
            });
        });
    }

    updateProtocols(protocols) {
        const protocolItems = document.querySelectorAll('.protocol-item');
        
        protocolItems.forEach(item => {
            const protocolKey = item.dataset.protocol;
            const isActive = protocols[protocolKey];
            
            if (isActive) {
                item.classList.add('active');
                item.querySelector('.protocol-status').textContent = 'On';
                item.querySelector('.protocol-status').classList.add('active');
            } else {
                item.classList.remove('active');
                item.querySelector('.protocol-status').textContent = 'Off';
                item.querySelector('.protocol-status').classList.remove('active');
            }
        });
    }

    async toggleProtocol(protocolItem) {
        const protocolKey = protocolItem.dataset.protocol;
        const protocolName = protocolItem.querySelector('.protocol-name').textContent;
        
        // Add visual feedback
        protocolItem.style.opacity = '0.7';
        
        try {
            const currentSettings = await this.getProtocolSettings();
            const newSettings = {
                ...currentSettings,
                [protocolKey]: !currentSettings[protocolKey]
            };

            // Save to storage
            await new Promise((resolve) => {
                chrome.storage.local.set({ protocolSettings: newSettings }, resolve);
            });

            // Update UI
            this.updateProtocols(newSettings);
            
            const status = newSettings[protocolKey] ? 'enabled' : 'disabled';
            this.showSuccess(`${protocolName} ${status}`);
            
            // Show protocol explanation
            this.showProtocolExplanation(protocolName);

        } catch (error) {
            console.error('Protocol toggle error:', error);
            this.showError('Failed to update protocol');
        } finally {
            protocolItem.style.opacity = '1';
        }
    }

    showProtocolExplanation(protocolName) {
        const explanations = {
            'Trojan Horses': 'Embeds positive suggestions in communication using psychological priming and subtle language patterns to influence outcomes positively.',
            'Matrix Breaker': 'Identifies and helps break negative communication patterns and cognitive loops through pattern interruption techniques.',
            'Reverse Psychology': 'Uses strategic opposition and reframing to achieve desired outcomes through indirect suggestion methods.'
        };

        this.showDemoNotification(
            `${protocolName}: ${explanations[protocolName]}`,
            'info'
        );
    }

    showMetricExplanation(metricIndex) {
        const explanations = [
            'Clarity: Measures how clear and understandable your communication is based on sentence structure and word choice.',
            'Tone: Analyzes the emotional tone and appropriateness of your messages for different contexts.',
            'Engagement: Tracks your daily communication activity and productive interactions.'
        ];
        
        this.showDemoNotification(explanations[metricIndex], 'info');
    }

    openDashboard() {
        this.showDemoNotification('Opening Advanced Analytics Dashboard...', 'info');
        // In a full implementation, this would open dashboard.html
        setTimeout(() => {
            this.showDemoNotification('Dashboard would show detailed analytics and ritual effectiveness tracking', 'info');
        }, 1000);
    }

    openSettings() {
        this.showDemoNotification('Settings panel would open here with customization options', 'info');
    }

    openHelp() {
        const helpMessage = `Chalamandra QuantumMind Help:

• Click "Analyze Current Page" to get communication insights
• Toggle protocols to enable different psychology techniques
• View metrics to track your communication health
• Use rituals when prompted for optimal performance

Based on neuroscience research for better communication.`;
        
        this.showDemoNotification(helpMessage, 'info');
    }

    updateStatus() {
        // Simulate status check
        const statusDot = document.querySelector('.status-dot');
        const statusText = document.querySelector('.status-text');
        
        statusDot.classList.add('active');
        statusText.textContent = 'Active';
    }

    setButtonLoading(buttonId, loading) {
        const button = document.getElementById(buttonId);
        const originalText = button.innerHTML;
        
        if (loading) {
            button.innerHTML = '<span class="btn-icon">🔮</span> Analyzing...';
            button.disabled = true;
        } else {
            button.innerHTML = '<span class="btn-icon">🔍</span> Analyze Current Page';
            button.disabled = false;
        }
    }

    showSuccess(message) {
        this.showNotification(message, 'success');
    }

    showError(message) {
        this.showNotification(message, 'error');
    }

    showDemoNotification(message, type = 'info') {
        this.showNotification(message, type);
    }

    showNotification(message, type = 'info') {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `demo-notification notification-${type} fade-in`;
        notification.innerHTML = `
            <span class="notification-icon">${
                type === 'success' ? '✅' : 
                type === 'error' ? '❌' : 
                type === 'info' ? '💡' : '🔔'
            }</span>
            <span class="notification-text">${message}</span>
        `;

        // Add styles
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${
                type === 'success' ? '#10b981' : 
                type === 'error' ? '#ef4444' : 
                type === 'info' ? '#3b82f6' : '#6b7280'
            };
            color: white;
            padding: 12px 16px;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            z-index: 1000;
            display: flex;
            align-items: center;
            gap: 8px;
            font-size: 14px;
            max-width: 300px;
            max-height: 200px;
            overflow-y: auto;
        `;

        document.body.appendChild(notification);

        // Remove after appropriate time
        const duration = message.length > 100 ? 5000 : 3000;
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, duration);
    }

    startDemoAnimation() {
        // Animate metrics for demo effect
        let clarity = 70;
        const clarityElement = document.querySelector('.metric-card:nth-child(1) .metric-value');
        
        const interval = setInterval(() => {
            clarity += 1;
            clarityElement.textContent = `${clarity}%`;
            
            if (clarity >= 87) {
                clearInterval(interval);
            }
        }, 50);
    }

    truncateText(text, maxLength) {
        if (text.length <= maxLength) return text;
        return text.substring(0, maxLength) + '...';
    }
}

// Add notification styles
const notificationStyles = `
    .notification {
        animation: slideIn 0.3s ease-out;
    }

    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }

    .notification-success {
        background: #10b981 !important;
    }

    .notification-error {
        background: #ef4444 !important;
    }

    .notification-info {
        background: #3b82f6 !important;
    }
`;

// Add styles to document
const styleSheet = document.createElement('style');
styleSheet.textContent = notificationStyles;
document.head.appendChild(styleSheet);

// Initialize popup when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new ChalamandraPopup();
});

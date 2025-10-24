/**
 * Content Script for Chalamandra QuantumMind
 * Real-time paradox detection across communication platforms
 * Chrome AI Hackathon 2025
 */

console.log('🦎 Chalamandra QuantumMind Content Script loaded');

class ContentAnalyzer {
    constructor() {
        this.isAnalyzing = false;
        this.currentPlatform = null;
        this.initialize();
    }

    initialize() {
        this.detectPlatform();
        this.initializeMessageListener();
        this.injectAnalysisUI();
        this.setupRealTimeAnalysis();
        console.log(`🌐 Chalamandra initialized on: ${this.currentPlatform}`);
    }

    detectPlatform() {
        const url = window.location.href;
        
        if (url.includes('mail.google.com')) {
            this.currentPlatform = 'gmail';
        } else if (url.includes('slack.com')) {
            this.currentPlatform = 'slack';
        } else if (url.includes('teams.microsoft.com')) {
            this.currentPlatform = 'teams';
        } else if (url.includes('discord.com')) {
            this.currentPlatform = 'discord';
        } else if (url.includes('notion.so')) {
            this.currentPlatform = 'notion';
        } else {
            this.currentPlatform = 'unknown';
        }
    }

    initializeMessageListener() {
        chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
            switch (request.action) {
                case 'analyzePage':
                    this.handleAnalyzePage(request, sendResponse);
                    return true;
                
                case 'analyzeSelectedText':
                    this.handleAnalyzeSelectedText(request, sendResponse);
                    return true;
                
                case 'getPlatformInfo':
                    sendResponse({ platform: this.currentPlatform });
                    return true;
                
                default:
                    console.log('Unknown message action:', request.action);
            }
        });
    }

    async handleAnalyzePage(request, sendResponse) {
        try {
            this.showLoadingState();
            
            const pageText = this.extractPageText();
            const analysis = await this.performComprehensiveAnalysis(pageText);
            
            this.showAnalysisUI(analysis);
            
            sendResponse({
                success: true,
                analysis: analysis,
                platform: this.currentPlatform
            });
        } catch (error) {
            console.error('Analysis error:', error);
            this.showErrorState(error.message);
            sendResponse({
                success: false,
                error: error.message
            });
        } finally {
            this.hideLoadingState();
        }
    }

    handleAnalyzeSelectedText(request, sendResponse) {
        const analysis = this.quickAnalyzeText(request.text);
        this.showFloatingAnalysis(analysis, request.text);
        sendResponse({ success: true });
    }

    // Text Extraction Methods
    extractPageText() {
        switch (this.currentPlatform) {
            case 'gmail':
                return this.extractGmailText();
            case 'slack':
                return this.extractSlackText();
            case 'teams':
                return this.extractTeamsText();
            case 'discord':
                return this.extractDiscordText();
            case 'notion':
                return this.extractNotionText();
            default:
                return this.extractGenericText();
        }
    }

    extractGmailText() {
        // Gmail compose box and email content
        const composeBox = document.querySelector('[role="textbox"][g_editable="true"]');
        const emailContent = document.querySelector('.a3s.aiL');
        
        if (composeBox) {
            return composeBox.textContent || composeBox.innerText;
        } else if (emailContent) {
            return emailContent.textContent || emailContent.innerText;
        }
        
        return document.body.innerText.substring(0, 2000);
    }

    extractSlackText() {
        // Slack message input and recent messages
        const messageInput = document.querySelector('[data-qa="message_input"]');
        const recentMessages = document.querySelectorAll('.c-message__body');
        
        let text = '';
        
        if (messageInput) {
            text += messageInput.textContent + ' ';
        }
        
        if (recentMessages.length > 0) {
            Array.from(recentMessages).slice(-5).forEach(msg => {
                text += msg.textContent + ' ';
            });
        }
        
        return text || document.body.innerText.substring(0, 1500);
    }

    extractTeamsText() {
        // Teams message input and chat
        const messageInput = document.querySelector('[role="textbox"]');
        const chatMessages = document.querySelectorAll('.activity-message');
        
        let text = '';
        
        if (messageInput) {
            text += messageInput.textContent + ' ';
        }
        
        if (chatMessages.length > 0) {
            Array.from(chatMessages).slice(-5).forEach(msg => {
                text += msg.textContent + ' ';
            });
        }
        
        return text || document.body.innerText.substring(0, 1500);
    }

    extractDiscordText() {
        // Discord message input and chat
        const messageInput = document.querySelector('[data-slate-object="block"]');
        const chatMessages = document.querySelectorAll('[class*="messageContent"]');
        
        let text = '';
        
        if (messageInput) {
            text += messageInput.textContent + ' ';
        }
        
        if (chatMessages.length > 0) {
            Array.from(chatMessages).slice(-5).forEach(msg => {
                text += msg.textContent + ' ';
            });
        }
        
        return text || document.body.innerText.substring(0, 1500);
    }

    extractNotionText() {
        // Notion page content
        const pageContent = document.querySelector('.notion-page-content');
        if (pageContent) {
            return pageContent.textContent || pageContent.innerText;
        }
        return document.body.innerText.substring(0, 2000);
    }

    extractGenericText() {
        // Fallback for unknown platforms
        return document.body.innerText.substring(0, 1000);
    }

    // Analysis Engine
    async performComprehensiveAnalysis(text) {
        if (!text || text.trim().length < 10) {
            return this.generateEmptyAnalysis();
        }

        const paradoxAnalysis = this.analyzeParadoxes(text);
        const quantumAnalysis = this.analyzeQuantumSuperposition(text);
        const suggestions = this.generateSuggestions(paradoxAnalysis.paradoxes);

        return {
            textSample: text.substring(0, 200) + (text.length > 200 ? '...' : ''),
            paradoxAnalysis,
            quantumAnalysis,
            suggestions,
            platform: this.currentPlatform,
            timestamp: Date.now()
        };
    }

    analyzeParadoxes(text) {
        const paradoxPatterns = {
            passiveAggressive: {
                patterns: [
                    /not angry but/gi,
                    /as you wish/gi,
                    /whatever you think/gi,
                    /no problem/gi,
                    /fine whatever/gi,
                    /if you want to/gi
                ],
                risk: 'high',
                description: 'Hidden disagreement masked as agreement'
            },
            ambiguity: {
                patterns: [
                    /maybe/gi,
                    /perhaps/gi,
                    /if you have time/gi,
                    /sometime/gi,
                    /when you get a chance/gi,
                    /not sure but/gi,
                    /possibly/gi
                ],
                risk: 'medium',
                description: 'Unclear priorities creating confusion'
            },
            sarcasm: {
                patterns: [
                    /great another/gi,
                    /perfect timing/gi,
                    /love that/gi,
                    /wonderful/gi,
                    /fantastic/gi,
                    /just what i needed/gi
                ],
                risk: 'high',
                description: 'Sarcastic tone masking frustration'
            },
            contradiction: {
                patterns: [
                    /no offense but/gi,
                    /don't take this wrong but/gi,
                    /with all due respect/gi,
                    /i'm not saying but/gi,
                    /this might sound harsh but/gi
                ],
                risk: 'medium',
                description: 'Contradictory messaging creating tension'
            }
        };

        const detectedParadoxes = [];
        let riskScore = 0;

        Object.entries(paradoxPatterns).forEach(([type, config]) => {
            config.patterns.forEach(pattern => {
                if (pattern.test(text)) {
                    detectedParadoxes.push({
                        type: type,
                        pattern: pattern.source,
                        risk: config.risk,
                        description: config.description,
                        examples: this.findPatternExamples(text, pattern)
                    });
                    riskScore += config.risk === 'high' ? 25 : 15;
                }
            });
        });

        return {
            paradoxes: detectedParadoxes,
            riskScore: Math.min(riskScore, 100),
            clarity: detectedParadoxes.length === 0 ? 0.9 : 0.3,
            totalPatterns: detectedParadoxes.length
        };
    }

    findPatternExamples(text, pattern) {
        const matches = text.match(pattern);
        return matches ? matches.slice(0, 3) : [];
    }

    analyzeQuantumSuperposition(text) {
        const meanings = this.extractPossibleMeanings(text);
        
        return {
            surfaceState: {
                amplitude: 1.0,
                phase: 0,
                observable: text.substring(0, 100)
            },
            hiddenState: {
                amplitude: meanings.length > 1 ? 0.8 : 0.2,
                phase: Math.PI / 2,
                hiddenObservables: meanings
            },
            intentState: {
                entanglement: this.calculateEntanglement(text),
                expressedIntent: this.getExpressedIntent(text),
                actualIntent: this.getActualIntent(text),
                alignment: this.calculateIntentAlignment(text)
            },
            emotionalSpin: this.measureEmotionalSpin(text),
            coherence: this.calculateQuantumCoherence(meanings, text)
        };
    }

    extractPossibleMeanings(text) {
        const meanings = [];
        const lowerText = text.toLowerCase();

        // Uncertainty detection
        if (lowerText.includes('maybe') || lowerText.includes('perhaps')) {
            meanings.push({
                type: 'uncertainty',
                probability: 0.7,
                description: 'Expresses uncertainty or hesitation',
                impact: 'Delayed decisions, confusion'
            });
        }

        // Hidden emotion detection
        if (lowerText.includes('not angry but') || lowerText.includes('no offense but')) {
            meanings.push({
                type: 'hidden_emotion',
                probability: 0.8,
                description: 'Hides true emotional state',
                impact: 'Passive-aggressive dynamics'
            });
        }

        // Sarcasm detection
        if (lowerText.includes('great another') || lowerText.includes('perfect timing')) {
            meanings.push({
                type: 'sarcasm',
                probability: 0.9,
                description: 'Uses sarcasm to express frustration',
                impact: 'Team morale issues'
            });
        }

        // Urgency masking
        if (lowerText.includes('if you have time') || lowerText.includes('when convenient')) {
            meanings.push({
                type: 'masked_urgency',
                probability: 0.6,
                description: 'Hides urgent needs behind casual language',
                impact: 'Missed deadlines, priority confusion'
            });
        }

        return meanings.length > 0 ? meanings : [{
            type: 'clear',
            probability: 0.9,
            description: 'Direct and unambiguous communication',
            impact: 'Efficient collaboration'
        }];
    }

    calculateEntanglement(text) {
        let entanglement = 0;
        
        // Context dependencies
        if (text.includes('this') || text.includes('that')) entanglement += 0.2;
        if (text.includes('as mentioned') || text.includes('previously')) entanglement += 0.3;
        
        // Conditional complexity
        if (text.includes('if') || text.includes('when')) entanglement += 0.2;
        if (text.includes('but') || text.includes('however')) entanglement += 0.3;
        
        return Math.min(entanglement, 1);
    }

    getExpressedIntent(text) {
        if (text.includes('?')) return 'Seeking information or confirmation';
        if (text.includes('!')) return 'Expressing strong emotion or urgency';
        if (text.toLowerCase().includes('please')) return 'Making a polite request';
        return 'Sharing information or making a statement';
    }

    getActualIntent(text) {
        const lowerText = text.toLowerCase();
        
        if (lowerText.includes('not angry but')) return 'Expressing frustration indirectly';
        if (lowerText.includes('maybe') && lowerText.includes('time')) return 'Uncertain request with hidden urgency';
        if (lowerText.includes('great another')) return 'Expressing frustration sarcastically';
        if (lowerText.includes('as you wish')) return 'Showing disagreement through false agreement';
        
        return 'Direct and clear communication intent';
    }

    calculateIntentAlignment(text) {
        const expressed = this.getExpressedIntent(text);
        const actual = this.getActualIntent(text);
        
        return expressed === actual ? 0.9 : 0.4;
    }

    measureEmotionalSpin(text) {
        let positive = (text.match(/great|good|excellent|perfect|love|wonderful/gi) || []).length;
        let negative = (text.match(/angry|bad|wrong|problem|issue|concern/gi) || []).length;
        let neutral = (text.match(/maybe|perhaps|possibly|consider/gi) || []).length;
        
        const total = positive + negative + neutral || 1;
        
        return {
            spin: positive > negative ? '↑' : negative > positive ? '↓' : '→',
            magnitude: Math.abs(positive - negative) / total,
            positive: positive / total,
            negative: negative / total,
            neutral: neutral / total
        };
    }

    calculateQuantumCoherence(meanings, text) {
        if (meanings.length === 1 && meanings[0].type === 'clear') {
            return { coherence: 0.9, decoherenceRisk: 0.1, state: 'coherent' };
        }
        
        const ambiguity = meanings.length > 1 ? 0.7 : 0.2;
        const contradiction = text.includes('but') && text.includes('not') ? 0.6 : 0.2;
        const clarity = text.length > 50 ? 0.4 : 0.8;
        
        const coherence = (1 - ambiguity) * 0.4 + (1 - contradiction) * 0.4 + clarity * 0.2;
        
        return {
            coherence: Math.max(0.1, Math.min(1, coherence)),
            decoherenceRisk: 1 - coherence,
            state: coherence > 0.7 ? 'coherent' : coherence > 0.4 ? 'partially_coherent' : 'decoherent'
        };
    }

    generateSuggestions(paradoxes) {
        const suggestions = [];
        
        paradoxes.forEach(paradox => {
            switch(paradox.type) {
                case 'passiveAggressive':
                    suggestions.push({
                        type: 'direct_communication',
                        priority: 'high',
                        message: 'Express concerns directly while maintaining professionalism',
                        example: 'Instead of "As you wish," try "I have some concerns about this approach. Can we discuss alternatives?"',
                        impact: 'Reduces team tension and misalignment'
                    });
                    break;
                    
                case 'ambiguity':
                    suggestions.push({
                        type: 'clarity',
                        priority: 'medium',
                        message: 'Provide clear timelines and priorities',
                        example: 'Instead of "When you have time," try "Please review this by EOD Tuesday as it\'s priority for the Q4 rollout."',
                        impact: 'Prevents missed deadlines and confusion'
                    });
                    break;
                    
                case 'sarcasm':
                    suggestions.push({
                        type: 'constructive_feedback',
                        priority: 'high',
                        message: 'Address issues directly without sarcasm',
                        example: 'Instead of "Great, another change," try "This change will impact our timeline. Let\'s discuss how to accommodate it effectively."',
                        impact: 'Maintains positive team dynamics'
                    });
                    break;
                    
                case 'contradiction':
                    suggestions.push({
                        type: 'alignment',
                        priority: 'medium',
                        message: 'Align your message with your true intent',
                        example: 'Instead of "No offense, but..." try "I have a different perspective on this. Here\'s what I\'m thinking..."',
                        impact: 'Builds trust and clear communication'
                    });
                    break;
            }
        });

        // Add general suggestion if no specific paradoxes found
        if (suggestions.length === 0) {
            suggestions.push({
                type: 'clarity_maintenance',
                priority: 'low',
                message: 'Your communication is clear and effective',
                example: 'Continue using direct, specific language in your messages',
                impact: 'Maintains efficient team collaboration'
            });
        }

        return suggestions;
    }

    quickAnalyzeText(text) {
        const paradoxAnalysis = this.analyzeParadoxes(text);
        const suggestions = this.generateSuggestions(paradoxAnalysis.paradoxes);
        
        return {
            text: text,
            paradoxAnalysis,
            suggestions,
            timestamp: Date.now()
        };
    }

    // UI Management Methods
    injectAnalysisUI() {
        // Remove existing UI if present
        this.removeExistingUI();
        
        // Create main analysis container
        const analysisContainer = document.createElement('div');
        analysisContainer.id = 'chalamandra-analysis-container';
        analysisContainer.innerHTML = this.getAnalysisUIHTML();
        
        document.body.appendChild(analysisContainer);
        
        // Add event listeners
        this.setupUIEventListeners();
    }

    getAnalysisUIHTML() {
        return `
            <div id="chalamandra-floating-panel" class="chalamandra-panel hidden">
                <div class="chalamandra-header">
                    <div class="chalamandra-logo">🦎⚛️</div>
                    <h3>Quantum Paradox Analysis</h3>
                    <button id="chalamandra-close" class="chalamandra-close">×</button>
                </div>
                <div class="chalamandra-content">
                    <div id="chalamandra-analysis-result"></div>
                    <div id="chalamandra-suggestions"></div>
                </div>
            </div>
            
            <div id="chalamandra-loading" class="chalamandra-loading hidden">
                <div class="quantum-spinner">⚛️</div>
                <p>Analyzing Quantum Paradoxes...</p>
            </div>
            
            <div id="chalamandra-quick-analysis" class="chalamandra-quick-analysis hidden">
                <div class="quick-result"></div>
            </div>
        `;
    }

    setupUIEventListeners() {
        // Close button
        const closeBtn = document.getElementById('chalamandra-close');
        if (closeBtn) {
            closeBtn.addEventListener('click', () => {
                this.hideAnalysisUI();
            });
        }

        // Click outside to close
        document.addEventListener('click', (e) => {
            const panel = document.getElementById('chalamandra-floating-panel');
            if (panel && !panel.contains(e.target) && !e.target.closest('.chalamandra-trigger')) {
                this.hideAnalysisUI();
            }
        });
    }

    showLoadingState() {
        const loading = document.getElementById('chalamandra-loading');
        if (loading) {
            loading.classList.remove('hidden');
        }
    }

    hideLoadingState() {
        const loading = document.getElementById('chalamandra-loading');
        if (loading) {
            loading.classList.add('hidden');
        }
    }

    showAnalysisUI(analysis) {
        const panel = document.getElementById('chalamandra-floating-panel');
        const analysisResult = document.getElementById('chalamandra-analysis-result');
        const suggestions = document.getElementById('chalamandra-suggestions');
        
        if (panel && analysisResult && suggestions) {
            analysisResult.innerHTML = this.formatAnalysisResult(analysis);
            suggestions.innerHTML = this.formatSuggestions(analysis.suggestions);
            panel.classList.remove('hidden');
            
            // Position near mouse or center
            this.positionAnalysisPanel(panel);
        }
    }

    hideAnalysisUI() {
        const panel = document.getElementById('chalamandra-floating-panel');
        if (panel) {
            panel.classList.add('hidden');
        }
    }

    showFloatingAnalysis(analysis, originalText) {
        const quickAnalysis = document.getElementById('chalamandra-quick-analysis');
        if (quickAnalysis) {
            const quickResult = quickAnalysis.querySelector('.quick-result');
            quickResult.innerHTML = this.formatQuickAnalysis(analysis, originalText);
            quickAnalysis.classList.remove('hidden');
            
            // Auto-hide after 5 seconds
            setTimeout(() => {
                quickAnalysis.classList.add('hidden');
            }, 5000);
        }
    }

    showErrorState(error) {
        const panel = document.getElementById('chalamandra-floating-panel');
        const analysisResult = document.getElementById('chalamandra-analysis-result');
        
        if (panel && analysisResult) {
            analysisResult.innerHTML = `
                <div class="chalamandra-error">
                    <h4>❌ Analysis Error</h4>
                    <p>${error}</p>
                    <p>Please try refreshing the page or check the console for details.</p>
                </div>
            `;
            panel.classList.remove('hidden');
        }
    }

    positionAnalysisPanel(panel) {
        // Position in viewport center
        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;
        const panelWidth = 400;
        const panelHeight = 500;
        
        panel.style.left = `${(viewportWidth - panelWidth) / 2}px`;
        panel.style.top = `${(viewportHeight - panelHeight) / 2}px`;
    }

    formatAnalysisResult(analysis) {
        const { paradoxAnalysis, quantumAnalysis } = analysis;
        
        return `
            <div class="analysis-section">
                <h4>🔍 Paradox Analysis</h4>
                <div class="risk-score ${this.getRiskClass(paradoxAnalysis.riskScore)}">
                    Risk Score: ${paradoxAnalysis.riskScore}%
                </div>
                ${paradoxAnalysis.paradoxes.length > 0 ? 
                    paradoxAnalysis.paradoxes.map(paradox => `
                        <div class="paradox-item ${paradox.risk}">
                            <strong>${this.formatParadoxType(paradox.type)}</strong>
                            <p>${paradox.description}</p>
                            <small>Risk: ${paradox.risk.toUpperCase()}</small>
                        </div>
                    `).join('') :
                    '<div class="paradox-item clear">✅ No paradoxical patterns detected</div>'
                }
            </div>
            
            <div class="analysis-section">
                <h4>⚛️ Quantum States</h4>
                <div class="quantum-states">
                    <div class="quantum-state">
                        <span class="state-label">Coherence:</span>
                        <span class="state-value ${quantumAnalysis.coherence.state}">
                            ${(quantumAnalysis.coherence.coherence * 100).toFixed(0)}%
                        </span>
                    </div>
                    <div class="quantum-state">
                        <span class="state-label">Emotional Spin:</span>
                        <span class="state-value">${quantumAnalysis.emotionalSpin.spin}</span>
                    </div>
                </div>
            </div>
        `;
    }

    formatSuggestions(suggestions) {
        return `
            <div class="suggestions-section">
                <h4>🎯 Suggestions</h4>
                ${suggestions.map(suggestion => `
                    <div class="suggestion-item ${suggestion.priority}">
                        <div class="suggestion-priority">${suggestion.priority.toUpperCase()}</div>
                        <p><strong>${suggestion.message}</strong></p>
                        <div class="suggestion-example">
                            <em>Example:</em> ${suggestion.example}
                        </div>
                        <div class="suggestion-impact">
                            <small>Impact: ${suggestion.impact}</small>
                        </div>
                    </div>
                `).join('')}
            </div>
        `;
    }

    formatQuickAnalysis(analysis, originalText) {
        return `
            <div class="quick-analysis">
                <div class="quick-header">
                    <strong>Chalamandra Quick Analysis</strong>
                </div>
                <div class="quick-original">
                    "${originalText.substring(0, 100)}${originalText.length > 100 ? '...' : ''}"
                </div>
                <div class="quick-risk ${this.getRiskClass(analysis.paradoxAnalysis.riskScore)}">
                    Risk: ${analysis.paradoxAnalysis.riskScore}%
                </div>
                <div class="quick-suggestion">
                    ${analysis.suggestions[0]?.message || 'Clear communication detected'}
                </div>
            </div>
        `;
    }

    getRiskClass(riskScore) {
        if (riskScore >= 70) return 'high';
        if (riskScore >= 40) return 'medium';
        return 'low';
    }

    formatParadoxType(type) {
        const types = {
            passiveAggressive: '🔄 Passive-Aggressive',
            ambiguity: '🎭 Ambiguity',
            sarcasm: '⚡ Sarcasm',
            contradiction: '🎪 Contradiction'
        };
        return types[type] || type;
    }

    removeExistingUI() {
        const existingContainer = document.getElementById('chalamandra-analysis-container');
        if (existingContainer) {
            existingContainer.remove();
        }
    }

    setupRealTimeAnalysis() {
        // Setup mutation observer for real-time analysis
        if (this.currentPlatform === 'gmail' || this.currentPlatform === 'slack') {
            this.setupMutationObserver();
        }
    }

    setupMutationObserver() {
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.type === 'childList' || mutation.type === 'characterData') {
                    // Check if this is a relevant text change
                    if (this.isRelevantTextChange(mutation)) {
                        this.scheduleRealTimeAnalysis();
                    }
                }
            });
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true,
            characterData: true
        });
    }

    isRelevantTextChange(mutation) {
        // Implement platform-specific logic to determine if this is a text input change
        return true; // Simplified for demo
    }

    scheduleRealTimeAnalysis() {
        // Debounce real-time analysis
        if (this.analysisTimeout) {
            clearTimeout(this.analysisTimeout);
        }
        
        this.analysisTimeout = setTimeout(() => {
            const text = this.extractPageText();
            if (text && text.length > 10) {
                const analysis = this.quickAnalyzeText(text);
                this.showFloatingAnalysis(analysis, text);
            }
        }, 1000);
    }

    generateEmptyAnalysis() {
        return {
            textSample: 'No sufficient text found for analysis',
            paradoxAnalysis: {
                paradoxes: [],
                riskScore: 0,
                clarity: 1.0,
                totalPatterns: 0
            },
            quantumAnalysis: {
                surfaceState: { amplitude: 0, observable: '' },
                hiddenState: { amplitude: 0, hiddenObservables: [] },
                intentState: { entanglement: 0, expressedIntent: '', actualIntent: '', alignment: 0 },
                emotionalSpin: { spin: '→', magnitude: 0 },
                coherence: { coherence: 0, decoherenceRisk: 1, state: 'unknown' }
            },
            suggestions: [{
                type: 'no_content',
                priority: 'low',
                message: 'No text content found to analyze',
                example: 'Try composing a message or selecting text to analyze',
                impact: 'No analysis performed'
            }],
            platform: this.currentPlatform,
            timestamp: Date.now()
        };
    }
}

// Initialize the content analyzer
const contentAnalyzer = new ContentAnalyzer();

// Export for testing
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { ContentAnalyzer };
          }

// Chrome Challenge 2025 - Content Script for Real-time Analysis
class ChalamandraContent {
    constructor() {
        this.initializeAnalysis();
        this.setupRitualIntegration();
        this.injectRitualPrompts();
    }

    initializeAnalysis() {
        console.log('🔮 Chalamandra Content Script Active - Chrome Challenge 2025');
        
        // Analyze current communication context
        this.analyzePageContent();
        
        // Setup mutation observer for dynamic content
        this.setupContentObserver();
    }

    analyzePageContent() {
        const context = this.detectCommunicationContext();
        const analysis = this.performRealTimeAnalysis(context);
        
        // Send analysis to popup
        chrome.runtime.sendMessage({
            action: 'contentAnalysis',
            data: analysis,
            context: context
        });

        return analysis;
    }

    detectCommunicationContext() {
        const url = window.location.href;
        let platform = 'general';
        let communicationType = 'written';

        if (url.includes('mail.google.com')) {
            platform = 'gmail';
            communicationType = this.detectGmailContext();
        } else if (url.includes('slack.com')) {
            platform = 'slack';
            communicationType = this.detectSlackContext();
        } else if (url.includes('teams.microsoft.com')) {
            platform = 'teams';
            communicationType = 'team-chat';
        }

        return {
            platform,
            communicationType,
            emotionalTone: this.estimateEmotionalTone(),
            complexityLevel: this.assessComplexity(),
            urgency: this.detectUrgency(),
            timestamp: Date.now()
        };
    }

    detectGmailContext() {
        if (window.location.hash.includes('compose')) {
            return 'email-composition';
        } else if (window.location.hash.includes('inbox')) {
            return 'email-reading';
        }
        return 'email-general';
    }

    detectSlackContext() {
        if (document.querySelector('[data-qa="message_input]')) {
            return 'message-composition';
        }
        return 'message-reading';
    }

    estimateEmotionalTone() {
        // Simple sentiment analysis based on text content
        const text = this.extractRelevantText();
        const positiveWords = ['great', 'good', 'excellent', 'happy', 'thanks', 'please', 'welcome'];
        const negativeWords = ['urgent', 'problem', 'issue', 'sorry', 'bad', 'wrong', 'failed'];
        
        let positiveCount = 0;
        let negativeCount = 0;
        
        positiveWords.forEach(word => {
            const regex = new RegExp(word, 'gi');
            positiveCount += (text.match(regex) || []).length;
        });
        
        negativeWords.forEach(word => {
            const regex = new RegExp(word, 'gi');
            negativeCount += (text.match(regex) || []).length;
        });
        
        const total = positiveCount + negativeCount;
        if (total === 0) return 0.5;
        
        return positiveCount / total;
    }

    assessComplexity() {
        const text = this.extractRelevantText();
        const sentences = text.split(/[.!?]+/).filter(s => s.length > 0);
        const words = text.split(/\s+/).filter(w => w.length > 0);
        
        if (sentences.length === 0 || words.length === 0) return 0.3;
        
        const avgSentenceLength = words.length / sentences.length;
        const longWords = words.filter(word => word.length > 6).length;
        const complexity = (avgSentenceLength / 20) + (longWords / words.length);
        
        return Math.min(complexity, 1);
    }

    detectUrgency() {
        const text = this.extractRelevantText().toLowerCase();
        const urgentIndicators = ['asap', 'urgent', 'immediately', 'emergency', 'important'];
        
        for (const indicator of urgentIndicators) {
            if (text.includes(indicator)) {
                return true;
            }
        }
        return false;
    }

    extractRelevantText() {
        // Extract text from common communication elements
        const selectors = [
            '[aria-label="Message Body"]',
            '.Am.Al.editable',
            '[data-qa="message_input"]',
            '.ql-editor',
            'textarea',
            '[contenteditable="true"]'
        ];
        
        for (const selector of selectors) {
            const element = document.querySelector(selector);
            if (element && element.textContent.trim()) {
                return element.textContent;
            }
        }
        
        // Fallback to body text
        return document.body.innerText || '';
    }

    performRealTimeAnalysis(context) {
        const textContent = this.extractRelevantText();
        
        return {
            sentiment: this.estimateEmotionalTone(),
            clarityScore: 1 - this.assessComplexity(), // Inverse of complexity
            riskFactors: this.identifyRiskFactors(textContent),
            suggestedRituals: this.recommendRituals(context),
            improvementTips: this.generateTips(textContent),
            wordCount: textContent.split(/\s+/).length
        };
    }

    identifyRiskFactors(text) {
        const risks = [];
        const lowerText = text.toLowerCase();
        
        if (lowerText.includes('urgent') || lowerText.includes('asap')) {
            risks.push('High urgency detected');
        }
        
        if (lowerText.includes('sorry') || lowerText.includes('apologize')) {
            risks.push('Apologetic tone may indicate issues');
        }
        
        if (text.length > 500) {
            risks.push('Long message may reduce clarity');
        }
        
        const questions = (text.match(/\?/g) || []).length;
        if (questions > 3) {
            risks.push('Multiple questions may overwhelm recipient');
        }
        
        return risks;
    }

    recommendRituals(context) {
        const recommendations = [];
        
        if (context.emotionalTone < 0.3) {
            recommendations.push({
                ritual: 'Enki Whisper',
                reason: 'Low emotional tone detected',
                seedWord: 'energy',
                urgency: 'high'
            });
        }

        if (context.emotionalTone > 0.7) {
            recommendations.push({
                ritual: 'Enki Whisper', 
                reason: 'High emotional intensity detected',
                seedWord: 'calm',
                urgency: 'high'
            });
        }

        if (context.complexityLevel > 0.7) {
            recommendations.push({
                ritual: 'Ziggurat Breath',
                reason: 'Complex communication requires mental clarity',
                duration: '3 minutes',
                urgency: 'medium'
            });
        }

        if (context.urgency) {
            recommendations.push({
                ritual: 'Maat Mirror',
                reason: 'Urgent situation requires centered perspective',
                duration: '30 seconds',
                urgency: 'high'
            });
        }

        return recommendations;
    }

    generateTips(text) {
        const tips = [];
        
        if (text.length > 300) {
            tips.push('Consider breaking this into shorter messages for better comprehension');
        }
        
        const questions = (text.match(/\?/g) || []).length;
        if (questions === 0 && text.length > 50) {
            tips.push('Adding a clear question can improve response rates');
        }
        
        if (text.includes('I') && !text.includes('you')) {
            tips.push('Balance "I" statements with "you" perspectives for better connection');
        }
        
        return tips;
    }

    setupRitualIntegration() {
        // Listen for ritual triggers from popup
        chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
            if (request.action === 'triggerRitual') {
                this.executeRitual(request.ritual, request.config);
            }
            if (request.action === 'analyzeCurrentContent') {
                const analysis = this.analyzePageContent();
                sendResponse({ success: true, analysis });
            }
        });
    }

    injectRitualPrompts() {
        // Add subtle ritual prompts to the page
        const promptHTML = `
            <div id="chalamandra-ritual-prompt" style="
                position: fixed;
                top: 20px;
                right: 20px;
                background: linear-gradient(135deg, #667eea, #764ba2);
                color: white;
                padding: 12px 16px;
                border-radius: 8px;
                box-shadow: 0 4px 12px rgba(0,0,0,0.15);
                z-index: 10000;
                font-family: -apple-system, BlinkMacSystemFont, sans-serif;
                font-size: 14px;
                display: none;
                cursor: pointer;
                max-width: 300px;
                border: 1px solid rgba(255,255,255,0.2);
            ">
                <div style="display: flex; align-items: center; justify-content: space-between;">
                    <span id="ritual-message" style="flex: 1; margin-right: 8px;"></span>
                    <button id="execute-ritual" style="
                        background: rgba(255,255,255,0.2);
                        border: none;
                        color: white;
                        padding: 6px 12px;
                        border-radius: 4px;
                        cursor: pointer;
                        font-size: 12px;
                        white-space: nowrap;
                    ">Try Ritual</button>
                </div>
            </div>
        `;

        if (!document.getElementById('chalamandra-ritual-prompt')) {
            document.body.insertAdjacentHTML('beforeend', promptHTML);
            
            // Add event listener for the ritual button
            document.getElementById('execute-ritual')?.addEventListener('click', () => {
                this.executeDemoRitual();
            });
        }
    }

    showRitualPrompt(ritual) {
        const prompt = document.getElementById('chalamandra-ritual-prompt');
        const message = document.getElementById('ritual-message');
        
        if (prompt && message) {
            message.textContent = `Need ${ritual.seedWord}? Try ${ritual.ritual}`;
            prompt.style.display = 'block';

            // Store current ritual for execution
            prompt.currentRitual = ritual;

            // Auto-hide after 10 seconds
            setTimeout(() => {
                if (prompt.style.display === 'block') {
                    prompt.style.display = 'none';
                }
            }, 10000);
        }
    }

    executeDemoRitual() {
        const prompt = document.getElementById('chalamandra-ritual-prompt');
        if (prompt.currentRitual) {
            this.executeRitual(prompt.currentRitual);
            prompt.style.display = 'none';
            
            // Show ritual execution effect
            this.showRitualEffect(prompt.currentRitual);
        }
    }

    executeRitual(ritual, config = {}) {
        console.log(`🧠 Executing ritual: ${ritual.ritual}`, ritual);
        
        // Visual feedback for ritual execution
        this.showRitualEffect(ritual);
        
        // Send message to background about ritual usage
        chrome.runtime.sendMessage({
            action: 'ritualExecuted',
            ritual: ritual,
            context: this.detectCommunicationContext(),
            timestamp: Date.now()
        });
    }

    showRitualEffect(ritual) {
        // Create a subtle visual effect for ritual execution
        const effect = document.createElement('div');
        effect.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: radial-gradient(circle, rgba(99,102,241,0.1) 0%, transparent 70%);
            pointer-events: none;
            z-index: 9999;
            animation: ritualPulse 2s ease-out;
        `;
        
        const style = document.createElement('style');
        style.textContent = `
            @keyframes ritualPulse {
                0% { opacity: 0; transform: scale(0.8); }
                50% { opacity: 0.3; transform: scale(1); }
                100% { opacity: 0; transform: scale(1.2); }
            }
        `;
        
        document.head.appendChild(style);
        document.body.appendChild(effect);
        
        setTimeout(() => {
            if (effect.parentNode) {
                effect.parentNode.removeChild(effect);
            }
            if (style.parentNode) {
                style.parentNode.removeChild(style);
            }
        }, 2000);
    }

    setupContentObserver() {
        // Observe DOM changes for dynamic content (like Gmail's dynamic interface)
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.type === 'childList') {
                    mutation.addedNodes.forEach((node) => {
                        if (node.nodeType === 1) { // Element node
                            this.checkForCommunicationElements(node);
                        }
                    });
                }
            });
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }

    checkForCommunicationElements(element) {
        // Check if new communication elements were added
        const communicationSelectors = [
            '[aria-label="Message Body"]',
            '.Am.Al.editable', // Gmail compose
            '[data-qa="message_input"]', // Slack
            '[role="textbox"]', // Teams
            '.ql-editor' // Rich text editors
        ];

        communicationSelectors.forEach(selector => {
            const elements = element.querySelectorAll?.(selector) || [];
            elements.forEach(el => {
                if (el.textContent.trim()) {
                    this.analyzeNewContent(el);
                }
            });
        });
    }

    analyzeNewContent(element) {
        const context = this.detectCommunicationContext();
        const analysis = this.performRealTimeAnalysis(context);
        
        // Show ritual prompt if recommended
        if (analysis.suggestedRituals.length > 0) {
            const urgentRitual = analysis.suggestedRituals.find(r => r.urgency === 'high');
            if (urgentRitual) {
                setTimeout(() => {
                    this.showRitualPrompt(urgentRitual);
                }, 1000);
            }
        }
    }
}

// Initialize content script
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        new ChalamandraContent();
    });
} else {
    new ChalamandraContent();
  }

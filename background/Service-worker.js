// Service Worker for Chalamandra QuantumMind with Chrome AI APIs
// Chrome AI Hackathon 2025 Submission

console.log('🦎 Chalamandra QuantumMind Service Worker initialized');

class ChromeAIIntegration {
    constructor() {
        this.apisAvailable = {
            proofreader: false,
            prompt: false,
            rewriter: false,
            gemini: false
        };
        this.checkAPIAvailability();
    }

    async checkAPIAvailability() {
        try {
            // Check Proofreader API
            if (chrome.ai?.proofreader) {
                this.apisAvailable.proofreader = true;
            }
            
            // Check Prompt API
            if (chrome.ai?.prompt) {
                this.apisAvailable.prompt = true;
            }
            
            // Check Rewriter API
            if (chrome.ai?.rewriter) {
                this.apisAvailable.rewriter = true;
            }
            
            // Check Gemini Nano availability
            this.apisAvailable.gemini = await this.checkGeminiNano();
            
            console.log('🔍 Chrome AI APIs Status:', this.apisAvailable);
        } catch (error) {
            console.warn('API availability check failed:', error);
        }
    }

    async checkGeminiNano() {
        // Simplified check for Gemini Nano
        // In production, this would use actual Gemini Nano API checks
        return typeof google !== 'undefined' && google.gemini;
    }

    async analyzeWithProofreader(text) {
        if (!this.apisAvailable.proofreader) {
            throw new Error('Proofreader API not available');
        }

        try {
            const result = await chrome.ai.proofreader.analyze({
                text: text,
                options: {
                    grammar: true,
                    clarity: true,
                    suggestions: true
                }
            });

            return {
                source: 'proofreader_api',
                grammarIssues: result.corrections?.length || 0,
                clarityScore: this.calculateClarityScore(result),
                suggestions: result.corrections || [],
                confidence: result.confidence || 0.8
            };
        } catch (error) {
            console.warn('Proofreader API error:', error);
            throw error;
        }
    }

    async analyzeWithPromptAPI(text, context = {}) {
        if (!this.apisAvailable.prompt) {
            throw new Error('Prompt API not available');
        }

        const paradoxPrompt = `
            Analyze this message for communication paradoxes and hidden meanings:
            "${text}"
            
            Context: ${JSON.stringify(context)}
            
            Detect these patterns:
            - Passive-aggressive language (e.g., "I'm not angry, but...")
            - Ambiguous priorities (e.g., "if you have time...")
            - Sarcastic tones (e.g., "Great, another change...")
            - Contradictory statements (e.g., "No offense, but...")
            - Hidden expectations and unspoken meanings
            
            Return analysis in JSON format with:
            - detectedParadoxes: array of paradox types
            - confidence: confidence score 0-1
            - riskLevel: low/medium/high
            - hiddenMeanings: array of inferred intents
            - examples: specific phrases detected
        `;

        try {
            const response = await chrome.ai.prompt.send({
                prompt: paradoxPrompt,
                options: {
                    format: 'json',
                    maxTokens: 1000
                }
            });

            return {
                source: 'prompt_api',
                ...JSON.parse(response.text),
                rawResponse: response
            };
        } catch (error) {
            console.warn('Prompt API error:', error);
            throw error;
        }
    }

    async rewriteWithRewriterAPI(originalText, analysis) {
        if (!this.apisAvailable.rewriter) {
            throw new Error('Rewriter API not available');
        }

        const rewriteContext = `
            Original message with communication issues: "${originalText}"
            
            Detected problems: ${JSON.stringify(analysis.detectedParadoxes || [])}
            
            Generate 3 clear, professional alternatives that:
            1. Maintain the original intent but remove paradoxes
            2. Use direct, unambiguous language
            3. Are constructive and professional
            4. Specify clear expectations and timelines if needed
        `;

        try {
            const result = await chrome.ai.rewriter.rewrite({
                text: rewriteContext,
                options: {
                    style: 'professional',
                    tone: 'constructive',
                    clarity: 'high',
                    format: 'structured'
                }
            });

            return {
                source: 'rewriter_api',
                original: originalText,
                alternatives: this.parseRewriteAlternatives(result.rewritten),
                improvements: result.improvements || []
            };
        } catch (error) {
            console.warn('Rewriter API error:', error);
            throw error;
        }
    }

    calculateClarityScore(proofreaderResult) {
        const issues = proofreaderResult.corrections?.length || 0;
        const textLength = proofreaderResult.text?.length || 1;
        const clarity = Math.max(0, 1 - (issues / textLength * 10));
        return Math.min(1, clarity);
    }

    parseRewriteAlternatives(rewrittenText) {
        // Parse the rewritten text into structured alternatives
        // This is a simplified parser - would be more sophisticated in production
        const alternatives = rewrittenText.split('\n\n').filter(alt => alt.trim().length > 0);
        return alternatives.slice(0, 3).map((alt, index) => ({
            id: index + 1,
            text: alt.replace(/^\d+\.\s*/, '').trim(),
            clarity: 0.9 - (index * 0.1) // Simulated clarity scoring
        }));
    }

    async fallbackToGeminiNano(text, context) {
        if (!this.apisAvailable.gemini) {
            return this.localFallbackAnalysis(text, context);
        }

        try {
            // This would use actual Gemini Nano API in production
            const analysis = await this.simulatedGeminiAnalysis(text);
            return {
                source: 'gemini_nano',
                ...analysis,
                processedLocally: true
            };
        } catch (error) {
            console.warn('Gemini Nano fallback failed:', error);
            return this.localFallbackAnalysis(text, context);
        }
    }

    async simulatedGeminiAnalysis(text) {
        // Simulated Gemini Nano analysis
        // In production, this would use actual Gemini Nano API calls
        return {
            detectedParadoxes: this.localParadoxDetection(text),
            confidence: 0.85,
            riskLevel: 'medium',
            hiddenMeanings: ['Simulated analysis for demo purposes'],
            alternatives: [
                "This is a simulated clear alternative using local processing.",
                "Another example of clear communication generated locally.",
                "Direct and unambiguous version of the original message."
            ]
        };
    }

    localParadoxDetection(text) {
        const patterns = {
            passiveAggressive: /not angry but|as you wish|whatever you think|no problem/gi,
            ambiguity: /maybe|perhaps|if you have time|sometime|when you get a chance/gi,
            sarcasm: /great another|perfect timing|love that|wonderful/gi,
            contradiction: /no offense but|don't take this wrong|with all due respect/gi
        };

        const detected = [];
        for (const [type, pattern] of Object.entries(patterns)) {
            if (pattern.test(text)) {
                detected.push(type);
            }
        }
        return detected;
    }

    localFallbackAnalysis(text, context) {
        return {
            source: 'local_fallback',
            detectedParadoxes: this.localParadoxDetection(text),
            confidence: 0.7,
            riskLevel: 'medium',
            hiddenMeanings: ['Analysis performed locally without AI APIs'],
            alternatives: [
                "Consider rephrasing for clearer communication.",
                "Be more direct about your needs and expectations.",
                "Use specific timelines and clear priorities."
            ],
            processedLocally: true
        };
    }
}

class QuantumStateManager {
    constructor() {
        this.chromeAI = new ChromeAIIntegration();
        this.states = new Map();
        this.initializeMessageHandlers();
    }

    initializeMessageHandlers() {
        chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
            switch (request.action) {
                case 'analyzeWithChromeAI':
                    this.handleChromeAIAnalysis(request, sender, sendResponse);
                    return true;
                
                case 'getAPIAvailability':
                    sendResponse({ available: this.chromeAI.apisAvailable });
                    return true;
                
                case 'performQuantumAnalysis':
                    this.handleQuantumAnalysis(request, sender, sendResponse);
                    return true;
                
                default:
                    console.log('Unknown message action:', request.action);
            }
        });
    }

    async handleChromeAIAnalysis(request, sender, sendResponse) {
        try {
            const { text, context } = request;
            
            console.log('🔄 Starting Chrome AI API analysis...');
            
            // Execute API calls in parallel for performance
            const [proofreaderResult, promptResult, rewriterResult] = await Promise.allSettled([
                this.chromeAI.analyzeWithProofreader(text).catch(e => ({ error: e.message })),
                this.chromeAI.analyzeWithPromptAPI(text, context).catch(e => ({ error: e.message })),
                this.chromeAI.rewriteWithRewriterAPI(text, {}).catch(e => ({ error: e.message }))
            ]);

            // Process results
            const analysis = {
                proofreader: proofreaderResult.status === 'fulfilled' ? proofreaderResult.value : null,
                prompt: promptResult.status === 'fulfilled' ? promptResult.value : null,
                rewriter: rewriterResult.status === 'fulfilled' ? rewriterResult.value : null,
                apiErrors: this.countAPIErrors([proofreaderResult, promptResult, rewriterResult])
            };

            // If all APIs failed, use fallback
            if (analysis.apiErrors === 3) {
                console.log('🔧 All APIs failed, using fallback...');
                const fallbackResult = await this.chromeAI.fallbackToGeminiNano(text, context);
                analysis.fallback = fallbackResult;
            }

            sendResponse({
                success: true,
                analysis: analysis,
                timestamp: Date.now()
            });

        } catch (error) {
            console.error('Chrome AI analysis error:', error);
            sendResponse({
                success: false,
                error: error.message,
                timestamp: Date.now()
            });
        }
    }

    async handleQuantumAnalysis(request, sender, sendResponse) {
        try {
            const { text, context } = request;
            
            // Perform comprehensive quantum analysis using available APIs
            const quantumAnalysis = await this.performQuantumAnalysis(text, context);
            
            sendResponse({
                success: true,
                quantumAnalysis: quantumAnalysis,
                apiStatus: this.chromeAI.apisAvailable
            });
            
        } catch (error) {
            console.error('Quantum analysis error:', error);
            sendResponse({
                success: false,
                error: error.message
            });
        }
    }

    countAPIResults(results) {
        return results.filter(result => result.status === 'fulfilled' && !result.value.error).length;
    }

    countAPIErrors(results) {
        return results.filter(result => 
            result.status === 'rejected' || 
            (result.status === 'fulfilled' && result.value.error)
        ).length;
    }

    async performQuantumAnalysis(text, context) {
        // This would integrate all API results into quantum state analysis
        const apiAnalysis = await this.handleChromeAIAnalysis(
            { action: 'analyzeWithChromeAI', text, context },
            null,
            (response) => response
        );

        return {
            superposition: this.analyzeSuperposition(text, apiAnalysis),
            entanglement: this.analyzeEntanglement(text, context),
            coherence: this.calculateCoherence(apiAnalysis),
            riskScore: this.calculateQuantumRisk(apiAnalysis),
            timestamp: Date.now()
        };
    }

    analyzeSuperposition(text, analysis) {
        return {
            surfaceState: { amplitude: 1.0, observable: text.substring(0, 100) },
            hiddenState: { 
                amplitude: analysis.prompt?.detectedParadoxes?.length > 0 ? 0.8 : 0.2,
                hiddenObservables: analysis.prompt?.hiddenMeanings || []
            },
            intentState: {
                entanglement: this.calculateIntentEntanglement(text),
                alignment: analysis.proofreader?.clarityScore || 0.5
            }
        };
    }

    analyzeEntanglement(text, context) {
        return {
            strength: this.calculateContextDependency(text, context),
            connections: this.findSemanticConnections(text),
            contextDependency: Object.keys(context).length > 0 ? 0.7 : 0.3
        };
    }

    calculateCoherence(analysis) {
        const proofreaderCoherence = analysis.proofreader?.clarityScore || 0.5;
        const promptConfidence = analysis.prompt?.confidence || 0.5;
        
        return {
            coherence: (proofreaderCoherence + promptConfidence) / 2,
            decoherenceRisk: 1 - ((proofreaderCoherence + promptConfidence) / 2),
            state: proofreaderCoherence > 0.7 && promptConfidence > 0.7 ? 'coherent' : 'partially_coherent'
        };
    }

    calculateQuantumRisk(analysis) {
        let risk = 0;
        
        if (analysis.prompt?.riskLevel === 'high') risk += 60;
        else if (analysis.prompt?.riskLevel === 'medium') risk += 30;
        
        if (analysis.proofreader?.grammarIssues > 3) risk += 20;
        
        if (analysis.apiErrors > 0) risk += 10;
        
        return Math.min(risk, 100);
    }

    calculateIntentEntanglement(text) {
        // Simplified entanglement calculation
        let score = 0;
        if (text.includes('but') || text.includes('however')) score += 0.3;
        if (text.includes('if') || text.includes('when')) score += 0.2;
        if (text.includes('this') || text.includes('that')) score += 0.2;
        return Math.min(score, 1);
    }

    calculateContextDependency(text, context) {
        let dependency = 0;
        if (text.includes('this') || text.includes('that')) dependency += 0.3;
        if (text.includes('as mentioned') || text.includes('previously')) dependency += 0.4;
        return Math.min(dependency, 1);
    }

    findSemanticConnections(text) {
        const connections = [];
        if (text.includes('but') || text.includes('however')) {
            connections.push({ type: 'contrast', strength: 0.8 });
        }
        if (text.includes('if') || text.includes('when')) {
            connections.push({ type: 'condition', strength: 0.6 });
        }
        return connections;
    }
}

// Initialize the service worker
const quantumManager = new QuantumStateManager();

// Service worker lifecycle
chrome.runtime.onStartup.addListener(() => {
    console.log('🦎 Chalamandra QuantumMind starting up...');
});

chrome.runtime.onInstalled.addListener((details) => {
    console.log('🦎 Chalamandra QuantumMind installed:', details.reason);
    
    // Create context menu for quick analysis
    chrome.contextMenus.create({
        id: 'analyzeWithChromeAI',
        title: 'Analyze with Chalamandra QuantumMind',
        contexts: ['selection']
    });
});

// Context menu handler
chrome.contextMenus.onClicked.addListener((info, tab) => {
    if (info.menuItemId === 'analyzeWithChromeAI' && info.selectionText) {
        chrome.tabs.sendMessage(tab.id, {
            action: 'analyzeSelectedText',
            text: info.selectionText,
            source: 'context_menu'
        });
    }
});

console.log('🚀 Chalamandra QuantumMind Service Worker ready with Chrome AI APIs!');

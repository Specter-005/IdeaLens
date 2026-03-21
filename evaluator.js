/**
 * evaluator.js — Startup Idea Evaluation Engine
 *
 * Generates a comprehensive, context-aware evaluation of a startup idea.
 * Uses keyword analysis and heuristic scoring to produce realistic results.
 */

const Evaluator = (() => {

  /* ===== Keyword Dictionaries ===== */
  const TECH_KEYWORDS = ['ai', 'ml', 'machine learning', 'blockchain', 'crypto', 'nft', 'vr', 'ar', 'iot', 'saas', 'api', 'cloud', 'automation', 'deep learning', 'gpt', 'llm', 'drone', 'robot', 'quantum', '3d print', 'wearable', 'computer vision', 'nlp', 'natural language', 'edge computing', 'serverless', 'microservices', 'devops', 'cybersecurity', 'biometric'];
  const MARKET_KEYWORDS = ['health', 'fitness', 'education', 'fintech', 'ecommerce', 'food', 'delivery', 'social media', 'gaming', 'travel', 'real estate', 'insurance', 'hr', 'recruitment', 'legal', 'agriculture', 'sustainability', 'green', 'mental health', 'wellness', 'telemedicine', 'edtech', 'proptech', 'climate', 'logistics', 'supply chain', 'retail', 'fashion', 'beauty', 'pet', 'automotive', 'entertainment', 'music', 'podcast', 'media', 'news', 'sports', 'construction', 'manufacturing'];
  const MONETIZATION_KEYWORDS = ['subscription', 'freemium', 'marketplace', 'commission', 'advertising', 'premium', 'enterprise', 'b2b', 'b2c', 'licensing', 'pay-per-use', 'saas', 'transaction fee', 'affiliate', 'sponsorship', 'white-label', 'data monetization'];
  const BUZZWORDS = ['disrupt', 'revolutionize', 'uber for', 'airbnb for', 'next-gen', 'world-class', 'first-ever', 'unique', 'innovative', 'game-changing', 'paradigm shift', 'synergy'];

  const COMPETITOR_DB = {
    'food': [
      { name: 'DoorDash', desc: 'Leading food delivery marketplace with 67% US market share' },
      { name: 'UberEats', desc: 'Global food delivery platform across 6,000+ cities' },
      { name: 'Instacart', desc: 'Grocery delivery and pickup service' }
    ],
    'delivery': [
      { name: 'DoorDash', desc: 'On-demand delivery platform for food and essentials' },
      { name: 'Postmates (Uber)', desc: 'Local delivery service acquired by Uber' },
      { name: 'Gopuff', desc: 'Instant delivery of everyday essentials' }
    ],
    'education': [
      { name: 'Coursera', desc: 'Online learning platform with university partnerships' },
      { name: 'Udemy', desc: 'Marketplace for 200K+ online courses' },
      { name: 'Khan Academy', desc: 'Free educational platform for all ages' },
      { name: 'Duolingo', desc: 'Gamified language learning with 74M+ MAU' }
    ],
    'edtech': [
      { name: "Byju's", desc: 'EdTech company with interactive learning modules' },
      { name: 'Coursera', desc: 'Online learning platform with 130M+ learners' },
      { name: 'Chegg', desc: 'Student-first connected learning platform' }
    ],
    'health': [
      { name: 'Teladoc', desc: 'Telehealth and virtual care pioneer' },
      { name: 'Headspace', desc: 'Mental health and meditation app' },
      { name: 'One Medical', desc: 'Membership-based primary care platform' }
    ],
    'mental health': [
      { name: 'BetterHelp', desc: 'Online therapy platform with 30K+ therapists' },
      { name: 'Calm', desc: 'Meditation, sleep, and relaxation app' },
      { name: 'Headspace', desc: 'Mindfulness and meditation platform' }
    ],
    'fitness': [
      { name: 'Peloton', desc: 'Connected fitness platform and equipment' },
      { name: 'MyFitnessPal', desc: 'Nutrition and fitness tracking app' },
      { name: 'Strava', desc: 'Social fitness network for athletes' }
    ],
    'fintech': [
      { name: 'Stripe', desc: 'Online payment processing infrastructure' },
      { name: 'Robinhood', desc: 'Commission-free trading platform' },
      { name: 'Square (Block)', desc: 'Financial services and payments platform' },
      { name: 'Plaid', desc: 'Financial data connectivity platform' }
    ],
    'ecommerce': [
      { name: 'Shopify', desc: 'E-commerce platform powering 4.4M+ stores' },
      { name: 'Amazon', desc: 'Global marketplace and cloud services giant' },
      { name: 'Etsy', desc: 'Marketplace for handmade and vintage goods' }
    ],
    'social media': [
      { name: 'Instagram (Meta)', desc: 'Photo and video sharing with 2B+ MAU' },
      { name: 'TikTok', desc: 'Short-form video platform with 1B+ MAU' },
      { name: 'Discord', desc: 'Communication platform for communities' },
      { name: 'Threads (Meta)', desc: 'Text-based social network' }
    ],
    'gaming': [
      { name: 'Steam (Valve)', desc: 'PC gaming distribution platform' },
      { name: 'Epic Games', desc: 'Gaming platform, engine, and store' },
      { name: 'Roblox', desc: 'User-generated gaming platform with 70M+ DAU' }
    ],
    'travel': [
      { name: 'Airbnb', desc: 'Accommodation marketplace in 220+ countries' },
      { name: 'Booking.com', desc: 'Travel reservations for 28M+ listings' },
      { name: 'Hopper', desc: 'AI-powered travel booking and price prediction' }
    ],
    'real estate': [
      { name: 'Zillow', desc: 'Online real estate marketplace and data platform' },
      { name: 'Opendoor', desc: 'iBuying and direct home sales platform' },
      { name: 'Redfin', desc: 'Real estate brokerage with technology focus' }
    ],
    'ai': [
      { name: 'OpenAI', desc: 'AI research lab behind GPT and ChatGPT' },
      { name: 'Anthropic', desc: 'AI safety company behind Claude' },
      { name: 'Jasper', desc: 'AI content generation for marketing' },
      { name: 'Midjourney', desc: 'AI image generation platform' },
      { name: 'Hugging Face', desc: 'Open-source ML model hub' }
    ],
    'blockchain': [
      { name: 'Coinbase', desc: 'Largest US cryptocurrency exchange' },
      { name: 'Ethereum', desc: 'Leading smart contract platform' },
      { name: 'Binance', desc: 'Global crypto trading platform' }
    ],
    'sustainability': [
      { name: 'Tesla', desc: 'EV and clean energy technology leader' },
      { name: 'Climeworks', desc: 'Direct air carbon capture technology' },
      { name: 'Too Good To Go', desc: 'Food waste reduction marketplace' }
    ],
    'agriculture': [
      { name: 'Indigo Agriculture', desc: 'AgTech for sustainable farming practices' },
      { name: 'FarmLogs', desc: 'Farm management and analytics software' },
      { name: 'Plenty', desc: 'Indoor vertical farming technology' }
    ],
    'recruitment': [
      { name: 'LinkedIn', desc: 'Professional networking with 900M+ members' },
      { name: 'Indeed', desc: 'World\'s largest job search engine' },
      { name: 'Greenhouse', desc: 'Structured hiring and ATS software' }
    ],
    'hr': [
      { name: 'Workday', desc: 'Enterprise HR and finance software' },
      { name: 'BambooHR', desc: 'HR management for SMBs' },
      { name: 'Gusto', desc: 'Payroll, benefits, and HR for small business' }
    ],
    'insurance': [
      { name: 'Lemonade', desc: 'AI-powered renters and home insurance' },
      { name: 'Root Insurance', desc: 'Usage-based auto insurance with telematics' },
      { name: 'Policygenius', desc: 'Insurance comparison marketplace' }
    ],
    'logistics': [
      { name: 'Flexport', desc: 'Digital freight forwarding and logistics' },
      { name: 'Convey (project44)', desc: 'Supply chain visibility platform' },
      { name: 'ShipBob', desc: 'E-commerce fulfillment platform' }
    ],
    'pet': [
      { name: 'Chewy', desc: 'Online pet food and products retailer' },
      { name: 'Rover', desc: 'Pet sitting and dog walking marketplace' },
      { name: 'BarkBox', desc: 'Dog products subscription service' }
    ],
    'construction': [
      { name: 'Procore', desc: 'Construction management software platform' },
      { name: 'PlanGrid (Autodesk)', desc: 'Blueprint and project management' },
      { name: 'Katerra', desc: 'Technology-driven construction company' }
    ]
  };

  /* ===== Helpers ===== */
  function containsAny(text, keywords) {
    const lower = text.toLowerCase();
    return keywords.filter(k => lower.includes(k));
  }

  function clamp(v, min, max) { return Math.max(min, Math.min(max, v)); }

  function rand(min, max) { return Math.floor(Math.random() * (max - min + 1)) + min; }

  function pickRandom(arr, n) {
    const shuffled = [...arr].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, n);
  }

  /* ===== Core Scoring ===== */
  function scoreIdea(idea, audience, problem, model) {
    const fullText = `${idea} ${audience} ${problem} ${model}`.toLowerCase();
    const ideaLen = idea.trim().length;

    const techHits = containsAny(fullText, TECH_KEYWORDS);
    const marketHits = containsAny(fullText, MARKET_KEYWORDS);
    const moneyHits = containsAny(fullText, MONETIZATION_KEYWORDS);
    const buzzHits = containsAny(fullText, BUZZWORDS);

    // Problem Strength
    let problemScore = 5;
    if (problem.trim().length > 30) problemScore += 2;
    if (problem.trim().length > 80) problemScore += 1;
    if (marketHits.length > 0) problemScore += 1;
    if (ideaLen > 100) problemScore += 1;
    problemScore = clamp(problemScore + rand(-1, 1), 3, 10);

    // Solution Clarity
    let solutionScore = 5;
    if (ideaLen > 50) solutionScore += 1;
    if (ideaLen > 120) solutionScore += 1;
    if (ideaLen > 200) solutionScore += 1;
    if (techHits.length > 0) solutionScore += 1;
    if (audience.trim().length > 10) solutionScore += 1;
    solutionScore = clamp(solutionScore + rand(-1, 1), 3, 10);

    // Feasibility
    let feasibilityScore = 6;
    if (techHits.length > 0) feasibilityScore += 1;
    if (techHits.length > 2) feasibilityScore -= 1;
    if (containsAny(fullText, ['quantum', 'flying car', 'teleportation']).length > 0) feasibilityScore -= 2;
    if (model.trim().length > 10) feasibilityScore += 1;
    feasibilityScore = clamp(feasibilityScore + rand(-1, 1), 2, 10);

    // Competition Level
    let competitionLevel = 'Medium';
    if (marketHits.length >= 2) competitionLevel = 'High';
    else if (marketHits.length === 0 && techHits.length >= 1) competitionLevel = 'Low';
    if (buzzHits.length >= 2) competitionLevel = 'High';

    // Innovation
    let innovationScore = 5;
    if (techHits.length >= 1) innovationScore += 1;
    if (techHits.length >= 2) innovationScore += 1;
    if (buzzHits.length === 0 && techHits.length >= 1) innovationScore += 1;
    if (ideaLen > 150) innovationScore += 1;
    innovationScore = clamp(innovationScore + rand(-1, 1), 2, 10);

    // Scalability
    let scalabilityScore = 5;
    if (containsAny(fullText, ['platform', 'marketplace', 'global', 'scale', 'network', 'international', 'worldwide']).length > 0) scalabilityScore += 2;
    if (containsAny(fullText, ['local', 'niche', 'small town', 'neighborhood']).length > 0) scalabilityScore -= 1;
    if (techHits.length >= 1) scalabilityScore += 1;
    if (model.trim().length > 10) scalabilityScore += 1;
    scalabilityScore = clamp(scalabilityScore + rand(-1, 1), 2, 10);

    // Monetization
    let monetizationScore = 5;
    if (moneyHits.length >= 1) monetizationScore += 2;
    if (moneyHits.length >= 2) monetizationScore += 1;
    if (model.trim().length > 20) monetizationScore += 1;
    if (containsAny(fullText, ['free', 'open source', 'nonprofit']).length > 0) monetizationScore -= 2;
    monetizationScore = clamp(monetizationScore + rand(-1, 1), 1, 10);

    return {
      problemStrength: problemScore,
      solutionClarity: solutionScore,
      feasibility: feasibilityScore,
      competitionLevel,
      innovation: innovationScore,
      scalability: scalabilityScore,
      monetization: monetizationScore
    };
  }

  /* ===== Competition ===== */
  function findCompetitors(fullText) {
    let competitors = [];
    for (const key of Object.keys(COMPETITOR_DB)) {
      if (fullText.toLowerCase().includes(key)) {
        competitors = competitors.concat(COMPETITOR_DB[key]);
      }
    }
    const seen = new Set();
    competitors = competitors.filter(c => {
      if (seen.has(c.name)) return false;
      seen.add(c.name);
      return true;
    });
    if (competitors.length === 0) {
      competitors = [
        { name: 'Various Startups', desc: 'Several early-stage startups may be exploring this space' },
        { name: 'Established Incumbents', desc: 'Larger companies with adjacent offerings could pivot into this market' }
      ];
    }
    return competitors.slice(0, 5);
  }

  /* ===== Text Generation ===== */
  function generateStrengths(scores, techHits, marketHits, idea) {
    const strengths = [];
    if (scores.problemStrength >= 7) strengths.push('Addresses a clearly defined, real-world problem that many users face regularly.');
    if (scores.solutionClarity >= 7) strengths.push('The solution is well-articulated with a clear value proposition and differentiators.');
    if (scores.feasibility >= 7) strengths.push('Technically feasible with current technology and can be built with a lean team.');
    if (scores.innovation >= 7) strengths.push('Brings a genuinely innovative approach that stands out from existing solutions.');
    if (scores.scalability >= 7) strengths.push('Has strong scalability potential — the model allows growth without proportional cost increases.');
    if (scores.monetization >= 7) strengths.push('Clear and viable monetization strategy with multiple potential revenue streams.');
    if (techHits.length > 0) strengths.push(`Leverages trending technologies (${techHits.slice(0,3).join(', ')}) which attract investor interest.`);
    if (marketHits.length > 0) strengths.push(`Targets a growing market sector (${marketHits.slice(0,2).join(', ')}) with proven demand.`);
    if (idea.length > 150) strengths.push('Detailed and well-thought-out idea description suggests strong founder clarity.');

    if (strengths.length < 3) {
      const fallbacks = [
        'Addresses a need that is growing with current societal and technological trends.',
        'Has the potential to build a loyal user base if executed with focus.',
        'The core concept is understandable and can be pitched in a single sentence.'
      ];
      while (strengths.length < 3) strengths.push(fallbacks.shift());
    }
    return strengths.slice(0, 6);
  }

  function generateWeaknesses(scores, competitionLevel, buzzHits) {
    const weaknesses = [];
    if (scores.problemStrength < 6) weaknesses.push('The problem statement needs further validation — consider conducting user interviews to confirm demand.');
    if (scores.solutionClarity < 6) weaknesses.push('The solution description is vague. Investors and users need a clearer picture of what exactly the product does.');
    if (scores.feasibility < 6) weaknesses.push('Technical feasibility may be a challenge — consider starting with a simpler MVP to prove the concept.');
    if (competitionLevel === 'High') weaknesses.push('The market is crowded with well-funded incumbents. You\'ll need a strong differentiator to compete.');
    if (scores.innovation < 6) weaknesses.push('The idea appears similar to existing products. Without clear differentiation, it may struggle to gain traction.');
    if (scores.scalability < 6) weaknesses.push('Scalability could be limited — the model may work locally but face challenges expanding to larger markets.');
    if (scores.monetization < 6) weaknesses.push('The revenue model is unclear or weak. Consider exploring additional monetization channels.');
    if (buzzHits.length >= 2) weaknesses.push('Heavy use of buzzwords without substantive backing can be a red flag for investors.');

    if (weaknesses.length < 3) {
      const fallbacks = [
        'Market timing is critical — launching too early or too late can make or break the startup.',
        'Customer acquisition costs could be high without a clear growth strategy.',
        'Regulatory or legal considerations in this space may add complexity.'
      ];
      while (weaknesses.length < 3) weaknesses.push(fallbacks.shift());
    }
    return weaknesses.slice(0, 6);
  }

  function generateSuggestions(scores, techHits, marketHits, competitionLevel) {
    const suggestions = [];
    if (scores.problemStrength < 7) suggestions.push('Conduct at least 20 user interviews to validate the problem and refine your understanding of customer pain points.');
    if (scores.solutionClarity < 7) suggestions.push('Create a detailed product spec or clickable prototype to communicate the solution more clearly to stakeholders.');
    if (scores.feasibility < 7) suggestions.push('Build a technical proof-of-concept or MVP within 4-6 weeks to test core assumptions before seeking funding.');
    if (competitionLevel === 'High') suggestions.push('Identify an underserved niche within this market and dominate it before expanding — avoid competing head-on with giants.');
    if (scores.innovation < 7) suggestions.push('Study your top 3 competitors deeply and identify at least 2 features or approaches they are not offering.');
    if (scores.scalability < 7) suggestions.push('Design the product architecture for scale from day one — consider cloud-native, API-first approaches.');
    if (scores.monetization < 7) suggestions.push('Explore a freemium model with clear upgrade triggers, or consider B2B licensing as an additional revenue stream.');
    if (techHits.length === 0) suggestions.push('Consider integrating AI or automation features to increase efficiency and appeal to tech-savvy investors.');
    if (marketHits.length === 0) suggestions.push('Clearly define your target market segment — a focused go-to-market strategy is more effective than trying to serve everyone.');

    const extras = [
      'Build in public — share your journey on social media to create organic buzz and attract early adopters.',
      'Set up analytics from day one to track key metrics (CAC, LTV, retention) and make data-driven decisions.',
      'Consider strategic partnerships with complementary products to accelerate distribution.',
      'Create a compelling landing page and run a small ad campaign ($500-$1000) to validate demand before building.'
    ];
    while (suggestions.length < 4) suggestions.push(extras.shift());
    return suggestions.slice(0, 6);
  }

  /* ===== Lift Score ===== */
  function calcLiftScore(scores) {
    const numericScores = [
      scores.problemStrength,
      scores.solutionClarity,
      scores.feasibility,
      scores.innovation,
      scores.scalability,
      scores.monetization
    ];
    const compPenalty = scores.competitionLevel === 'High' ? -5 : scores.competitionLevel === 'Medium' ? 0 : 5;
    const avg = numericScores.reduce((a, b) => a + b, 0) / numericScores.length;
    return clamp(Math.round(avg * 10 + compPenalty + rand(-3, 3)), 15, 98);
  }

  /* ===== Verdict ===== */
  function getVerdict(liftScore) {
    if (liftScore >= 75) return {
      icon: 'rocket',
      label: 'High Potential',
      key: 'high',
      text: 'This idea shows strong market potential, clear problem-solution fit, and viable monetization paths. With proper execution and a focused go-to-market strategy, it could gain significant traction.'
    };
    if (liftScore >= 50) return {
      icon: 'scales',
      label: 'Moderate Potential',
      key: 'moderate',
      text: 'The idea has merit but needs refinement. Focus on strengthening the weakest areas identified above and validating core assumptions before scaling.'
    };
    if (liftScore >= 30) return {
      icon: 'warning',
      label: 'Needs Improvement',
      key: 'needs-improvement',
      text: 'The idea faces significant challenges in its current form. Substantial pivoting, deeper market research, or a fundamental rethink of the approach may be needed.'
    };
    return {
      icon: 'x-circle',
      label: 'Not Viable',
      key: 'not-viable',
      text: 'In its current form, this idea is unlikely to succeed. Consider fundamental changes to the problem, solution, or market approach.'
    };
  }

  /* ===== Public API ===== */
  function evaluate(idea, audience = '', problem = '', model = '') {
    const fullText = `${idea} ${audience} ${problem} ${model}`;
    const techHits = containsAny(fullText, TECH_KEYWORDS);
    const marketHits = containsAny(fullText, MARKET_KEYWORDS);
    const buzzHits = containsAny(fullText, BUZZWORDS);

    const scores = scoreIdea(idea, audience, problem, model);
    const liftScore = calcLiftScore(scores);
    const verdict = getVerdict(liftScore);
    const competitors = findCompetitors(fullText);
    const strengths = generateStrengths(scores, techHits, marketHits, idea);
    const weaknesses = generateWeaknesses(scores, scores.competitionLevel, buzzHits);
    const suggestions = generateSuggestions(scores, techHits, marketHits, scores.competitionLevel);

    const comparison = scores.competitionLevel === 'High'
      ? 'The market is highly competitive. Your idea will need a very strong differentiator and excellent execution to stand out. Consider focusing on an underserved sub-segment.'
      : scores.competitionLevel === 'Medium'
        ? 'There is moderate competition in this space. Opportunity exists for a well-positioned entrant with clear differentiation and superior user experience.'
        : 'Competition is relatively low, presenting a first-mover advantage opportunity. However, validate that low competition isn\'t due to low market demand.';

    return {
      liftScore,
      scores,
      verdict,
      competitors,
      comparison,
      strengths,
      weaknesses,
      suggestions
    };
  }

  return { evaluate };
})();

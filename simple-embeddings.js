// Improved embedding function with multilingual keyword matching
export class SimpleEmbeddings {
  constructor() {
    this.dimension = 768;
    // English DSA keywords
    this.englishKeywords = [
      'array', 'linked', 'list', 'stack', 'queue', 'tree', 'graph', 'sort', 'search',
      'binary', 'linear', 'hash', 'table', 'heap', 'quick', 'merge', 'bubble',
      'insertion', 'selection', 'algorithm', 'complexity', 'time', 'space',
      'recursion', 'iteration', 'dynamic', 'programming', 'greedy', 'divide',
      'conquer', 'breadth', 'depth', 'first', 'traversal', 'node', 'edge',
      'vertex', 'path', 'cycle', 'minimum', 'maximum', 'optimal', 'efficient'
    ];
    
    // Hindi translations and common Hindi tech terms
    this.hindiKeywords = [
      'kya', 'hai', 'hota', 'kaise', 'kaam', 'karta', 'algorithm', 'sorting',
      'searching', 'data', 'structure', 'quick', 'merge', 'bubble', 'insertion',
      'selection', 'binary', 'linear', 'tree', 'graph', 'array', 'list'
    ];
    
    // Combined keywords
    this.keywords = [...this.englishKeywords, ...this.hindiKeywords];
  }

  async embedQuery(text) {
    return this.textToVector(text);
  }

  async embedDocuments(texts) {
    return texts.map(text => this.textToVector(text));
  }

  textToVector(text) {
    const vector = new Array(this.dimension).fill(0);
    const lowerText = text.toLowerCase();
    
    // Enhanced embedding with keyword weighting
    for (let i = 0; i < text.length; i++) {
      const charCode = text.charCodeAt(i);
      const index = charCode % this.dimension;
      vector[index] += charCode / 1000;
    }
    
    // Boost vectors for matching keywords
    this.keywords.forEach((keyword, keywordIndex) => {
      if (lowerText.includes(keyword)) {
        const boost = 5.0; // Significant boost for keyword matches
        const startIndex = (keywordIndex * 10) % this.dimension;
        for (let j = 0; j < 10; j++) {
          const idx = (startIndex + j) % this.dimension;
          vector[idx] += boost;
        }
      }
    });
    
    // Word-based features
    const words = lowerText.split(/\s+/);
    words.forEach((word, wordIndex) => {
      if (word.length > 2) {
        const wordHash = this.simpleHash(word);
        const index = wordHash % this.dimension;
        vector[index] += 2.0;
      }
    });
    
    // Normalize the vector
    const magnitude = Math.sqrt(vector.reduce((sum, val) => sum + val * val, 0));
    return vector.map(val => magnitude > 0 ? val / magnitude : 0);
  }
  
  simpleHash(str) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return Math.abs(hash);
  }
}
function Tokenizer() {}

Tokenizer.prototype = {
  // Split the entry into sentences.
  getSentences : function (text) {
    if(!text) return [];
    var words = text.words();
    var endingWords = words.filter(function(w) {
      return w.endsWith(/[\.!\?]/);
    });

    var self = this;
    var sentences = [];
    var lastSentence = words[0];
    words.reduce(function (prev, cur, index, array) {
      var curReplaced = cur;

      if (endingWords.indexOf(prev) != -1) {
        sentences.push(lastSentence.compact());
        lastSentence = "";
      }
      lastSentence = lastSentence + " " + curReplaced;
      return cur;
    });
    sentences.push(lastSentence.compact());
    return sentences;
  },
  // Get the tokens of one sentence
  getTokens : function (text) {
    if(!text) return [];
    return text.words();
  }
};
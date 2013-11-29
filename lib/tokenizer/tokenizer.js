function Tokenizer() {
    // WhiteSpace/LineTerminator as defined in ES5.1 plus Unicode characters in the Space, Separator category.
    this.trimmableCharacter = '\u0009\u000A\u000B\u000C\u000D\u0020\u00A0\u1680\u180E\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200A\u202F\u205F\u2028\u2029\u3000\uFEFF';

  }

  Tokenizer.prototype.getSentences = function(text){
    if(!text) return [];

    var words = this.tokenizeWithPunct(text);
    var endingWords = words.filter(function(w) {
      var character = w[w.length-1];
      return  character == "." ||
      character == "!" ||
      character == "?";
    });

    var self = this;
    var sentences = [];
    var lastSentence = words[0];
    for(var i = 0; i < words.length; i++)
    {
      var word = words[i];
      lastSentence = lastSentence + " " + word;

      if (endingWords.indexOf(word) != -1) {
        sentences.push(lastSentence);
        lastSentence = "";
      }
    }
    //sentences.push(lastSentence.compact());
    return sentences;
  };


  Tokenizer.prototype.tokenizeAggressive = function(text) {
    return this.clean(text.split(/\W+/));
  };

  Tokenizer.prototype.tokenizeWithPunct = function(text)
  {
    return this.clean(text.match(/\S+/g));
  };

  Tokenizer.prototype.clean = function(array) {
    return array.filter(function(e){return e});
  };

  Tokenizer.prototype.trim = function(text) {
    return this.trimRight(this.trimLeft(text));
  };

  Tokenizer.prototype.trimLeft = function(text) {
    return text.replace('^['+this.trimmableCharacter+']+', '');
  };

  Tokenizer.prototype.trimRight = function(text) {
    return text.replace('['+this.trimmableCharacter+']+$', '');
  };
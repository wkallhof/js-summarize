var jSSummarize = {

    ideal: 20.0,
    tokenizer: new Tokenizer(),

    summarize: function (title, article) {
        if (article.length == 0) return [];

        var sentences = this.splitSentences(article);
        var keywords = this.keywords(article);
        var titleWords = this.splitWords(title)


        //score setences, and use the top 5 sentences
        //TODO: Figure out top 5
        var ranks = this.score(sentences, titleWords, keywords); //.most_common(5)
        return ranks;
    },

    score: function (sentences, titleWords, keywords) {
        var senSize = sentences.length;
        var ranks = [];
        for(var i = 0; i < sentences.length; i++)
        {
            var sentence = this.splitWords(sentences[i]);
            var titleFeature = this.titleScore(titleWords, sentence);
            var sentenceLength = this.lengthScore(sentence);
            var sentencePosition = this.sentencePosition(i+1, senSize);
            var sbsFeature = this.sbs(sentence, keywords);
            var dbsFeature = this.dbs(sentence, keywords);
            var frequency = (sbsFeature + dbsFeature) / 2.0 * 10.0;

            //weighted average of scores from four categores
            var totalScore = (titleFeature*1.5 + frequency*2.0 + sentenceLength*1.0 + sentencePosition*1.0)/4.0;
            ranks.push({sentence:sentences[i],score:totalScore});
        }

        return ranks;
    },

    sbs: function (words, keywords) {
        var score = 0.0;
        if(words.length == 0) return 0;
        for(var i = 0; i < words.length; i++)
        {
            var word = words[i];
            var match = _.find(keywords,{"word":word});
            if(match)
            {
                score += match.score;
            }
        }

        return (1.0 / words.length * score)/10.0;
    },

    dbs: function (words, keywords) {
        if(words.length == 0) return 0;
        var summ = 0;
        first = null;
        second = null;

        for(var i = 0; i < words.length; i++)
        {
            var word = words[i];
            var match = _.find(keywords,{"word":word});
            if(match)
            {
                var score = match.score;
                if(!first)
                {
                    first = {index:i, score:score};
                }
                else{
                    second = first;
                    first = {index:i, score:score};
                    var dif = first.index - second.index;
                    summ +=(first.score*second.score) / (Math.pow(dif,2));
                }
            }
        }

        var keywordWords = _.pluck(keywords, "word");
        var intersection = _.intersection(keywordWords, words);
        var k = intersection.length;
        if(k == 0) return 0;
        return (1/(k*(k+1.0))*summ);

    },

    splitWords: function (text) {
        return this.tokenizer.getTokens(text.toLowerCase());
    },

    keywords: function (text) {
        var splitText = this.splitWords(text);
        var numWords = splitText.length;

        var words = _.chain(splitText)
                    .difference(this.stopWords)
                    .groupBy(function (word) {return word;})
                    .map(function(group){
                        var frequency = group.length;
                        var score = (frequency * 1.0 / numWords) * 1.5 + 1;
                        return {word:group[0], score:score};
                    }).sortBy('score')
                    .reverse()
                    .take(10)
                    .value();

        return words;
    },

    splitSentences: function (text) {
        return this.tokenizer.getSentences(text);
    },

    lengthScore: function (sentence) {
        return 1- Math.abs(this.ideal - sentence.length) / this.ideal;
    },

    titleScore: function (title, sentence) {
        var titleWords = _.difference(title,this.stopWords);
        var count = 0.0;
        for(var i = 0; i < sentence.length; i++)
        {
            var word = sentence[i];
            if(!_.contains(this.stopWords,word) && _.contains(titleWords, word ))
            {
                count++;
            }
        }

        return count/title.length;
    },

    sentencePosition: function (i, size) {
        //different sentence positions indicate different probability of being an important sentence

        var normalized =  i*1.0 / size;
        if (normalized > 0 && normalized <= 0.1)
                return 0.17;
        else if (normalized > 0.1 && normalized <= 0.2)
                return 0.23;
        else if (normalized > 0.2 && normalized <= 0.3)
                return 0.14;
        else if (normalized > 0.3 && normalized <= 0.4)
                return 0.08;
        else if (normalized > 0.4 && normalized <= 0.5)
                return 0.05;
        else if (normalized > 0.5 && normalized <= 0.6)
                return 0.04;
        else if (normalized > 0.6 && normalized <= 0.7)
                return 0.06;
        else if (normalized > 0.7 && normalized <= 0.8)
                return 0.04;
        else if (normalized > 0.8 && normalized <= 0.9)
                return 0.04;
        else if (normalized > 0.9 && normalized <= 1.0)
                return 0.15;
        else
                return 0;
    },


    stopWords: ["-", " ", ",", ".", "a", "e", "i", "o", "u", "t", "about", "above", "above", "across", "after", "afterwards", "again", "against", "all", "almost", "alone", "along", "already", "also", "although", "always", "am", "among", "amongst", "amoungst", "amount", "an", "and", "another", "any", "anyhow", "anyone", "anything", "anyway", "anywhere", "are", "around", "as", "at", "back", "be", "became", "because", "become", "becomes", "becoming", "been", "before", "beforehand", "behind", "being", "below", "beside", "besides", "between", "beyond", "both", "bottom", "but", "by", "call", "can", "cannot", "can't", "co", "con", "could", "couldn't", "de", "describe", "detail", "did", "do", "done", "down", "due", "during", "each", "eg", "eight", "either", "eleven", "else", "elsewhere", "empty", "enough", "etc", "even", "ever", "every", "everyone", "everything", "everywhere", "except", "few", "fifteen", "fifty", "fill", "find", "fire", "first", "five", "for", "former", "formerly", "forty", "found", "four", "from", "front", "full", "further", "get", "give", "go", "got", "had", "has", "hasnt", "have", "he", "hence", "her", "here", "hereafter", "hereby", "herein", "hereupon", "hers", "herself", "him", "himself", "his", "how", "however", "hundred", "i", "ie", "if", "in", "inc", "indeed", "into", "is", "it", "its", "it's", "itself", "just", "keep", "last", "latter", "latterly", "least", "less", "like", "ltd", "made", "make", "many", "may", "me", "meanwhile", "might", "mill", "mine", "more", "moreover", "most", "mostly", "move", "much", "must", "my", "myself", "name", "namely", "neither", "never", "nevertheless", "new", "next", "nine", "no", "nobody", "none", "noone", "nor", "not", "nothing", "now", "nowhere", "of", "off", "often", "on", "once", "one", "only", "onto", "or", "other", "others", "otherwise", "our", "ours", "ourselves", "out", "over", "own", "part", "people", "per", "perhaps", "please", "put", "rather", "re", "said", "same", "see", "seem", "seemed", "seeming", "seems", "several", "she", "should", "show", "side", "since", "sincere", "six", "sixty", "so", "some", "somehow", "someone", "something", "sometime", "sometimes", "somewhere", "still", "such", "take", "ten", "than", "that", "the", "their", "them", "themselves", "then", "thence", "there", "thereafter", "thereby", "therefore", "therein", "thereupon", "these", "they", "thickv", "thin", "third", "this", "those", "though", "three", "through", "throughout", "thru", "thus", "to", "together", "too", "top", "toward", "towards", "twelve", "twenty", "two", "un", "under", "until", "up", "upon", "us", "use", "very", "via", "want", "was", "we", "well", "were", "what", "whatever", "when", "whence", "whenever", "where", "whereafter", "whereas", "whereby", "wherein", "whereupon", "wherever", "whether", "which", "while", "whither", "who", "whoever", "whole", "whom", "whose", "why", "will", "with", "within", "without", "would", "yet", "you", "your", "yours", "yourself", "yourselves", "the", "reuters", "news", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday", "mon", "tue", "wed", "thu", "fri", "sat", "sun", "rappler", "rapplercom", "inquirer", "yahoo", "home", "sports", "1", "10", "2012", "sa", "says", "tweet", "pm", "home", "homepage", "sports", "section", "newsinfo", "stories", "story", "photo", "2013", "na", "ng", "ang", "year", "years", "percent", "ko", "ako", "yung", "yun", "2", "3", "4", "5", "6", "7", "8", "9", "0", "time", "january", "february", "march", "april", "may", "june", "july", "august", "september", "october", "november", "december", "philippine", "government", "police", "manila"]
}

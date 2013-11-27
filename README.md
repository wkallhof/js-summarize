# JS Summarize
JS Summarize is a Natural Language Processing utility used to summarize large bodies of text down into a small subset of sentences.

JS Summarize borrows heavily from the summarizing algorithm used in [PyTeaser](https://github.com/xiaoxu193/PyTeaser)

## Demo
Click [here](http://wkallhof.github.io/js-summarize/example.html) for a demo

## How To Use
Include the js-summarize file in your page and reference all of the necessary library items.
Then:
``` javascript
var summary = jSSummarize.summarize("[title text here]","[full text here]");
/*
	summary array:

	[
		{sentence:"summary sentence 1", score:0.42},
		{sentence:"summary sentence 2", score:0.32},
		{sentence:"summary sentence 3", score:0.31},
		                     ...
	]
*/
```

## To Do
* Create a better tokenizer to parse out correct sentences. Right now there are a lot of problems parsing initials properly (ex. U.S.A. )
* Remove dependencies on other libraries (jquery, lodash, and sugar)
* Clean up and comment code
* Research and re-evaluate score calculating algorithms

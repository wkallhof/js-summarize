# JS Summarize
JS Summarize is a Natural Language Processing utility used to summarize large bodies of text down into a small subset of sentences.

JS Summarize borrows heavily from the summarizing algorithm used in [PyTeaser](https://github.com/xiaoxu193/PyTeaser)

## Demo
Click [here](http://wkallhof.github.io/js-summarize/example.html) for a demo

## How To Use
Include the js-summarize file in your page and reference all of the necessary library items.
Then:
``` javascript
var summarizer = new JsSummarize();
var summary = summarizer.summarize("Text title here","Full text here");
/*
	output summary array:

	[
		"Best summarizing sentence here.",
		"Second best summarizing sentence here.",
		"Third best summarizing article here.",
		                     ...
	]
*/
```

## To Do
* Create a better tokenizer to parse out correct sentences. Right now there are a lot of problems parsing initials properly (ex. U.S.A. )
* Remove dependencies on other libraries (jquery, lodash, and sugar)
* Clean up and comment code
* Research and re-evaluate score calculating algorithms

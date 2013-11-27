### JS Summarize
JS Summarize is a Natural Language Processing utility used to summarize large bodies of text down into a list of sentences that summarize the text.

JS Summarize borrows heavily from the summarizing algorithm used in [PyTeaser](https://github.com/xiaoxu193/PyTeaser)

### Demo
Click [here](example.html) for a demo

### How To Use
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

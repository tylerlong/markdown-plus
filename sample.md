# Markdown Plus

![Markdown Plus](http://mdp.tylingsoft.com/icon.png)  
Markdown Plus ("M+" or "mdp" for short) is a versatile markdown editor. Besides CommonMark, GitHub flavored markdown, it also supports footnote, task list, emoji, Font Awesome, Ionicons, mathematical formula, flowchart, sequence diagram, gantt diagram, Vim mode and Emacs mode.


#### Fork me on GitHub: :fa-github: [tylingsoft/markdown-plus](https://github.com/tylingsoft/markdown-plus).


#### Buy our apps: :fa-apple: [tylingsoft.com/mdp](https://tylingsoft.com/mdp).


---


## Mastering Markdown

Markdown allows you to write using an easy-to-read, easy-to-write plain text format, which then converts to valid HTML for viewing.

[Mastering Markdown Guide](https://guides.github.com/features/mastering-markdown/).


## ~~strikethrough~~


## ++insert++


## ==mark==


## Emoji: :panda_face: :sparkles: :camel: :boom: :pig:

[Emoji Cheat Sheet](http://www.emoji-cheat-sheet.com/)


## Fontawesome: :fa-cab: :fa-flag: :fa-bicycle: :fa-leaf: :fa-heart:

[All the Font Awesome icons](http://fontawesome.io/icons/)


## Ionicons: :ion-printer: :ion-social-tux: :ion-lock-combination: :ion-ios-medkit: :ion-coffee:

[All the Ionicons icons](http://ionicons.com/)


## `print 'hello code'`

    evens = [1, 2, 3, 4, 5].collect do |item|
      item * 2
    end

```javascript
$(document).ready(function() {
  $('pre code').each(function(i, block) {
    hljs.highlightBlock(block);
  });
});
```

[Code Formatting](https://help.github.com/articles/markdown-basics/#code-formatting)


## Tables and alignment

First Header | Second Header
------------ | -------------
Content from cell 1 | Content from cell 2
Content in the first column | Content in the second column

| Left-Aligned  | Center Aligned  | Right Aligned |
| :------------ |:---------------:| -----:|
| col 3 is      | some wordy text | $1600 |
| col 2 is      | centered        |   $12 |

[Table Syntax](https://help.github.com/articles/github-flavored-markdown/#tables)


## Task list

- [ ] a bigger project
  - [x] first subtask
  - [x] follow up subtask
  - [ ] final subtask
- [ ] a separate task

[Task Lists Syntax](https://help.github.com/articles/writing-on-github/#task-lists)


## Footnote

Here is a footnote reference,[^1] and another.[^longnote]

[^1]: Here is the footnote.

[^longnote]: Here's one with multiple blocks.

    Subsequent paragraphs are indented to show that they
belong to the previous footnote.


Here is an inline note.^[Inlines notes are easier to write, since
you don't have to pick an identifier and move down to type the
note.]

[Footnote Syntax](http://pandoc.org/README.html#footnotes)


## Mathematical formula `$y = x^2$`

Inline math: `$\dfrac{ \tfrac{1}{2}[1-(\tfrac{1}{2})^n] }{ 1-\tfrac{1}{2} } = s_n$`.

Math block:

```math
\oint_C x^3\, dx + 4y^2\, dy

2 = \left(
 \frac{\left(3-x\right) \times 2}{3-x}
 \right)

\sum_{m=1}^\infty\sum_{n=1}^\infty\frac{m^2\,n}
 {3^m\left(m\,3^n+n\,3^m\right)}
 
\phi_n(\kappa) =
 \frac{1}{4\pi^2\kappa^2} \int_0^\infty
 \frac{\sin(\kappa R)}{\kappa R}
 \frac{\partial}{\partial R}
 \left[R^2\frac{\partial D_n(R)}{\partial R}\right]\,dR
```

[Mathematical Formula Syntax](http://meta.wikimedia.org/wiki/Help:Displaying_a_formula)


## Flowchart

```
graph TD
    A[Christmas] -->|Get money| B(Go shopping)
    B --> C{fa:fa-spinner Let me think}
    C -->|One| D[Laptop: fa:fa-laptop]
    C -->|Two| E[iPhone: fa:fa-mobile]
    C -->|Three| F[Car: fa:fa-car]
```

[Flowchart Syntax](http://knsv.github.io/mermaid/#flowcharts-basic-syntax)


## Sequence diagram

```
sequenceDiagram
    loop every day
        Alice->>John: Hello John, how are you?
        John-->>Alice: Great!
    end
```

[Sequence Diagram Syntax](http://knsv.github.io/mermaid/#sequence-diagrams)


## Gantt diagram

```
gantt
    dateFormat  YYYY-MM-DD
    title Adding GANTT diagram functionality to mermaid

    section A section
    Completed task            :done,    des1, 2014-01-06,2014-01-08
    Active task               :active,  des2, 2014-01-09, 3d
    Future task               :         des3, after des2, 5d
    Future task2               :         des4, after des3, 5d

    section Critical tasks
    Completed task in the critical line :crit, done, 2014-01-06,24h
    Implement parser and jison          :crit, done, after des1, 2d
    Create tests for parser             :crit, active, 3d
    Future task in critical line        :crit, 5d
    Create tests for renderer           :2d
    Add to mermaid                      :1d

    section Documentation
    Describe gantt syntax               :active, a1, after des1, 3d
    Add gantt diagram to demo page      :after a1  , 20h
    Add another diagram to demo page    :doc1, after a1  , 48h

    section Last section
    Describe gantt syntax               :after doc1, 3d
    Add gantt diagram to demo page      : 20h
    Add another diagram to demo page    : 48h
```

[Gantt Diagram Syntax](http://knsv.github.io/mermaid/#gant-diagrams)


## Subscript: H~2~O

You can also use inline math: `$H_2O$`


## Superscript: 29^th^

You can also use inline math: `$29^{th}$`

# Markdown Plus

![Markdown Plus](icon.png)
Markdown Plus is a lightweight markdown editor. Besides common markdown, GitHub flavored markdown, it also supports task lists, emojis, Font Awesome icons, Ionicons icons, Mathematical formulae, flowcharts, sequence diagrams and gantt diagrams.


#### Fork me on GitHub: <i class="fa fa-github" style="font-size: 64px;"/> [tylingsoft/markdown-plus](https://github.com/tylingsoft/markdown-plus).


We currently ***don't*** accept donations. The best way you could support our development is to buy our Mac app.

[![Markdown Plus Mac app](macappstore.png)](https://itunes.apple.com/us/app/markdown-plus/id972585766?mt=8)


## GitHub flavored markdown

| Left-Aligned  | Center Aligned  | Right Aligned |
| :------------ |:---------------:| -----:|
| col 3 is      | some wordy text | $1600 |
| col 2 is      | centered        |   $12 |
| zebra stripes | are neat        |    $1 |

[GitHub Flavored Markdown](https://help.github.com/articles/github-flavored-markdown/)


## Fenced code blocks

```python
from fabric.api import local

def update():
    local('rm -rf bower_components')
    local('bower cache clean')
    local('bower update')
```


## Task lists

- [ ] a bigger project
  - [x] first subtask
  - [x] follow up subtask
  - [ ] final subtask
- [ ] a separate task

[Task Lists Syntax](https://help.github.com/articles/writing-on-github/#task-lists)


## Emojis

<img src="emoji/smile" width="64"/>
<img src="emoji/whale" width="64"/>
<img src="emoji/santa" width="64"/>
<img src="emoji/panda_face" width="64"/>
<img src="emoji/dog" width="64"/>
<img src="emoji/truck" width="64"/>

[Emoji Cheat Sheet](http://www.emoji-cheat-sheet.com/)


## Font Awesome icons

<i class="fa fa-cloud" style="font-size: 64px;"/>
<i class="fa fa-flag" style="font-size: 64px;"/>
<i class="fa fa-car" style="font-size: 64px;"/>
<i class="fa fa-truck" style="font-size: 64px;"/>
<i class="fa fa-heart" style="font-size: 64px;"/>
<i class="fa fa-dollar" style="font-size: 64px;"/>

[All the Font Awesome icons](http://fontawesome.io/icons/)


## Ionicons icons

<i class="icon ion-beer" style="font-size: 96px;"/>
<i class="icon ion-key" style="font-size: 96px;"/>
<i class="icon ion-locked" style="font-size: 96px;"/>
<i class="icon ion-location" style="font-size: 96px;"/>
<i class="icon ion-plane" style="font-size: 96px;"/>
<i class="icon ion-ios-eye" style="font-size: 96px;"/>

[All the Ionicons icons](http://ionicons.com/)


## Mathematical formulae

```math
E = mc^2

\dfrac{ \tfrac{1}{2}[1-(\tfrac{1}{2})^n] }{ 1-\tfrac{1}{2} } = s_n

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

[Mathematical Formulae Syntax](http://meta.wikimedia.org/wiki/Help:Displaying_a_formula)


## Flowcharts

```
graph TD
    A[Hard edge] -->|Link text| B(Round edge)
    B --> C{Decision}
    C -->|One| D[Result one]
    C -->|Two| E[Result two]
```

[Flowchart Syntax](http://knsv.github.io/mermaid/flowchart.html)


## Sequence diagrams

```
sequenceDiagram
    Alice->>Bob: Hello Bob, how are you?
    alt is sick
        Bob->>Alice: Not so good :(
    else is well
        Bob->>Alice: Feeling fresh like a daisy
    end
    opt Extra response
        Bob->>Alice: Thanks for asking
    end
```

[Sequence Diagram Syntax](http://knsv.github.io/mermaid/sequenceDiagram.html)


## Gantt diagrams

```
gantt
    title A Gantt Diagram
    dateFormat  YYYY-MM-DD
    section Section
    A task           :a1, 2014-01-01, 30d
    Another task     :after a1, 20d
    section Another
    Task in sec      :2014-01-12, 12d
    anther task      : 24d
```

[Gantt Diagram Syntax](http://knsv.github.io/mermaid/gantt.html)

---
layout: page
title: Visualizing your data on the web using D3
---

> ## D3 Version {.callout}
> This tutorial uses D3 v7. Much of the tutorial was made with D3 v3 and some stray elements may be out-of-date. If you find an issue with the tutorial, please report it by [opening an issue](https://github.com/alackles/D3-visualising-data/issues). 

Open science should be visible science. And what better
way to make your research visible and accessible than putting it on the 
Internet? But no one wants to read endless tables of data. We’d rather
look at graphs, or, even better, have the possibility of interacting with the data.
And we have probably all created some graphs. But in order to make them 
accessible to many people, we will have to move away from our specialized
software to a more universal platform - the Web. 

We want to:

* Display our data on a website to increase visibility and accessibility of our research.

Our goal is to create a [dynamic bubble plot](http://bost.ocks.org/mike/nations/) (a prettier version of a scatter plot) and publish it on the Internet.

Along the way, we will learn:

* how to create our first own web page
* how to change the appearance of certain elements on the page
* how to integrate graphical elements into our page
* how to publish our page 
* how to allow interaction with elements
* how to store data for the use in webpages
* how to create a graph in D3

> ## Prerequisites {.prereq}
>
> * Familiarity with at least one programming language: concept of loops, functions, and conditionals.
> * Familiarity with your favorite text editor (we'll be using Sublime Text, but any text editor will do!).
> * A modern web browser with developer tools (we'll be using Chrome, but Firefox is also a good choice)

> ## Setup {.prereq}
>
> * Create a Github account (if you don't already have one) and make sure you have git installed on your computer (here's [a good option for Windows](https://git-for-windows.github.io/)). A graphical interface for git is nice to have if you don't want to do everything from the command line, but not necessary ([Mac and Windows](https://desktop.github.com/), [Linux](https://git-scm.com/download/gui/linux)).


## Topics

1.  [HTML](01-html.html)
2.  [CSS](02-css.html)
3.  [Images and SVG](03-images-and-svg.html) 
4.  [JavaScript](05-javascript.html)
5.  [D3 Setup](07-d3setup.html)
6.  [D3 Into the data](08-d3enter.html)
7.  [D3 Add and remove](09-d3exit.html)
8.  [D3 Transitions](10-d3update.html)
9.  [Lines (and other SVG paths)](11-paths.html)
10. [Maps](12-maps.html)
11. [Publishing with Github](04-publishing-with-github.html)
12. [What now?](xx-d3future.html)

We are using [gapminder data](http://gapminder.org) [reformatted by Jennifer Bryan](http://www.stat.ubc.ca/~jenny/notOcto/STAT545A/examples/gapminder/data/gapminderData.txt) and the later lessons are based on an example by [Mike Bostock](http://bost.ocks.org/mike/nations/). In order to make this example slightly easier, we interpolated the data. The data files can be found [here](http://alackles.github.io/D3-visualising-data/resources/nations.csv).
Lessons created by [Isabell Kiral-Kornek](https://github.com/isakiko) and [Robert Kerr](https://github.com/robrkerr) and modified for this workshop by [Emily Dolson](https://github.com/emilydolson). Updated for D3 v7 by [Acacia Ackles](https://github.com/alackles).

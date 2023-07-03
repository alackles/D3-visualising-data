---
layout: page
title: D3 setup
subtitle: Setting up html for our data visualisation
minutes: 20
---

> ## Learning Objectives {.objectives}
> 
> * Setting up an html file to contain the plot
> * Reading in data from a given `.json` file
> * Structuring the html content

We've finally learned everything we need to know to start using D3. 
D3 is a JavaScript library. This means that we can use all of the JavaScript commands that we have already learned, but on top of these, there are a few new functions that will make our life easier.

The main purpose of D3 is to create visualisations of data online. Because it uses JavaScript, it is possible to make graphs interactive! 

As a little refresher, we will repeat a little bit of html to set up our page. 

Create `index.html` containing the following:

~~~{.html}
<!DOCTYPE html>
<html>
  <head>
    <title>The Wealth & Health of Nations</title>
    <link rel="stylesheet" type="text/css" href="main.css" />
  </head>
  <body>

    <h1>The Wealth & Health of Nations</h1>

    <div id="chart_area"></div>

    <script src="http://d3js.org/d3.v5.min.js"></script>
    <script src="main.js"></script>
  </body>
</html>
~~~

There are a few things in this file that look new:
`<link rel="stylesheet" type="text/css" href="main.css" />` is linking the local CSS file `main.css`(that can just be an empty file for now). `<script src="main.js"></script>` is linking the JavaScript file, the file in which all the action will happen. 

Additionally, we now need to link d3 using `<script src="http://d3js.org/d3.v3.min.js"></script>`. The order matters. Since code is executed sequentially and we want to use parts of the D3 library in our own script, we have to link to d3.js first.

The last bit, that's important here is an HTML element (div) we create. We give it an id `chart_area`. This is the area we reserve for our pretty chart. We will use JavaScript (and D3) to fill it in. 

Now, let's write main.js.

D3-specific functions can be called using a `d3.`-syntax.

The first thing we need, is of course our data, which is stored at 'http://alackles.github.io/D3-visualising-data/resources/nations.csv'.
D3 provides a handy function to read in `csv`-files:

~~~{.d3}
d3.csv("http://alackles.github.io/D3-visualising-data/resources/nations.csv").then(function(nations){ })
~~~

This line probably needs a little explanation and we'll go through it bit by bit: 

* `d3.csv()` is called the function call. In this case, we have a function that reads in a json file, parses it, and is also able to do something with the parsed data on the way.
* The argument `"http://alackles.github.io/D3-visualising-data/resources/nations.csv"` tells the function where to get the data we want to have parsed.
* `.then()` tells d3 to load the data in `d3.csv()` first, and then apply any manipulations we specify afterwards. 
* `function(nations) {...}` is called the callback function. It is a so-called 'inline' function, which means it has no name (we're only operating in the object space here). This also means we can't use this function anywhere else in our code. 
* The code we put inside the curly brackets is the code that's run once d3.json() is called and the data is loaded.
* D3 assigns the name `nations` to the parsed object it returns. We can only use 'nations' within the callback function, this means our code only knows of `nations` inside the curly brackets. This means most of our visualization code will need to go inside the curly brackets.
* What seems unusual, but is actually quite common, is that this function call doesn't return anything. It is simply executed and displayed (if we tell it to), but no value is returned. 


> ## What else can I read in conveniently? {.callout}
> D3 offers the possibility to also read in tsv, json, and other types of files directly. See [here](https://github.com/mbostock/d3/wiki/CSV) for an example.

If we start by looking at `nations` with the `console.log()` function, we can 
see that D3 has interpretted the csv file relatively intelligently. It gave us
an array of Javascript objects, each of which represents one row in the original
file. These objects each have a property for each column. The names of these
properties are based on the names that the header gave to each column in the 
csv. There's one thing that D3 isn't quite smart enough about, though - the
types of the variables. It's assuming everything is a string - a series of
characters. You can tell because there are quotation marks around the numbers.
We can fix this by passing in another argument to `d3.csv()`. This argument 
will be another function, which will be called on each of the objects 
representing rows of the csv file:

~~~{.js}
var accessor = function(d){ 
    return {
	country: d.country,
	year: +d.year,
	pop: +d.pop,
	continent: d.continent,
	lifeExp: +d.lifeExp,
	gdpPercap: +d.gdpPercap
    };
}
~~~

The `+` signs tell Javascript to interpret that variable as a number. We can
stick this into the call to the `d3.csv()` function as the second argument:

~~~{.js}
d3.csv("http://alackles.github.io/D3-visualising-data/resources/nations.csv", accessor).
  then(function) {
   //Awesome visualizations here!
  }
~~~

So naturally, the next step is to think about what we want to happen between the curly brackets.
For now, we want to:

* Link JavaScript to HTML page
* Insert an SVG canvas
* Create axes (x: income per capita, y: life expectancy)
* Display data points (scatter plot)

First, let's draw a little schematic of how we want the page to be structured.

<img src="img/chart_area.png" alt="What we want.." width="700" />

We already set up our HTML page to contain a chart area. That's the space we want to 
fill now. 
We'll have a picture frame (an SVG-element), our drawing area (a g-element), and in 
that drawing area, we'll have separate elements for both axes and the area for our circles.

What we now want to end up with in our html document is this:

~~~{.html}
<div id="chart_area"> </div>
~~~

But this time, we want to create these elements automatically using JavaScript only.
First, we need to link the JavaScript and HTML environment so that we have writing access
to the HTML.
To do this, we use the `.select()`. This lets us grab an element by specifying its ID.

~~~{.js} 
// Select the chart area by ID 
var chart_area = d3.select("#chart_area");
~~~

Now we're setting up the grid by appending the chart area by the SVG picture frame.

~~~{.js} 
var frame = chart_area.append("svg");
~~~

in the HTML file. We chose to append because we now have access to the 
SVG element without the need to seperately select it by ID.

We also create the canvas inside the frame:

~~~{.js}
// Create canvas inside frame.
var canvas = frame.append("g");
~~~

Let's set up the dimensions for our elements that we want to use:

~~~{.js}
// Set margins, width, and height.
var margin = {top: 19.5, right: 19.5, bottom: 19.5, left: 39.5};
var frame_width = 960;
var frame_height = 350;
var canvas_width = frame_width - margin.left - margin.right;
var canvas_height = frame_height - margin.top - margin.bottom;
~~~

...and apply them to the actual elements:

~~~{.js}
// Set frame attributes width and height.
frame.attr("width", frame_width);
frame.attr("height", frame_height);
~~~

The canvas element will have to fit nicely into the frame. To make it fit, we 
set a transform attribute and use the translate function. 

~~~{.js}
// Shift the canvas and make it slightly smaller than the svg canvas.
canvas.attr("transform", "translate(" + margin.left + "," + margin.top + ")");
~~~

> # Adding SVGs from JavaScript file {.challenge}
> 1. Add a SVG circle element to the frame.
> 2. Once the circle reference is obtained, make the radius 40px, the border black and the colour green.
>
> HINT: You can use the `attr` method on the circle object obtained.

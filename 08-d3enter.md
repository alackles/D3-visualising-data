---
layout: page
title: D3 - Into the data
subtitle: Actually plotting things
minutes: 20
---

> ## Learning Objectives {.objectives}
> 
> * Making axes
> * Actually plotting data (d3.enter)


We design our axes based on our data. This means we have to know the minimum and 
maximum values of our data and have to decide whether we want linear or logarithmic
axes.


~~~{.js}
// Create a logarithmic scale for the income 
var xScale = d3.scaleLog(); // income
xScale.domain([250, 1e5]); // set minimum and maximum value
xScale.range([0, canvas_width]); // set minimum and maximum range on the page
~~~

D3's scale object provides a number of subfunctions to create the scaling we want 
for our data. For example, we can choose between a logarithmic scale (`scaleLog`), a 
linear scale (`scaleLinear`), a square root scale (`scaleSqrt`), or a categorical scale 
(e.g. `scaleOrdinal(d3.schemeCategory20)` can represent 20 different colours).

The domain consists of the data values that will get mapped to the minimum and maximum positions on the page specified by the range. Often, the domain will be set to the minimum and maximum values of the data and the range to the edges of the plotting area. 


Instead of spreading this code over three lines, we often find another notation 
online that achieves the same thing:

~~~{.js}
var xScale = d3.scaleLog().domain([300, 1e5]).range([0, canvas_width]);  
~~~

These two notations are interchangeable and it is entirely up to you to use the 
one that seems more intuitive to you. 
In the same way that we could switch setting up the domain and range in the more 
verbose notation, we can swap these two in the shorter notation without it making 
any difference. 

The next step is to create the actual axis and linking it to the scale we just 
created:

~~~{.js}
// Creating the x axis.
var xAxis = d3.axisBottom(xScale);
~~~

`axisBottom` and similar methods affect the location of the axes.

So far, the xAxis exists, but it's not actually showing up anywhere on the page.
To push the axis to our canvas, we create a new group element (using `.append`).

~~~{.js}
// Add the x-axis.
canvas.append("g")
	.attr("class", "x axis")
  .attr("transform", "translate(0," + canvas_height + ")")
  .call(xAxis);
~~~

`.call()` calls the axis we just created and pushes it to the element.
We add a transform attribute to move the axis to the bottom of the plotting area (instead of having it across the top). There are a number of transform options, but here we are just using `translate` and pass in the amount to shift the axis in the x and y directions, respectively. Here we shift it only in the y direction (i.e. down) by an amount given by height of the canvas.  
We also give it a class, just in case we might want to select the axis later in our code.

> # We might need a y-axis, too {.challenge}
> Create a linear scale for the y-axis, with 10 being the minimum and 85 being the maximum value. Then, add the axis to the canvas.
> 
> Hint #1: You probably want to orient the axis "left"
> Hint #2: Remember that SVG coordinates are flipped from what you might expect 
> - (0,0) is the upper left corner.

We're slowly getting there. Having our two axes, we can now finally add our data. 

And now we're ready to add one circle per data point! 

~~~{.js}
var data_canvas = canvas.append("g")
  .attr("class", "data_canvas");
      
var circles = data_canvas.selectAll("circle")
  .data(nations, function(d){return d.country});

circles.enter().append("circle").attr("class","data_point")
  .merge(circles)
	.attr("cx", function(d) { return xScale(d.gdpPercap); }) 
	.attr("cy", function(d) { return yScale(d.lifeExp); })
	.attr("r", 5);
~~~

We're starting this bit by adding a `g` element to our canvas.
This group is going to be our data canvas, so that's the class name we give it.
We then select all circles. This is an empty set at the moment,
since we haven't created any circles, yet.
We are then telling our page where to find the data, using `.data(nations)`.

We are also inserting what is called a key function `.data(nations, function(d){return d.country});`. This function will help D3 keep track of the data when we start changing it (and the order of the objects). It's important to keep the identifier unique, which is why we return only the country of the current element.

Now comes the interesting part:
The function `enter()` takes each element in the dataset and does everything that follows afterwards for each of these elements we're adding in. These new circles need to be added with the class 'data_point', so that next time we call `data_canvas.selectAll(".data_point")` we get the circles that have already been added to our plot.

We then need to make sure we are operating on each individual element in our selection (in this case, the circles) instead of operating on the selection as a group. To accomplish this, we manually "merge" all the datapoints that we have just added into our class with `.merge(circles)`.

What we want to do is to create one circle for each data point. That's
what the last four lines of code do. They are creating the circle, and then setting 
the attributes `cx`, `cy`, and `r`. 
The attributes `cx` and `cy` define the position of the centre of the circle and are based on the income (we are looking at the most recent data point: `[nation.income.length-1]`.) and life expectancy of the data point (that is temporarily called `d`). The radius is set to an 
arbitrary number... for now.

Right now, we're displaying data from a semi-random year.  We can use the 
`filter()` function to just look at the most recent data (2007):

~~~{.js}
var filtered_nations = nations.filter(function(nation){return nation.year==2007})
~~~

Similar to previous functions, this function iterates over each of the 
elements in the array `nations`, temporarily calling it `nation`. It only 
includes elements in the new array `filtered_nations` if the function evaluates
 to 'true' for that element. Here this will be the case for data points whose 
year is 2007.


> # Filtering by region {.challenge}
> You might have noticed that our data contains information about the continent in 
> which a country is.
> 
> Create a filter so that you only display data points from "Africa".


> # A new dimension {.challenge}
> Change the code so that the radius of the circles represents the population. First, create a 'sqrt' scale (`d3.scaleSqrt()`) with a minimum of 0 and a maximum of 5e8. The range should be between 0 and 40. 


<iframe src="http://alackles.github.io/D3-visualising-data/code/index08.html" width="1000" height="600"></iframe>

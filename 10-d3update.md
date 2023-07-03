---
layout: page
title: D3 - Transitions
subtitle: Move it!
minutes: 20
---

> ## Learning Objectives {.objectives}
> 
> * Using a slider 
> * Updating data points using d3.transition

At the moment, the year that we are looking at in the data is hardcoded. 
Naturally, we want the user to be able to see how the data changes over time. 

Let's do this with a slider. The first thing we need to do is add this slider to the user interface (our website). A slider element is actually an `input` element with the the type `range`. We give it an ID in order to be able to select it from our JavaScript script, a class to style it (if we choose to), and a minimum, maximum, and step size that depend on our data. `value` is what we read out in order to know the position of the slider. Let's initialise it somewhere in the middle (1979).

~~~{.html}
<input type="range" name="range" class="slider" id="year_slider" value="1979" min="1950" max="2008" step="1" ><br>
~~~

In our script, we now want the year to be a variable, so we need to initialise it. 
Because the value is a string, we need to parse it to an integer using `parseInt()`.

~~~{.js}
var year = parseInt(document.getElementById("year_slider").value);
~~~

Now we need add another event listener that changes the year the moment we touch the slider. The event we want to listen for is called `input`. When we get an event, we need to add a new filter command to update the data.  We then execute the `update()` function we wrote earlier.

~~~{.js}
d3.select("#year_slider").on("input", function () {
	year = parseInt(this.value);
	filtered_nations = nations.filter(function(nation){nation.year==year})
	update();
});
~~~

Uh-oh, looks like this doesn't play nicely with our checkboxes! Let's add a line
to our filter function to make sure that this continent is currently checked:

~~~{.js}
d3.select("#year_slider").on("input", function () {
	year = parseInt(this.value);
	filtered_nations = nations.filter(function(nation){
		//Grab the checkbox corresponding to this country
		var checkbox = d3.selectAll(".region_cb")[0].filter(
			function(cb){return this.value == nation.continent})[0];

		//If the checkbox is checked, see if the year matches
		if (checkbox.property("checked")){		
			 return(nation.year==year)
		} else {
		       //Otherwise it doesn't matter what the year is
		       return(false)
		}
	})
	update();
});
~~~


So far, the update function is instantaneously updating the appearance of all
circles when the data changes. If we want ppeople to watch circles change
over time, this is neither pretty or helpful. 
To fix this, D3 also offers the `d3.transition` function to handle updating data. First, we need to define how to transition between data points. We might want to interpolate between to values linearly over the duration of 200 ms, like this: 

~~~{.js}
circles.transition().ease("linear").duration(200);
~~~

Now we know how it's gonna happen, but we need to tell the transition what the actual change is. 
We can simply move the part of our code that updates the circle attributes from our `enter` function to our `transition` function. 

~~~{.js}
circles.enter().append("circle").attr("class","data_point")
        .style("fill", function(d) { return colorScale(d.continent); });
circles.exit().remove();
circles.transition().ease("linear").duration(200)
	    .attr("cx", function(d) { return xScale(d.gdpPercap); }) 
	    .attr("cy", function(d) { return yScale(d.lifeExp); })
	    .attr("r", function(d) {return rScale(d.pop)});
~~~

> ## Other transition functions you might want {.callout}
> * sin - applies the trigonometric function sin.
> * exp - raises 2 to a power based on t.
> * bounce - simulates a bouncy collision.
> * elastic(a, p) - simulates an elastic band; may extend slightly beyond 0 and 1.
> * [more here](https://github.com/mbostock/d3/wiki/Transitions#d3_ease)

> # Play time {.challenge}
> D3 is incredible versatile. Try out different transitions and if you have time, maybe try drawing rectangles instead of circles.

Next, we might want to create a tooltip. Let's go have a look at what's already out there. 
The creator of D3 has put up some code for pretty much everything you can imagine. The example for a simple tooltip can be found [here](http://bl.ocks.org/biovisualize/1016860).
We need to first create the variable tooltip:

~~~{.js}
var tooltip = d3.select("body")
	.append("div")
	.style("position", "absolute")  
	.style("visibility", "hidden");
~~~

and then create event listeners for moving the mouse into a circle and out of one. Different from the example on the web page, we want to display the specific country we are looking at. When we move the mouse, we want the tool tip to move with it. And the moment we leave a circle, we want the tool tip to hide again.

~~~{.js}
circles.enter().append("circle").attr("class","dot")				      	
			.style("fill", function(d) { return colorScale(d.region); })
			.on("mouseover", function(d){return tooltip.style("visibility", "visible").text(d.name);})
			.on("mousemove", function(){return tooltip.style("top", (d3.event.pageY-10)+"px").style("left",(d3.event.pageX+10)+"px");})
			.on("mouseout", function(){return tooltip.style("visibility", "hidden");});
~~~

> ## We have used some special objects given to us by the browser {.callout}
> * document.x - selecting things within the page (getElementById)
> * console.x - interact with the browser's console (log)
> * event.x - only interesting in the scope of an event like "mouseover", "mousemove", "keydown". Returns information about the event (pageX - where on the page did this event occur?). 

> # ...style! {.challenge}
> Add axis labels and make the fonts pretty. 

By the end of this lesson, your page should look something like this:

<iframe src="http://alackles.github.io/D3-visualising-data/code/index10.html" width="1000" height="600"></iframe>

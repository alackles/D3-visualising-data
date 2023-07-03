---
layout: page
title: D3 - Add and remove
subtitle: Dynamically adding and removing data points
minutes: 20
---

> ## Learning Objectives {.objectives}
> 
> * Filtering data
> * Creating checkboxes
> * Adding and removing data points (d3.enter and d3.exit)

Our plot is pretty busy. We might not want to display everything all the time.
The goal for this lesson is to update the plot based on what kind of data we 
want to display. 

We have now hard-coded a criterion for the data we want to display. Naturally, 
we might want to change what data gets displayed interactively using elements 
on our page. Let's create some checkboxes that let us add and remove the 
regions that we want to include. To do this, we will have to switch back to 
our HTML file for a while.

Now, instead of displaying all the data all the time, we want to be able to 
choose which data we display. We will create a checkbox for each continent and 
only display the data for the continents that are checked.

Checkboxes will need to be added to the HTML page. Since we want to add and 
remove data, we'll have to add a checkbox for each continent like the following
 one. Checkbox elements are actually `input` elements with type `checkbox`. 
Initially, we want all checkboxes to be checked. We do this by setting the 
`checked` attribute of the element to 'checked'. 

~~~{.html}
<label><input type="checkbox" name="region" class="region_cb" value="Africa" checked="checked"/> Africa</label>
~~~

The next step is to add an event listener to the JavaScript file. Luckily, D3 provides us with some nice options. The `value` needs to be set to the region, because this is the value we want to filter our data by later. 

~~~{.js}
d3.selectAll(".region_cb").on("change", function () { <--- stuff happens here ---> });
~~~

This line listens to all checkboxes that have the class `region_cb`. Every time a checkbox's status changes from checked to unchecked or unchecked to checked, the following function is executed.  

Inside this function, we want to decide what happens based on which of the checkboxes got checked or unchecked. The first step to doing this is to read out the value of the checkbox. We set this value to the region string earlier. Reading it can be done using the `this` keyword. `this` inside a callback function refers to the element through which the function got called, in our case the checkbox. 

~~~{.js}
var continent = this.value;
~~~

Now that we have the region string saved in `type`, we want to add the data points for the new nations to include if the checkbox is now checked. Whether it is checked or not is stored in `this.checked`. To add the new nations to `filtered_nations`, we use the `concat` function, which, similar to the `concat` function we used with strings, joins the array given as an argument onto the end of the first array. Here we join `new_nations` onto the end of `filtered_nations`. 

~~~{.js}
if (this.checked) { // adding data points 
  var new_nations = nations.filter(function(nation){ return nation.continent == continent;});
  filtered_nations = filtered_nations.concat(new_nations);
}
~~~

This `if`-statement gets executed every time a checkbox is checked. To add the data points, we can use the `push`-function, which adds one object to an array at a time. 
First, we filter the nations we want to add, calling them `new_nations`. Next, we are looping through all new nations and add one at a time to the array `filtered_nations`.

We are initially making `filtered_nations` be the same as `nations` because initially all of the checkboxes are checked and we are displaying the data from all of the nations. This also means that any checkbox that is changed from this point will actually be changing to the unchecked state and not entering the `if`-statement we just made. So we need to add some code to remove elements when the state of a checkbox changes to unchecked. 

But before doing this, we need to learn how to remove elements using D3. This is done using the `exit()` function. 

~~~{.js}
circles.exit().remove();
~~~

Whereas before `enter()` was used to append new elements to the plot, `exit()` is used to remove elements from the plot that are no longer in the dataset. Both functions compare the data that has been specified to what elements are in the plot (on the page). As for `enter()`, everything that follows `exit()` is performed for each of the elements that no longer have data points corresponding to them. Here (and in most cases) we want to remove these elements. 

A good, brief explanation of this linking between data and elements on the page can be found [here](http://bost.ocks.org/mike/join/). This article discusses the three important functions used for this: `enter`, `exit`, and a third function `update` that we will get to shortly. 

> # Removing elements {.challenge}
> Using an `else` case after the `if` statement, create a filter that removes elements from `filtered_data` that correspond to the checkbox that was just unchecked. (i.e. `else { filtered_nations = <--- fill in this bit --->}`). 

> # Another new dimension {.challenge}
> Have the colour of circles represent the region. Use category10() to make a scale. You will then need to add `.style("fill", function(d) { <-- fill in this bit ---> });` to the enter() function.


As a last step, let's move `enter()` and `exit()` into a separate function. This will become useful when we want to update the data from different elements on the page. We'll also split the enter section into things that only need to happen
to entering circles and things that need to be performed on both the enter and
update selections:

~~~{.js}
function update() {
  var circles = data_canvas.selectAll("circle").data(filtered_nations, function(d){return d.country});

  circles.enter().append("circle").merge().attr("class","data_point");

  circles.exit().remove();

  circles.attr("cx", function(d) { return xScale(d.gdpPercap); }) 
	  .attr("cy", function(d) { return yScale(d.lifeExp); })
	  .attr("r", function(d) {return rScale(d.pop)});
}
~~~

This means that we now have to call the update function from our event listener after updating `filtered_nations` based on the checkbox change:

~~~{.js}
d3.selectAll(".region_cb").on("change", function() {
  var continent = this.value;
  if (this.checked) { // adding data points (not quite right yet)
    var new_nations = nations.filter(function(nation){ return nation.continent == continent;});
    filtered_nations = filtered_nations.concat(new_nations);
  } else { // remove data points from the data that match the filter
    filtered_nations = filtered_nations.filter(function(nation){ return nation.continent != continent;});
  }
  update();
});
~~~

In order to create the plot when we first load the page, we will also have to call `update()` outside of our event listeners once. 

By the end of this lesson, your page should look something like this:

<iframe src="http://alackles.github.io/D3-visualising-data/code/index09.html" width="1000" height="600"></iframe>

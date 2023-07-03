---
layout: page
title: D3 - Maps
subtitle: Because checkboxes are boring
minutes: 20
---

> ## Learning Objectives {.objectives}
> 
> * Making a map in D3 
> * Using event bindings to link graphical elements together

Right now, we have circles colored by continent, but it's not obvious which
continent stands for which color. Since D3 also handles maps really nicely,
let's replace the checkboxes with a map that lets us select and de-select
continents. If color the continents the same way as the circles, it will double
as a legend!

First, let's make a new canvas to hold all of our map stuff. We'll append this
to our `frame` element, so that it ends up on the same SVG canvas as our other
shapes:

~~~{.js}
var map_canvas = frame.append("g");
var map_width = 300;
var map_height = 150;
~~~

Since there's a nice strong postive correlation between income and 
life-expectancy, that lower right corner of the graph looks like a good place
for the map. We can position it there by subtracting the map canvas' height
and width from the main canvas' height and width, and moving the map canvas to
there:

~~~{.js}
var upper_x = canvas_width - map_width;
var upper_y = canvas_height - map_height;
map_canvas.attr("transform", "translate(" + upper_x + "," + upper_y + ")" );    
~~~

Okay, great. Now we need to get some data telling us what the continents on 
earth actually look like. The easiest format to use this data in is `.json`.
JSON stands for JavaScript Object Notation, and it looks exactly like 
Javascript objects that we've already seen.
Technically, the file that we're going to use here is in 
`[TopoJSON](https://github.com/mbostock/topojson)` format, which allows for easy
description of geographic shapes. A JSON file containing outlines for all of 
the continents is available 
[here](http://alackles.github.io/D3-visualising-data/resources/continents.json). We can load this file with the `d3.json()` function, which works
just like `d3.csv()` except that it loads a JSON file:

~~~{.js}
d3.json("http://alackles.github.io/D3-visualising-data/resources/continents.json", function(continent_data) {
//All of our map stuff happens here
}
~~~

This file contains an array of five `FeatureCollection` objects. D3 understands 
how to convert these objects into paths, so we don't need to worry too much 
about their contents. We can just bind them to a selection like we did before:

~~~{.js}
var continents = map_canvas.selectAll(".continent").data(continent_data);
~~~

Here, we have selected all of the objects within `map_canvas` that have class
`continent` (currently nothing), and bound the data from the JSON file to them.
Since the selection we bound the data to was empty, everything will be in the
`enter` selection. For each element, we want to add a path. Since these are
geographic paths, we're going to use the `d3.geo.path()` function instaed of
the normal `d3.path()` function, so that D3 will be able to handle the
eccentricities of geographic data:

~~~{.js}
continents.enter().append("path")
	.merge()
	.attr("class", "continent")
	.attr("d", d3.geo.path())
	.attr("name", function(d) {return d.name;}
	.style("fill", function(d) { return colorScale(d.name); })
~~~

Well that's sure a big map. If we want to control it, we'll need to customize
the `d3.geo.path()` function a little bit. Just like our axes were governed
by a `scale` object with `domain` and `range` to tell it how 
incoming numbers should map to pixels on the webpage, `geo.path` objects have
an associated `projection` object that tells them how geographic coordinates 
should map to your web-page. In the case of maps it's a little more complicated,
though, because mapping points on a sphere to a flat surface invariably
introduces distortions. People have come up with many different
map projections over the years, each of which have their own strengths and 
weaknesses ([your favorite says a lot about you](http://xkcd.com/977/)). D3
has [many](https://github.com/mbostock/d3/wiki/Geo-Projections) built-in, and
just about any that you could ever want in the 
[Extended Geographic Projections library](https://github.com/d3/d3-geo-projection/). For now, let's use the equirectangular projection because, 
in the words of XKCD, "[this one's fine](http://xkcd.com/977/)":

~~~{.js}
var projection = d3.geo.equirectangular()
    .translate([(map_width/2), (map_height/2)])
    .scale( map_width / 2 / Math.PI);
var path = d3.geo.path().projection(projection);
~~~

This will center the projection in our map canvas, scale it appropriately, and
then create a `geo.path` that uses it. We can now go back and use it to create
the continent paths:

~~~{.js}
continents.enter().append("path")
	.merge()
	.attr("class", "continent")
	.attr("d", path)
	.attr("name", function(d) {return d.name;}
	.style("fill", function(d) { return colorScale(d.name); });
~~~

There, that's better! 

> # Try out another projection! {.challenge}
> Swap out the equirectangular projection for something more exciting!
> Remember that if you want to use one of the maps from the extended library
> you need to add the link to it to your html file:
>
> `<script src="http://d3js.org/d3.geo.projection.v0.min.js" charset="utf-8"></script>`
> 

Now let's add the interactions so that we can use
the map instead of the checkboxes. We want to bind an interaction to each
continent so something happens when we click on it. Conveniently, since we
gave all of the continents their own class, we can easily select all of them.
We'll also use classes to keep track of which continents are currently selected
vs. unselected. Other than that, this is going to be really similar to
our checkbox function:

~~~{.js}
map_canvas.selectAll(".continent").on("click", function(d){
    if (d3.select(this).classed("unselected")){
       //We're adding data points
       d3.select(this).classed("unselected", false)
       var new_nations = nations.filter(function(nation){
       	   return nation.continent == d.name && nation.year==year;});
       filtered_nations = filtered_nations.concat(new_nations);

	
    } else {
    	//we're removing data points
	d3.select(this).classed("unselected", true)
	filtered_nations = filtered_nations.filter(function(nation){
		return nation.continent != d.name;});
    };
    update();
});
~~~

We used a few new things here. The `this` keyword refers to the continent that
this function is bound to. D3's `classed` function returns true if the selection
has the specified class, or, if there's a second argument, adds or removes that
class based on whether the second argument is `true` or `false`. So, in this
function, we toggle whether or not the selection has the class `unselected`.

One thing that was nice about the checkboxes is that we could see which ones
were selected. Let's make it so the map can do the same thing! We can decrease
the opacity of continents when their data isn't being displayed. Since we've
already assigned a class to the unselected continents, we can do this in our
CSS stylesheet:

~~~{.css}
.unselected {
    opacity: .5;
}
~~~

Ta-da!

> # Fix the slider {.challenge}
> Now that we've changed how we select data, the slider doesn't know how to
> correctly check for continents it should be leaving out. Fix it so that
> it checks for continents with the `unselected` class. 
>
> Hint: `.classed()` works on selections - we don't need to worry about picking
> out just the element itself like we did with checkboxes.

> # Add a box around the map {.challenge}
> That map is kind of looking like it's hovering in the middle of nowhere.
> Add a box around it to make it look more like a legend.
>
> Hint: The `rect` SVG element lets you specify a `stroke` color and a `fill`
> color independently.

> # More practice with maps! {.challenge}
> A json file describing the shapes of all of the countries (as of 2015) is
> available at
> http://alackles.github.io/D3-visualising-data/resources/countries.json.
> See if you can use it to make a map that shows the countries.

By the end of this lesson, your page should look something like this:

<iframe src="http://alackles.github.io/D3-visualising-data/code/index11.html" width="1000" height="600"></iframe>

The continents.json file was generated based on the code for 
[this map projection explorer](http://techslides.com/continents-and-map-projections-with-d3-js)
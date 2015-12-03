// Do the set-up

   
// Create the SVG frame inside chart_area.
var chart_area = d3.select("#chart_area");
var frame = chart_area.append("svg");
    
// Create canvas inside frame.
var canvas = frame.append("g");

// Set margins, width, and height.
var margin = {top: 19.5, right: 19.5, bottom: 19.5, left: 39.5};
var frame_width = 960;
var frame_height = 350;
var canvas_width = frame_width - margin.left - margin.right;
var canvas_height = frame_height - margin.top - margin.bottom;

    
// Set svg attributes width and height.
frame.attr("width", frame_width);
frame.attr("height", frame_height);


// Shift the chart and make it slightly smaller than the svg canvas.
canvas.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

var map_canvas = frame.append("g");
var map_width = 300;
var map_height = 150;
var upper_x = canvas_width - map_width;
var upper_y = canvas_height - map_height;

map_canvas.attr("transform", "translate(" + upper_x + "," + upper_y + ")" );

// Various scales. These domains make assumptions of data, naturally.
var xScale = d3.scale.log(); // income
xScale.domain([250, 1e5]);
xScale.range([0, canvas_width]);  

// d3 has a subobject called scale. within scale, there are a number of functions to create scales.
// e.g. log, linear, sqrt, category10 (e.g. 10 different colours)... 
// we set the domain based on our data - min and max of the data
// we set the range - range on the page
// domain, range, log scale all determing data values are mapped to graph positions.

var yScale = d3.scale.linear().domain([10, 85]).range([canvas_height, 0]);  // life expectancy
var colorScale = d3.scale.category10();

// an alternative notation that d3 offers is to chain everything together using the dot-syntax 
// (you'll see this a lot). The order is mostly arbitrary. 

// Creating the x & y axes.
var xAxis = d3.svg.axis().orient("bottom").scale(xScale);
var yAxis = d3.svg.axis().scale(yScale).orient("left");

var rScale = d3.scale.sqrt().domain([0, 5e8]).range([0, 40]); // life expectancy

// Next step: push the axes into the chart
// Add the x-axis.
canvas.append("g")
    .attr("class", "x axis")
    .attr("transform", "translate(0," + canvas_height + ")")
    .call(xAxis)
    .append("text")
    .attr("class", "x label")
    .attr("text-anchor", "end")
    .attr("x", canvas_width)
    .attr("y", - 6)
    .text("income per capita, inflation-adjusted (dollars)");

// .call is the bit where the properties we just set are pushed to the object
// attribures are added to make it look pretty (class is used in the css file)


// Add the y-axis.
canvas.append("g")
    .attr("class", "y axis")
    .call(yAxis)
    .append("text")
    .attr("class", "y label")
    .attr("text-anchor", "end")
    .attr("y", 6)
    .attr("dy", ".75em")
    .attr("transform", "rotate(-90)")
    .text("life expectancy (years)");;

//////////////////////AXES CREATED//////////////////////////

////////////////////MAKE MAP///////////////////////////////
var continents;
var projection = d3.geo.equirectangular()
    .translate([(map_width/2), (map_height/2)])
    .scale( map_width / 2 / Math.PI);
var path = d3.geo.path().projection(projection);

d3.json("../resources/continents.json", function(outlines) {
    
    var continents = map_canvas.selectAll(".continent").data(outlines);
    
    continents.enter().append("path")
	.attr("class", "continent")
	.attr("d", path)
	.attr("name", function(d) { return d.name; })
	.style("fill", function(d) { return colorScale(d.name); });
});


// Load the data.

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

d3.tsv("http://emilydolson.github.io/D3-visualising-data/resources/nations.csv", accessor, function(nations) {

    //Initialize variables:
    var year = parseInt(document.getElementById("year_slider").value);
    var filtered_nations = nations.map(function(nation) { return nation;});
    filtered_nations = nations.filter(
	function(nation){return nation.year==year}
    );

    var data_canvas = canvas.append("g").attr("class", "data_canvas")

    //////////////////////FILL IN DATA//////////////////////////

    // update the plot, includes enter, exit, and transition
    function update() {
	var circles = data_canvas.selectAll("circle")  // magic! 
	    .data(filtered_nations, function(d){return d.country});

	circles.enter().append("circle").attr("class","data_point")
	    .style("fill", function(d) { return colorScale(d.continent); });
	
	circles.exit().remove();
	
	circles.transition().ease("linear").duration(200)
	    .attr("cx", function(d) { return xScale(d.gdpPercap); }) 
	    .attr("cy", function(d) { return yScale(d.lifeExp); })
	    .attr("r", function(d) {return rScale(d.pop)});
    }

    update();

    // slider
    d3.select("#year_slider").on("input", function () {
	year = parseInt(this.value);
	filtered_nations = nations.filter(function(nation){
	    //Grab the checkbox corresponding to this country
	    var checkbox = d3.selectAll(".region_cb")[0].filter(
		function(cb){return cb.value == nation.continent})[0];
	    //If the checkbox is checked, see if the year matches
	    if (checkbox.checked){		
		return(nation.year==year)
	    } else {
		//Otherwise it doesn't matter what the year is
		return(false)
	    }
	})
	update();
    });
    console.log("binding?")
    map_canvas.selectAll(".continent").on("click", function(d){
	
	if (d3.select(this).classed("unselected")){
	    //We're adding data points
	    d3.select(this).classed("unselected", false)
	    var new_nations = nations.filter(function(nation){
		return nation.continent == d.name && nation.year==year;});
	    filtered_nations = filtered_nations.concat(new_nations);
	    update();
	
	} else {
	    //we're removing data points
	    d3.select(this).classed("unselected", true)
	    filtered_nations = filtered_nations.filter(function(nation){
		return nation.continent != d.name;});
	    update();
	};
    });
    console.log("Bound?")

    // check boxes
    d3.selectAll(".region_cb").on("change", function() {
	var type = this.value;
	if (this.checked) { // adding data points (not quite right yet)
	    var new_nations = nations.filter(function(nation){ return nation.continent == type;});
	    filtered_nations = filtered_nations.concat(new_nations);
	} else { // remove data points from the data that match the filter
	    filtered_nations = filtered_nations.filter(function(nation){ return nation.continent != type;});
	}
	update();
    });
});

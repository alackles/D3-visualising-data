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

d3.csv("http://alackles.github.io/D3-visualising-data/resources/nations.csv", accessor).then( function(nations) {

	var filtered_nations = nations.map(function(nation) { return nation; });

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


	// Various scales. These domains make assumptions of data, naturally.
	var xScale = d3.scaleLog(); // income
	xScale.domain([250, 1e5]);
	xScale.range([0, canvas_width]);  
    
    // d3 has a subobject called scale. within scale, there are a number of functions to create scales.
    // e.g. log, linear, sqrt, category10 (e.g. 10 different colours)... 
    // we set the domain based on our data - min and max of the data
    // we set the range - range on the page
    // domain, range, log scale all determing data values are mapped to graph positions.

    var yScale = d3.scaleLinear().domain([10, 85]).range([canvas_height, 0]);  // life expectancy
    var colorScale = d3.scale.category10();

    // an alternative notation that d3 offers is to chain everything together using the dot-syntax 
    // (you'll see this a lot). The order is mostly arbitrary. 


	// Creating the x & y axes.
	var xAxis = d3.axisBottom(xScale);
	var yAxis = d3.axisLeft(yScale);

	var rScale = d3.scaleSqrt().domain([0, 5e8]).range([0, 40]); // life expectancy

    // Next step: push the axes into the chart
	// Add the x-axis.
	canvas.append("g")
	.attr("class", "x axis")
    .attr("transform", "translate(0," + canvas_height + ")")
    .call(xAxis);

    // .call is the bit where the properties we just set are pushed to the object
    // attribures are added to make it look pretty (class is used in the css file)


	// Add the y-axis.
	canvas.append("g")
    .attr("class", "y axis")
    .call(yAxis);



	//////////////////////AXES CREATED//////////////////////////



	//////////////////////FILL IN DATA//////////////////////////


	// var filtered_nations = nations.filter(function(nation){ return nation.population[nation.population.length-1][1] > 10000000;});

	// var filtered_nations = nations.filter(function(nation){ return nation.region == "Sub-Saharan Africa";});

	var data_canvas = canvas.append("g")
	.attr("class", "data_canvas")

	update();

	// dot is finding a class, hash an ID

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

	// update the plot, includes enter, exit, and transition
  function update() {
    
      var circles = data_canvas.selectAll("circle").data(filtered_nations, function(d){return d.country});

      circles.enter().append("circle").attr("class","data_point")
          .style("fill", function(d) { return colorScale(d.continent); })      
          .attr("cx", function(d) { return xScale(d.gdpPercap); }) 
	  .attr("cy", function(d) { return yScale(d.lifeExp); })
	  .attr("r", function(d) {return rScale(d.pop)});

      circles.exit().remove();

  }  

})

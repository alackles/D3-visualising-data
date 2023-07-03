//This is a comment

var chart_area = d3.select("#chart_area");
var frame = chart_area.append("svg");
var canvas = frame.append("g");

var margin = {top:19.5, right: 19.5, bottom: 19.5, left: 39.5};
var frame_width = 960;
var frame_height = 350;
var canvas_width = frame_width - margin.left - margin.right;
var canvas_height = frame_height - margin.top - margin.bottom;

frame.attr("width", frame_width);
frame.attr("height", frame_height);
canvas.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

var xScale = d3.scaleLog();
xScale.domain([250, 1e5]).range([0,canvas_width]);

var yScale = d3.scaleLinear();
yScale.domain([10, 85]).range([canvas_height, 0]);

var rScale = d3.scaleSqrt();
rScale.domain([0, 5e8]).range([0, 40]);

var colScale = d3.scaleOrdinal();
colScale.domain(["Africa", "Americas", "Asia", "Europe", "Oceania"]).range(d3.schemeCategory10);

var xAxis = d3.axisBottom(xScale);
var yAxis = d3.axisLeft(yScale);


canvas.append("g")
    .attr("class", "x axis")
    .attr("transform", "translate(0," + canvas_height + ")")
    .call(xAxis);

canvas.append("g")
    .attr("class", "y axis")
    .call(yAxis);


var accessor = function(row){
    return {
        country: row.country,
        year: +row.year,
        pop: +row.pop,
        continent: row.continent,
        lifeExp: +row.lifeExp,
        gdpPercap: +row.gdpPercap
    };
}


d3.csv("http://alackles.github.io/D3-visualising-data/resources/nations.csv", 
    accessor
    ).then(
        function(nations) {
        
        var data_canvas = canvas.append("g")
            .attr("class", "data_canvas");
        
        var year = parseInt(document.getElementById("year_slider").value);
        
        console.log(year)
        
        var filtered_nations = nations.filter(
            function(d){return d.year == year}
        );

        console.log(filtered_nations)

        var update = function(){
            var circles = data_canvas.selectAll("circle")
                .data(filtered_nations, function(d){return d.country});

            circles.enter()
                .append("circle").attr("class", "data_point")
                .merge(circles)
                .attr("cx", function(d) {return xScale(d.gdpPercap);})
                .attr("cy", function(d) {return yScale(d.lifeExp);})
                .attr("r", function(d) {return rScale(d.pop);})
                .style("fill", function(d) {return colScale(d.continent)})
                .style("stroke", "black");
    
            circles.exit().remove();
        }

        update();

        d3.selectAll(".region_cb").on("change", function () {
            var continent = this.value;
            if (this.checked) {
                var new_nations = nations.filter(function(nation) {
                    return nation.continent == continent && nation.year == year;
                });
                filtered_nations = filtered_nations.concat(new_nations);
            } else {
                filtered_nations = filtered_nations.filter(function(nation) {
                    return nation.continent != continent});

            }
            update();
        });
        d3.select("#year_slider").on("input", function () {
            year = parseInt(this.value);    
            filtered_nations = nations.filter(function(nation) {
                // checkbox corresponding to country
                var checkbox = d3.selectAll(".region_cb").filter(
                    function(){return this.value == nation.continent}
                );
                if (checkbox.property("checked")) {
                    return(nation.year == year);
                } else {
                    return(false);
                }
            });
            update();
        });
        }
    );
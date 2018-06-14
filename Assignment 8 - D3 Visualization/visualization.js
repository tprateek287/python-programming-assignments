'use strict';

// constant to hold month names in an array
const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
];

// constant to hold crime types which are violent in an array
const violentCrimes = {"ASSAULT": true, "HOMICIDE": true, 
						"PROPERTY DAMAGE": true, "ROBBERY": true, 
						"THREATS": true, "WEAPON":true};

// define color scale
var scales = {'viridis': ["#440154","#440256","#450457","#450559","#46075a","#46085c","#460a5d","#460b5e","#470d60","#470e61","#471063","#471164","#471365","#481467","#481668","#481769","#48186a",
"#481a6c","#481b6d","#481c6e","#481d6f","#481f70","#482071","#482173","#482374","#482475","#482576","#482677","#482878","#482979","#472a7a","#472c7a","#472d7b","#472e7c","#472f7d","#46307e","#46327e",
"#46337f","#463480","#453581","#453781","#453882","#443983","#443a83","#443b84","#433d84","#433e85","#423f85","#424086","#424186","#414287","#414487","#404588","#404688","#3f4788","#3f4889","#3e4989",
"#3e4a89","#3e4c8a","#3d4d8a","#3d4e8a","#3c4f8a","#3c508b","#3b518b","#3b528b","#3a538b","#3a548c","#39558c","#39568c","#38588c","#38598c","#375a8c","#375b8d","#365c8d","#365d8d","#355e8d","#355f8d",
"#34608d","#34618d","#33628d","#33638d","#32648e","#32658e","#31668e","#31678e","#31688e","#30698e","#306a8e","#2f6b8e","#2f6c8e","#2e6d8e","#2e6e8e","#2e6f8e","#2d708e","#2d718e","#2c718e","#2c728e",
"#2c738e","#2b748e","#2b758e","#2a768e","#2a778e","#2a788e","#29798e","#297a8e","#297b8e","#287c8e","#287d8e","#277e8e","#277f8e","#27808e","#26818e","#26828e","#26828e","#25838e","#25848e","#25858e",
"#24868e","#24878e","#23888e","#23898e","#238a8d","#228b8d","#228c8d","#228d8d","#218e8d","#218f8d","#21908d","#21918c","#20928c","#20928c","#20938c","#1f948c","#1f958b","#1f968b","#1f978b","#1f988b",
"#1f998a","#1f9a8a","#1e9b8a","#1e9c89","#1e9d89","#1f9e89","#1f9f88","#1fa088","#1fa188","#1fa187","#1fa287","#20a386","#20a486","#21a585","#21a685","#22a785","#22a884","#23a983","#24aa83","#25ab82",
"#25ac82","#26ad81","#27ad81","#28ae80","#29af7f","#2ab07f","#2cb17e","#2db27d","#2eb37c","#2fb47c","#31b57b","#32b67a","#34b679","#35b779","#37b878","#38b977","#3aba76","#3bbb75","#3dbc74","#3fbc73",
"#40bd72","#42be71","#44bf70","#46c06f","#48c16e","#4ac16d","#4cc26c","#4ec36b","#50c46a","#52c569","#54c568","#56c667","#58c765","#5ac864","#5cc863","#5ec962","#60ca60","#63cb5f","#65cb5e","#67cc5c",
"#69cd5b","#6ccd5a","#6ece58","#70cf57","#73d056","#75d054","#77d153","#7ad151","#7cd250","#7fd34e","#81d34d","#84d44b","#86d549","#89d548","#8bd646","#8ed645","#90d743","#93d741","#95d840","#98d83e",
"#9bd93c","#9dd93b","#a0da39","#a2da37","#a5db36","#a8db34","#aadc32","#addc30","#b0dd2f","#b2dd2d","#b5de2b","#b8de29","#bade28","#bddf26","#c0df25","#c2df23","#c5e021","#c8e020","#cae11f","#cde11d",
"#d0e11c","#d2e21b","#d5e21a","#d8e219","#dae319","#dde318","#dfe318","#e2e418","#e5e419","#e7e419","#eae51a","#ece51b","#efe51c","#f1e51d","#f4e61e","#f6e620","#f8e621","#fbe723","#fde725"]};

// append an SVG element to the visualization container
var svg = d3.select('#visContainer')
		.append('svg')
		.attr('height', 480) 
		.attr('width', 600)
    .style('border','1px solid gray');

// define margins and accordingly compute effective width and height
var margin = {top: 25, right: 20, bottom: 55, left: 65},
    width = svg.attr("width") - margin.left - margin.right,
	height = svg.attr("height") - margin.top - margin.bottom;

// text label for the x axis
svg.append("text")
	.attr("transform", "translate(" + (width/2 + 50) + " ," + (height + margin.top + 35) + ")")
	.style("text-anchor", "middle")
	.text("Month");

// text label for the y axis
svg.append("text")
	.attr("transform", "rotate(-90)")
	.attr("y", margin.left - 40)
	.attr("x", (height / 2) - 440)
	.style("text-anchor", "middle")
	.text("Offense Count");	

/**
 * Function that appends a predefined year options to the 'select' element in the DOM.
 * 
 * @return {undefined}
 */
function appendYearFilter() {
	var years = [2013, 2014, 2015, 2016, 2017]; // years for which data is to be displayed
	var yearSelect = d3.select('#yearSelect');  // select the drop down element

	for (var year of years) {
		// for each year, append an 'option' element to the dropdown
		yearSelect.append('option').attr('value', year).property('text', year);
	}
}

/**
 * Function to initialize the X and Y axes.
 * 
 * @return {undefined}
 */
function initAxes() {
	// create a 'group' element to hold the axes and the plot
	var g = svg.append("g")
    			.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    // append X axis
    g.append("g")
      .attr("class", "axis axis--x")
      .attr("transform", "translate(0," + height + ")");

    // append Y axis
    g.append("g")
      .attr("class", "axis axis--y")
      .append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 6)
      .attr("dy", "0.71em")
      .attr("text-anchor", "end");
}

/**
 * Function to update the plot and display crime stats based on the general update pattern.
 * 
 * @param  {array} dataArray [The array of monthwise crime data.]
 * @return {undefined}
 */
function displayStats(dataArray) {
	var x = d3.scaleBand().rangeRound([0, width]).padding(0.1),  // scale for the X axis
	y = d3.scaleLinear().rangeRound([height, 0]);     // scale for the Y axis

    // store max count of offenses across all months
    var maxOffenseCount = d3.max(dataArray, function(d) {return d['offense_count'];});

    // define the domain of the X and Y axis
    x.domain(dataArray.map(function(d) { return d['name']; }));
  	y.domain([0, maxOffenseCount]);

  	// update the axes
  	var g = svg.select('g');
  	g.select(".axis--y")
    	.call(d3.axisLeft(y).ticks(10));

   	g.selectAll(".axis--x")
        .call(d3.axisBottom(x));

    // perform a data join
    var rects = g.selectAll('rect')
                      .data(dataArray, function(d) { return d.name; });
    
    // merge with the existing rectangles
    var present = rects.enter().append('rect')
                    .attr('width', 0)
                    .attr('fill', '#286090')
					.merge(rects);
    
    // define attributes for the rectangles representing new data
	present.transition().duration(500)
            .attr('x', function(d) {return x(d['name']);})
            .attr('y', function(d) {return y(d['offense_count']);})
            .attr('width', x.bandwidth())	
            .attr('height', function(d) { return height - y(d['offense_count']);})
			.attr('fill', function(d) {
				return scales['viridis'][Math.round(((maxOffenseCount - d.offense_count)/maxOffenseCount) * 255)];
            });
	
	// define the mouse over and mouse out effects		
	present.on("mouseover", function(d){
				d3.select(this)
					.attr("fill", "#D35400")
					.append("title").text(function(d){
						return ("Violent Crimes (%):           " + ((d["violent_count"]/d["offense_count"]) * 100).toFixed(2) + "\n" +
								"Non-violent Crimes (%):   " + ((d["non_violent_count"]/d["offense_count"]) * 100).toFixed(2))
					})
				})
			.on("mouseout", function(){
				d3.select(this)
				.attr('fill', function(d) {
					return scales['viridis'][Math.round(((maxOffenseCount - d.offense_count)/maxOffenseCount) * 255)];
				})
				.select("title").remove()
				});

    // remove older rectangles
    rects.exit()
      .transition().duration(500)
      .attr('width', 0)
	  .remove();
}

/**
 * Function to parse the crime data fetched from source, create an appropriate data structure for
 * visualization and initiate plotting.
 * 
 * @param  {array} jsonResponse [Array of crime data in JSON format, fetched from source]
 * @return {undefined}
 */
function updateAndDisplayStats(jsonResponse) {
	var monthStats = {}; // object to hold plotting data
	var month = "";

	// do for each offense data in the jsonResponse
	for (var crime of jsonResponse) {
		month = crime["month"];  // extract month
		if (!monthStats[month]) {
			// if the month did not exist previously in monthStats
			monthStats[month] = { 'offense_count': 0, 
								  'name': monthNames[parseInt(month)-1],
								  'violent_count': 0,
								  'non_violent_count': 0,
								  'month_num': parseInt(month)-1
								}
		}
		monthStats[month]['offense_count']++; // update overall offense count

		// update violent/non-violent count based on nature of crime
		if (violentCrimes[crime['summarized_offense_description']]) {
			monthStats[month]['violent_count']++;
		} else {
			monthStats[month]['non_violent_count']++;
		}
	}
	// extract monthly data from the object and initiate plotting
	displayStats(Object.values(monthStats));
}

/**
 * Function to make an asynchronous request for crime data pertaining to the 'year' argument.
 * Once the data request is complete, the function initiates parsing and display of the data.
 * 
 * @param  {integer} year [The year for which crime data is to be fetched]
 * @return {undefined}
 */
async function loadCrimeData(year) {
	var url = "https://data.seattle.gov/resource/y7pv-r3kh.json?"
				+ "year=" + year;
	var jsonResponse = await d3.json(url);  // make an AJAX request
	updateAndDisplayStats(jsonResponse);    // init display of stats when the request completes
}

/**
 * Function to retrieve the user selected year and initiate fetching of crime data.
 * 
 * @return {undefined}
 */
function searchCrimeData() {
	var searchYear = d3.select('#yearSelect').property('value'); // get user selected year
	loadCrimeData(searchYear); // fetch and display the data
}

// bind an event listener to handle change in 'year' for which crime data is to be displayed
d3.select('#yearSelect').on('change', function() {
	// fetch and display crime data
	searchCrimeData();
});

// generate the drop down values on page load
appendYearFilter();
// initialize the axes
initAxes();
// on page load, show data for first year by default
searchCrimeData();
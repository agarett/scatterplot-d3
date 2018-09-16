//select the healthcare data 
var csvDataFile = 'data.csv';

//set svg size and margins 
var svgWidth = 960;
var svgHeight = 500;

var margin = {
  top: 20,
  right: 40,
  bottom: 60,
  left: 100
};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

// Create an SVG wrapper, append an SVG group that will hold our chart, and shift the latter by left and top margins.
var svg = d3.select("#scatter")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);

var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

// Import Data (find your own CSV data file)
d3.csv(csvDataFile, function(err, csvData) {
  if (err) throw err;

  // Parse Data/Cast as numbers
  csvData.forEach(function(d) {
    console.log(d.state + ' poverty: ' + d.poverty + ' healthcare: ' + d.healthcare)
    d.poverty = +d.poverty;
    d.healthcare = +d.healthcare;
  });

  // Create scale functions setting the x and y-axis domain/range
  var xLinearScale = d3.scaleLinear()
    .domain([8, d3.max(csvData, d => d.poverty)])
    .range([0, width]);

  var yLinearScale = d3.scaleLinear()
    .domain([0, d3.max(csvData, d => d.healthcare)])
    .range([height, 0]);

  // Create axis functions
  var bottomAxis = d3.axisBottom(xLinearScale);
  var leftAxis = d3.axisLeft(yLinearScale);

  // Append Axes to the chart
  chartGroup.append("g")
    .attr("transform", `translate(0, ${height})`)
    .call(bottomAxis);

  chartGroup.append("g")
    .call(leftAxis);

   // Create Circles for the data
  var circlesGroup = chartGroup.selectAll("circle")
    .data(csvData)
    .enter()
    .append("circle")
    .attr("cx", d => xLinearScale(d.poverty))
    .attr("cy", d => yLinearScale(d.healthcare))
    .attr("r", "10")
    .attr("fill", "green")
    .attr("opacity", ".4");

  chartGroup.append("text")
    .style("text-anchor", "middle")
    .style("font-size", "10px")
    .attr("fill","white")
    .selectAll("tspan")
    .data(csvData)
    .enter()
    .append("tspan")
      .attr("x", function(d) {
          return xLinearScale(d.poverty - 0);
      })
      .attr("y", function(d) {
          return yLinearScale(d.healthcare - 0.2);
      })
      .text(function(d) {
          return d.abbr
      });

  // Initialize tool tip
  var toolTip = d3.tip()
    .attr("class", "tooltip")
    .offset([80, -60])
    .html(function(d) {
      return (`<b>${d.state}</b><br><b>Poverty:</b> ${d.poverty}<br><b>Healthcare:</b> ${d.healthcare}`);
    });

  // Create tooltip in the chart
  chartGroup.call(toolTip);

  // Create event listeners to display and hide the tooltip
  circlesGroup.on("mouseover", function(data) {
    toolTip.show(data);
  })
    .on("mouseout", function(data, index) {
      toolTip.hide(data);
    });

  // Create axes labels 
  chartGroup.append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 0 - margin.left + 40)
    .attr("x", 0 - (height / 2))
    .attr("dy", "1em")
    .attr("class", "axisText")
    .text("Lacking Healthcare (%)");

  chartGroup.append("text")
    .attr("transform", `translate(${width / 2}, ${height + margin.top + 30})`)
    .attr("class", "axisText")
    .text("Poverty Rate (%)");
});
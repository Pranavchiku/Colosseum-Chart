import define1 from "./8d271c22db968ab0@160.js";

function _1(md){return(
md`# Colosseum Chart
Created by: Pranav Goswami (B20CS016) & Deep Patel (B20CS087)
---

Upload any dataset and update parameters to visualise dataset.`
)}

function _sampledata(FileAttachment){return(
FileAttachment("Colosseum.csv").csv()
)}

function _3(__query,FileAttachment,invalidation){return(
__query.sql(FileAttachment("Colosseum.csv"),invalidation)`select * from "Colosseum.csv"`
)}

function _4(md){return(
md`# Input Parameters`
)}

function _inputParameters(Inputs){return(
Inputs.form({
  concentricRing: Inputs.range([1, 5], {step: 1, label: "concentric rings", value: 2}),
  numLayers: Inputs.range([1, 5], {step: 1, label: "number of layers", value: 2}),
  file: Inputs.file({label: "CSV file", accept: ".csv", required: true, value: "Colosseum-small.csv"}),
  gap: Inputs.range([5, 40], {step: 1, label: "vertical gap", value: 20}),
  innerGap: Inputs.range([10, 500], {step: 1, label: "insert gap between concentric circles", value: 20})
})
)}

function _inputData(inputParameters,sampledata){return(
inputParameters.file === undefined ? sampledata: inputParameters.file.csv({typed: true})
)}

function _7(md){return(
md`# Colosseum Chart`
)}

function _8(ColosseumChart,inputData,calculateNumSectors,inputParameters,calculateNumberOfDatapoints,getUniqueCategories){return(
ColosseumChart(
  inputData,
  calculateNumSectors(inputData),
  inputParameters.concentricRing, inputParameters.numLayers,
  calculateNumberOfDatapoints(inputData, getUniqueCategories(inputData)),
  inputParameters.gap,
  inputParameters.innerGap,
  640,
  600,
  {top: 20, right: 30, bottom: 30, left: 40}
)
)}

function _ColosseumChart(d3,getColumnName){return(
function ColosseumChart(
    data = data,
    numSectors,
    numConcentricCircles,
    numLayers,
    numberOfDatapoints,
    verticalGap,
    innerGap,
    width = 640,
    height = 600,
    margin = {top: 20, right: 30, bottom: 30, left: 40},
    color = d3.scaleOrdinal(d3.quantize(d3.interpolateHcl("#fafa6e", "#2A4858"), 10)),
) {

    const columnName = getColumnName(data);

    var colorScale = d3.scaleLinear()
      .domain([-3, 0, 3])  // Input values
      .range(["blue", "white", "red"]); // Output colors
  
    // Function to handle zoom
    function zoomIn(scaleFactor) {
      d3.select(this)
        .transition()
        .attr("transform", "scale(" + scaleFactor + ")");
    }
  
    function zoomOut() {
      d3.select(this)
        .transition()
        .attr("transform", "scale(1)");
    }
  
    const svg = d3.create('svg')
        .attr("viewBox", [-width / 2, -height / 2, width, height]);

    var prevEndAngle = 2 * Math.PI * numberOfDatapoints[0] / data.length;

    var prevOuterRadius = innerGap;
  
    for ( var cc = 0; cc < numConcentricCircles + 1; cc++ ) {
      // const globalInnerRadius = ( 1 + cc ) * 40 * numLayers;
      const globalInnerRadius = prevOuterRadius + innerGap;
      var cumSumOfDatapoints = 0;
  
      for ( var arc = 0; arc < numSectors; arc++ ) {

        const angle = 2 * Math.PI * numberOfDatapoints[arc] / data.length; // angle of each sector
        const globalStartAngle = prevEndAngle;

        const padAngle = Math.PI / 10;
      
        const step = numberOfDatapoints[arc];
        const radiusStep = numLayers; // "logFC nano urea 12h", .....
        const gap = verticalGap;

        cumSumOfDatapoints += arc === 0 ? 0 : numberOfDatapoints[arc - 1]; 

        if ( cc === numConcentricCircles ) {
          const nestedArc1 = d3.arc()
            .innerRadius(prevOuterRadius + gap)
            .outerRadius(prevOuterRadius + 2 * gap)
            .startAngle(globalStartAngle)
            .endAngle(globalStartAngle - angle + (angle / numberOfDatapoints[arc]) / 2);

          prevEndAngle = globalStartAngle - angle;

          svg.append("path")
            .attr("transform", "translate(100,100)")
            .attr("d", nestedArc1).style('stroke', 'black')
            .style('stroke-width', 0.2)
            .attr("fill", 'white')
          .attr('transform', 'translate(0, 0)');

        } else {
          for ( var j = 0; j < radiusStep; j++ ) {
              const nestedInnerRadius = globalInnerRadius + j * gap;
              const nestedOuterRadius = globalInnerRadius + (j + 1) * (gap);
  
              var curRow = cumSumOfDatapoints;
  
              const curLayerIndex = j + (numLayers * cc) + 2;
        
              for ( var i = 0; i < step; i++) {
                var nestedStartAngle = globalStartAngle - (i * ( angle / step ));
                var nestedEndAngle = globalStartAngle - (( i + 1 ) * (angle / step));
  
                if ( i === step - 1 ) {
                  prevEndAngle = nestedEndAngle;
                  prevOuterRadius = nestedOuterRadius;
                  nestedEndAngle += (angle / step) / 2;
                }
    
                var div = d3.select("body").append("div")
                     .attr("class", "tooltip-donut")
                     .style("opacity", 0)
                     .style("position", "absolute")
                     .style("background", "black");
          
                const nestedArc1 = d3.arc()
                    .innerRadius(nestedInnerRadius)
                    .outerRadius(nestedOuterRadius)
                    .startAngle(nestedStartAngle)
                    .endAngle(nestedEndAngle);
        
                var s = 1;
  
                const category = data[curRow].Category;
                const ID = data[curRow].ID;
                const cName = columnName[curLayerIndex];
                const curElemValue = data[curRow][columnName[curLayerIndex]];
                curRow = (curRow + 1);
  
                // var colorConfig = curElemValue > 0 ? 'blue' : 
                //                   curElemValue < 0 ? 'red' : 'white';

                var colorConfig = colorScale(curElemValue);
          
                svg.append("path")
                  .attr("transform", "translate(100,100)")
                  .attr("d", nestedArc1).style('stroke', 'black')
                  .style('stroke-width', 0.2)
                  .attr("fill", colorConfig)
                  // .attr("fill", function(d) { return colorScale(curElemValue); })
                  // .attr("fill", color(( i + j ) % ( step + radiusStep )))
                  .attr("fill-opacity", 0.8)
                  .attr('transform', 'translate(0, 0)')
                  .on('mouseover', function(d, i) {
                    // d3.select(this).transition()
                    //   .duration('50')
                    //   .attr('opacity', '1');
    
                    // Append rectangle
                    svg.append('rect')
                        .attr("x", width/3)
                        .attr("y", -height/3)
                        .attr("width", 100)
                        .attr("height", 50)
                        .style("stroke", "black")
                        .style('stroke-width', 0.2)
                        .attr("fill", "white");
                    
                    // Append text inside the rectangle
                    svg.append("text")
                        .attr("x", width/3 + 50)  // Adjust x position to center the text horizontally
                        .attr("y", -height/3 + 10) // Adjust y position to center the text vertically
                        .text(category)
                        .attr("text-anchor", "middle")
                        .attr("alignment-baseline", "middle")
                        .style("font-size", "8px")
                        .style("fill", "black");
    
                    // Append text inside the rectangle
                    svg.append("text")
                        .attr("x", width/3 + 50)  // Adjust x position to center the text horizontally
                        .attr("y", -height/3 + 20) // Adjust y position to center the text vertically
                        .text(ID)
                        .attr("text-anchor", "middle")
                        .attr("alignment-baseline", "middle")
                        .style("font-size", "8px")
                        .style("fill", "black");
  
                    svg.append("text")
                        .attr("x", width/3 + 50)  // Adjust x position to center the text horizontally
                        .attr("y", -height/3 + 30) // Adjust y position to center the text vertically
                        .text(curElemValue)
                        .attr("text-anchor", "middle")
                        .attr("alignment-baseline", "middle")
                        .style("font-size", "8px")
                        .style("fill", "black");
  
                    svg.append("text")
                        .attr("x", width/3 + 50)  // Adjust x position to center the text horizontally
                        .attr("y", -height/3 + 40) // Adjust y position to center the text vertically
                        .text(cName)
                        .attr("text-anchor", "middle")
                        .attr("alignment-baseline", "middle")
                        .style("font-size", "8px")
                        .style("fill", "black");
    
                  })
                  .on('click', function() {
                    if (s === 1) {
                      zoomOut.call(this);
                      s = 2;
                    } else {
                      zoomIn.call(this, 2);
                      s = 1;
                    }
                  })
                  .on('mouseout', function(d, i) {
                    // d3.select(this).transition()
                    //   .attr('opacity', '0.8');
                    svg.selectAll("text").remove();
                    svg.selectAll("rect").remove();
                  });
              }
          }
        }
      }
    }
  
    return svg.node();
}
)}

function _calculateNumSectors(){return(
function calculateNumSectors(data) {
  // Create an empty set to store unique categories
  let uniqueCategories = new Set();

  // Iterate through the data array
  data.forEach(entry => {
    // Extract the category from each object
    let category = entry.Category;

    // Add the category to the set
    uniqueCategories.add(category);
  });

  // Return the size of the set, which represents the number of unique categories
  return uniqueCategories.size;
}
)}

function _getUniqueCategories(){return(
function getUniqueCategories(data) {
  // Create an empty set to store unique categories
  let uniqueCategories = new Set();

  // Iterate through the data array
  data.forEach(entry => {
    // Extract the category from each object
    let category = entry.Category;

    // Add the category to the set
    uniqueCategories.add(category);
  });

  // Return the size of the set, which represents the number of unique categories
  return Array.from(uniqueCategories);
}
)}

function _12(calculateNumberOfDatapoints,sampledata,getUniqueCategories){return(
calculateNumberOfDatapoints(sampledata, getUniqueCategories(sampledata))
)}

function _calculateNumberOfDatapoints(){return(
function calculateNumberOfDatapoints(data, uniqueCategories) {
  // Initialize an object to store counts for each category
  let counts = {};

  // Iterate through the unique categories and initialize counts to 0
  uniqueCategories.forEach(category => {
    counts[category] = 0;
  });

  // Iterate through the data array
  data.forEach(entry => {
    // Extract the category from each object
    let category = entry.Category;

    // Increment the count for that category
    counts[category]++;
  });

  // Convert counts object to an array of counts
  let countsArray = uniqueCategories.map(category => counts[category]);

  // Return the array of counts
  return countsArray;
}
)}

function _getColumnName(){return(
function getColumnName(data) {
  // Check if data is not empty
  if (data.length === 0) {
    return [];
  }

  // Get the keys of the first object in data
  let firstEntry = data[0];
  let columnNames = Object.keys(firstEntry);

  // Return the array of column names
  return columnNames;
}
)}

export default function define(runtime, observer) {
  const main = runtime.module();
  function toString() { return this.url; }
  const fileAttachments = new Map([
    ["Colosseum.csv", {url: new URL("./files/d98162818ad216df1e6b783bf4b9e658acc7b2759f888d9382cbd2e44f39649c4bf854b8d3f6d6e978607f22a47e56cd0b9c0e46fe7edd07ea8a68d6103221b0.csv", import.meta.url), mimeType: "text/csv", toString}]
  ]);
  main.builtin("FileAttachment", runtime.fileAttachments(name => fileAttachments.get(name)));
  main.variable(observer()).define(["md"], _1);
  main.variable(observer("sampledata")).define("sampledata", ["FileAttachment"], _sampledata);
  main.variable(observer()).define(["__query","FileAttachment","invalidation"], _3);
  main.variable(observer()).define(["md"], _4);
  main.variable(observer("viewof inputParameters")).define("viewof inputParameters", ["Inputs"], _inputParameters);
  main.variable(observer("inputParameters")).define("inputParameters", ["Generators", "viewof inputParameters"], (G, _) => G.input(_));
  main.variable(observer("inputData")).define("inputData", ["inputParameters","sampledata"], _inputData);
  main.variable(observer()).define(["md"], _7);
  main.variable(observer()).define(["ColosseumChart","inputData","calculateNumSectors","inputParameters","calculateNumberOfDatapoints","getUniqueCategories"], _8);
  main.variable(observer("ColosseumChart")).define("ColosseumChart", ["d3","getColumnName"], _ColosseumChart);
  main.variable(observer("calculateNumSectors")).define("calculateNumSectors", _calculateNumSectors);
  main.variable(observer("getUniqueCategories")).define("getUniqueCategories", _getUniqueCategories);
  main.variable(observer()).define(["calculateNumberOfDatapoints","sampledata","getUniqueCategories"], _12);
  main.variable(observer("calculateNumberOfDatapoints")).define("calculateNumberOfDatapoints", _calculateNumberOfDatapoints);
  main.variable(observer("getColumnName")).define("getColumnName", _getColumnName);
  const child1 = runtime.module(define1);
  main.import("form", child1);
  return main;
}

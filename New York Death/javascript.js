// ============================================================
// Variables, these variables describe the dimensions of the
//    graph and provide a way to easily change all the rest of the variables
// ============================================================
var height = 1060,
    width = 900,
    margin = {
        top: 40,
        right: 90,
        bottom: 40,
        left: 35
    },


    // ============================================================
    // Minimum and maximum radius for the circles that will drawn
    // ============================================================
    maxRadius = 30,
    minRadius = 5,


    // ============================================================
    // The columns of the csv
    // ============================================================
    year = "Year",
    ethnicity = "Ethnicity",
    sex = "Sex",
    cause = "Cause of Death",
    count = "Count",
    percent = "Percent",


    // ============================================================
    // Start describing the scales for x and y dimensions.
    // xScale is corresponding to the year and so is linear
    // yScale is corresponding to the number of deaths and is log
    // rScale is the circle radius scale as a square root scale
    // genderScale has blue and pink colors and both are transparent
    // ethnicityScale is a d3 builtin color scheme
    // ============================================================
    xScale = d3.scale.linear().range([0, width - (margin.right + margin.left)]),
    yScale = d3.scale.log().range([height - (margin.bottom + margin.top), 0]),
    rScale = d3.scale.sqrt().range([minRadius, maxRadius]),
    genderScale = d3.scale.ordinal().range(["rgba(255,119,170,.5)", "rgba(119,170,255,.5)"]).domain(["Female", "Male"]),
    ethnicityScale = d3.scale.category10(),


    // ============================================================
    // Using the x and y scales I start describing the axis that 
    //    will be made based on those scales.
    // xAxis is different as the ticks are needing to be shown
    //    as just a year without commas and extra stuff.
    // ============================================================
    xAxis = d3.svg.axis().scale(xScale).orient("bottom").tickFormat(d3.time.format("%Y")),
    yAxis = d3.svg.axis().scale(yScale).orient("left");


// ============================================================
// SVG element is given height and width according to the 
//    variables above
// ============================================================
var svg = d3.select("svg")
    .attr("height", height)
    .attr("width", width);


// ============================================================
// The chart element is created with a height and width 
//    modified by the margins and also translated by the left
//    and top margin
// ============================================================
var g = svg.append("g")
    .attr("height", height - (margin.top + margin.bottom))
    .attr("width", width - (margin.right + margin.left))
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");


// ============================================================
// Process the data coming from the csv in order to provide the
//    right data types as well as filtering out things I do not
//    want included in the chart
// ============================================================
function processData(data) {
    String.prototype.change = function () {
        if (this.match(/(\w*-\w*\W)/g)) {
            return this.replace(/(\w*-\w*\W)/g, "");
        } else if (this.match(/&/g)) {
            return this.replace("&", "and");
        } else {
            return this;
        }
    }

    String.prototype.capitalizeFirstLetter = function () {
        var str = this.split(" "),
            normalized = "";

        str.forEach(function (value, index) {
            value = value.charAt(0).toUpperCase() + value.slice(1).toLowerCase();
            normalized = index === 0 ? value : normalized + " " + value;
        });

        return normalized.trim();
    }

    var d = {};

    d[year] = +data[year];
    d[ethnicity] = data[ethnicity].change().capitalizeFirstLetter();
    d[cause] = data[cause].change().capitalizeFirstLetter();
    d[sex] = data[sex].capitalizeFirstLetter();
    d[count] = +data[count];
    d[percent] = +data[percent];
    return d;
};


// ============================================================
// Render the chart from the data
// ============================================================
function render(error, data) {
    if (error) throw error;

    xScale.domain(d3.extent(data, function (d) {
        return d[year];
    }));
    yScale.domain(d3.extent(data, function (d) {
        return d[count];
    }));
    rScale.domain(d3.extent(data, function (d) {
        return d[count];
    }));
    ethnicityScale.domain(data.map(function (d) {
        return d[ethnicity];
    }));

    svg.append("g")
        .attr("class", "x axis")
        .call(xAxis);

    svg.append("g")
        .attr("class", "y axis")
        .call(yAxis);

    // bind data
    var circles = g
        .selectAll("circle")
        .data(data);

    // create dom elements based on data
    circles
        .enter()
        .append("circle");

    // attach attributes that depend on the data
    circles
        .attr("height", 100)
        .attr("width", 100)
        .attr("r", function (d) {
            return rScale(d[count]);
        })
        .attr("cx", function (d) {
            return xScale(d[year]);
        })
        .attr("cy", function (d) {
            return yScale(d[count]);
        })
        .attr("fill", function (d) {
            return genderScale(d[sex]);
        });

    // remove the old data elements
    circles
        .exit()
        .remove();

    console.log(data);
};

d3.csv("NYC_Leading_Causes_of_Death.csv", processData, render);
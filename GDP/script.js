//=======================================================================
//=======================================================================
var height = 940,
    width = 860,
    margin = {
        top: 55,
        right: 30,
        bottom: 30,
        left: 55
    },

    //=======================================================================
    //=======================================================================
    country = "Country or Area",
    year = "Year",
    gdp = "Value",

    //=======================================================================
    //=======================================================================
    xScale = d3.time.scale().range([0 + margin.left, width + margin.right]),
    yScale = d3.scale.linear().range([height - margin.bottom, 0 + margin.top]),
    colorScale = d3.scale.category20(),

    //=======================================================================
    //=======================================================================
    xAxis = d3.svg.axis().scale(xScale).orient("bottom").tickFormat(d3.time.format("%Y")),
    yAxis = d3.svg.axis().scale(yScale).orient("left"),

    //=======================================================================
    //=======================================================================

    svg = d3.select("svg")
    .attr("height", height + margin.top + margin.bottom)
    .attr("width", width + margin.left + margin.right),

    g = svg.append("g")
    .attr("height", height)
    .attr("width", width),

    line = d3.svg.line()
    .x(function (d) {
        return xScale(d[year]);
    })
    .y(function (d) {
        return yScale(d[gdp]);
    })
    .interpolate("basis"),

    div = d3.select("body").append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);

var formatDate = d3.time.format("%Y").parse;

function processData(data) {
    var d = {};
        if (data[country].match(/United/g)) {

    d[country] = data[country];
    d[year] = formatDate(data[year]);
    d[gdp] = parseFloat(data[gdp]);
    return d;

        }
}

function render(error, data) {
    if (error) throw error;

    xScale.domain(d3.extent(data, function (d) {
        return d[year];
    }));
    yScale.domain(d3.extent(data, function (d) {
        return d[gdp];
    }));
    colorScale.domain(data.map(function (d) {
        return d[country];
    }));

    svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + (height - margin.bottom) + ")")
        .call(xAxis);
    svg.append("g")
        .attr("class", "y axis")
        .attr("transform", "translate(" + margin.left + ")")
        .call(yAxis);

    var nestedData = d3.nest()
        .key(function (d) {
            return d[country];
        })
        .entries(data);

    var countries = g.selectAll(".country")
        .data(nestedData);

    countries
        .enter()
        .append("g")
        .attr("class", "country");

    countries
        .append("path")
        .attr("class", "line")
        .attr("id", function (d) {
            return d.key.replace(",", "").split(" ").join("_");
        })
        .attr("stroke-linecap", "round")
        .attr("d", function (d) {
            return line(d.values);
        })
        .style("stroke", function (d) {
            return colorScale(d.key);
        })
        .style("fill", "none")
        .on("mouseover", function (d) {
            d3.select("#" + d.key.replace(",", "").split(" ").join("_"))
                .style("stroke-width", 3);
            div.transition()
                .duration(200)
                .style('opacity', .9);
//            div.html('<h3>' + d.key + '</h3>' + '<p>GDP: <br/>Year: </p>')
        div.html('<img src="/tooltip/css-tooltip-image.gif" /><span><img class="callout" src="cssttp/callout.gif" /><img src="/tooltip/src/tooltips-cd2.jpg" style="float:right;" /><strong>CSS only Tooltip</strong><br />Pure CSS popup tooltips with clean semantic XHTML.</span>')
                .style('left', (d3.event.pageX) + 'px')
                .style('top', (d3.event.pageY - 28) + 'px');
        })
        .on("mouseout", function (d) {
            d3.select("#" + d.key.replace(",", "").split(" ").join("_"))
                .style("stroke-width", 1.5);
            div.transition()
                .duration(500)
                .style('opacity', 0);
        });

}

d3.csv("UN_GDP.csv", processData, render);
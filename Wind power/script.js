var margin = {
        top: 55,
        right: 35,
        bottom: 35,
        left: 65
    },
    height = 960,
    width = 890,
    column = {
        country: "Country or Area",
        year: "Year",
        quantity: "Quantity"
    },
    svg = d3.select("body").append("svg")
    .attr("height", height)
    .attr("width", width),
    chart = svg.append("g")
    .attr("class", "chart")
    .attr("height", height - (margin.top + margin.bottom))
    .attr("width", width - (margin.right + margin.left))
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")"),
    xScale = d3.time.scale().range([0, width - (margin.left + margin.right)]),
    yScale = d3.scale.linear().range([height - (margin.top + margin.bottom), 0]),
    colorScale = d3.scale.category20(),
    xAxis = d3.svg.axis().scale(xScale).tickFormat(d3.time.format("%Y")),
    yAxis = d3.svg.axis().scale(yScale).orient("left"),
    line = d3.svg.line()
    .x(function (d) {
        return xScale(d[column.year]);
    })
    .y(function (d) {
        return yScale(d[column.quantity]);
    }),
    circle = function (data) {
        data.forEach(function (value, index, array) {
            value.values.forEach(function (v, i, a) {
                chart.append("circle")
                    .attr("class", v[column.country].split(" ").join("_"))
                    .attr("cx", xScale(v[column.year]))
                    .attr("cy", yScale(v[column.quantity]))
                    .attr("r", 3)
                    .attr("fill", colorScale(v[column.country]))
                    .on("mouseover", function () {
                        d3.selectAll("." + v[column.country].split(" ").join("_"))
                            .attr("r", 5);
                        d3.selectAll("#" + v[column.country].split(" ").join("_"))
                            .attr("stroke-width", 3);
                        console.log(v[column.country].split(" ").join("_"));
                    })
                    .on("mouseleave", function () {
                        d3.selectAll("." + v[column.country].split(" ").join("_"))
                            .attr("r", 3);
                        d3.selectAll("#" + v[column.country].split(" ").join("_"))
                            .attr("stroke-width", 1.5);
                    });
            });
        });
    };
formatDate = d3.time.format("%Y").parse;

function processData(data, i, a, b) {

    var d = {};
    d[column.year] = formatDate(data[column.year]);
    d[column.quantity] = +data[column.quantity];
    d[column.country] = data[column.country];
    return d;
};

function render(error, data) {
    if (error) throw error;

    xScale.domain(d3.extent(data, function (d) {
        return d[column.year];
    }));
    yScale.domain(d3.extent(data, function (d) {
        return d[column.quantity];
    }));
    colorScale.domain(data.map(function (d) {
        return d[column.country];
    }));

    svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(" + margin.left + "," + (height - margin.bottom) + ")")
        .call(xAxis);
    svg.append("g")
        .attr("class", "y axis")
        .attr("transform", "translate(" + margin.left + "," + (margin.top) + ")")
        .call(yAxis);

    var nestedData = d3.nest()
        .key(function (d) {
            return d[column.country];
        })
        .entries(data);
    
    var n = nestedData.filter(function(val, ind, arr){
        var check = false;
        val.values.forEach(function(v, i, a){
            if(v[column.quantity] > 10000){
                check = true;
            };
        });
        return check;
    });
    
    console.log(n);

    var countries = chart.selectAll("g")
        .data(nestedData);

    countries
        .enter()
        .append("g")
        .attr("class", "country");

    countries
        .append("path")
        .attr("class", "line")
        .attr("id", function (d) {
            return d.key.split(" ").join("_")
        })
        .attr("d", function (d) {
            return line(d.values);
        })
        .attr("stroke", function (d) {
            return colorScale(d.key);
        })
        .attr("fill", "none");

    circle(nestedData);

    countries
        .exit()
        .remove();

};

d3.csv("data.csv", processData, render);
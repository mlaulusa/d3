var margin = {
		top: 50,
		right: 40,
		bottom: 70,
		left: 90
	},
	height = 960,
	width = 890,
	column = {
		client: 'Client',
		sl: 'Service Location',
		inspector: 'Inspector',
		date: 'Date',
		count: 'Total Services',
		deficient: 'Total Deficient',
		score: 'Score',
		provider: 'Service Provider',
		run_on: 'Run On'
	},

	svg = d3.select("body").append("svg")
	.attr("height", height)
	.attr("width", width),

	chart = svg.append("g")
	.attr("class", "chart")
	.attr("height", height - (margin.top + margin.bottom))
	.attr("width", width - (margin.left + margin.right))
	.attr("transform", "translate(" + margin.left + "," + margin.top + ")"),

	xScale = d3.scale.ordinal().range([0, width - (margin.left + margin.right)]),
	yScale = d3.scale.linear().range([height - (margin.top + margin.bottom), 0]),
	colorScale = d3.scale.category10(),

	xAxis = d3.svg.axis().scale(xScale).orient('bottom'),
	yAxis = d3.svg.axis().scale(yScale).orient('left'),

	formatDate = d3.time.format('%x').parse;

function processData(data) {
	var d = {};
	d[column.client] = data[column.client];
	d[column.sl] = data[column.sl];
	d[column.date] = new Date(data[column.date]);
	d[column.inspector] = data[column.inspector];
	d[column.score] = +data[column.score] * 10;
	d[column.count] = +data[column.count];
	d[column.deficient] = +data[column.deficient];
	d[column.provider] = data[column.provider];
	d[column.run_on] = formatDate(data[column.run_on]);
	return d;
};

function render(error, data) {
	if (error) throw error;

	xScale.domain(d3.extent(data, function (d) {
		return d[column.sl];
	}));
	yScale.domain([0, 100]);
	colorScale.domain(data.map(function (d) {
		return d[column.client];
	}));

	svg.append("g")
		.attr("class", "x axis")
		.attr("transform", "translate(" + margin.left + "," + (height - margin.bottom) + ")")
		.call(xAxis);

	svg.append("g")
		.attr("class", "y axis")
		.attr("transform", "translate(" + margin.left + "," + margin.top + ")")
		.call(yAxis);

	data.forEach(function (v) {
		console.log(v);
	});
}

d3.csv("SL Report.csv", processData, render);
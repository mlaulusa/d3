angular.module('Dashboard', ['Dashboard.directives'])
    .controller('DashboardCtrl', ['$log', function ($log) {
        var vm = this;
        vm.data = [
            {
                name: 'Greg',
                score: 98
            },
            {
                name: 'Ari',
                score: 91
            },
            {
                name: 'Jeri',
                score: 62
            },
            {
                name: 'Siri',
                score: 58
            },
            {
                name: 'Hubert',
                score: 95
            },
            {
                name: 'Pim',
                score: 78
            },
            {
                name: 'Que',
                score: 86
            },
            {
                name: 'Rad',
                score: 63
            },
            {
                name: 'Ishi',
                score: 82
            }];

}]);

angular.module('Dashboard.directives', ['d3'])
    .directive('chart', ['$window', '$log', 'd3Service', function ($window, $log, d3Service) {
        return {
            restrict: 'EA',
            scope: {
                data: '='
            },
            link: function (scope, elem, attr) {
                d3Service.d3().then(function (d3) {

                    var margin = parseInt(attr.margin) || 20,
                        barHeight = parseInt(attr.barHeight) || 20,
                        barPadding = parseInt(attr.barPadding) || 5;

                    var svg = d3.select(elem[0])
                        .append('svg')
                        .style('width', '100%');

                    window.onresize = function () {
                        scope.$apply();
                    };

                    scope.$watch(function () {
                        return angular.element($window)[0].innerWidth;
                    }, function () {
                        scope.render(scope.data);
                    });

                    scope.render = function (data) {

                        svg.selectAll('*').remove();

                        if (!data) return;

                        var width = d3.select(elem[0]).node().offsetWidth - margin,
                            height = scope.data.length * (barHeight + barPadding),
                            color = d3.scale.category20(),
                            xScale = d3.scale.linear()
                            .domain([0, d3.max(data, function (d) {
                                return d.score;
                            })])
                            .range([0, width]);

                        svg.attr('height', height);

                        svg.selectAll('rect')
                            .data(data)
                            .enter()
                            .append('rect')
                            .attr('height', barHeight)
                            .attr('width', 0)
                            .attr('x', Math.round(margin / 2))
                            .attr('y', function (d, i) {
                                return i * (barHeight + barPadding);
                            })
                            .attr('fill', function (d) {
                                return color(d.name);
                            })
                            .transition()
                            .duration(1000)
                            .attr('width', function (d) {
                                return xScale(d.score);
                            });

                    }
                })
            }
        }
}])

angular.module('d3', [])
    .factory('d3Service', ['$document', '$q', '$rootScope', function ($document, $q, $rootScope) {
        var d = $q.defer();

        function onScriptLoad() {
            $rootScope.$apply(function () {
                d.resolve(window.d3);
            });
        }

        var scriptTag = $document[0].createElement('script');
        scriptTag.type = 'text/javascript';
        scriptTag.async = true;
        scriptTag.src = 'http://d3js.org/d3.v3.min.js';
        scriptTag.onreadystatechange = function () {
            if (this.readyState == 'complete') onScriptLoad();
        }
        scriptTag.onload = onScriptLoad;

        var s = $document[0].getElementsByTagName('body')[0];
        s.appendChild(scriptTag);

        return {
            d3: function () {
                return d.promise;
            }
        };
}])
// // code style: https://github.com/johnpapa/angular-styleguide 
import gql from 'graphql-tag';
import moment from 'moment';


function syncToLocalStorage(key,varr,vm,$localStorage){

    // save settings to local storage
    if ( angular.isDefined($localStorage[key]) ) {
      vm[varr] = $localStorage[key];
      console.log("areas",vm[varr])
    } else {
      $localStorage[key] = vm[varr];
    }
}

function refreshStats(vm,apollo){
    var sellstats_args={
    }


    if (vm.filters.areas.length != 0) {
      sellstats_args._areas = vm.filters.areas.join('|')
    }
    // $interval(function () {
    apollo.query({
        query: gql`
                  query MyQuery($_today: date,$_sellstats_args: sellstats_args!) {
                    transaction: transactions_aggregate {
                      aggregate {
                        count(columns: categories_applied)
                      }
                    }
                    parking: parkings_aggregate {
                      aggregate {
                        count(columns: id)
                      }
                    }
                    payment: payments_aggregate(where: {created_at: {_eq: $_today}}) {
                      aggregate {
                        sum {
                          amount: amount_paid
                        }
                      }
                    }
                    sellstats(args:$_sellstats_args) {
                      amount
                      duration
                      transactionDate
                    }
                    parkings {
                      name: area_name
                    }
                  }
                `,
        variables:{
          "_today": moment().format("YYYY-MM-DD"),
          "_sellstats_args":sellstats_args
        }
      })
      .then(result => {
          console.log('got data', result);
          vm.transactionToday=result.data.payment.aggregate.sum.amount?result.data.payment.aggregate.sum.amount:0
          vm.lockedParking=result.data.transaction.aggregate.count
          vm.unlockedParking=result.data.parking.aggregate.count-vm.lockedParking
          // console.log()
          vm.areaOptions=result.data.parkings
          console.log(vm.areaOptions)
        });
    // }, 5000)

}

(function () {
  'use strict';
  angular
    .module('app')
    .controller('ChartCtrl', Chart);

  Chart.$inject = ['$scope', 'apollo', '$interval','$timeout','APP_ENV','$localStorage'];

  function Chart($scope, apollo, $interval,$timeout,APP_ENV,$localStorage) {
    var vm = $scope;


    vm.slider={
        options: {
          floor: 1,
          ceil: 200,
          noSwitching: true,
          translate: function(value, sliderId, label) {
            
              return value + " hrs"
    
          }
        }
    }

    vm.filters={
      slider:{
        minValue: 1,
        maxValue: 200
      },
      areas:[

      ]
    }

    var filters=APP_ENV.NAME+'-filters'
    syncToLocalStorage(filters,'filters',vm,$localStorage)
    
    $scope.$watch('filters', function(){
      $localStorage[filters] = vm.filters;
    }, true);
// slider

    $scope.sliderVisible = false;

    // vm.slider = {
    //   minValue: 1,
    //   maxValue: 200,
    //   options: {
    //     floor: 1,
    //     ceil: 200,
    //     noSwitching: true,
    //     translate: function(value, sliderId, label) {
          
    //         return value + " hrs"
  
    //     }
    //   }
    // };
    $scope.toggleSlider = function () {
      // console.log("slider")
      $scope.sliderVisible = !$scope.sliderVisible;
      $timeout(function () {
        $scope.$broadcast('rzSliderForceRender');
      });
    };

  // location filter
    // var REGEX_EMAIL = '([a-z0-9!#$%&\'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&\'*+/=?^_`{|}~-]+)*@' +
    //                   '(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?)';

    // vm.areas=[];
    // var areas = APP_ENV.APP_NAME+'-areas';
    // // save settings to local storage
    // if ( angular.isDefined($localStorage[areas]) ) {
    //   vm.areas = $localStorage[areas];
    //   // console.log("areas",vm.areas)
    // } else {
    //   $localStorage[areas] = vm.areas;
    // }

    // vm.areas=[]
    // var areas = APP_ENV.APP_NAME+'-areas';
    // syncToLocalStorage(areas,'areas',vm,$localStorage)
    // watch changes
    // $scope.$watch('areas', function(){
    //   $localStorage[areas] = vm.areas;
    // }, true);

    vm.transactionToday = 0;
    vm.unlockedParking = 0;
    vm.lockedParking = 0;
    vm.areaOptions=[]


    refreshStats(vm,apollo)

    console.log("areas_c",vm.filters)


    $('#select-to').selectize({
        plugins: ['remove_button'],
        persist: false,
        maxItems: null,
        valueField: 'name',
        labelField: 'name',
        searchField: ['name'],
        placeholder:"Enter Area name one by one",
        items:   vm.filters.areas,
        options: vm.areaOptions,
        render: {
            item: function(item, escape) {
                return '<div>' +
                    (item.name ? '<span class="name">' + escape(item.name) + '</span>' : '')+
                '</div>';
            },
            option: function(item, escape) {
                var label = item.name;
                return '<div>' +
                    '<span class="label">' + escape(label) + '</span>' +
                '</div>';
            }
        },
        createFilter: function(input) {
            var match, regex;

            // email@address.com
            regex = new RegExp('^' + input + '$', 'i');
            match = input.match(regex);
            if (match) return !this.options.hasOwnProperty(match[0]);

            // name <email@address.com>
            // regex = new RegExp('^([^<]*)\<' + REGEX_EMAIL + '\>$', 'i');
            // match = input.match(regex);
            // if (match) return !this.options.hasOwnProperty(match[2]);

            return false;
        },
        onChange: function(value){
          // $localStorage[areas] = value;
          console.log("value",value)
          vm.filters.areas=value;
          // $localStorage[filters]=vm.filters
          console.log(vm.filters)
          console.log("vm areas",vm.filters.areas)
          console.log("st areas",$localStorage[filters])
              // var filters=APP_ENV.NAME+'-filters'
          syncToLocalStorage(filters,'filters',vm,$localStorage)
        },
        preload:"focus",
        load: function(query, callback){
          callback(vm.areaOptions)
        }
    });
  // end location filter



    vm.p_p_1 = [{ data: 70, label: 'Server' }, { data: 30, label: 'Client' }];
    vm.p_p_2 = [{ data: 75, label: 'iPhone' }, { data: 20, label: 'iPad' }];
    vm.p_p_3 = [{ data: 30, label: 'Server' }, { data: 70, label: 'Client' }];
    vm.p_p_4 = [{ data: 10, label: 'Apple' }, { data: 15, label: 'Google' }, { data: 35, label: 'Flatty' }, { data: 45, label: 'Other' }];

    vm.p_l_1 = [[1, 6.1], [2, 6.3], [3, 6.4], [4, 6.6], [5, 7.0], [6, 7.7], [7, 8.3]];
    vm.p_l_2 = [[1, 5.5], [2, 5.7], [3, 6.4], [4, 7.0], [5, 7.2], [6, 7.3], [7, 7.5]];
    vm.p_l_3 = [[1, 2], [2, 1.6], [3, 2.4], [4, 2.1], [5, 1.7], [6, 1.5], [7, 1.7]];
    vm.p_l_4 = [[1, 3], [2, 2.6], [3, 3.2], [4, 3], [5, 3.5], [6, 3], [7, 3.5]];
    vm.p_l_5 = [[1, 3.6], [2, 3.5], [3, 6], [4, 4], [5, 4.3], [6, 3.5], [7, 3.6]];
    vm.p_l_6 = [[1, 10], [2, 8], [3, 27], [4, 25], [5, 50], [6, 30], [7, 25]];

    vm.p_b_1 = [[1, 2], [2, 4], [3, 5], [4, 7], [5, 6], [6, 4], [7, 5], [8, 4]];
    vm.p_b_2 = [[3, 1], [2, 2], [6, 3], [5, 4], [7, 5]];
    vm.p_b_3 = [[1, 3], [2, 4], [3, 3], [4, 6], [5, 5], [6, 4], [7, 5], [8, 3]];
    vm.p_b_4 = [[1, 2], [2, 3], [3, 2], [4, 5], [5, 4], [6, 3], [7, 4], [8, 2]];

    vm.world_markers = [
      { latLng: [52.5167, 13.3833], name: 'Berlin' },
      { latLng: [48.8567, 2.3508], name: 'Paris' },
      { latLng: [35.6833, 139.6833], name: 'Tokyo' },
      { latLng: [40.7127, -74.0059], name: 'New York City' },
      { latLng: [49.2827, -123.1207], name: 'City of Vancouver' },
      { latLng: [22.2783, 114.1747], name: 'Hong Kong' },
      { latLng: [55.7500, 37.6167], name: 'Moscow' },
      { latLng: [37.7833, -122.4167], name: 'San Francisco' },
      { latLng: [39.9167, 116.3833], name: 'Beijing' }
    ];

    vm.usa_markers = [
      { latLng: [40.71, -74.00], name: 'New York' },
      { latLng: [34.05, -118.24], name: 'Los Angeles' },
      { latLng: [41.87, -87.62], name: 'Chicago' },
      { latLng: [29.76, -95.36], name: 'Houston' },
      { latLng: [39.95, -75.16], name: 'Philadelphia' },
      { latLng: [38.90, -77.03], name: 'Washington' },
      { latLng: [37.36, -122.03], name: 'Silicon Valley' }
    ];

    vm.cityAreaData = [
      605.16,
      310.69,
      405.17,
      748.31,
      207.35,
      217.22,
      137.70,
      280.71,
      210.32,
      325.42
    ]





  vm.locations="Gombak,Ampang Park"
  vm.minDuration=1
  vm.maxDuration=3

  // #### sells statistics chart
    am4core.ready(function() {

      // Themes begin
      am4core.useTheme(am4themes_animated);
      // Themes end

      // Create chart instance
      var chart = am4core.create("chartSellStats", am4charts.XYChart);
      // chart.chartContainer.wheelable = true;

      // Add data
      chart.data = generateChartData();

      // Create axes
      var dateAxis = chart.xAxes.push(new am4charts.DateAxis());
      dateAxis.renderer.minGridDistance = 50;

      var valueAxis = chart.yAxes.push(new am4charts.ValueAxis());

      // Create series
      var series = chart.series.push(new am4charts.LineSeries());
      series.dataFields.valueY = "visits";
      series.dataFields.dateX = "date";
      series.strokeWidth = 2;
      series.minBulletDistance = 10;
      series.tooltipText = "{valueY}";
      series.tooltip.pointerOrientation = "vertical";
      series.tooltip.background.cornerRadius = 20;
      series.tooltip.background.fillOpacity = 0.5;
      series.tooltip.label.padding(12,12,12,12)

      // Add scrollbar
      chart.scrollbarX = new am4charts.XYChartScrollbar();
      chart.scrollbarX.series.push(series);

      // Add cursor
      chart.cursor = new am4charts.XYCursor();
      chart.cursor.xAxis = dateAxis;
      chart.cursor.snapToSeries = series;

      function generateChartData() {
          var chartData = [];
          var firstDate = new Date();
          firstDate.setDate(firstDate.getDate() - 1000);
          var visits = 1200;
          for (var i = 0; i < 500; i++) {
              // we create date objects here. In your data, you can have date strings
              // and then set format of your dates using chart.dataDateFormat property,
              // however when possible, use date objects, as this will speed up chart rendering.
              var newDate = new Date(firstDate);
              newDate.setDate(newDate.getDate() + i);
              
              visits += Math.round((Math.random()<0.5?1:-1)*Math.random()*10);

              chartData.push({
                  date: newDate,
                  visits: visits
              });
          }
          return chartData;
      }

    }); 


  }

})();

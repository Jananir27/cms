;(function ($) {
    "use strict";

    // Default Highchart Options
    var DEFAULT_HC_OPTS = {



        "title": {
            "text": ""
        },
        "credits": {
            "enabled": false
        }
    };

    // Default column graph options
    var DEFAULT_COL_HC_OPTS = $.extend({}, DEFAULT_HC_OPTS, {

      "chart": {

        "type": "column",
      },
      "xAxis": {

        "labels": {"enabled": false}
      },
      "tooltip": {

        "valueSuffix": " Items"
      }
    });

    var ars = window.ARS = window.ARS || {};

    function renderPlanogramAdherence () {

      var $panel = $("#ad-panel"),
          $graph = $panel.find("div.graph");

      var seriesData = [];

      $.each(ars.adherence, function (storeName, categories) {

        var catData = [];

        $.each(categories, function () {

          catData.push({"name": this.name, "y": this.value});
        });

        seriesData.push({name: storeName, data: catData});
      });

      var options = $.extend({}, DEFAULT_COL_HC_OPTS, {
                                    "yAxis": {

                                      "title": {

                                        "text": "Allocation %"
                                      }
                                    },
                                    "tooltip": {

                                      "valueSuffix": " %"
                                    },
                                    "series": seriesData
                                  }
                            );

      $graph.highcharts(options);
    }


    function renderSellThroughTrend () {


      var $panel = $("#stt-panel"),
          $graph = $panel.find("div.graph");

      var seriesData = [];

      $.each(ars.sellthru, function (store1, sellthru1) {

        var catData = [];

        $.each(sellthru1, function () {
          var wwq = this.name;
          var dsplit = wwq.split("-");
          var wwq = new Date(dsplit[0],dsplit[1]-1,dsplit[2]);
          var newDateMs = Date.UTC(wwq.getUTCFullYear(),wwq.getUTCMonth(),wwq.getUTCDate()+1);
          var ew = parseFloat(this.value)
          catData.push({ "x": newDateMs, "y": ew  });
        });
        seriesData.push({ name : store1, data : catData});
      });

      var options = $.extend({}, DEFAULT_HC_OPTS, {
                                    "chart": {"type": "line"},

                                    "xAxis": { "type" : 'datetime',
                                               "labels" : {"enabled": true,
                                               "formatter": function() {
                                                            return Highcharts.dateFormat("%Y %b %e", this.value)

                                                            },
                                               },

                                     },

                                    "yAxis": { "title": {"text": "Sell Thru %"} },

                                    "tooltip": {"useHTML": true,
                                    "formatter": function() {
                                                return '<center><b>'+Highcharts.numberFormat(this.y) +'</b> %</center>'+'<b></b> '+Highcharts.dateFormat("%A,%e %b %Y", this.x);
                                    }

                                            },

                                    "series": seriesData
                                    }
                            );
      $graph.highcharts(options);
    }





    function renderRateOfSaleTrend () {

      var $panel = $("#rost-panel"),
          $graph = $panel.find("div.graph");

      var seriesData = [];

      $.each(ars.rate, function (store1, sellthru1) {

        var catData = [];

        $.each(sellthru1, function () {
          var wwq = this.name;
          var dsplit = wwq.split("-");
          var wwq = new Date(dsplit[0],dsplit[1]-1,dsplit[2]);
          var newDateMs = Date.UTC(wwq.getUTCFullYear(),wwq.getUTCMonth(),wwq.getUTCDate()+1);
          var ew = parseFloat(this.value)
          catData.push({ "x": newDateMs, "y": ew  });
        });
        seriesData.push({ name : store1, data : catData});
      });

      var options = $.extend({}, DEFAULT_HC_OPTS, {
                                    "chart": {"type": "line"},

                                    "xAxis": { "type" : 'datetime',
                                               "labels" : {"enabled": true,
                                               "formatter": function() {
                                                            return Highcharts.dateFormat("%Y %b %e", this.value)
                                                            },
                                               },
                                     },
                                    "yAxis": { "title": {"text": "Rate Of Sale %"},"min" : 0 },
                                    "tooltip": {
                                    "useHTML": true,
                                    "formatter": function() {
                                                return '<center><b>'+Highcharts.numberFormat(this.y) +'</b> %</center>'+'<b></b> '+Highcharts.dateFormat("%A,%e %b %Y", this.x);
                                    }},
                                    "series": seriesData
                                    }
                                    );

      $graph.highcharts(options);
    }

    function renderAllocationSummary (data) {

      var $panel = $("#as-panel"),
          $graph   = $panel.find("div.graph");

      var seriesData = [];

      $.each(ars.allAllocations, function (storeName, allocQty) {

        seriesData.push({"name": storeName, "y": allocQty});
      });

      var options = $.extend({}, DEFAULT_COL_HC_OPTS, {
                                  "yAxis": {

                                    "title": {

                                      "text": 'Items Allocated'
                                    }
                                  },
                                  "series": [{

                                    "name": "Allocations",
                                    "data": seriesData
                                }]}
                            );

      $graph.highcharts(options);
    }

    function initUi () {
      renderPlanogramAdherence();
      renderSellThroughTrend();
      renderRateOfSaleTrend();
      renderAllocationSummary();
    }

    $(function () {
      initUi();
    });
}(window.jQuery));

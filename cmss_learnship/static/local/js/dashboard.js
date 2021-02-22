$(document).ready(function () {

    var zones = [];
    var utilized = [];
    var free = [];

    $('#zone-util tbody tr').find('td:first').each(function() {
           zones.push($(this).text());
        });
    $('#zone-util tbody tr').find('td:first').next().each(function() {
           utilized.push(parseInt($(this).text(), 10));
        });
    $('#zone-util tbody tr').find('td:last').each(function() {
           free.push(parseInt($(this).text(), 10));
        });

    $('#zone-utilization').highcharts({
        chart: {
            type: 'column'
        },
        credits: {
            enabled: false
        },
        title: {
            text: 'Space Utilization'
        },
        xAxis: {
            title: {
                text: 'Zone'
            },
            categories: zones
        },
        yAxis: {
            min: 0,
            title: {
                text: 'Number of Locations'
            },
            stackLabels: {
                enabled: true,
                style: {
                    fontWeight: 'bold',
                    color: (Highcharts.theme && Highcharts.theme.textColor) || 'gray'
                }
            }
        },
        legend: {
            align: 'right',
            x: -30,
            verticalAlign: 'top',
            y: 25,
            floating: true,
            backgroundColor: (Highcharts.theme && Highcharts.theme.background2) || 'white',
            borderColor: '#CCC',
            borderWidth: 1,
            shadow: false
        },
        tooltip: {
            formatter: function () {
                return '<b>' + this.x + '</b><br/>' +
                    this.series.name + ': ' + this.y + '<br/>' +
                    'Total: ' + this.point.stackTotal;
            }
        },
        plotOptions: {
            column: {
                stacking: 'normal',
                dataLabels: {
                    enabled: true,
                    color: (Highcharts.theme && Highcharts.theme.dataLabelsColor) || 'white',
                    style: {
                        textShadow: '0 0 3px black'
                    }
                }
            }
        },
        series: [{
            name: 'Free',
            data: free
        }, {
            name: 'Utilized',
            data: utilized
        }]
    });


    var cate = [];
    var total = [];
    var picked = [];
    var dispatched = [];

    $('#dtr-report tbody tr').find('td:first').each(function() {
           cate.push($(this).text());
        });

    $('#dtr-report tbody tr').find('td:first').next().each(function() {
           total.push(parseInt($(this).text(), 10));
        });
    $('#dtr-report tbody tr').find('td:last').prev().each(function() {
           picked.push(parseInt($(this).text(), 10));
        });
    $('#dtr-report tbody tr').find('td:last').each(function() {
           dispatched.push(parseInt($(this).text(), 10));
        });


    $('#dtr').highcharts({
        chart: {
            type: 'line'
        },
        credits: {
            enabled: false
        },
        title: {
            text: 'Daily Transactions'
        },
        xAxis: {
            categories: cate
        },
        yAxis: {
            title: {
                text: 'Number of Orders'
            }
        },
        plotOptions: {
            line: {
                dataLabels: {
                    enabled: true
                },
                enableMouseTracking: false
            }
        },
        series: [{
            name: 'Total Orders',
            data: total
        }, {
            name: 'Picked Orders',
            data: picked
        }, {
            name: 'Dispatched Orders',
            data: dispatched
        }]
    });

    var executed = [];
    var progress = [];
    var pending = [];

    executed.push(parseInt($('#putaway-report tbody tr:first').find('td:first').next().text(), 10));
    executed.push(parseInt($('#putaway-report tbody tr:last').find('td:first').next().text(), 10));

    progress.push(parseInt($('#putaway-report tbody tr:first').find('td:last').prev().text(), 10));
    progress.push(parseInt($('#putaway-report tbody tr:last').find('td:last').prev().text(), 10));

    pending.push(parseInt($('#putaway-report tbody tr:first').find('td:last').text(), 10));
    pending.push(parseInt($('#putaway-report tbody tr:last').find('td:last').text(), 10));

    $('#pick-putaway').highcharts({
        chart: {
            type: 'column'
        },
        credits: {
            enabled: false
        },
        colors: ['#8bbc21', '#E6E600', '#d9534f'],
        title: {
            text: 'Pick & Putaway'
        },
        xAxis: {
            categories: [
                'Pick',
                'Put-away'
            ],
            crosshair: true
        },
        yAxis: {
            min: 0,
            title: {
                text: 'Number Of Orders'
            }
        },
        tooltip: {
            headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
            footerFormat: '</table>',
            shared: true,
            useHTML: true
        },
        plotOptions: {
            column: {
                pointPadding: 0.2,
                borderWidth: 0
            }
        },
        series: [{
            name: 'Executed',
            data: executed

        }, {
            name: 'In-Progress',
            data: progress

        }, {
            name: 'Pending',
            data: pending

        }]
    });

  var aging_node = $('#inventory-aging tbody')
  var data1 = parseInt(aging_node.find('tr:first').find('td:last').text(), 10);
  var data2 = parseInt(aging_node.find('tr:first').next().find('td:last').text(), 10);
  var data3 = parseInt(aging_node.find('tr:last').find('td:last').text(), 10);

  $('#aging').highcharts({
        chart: {
            type: 'column'
        },
        title: {
            text: 'Inventory Aging'
        },
        credits: {
            enabled: false
        },
        xAxis: {
            title: {
                text: 'Age'
            },
            type: 'category',
            labels: {
                style: {
                    fontSize: '13px',
                    fontFamily: 'Verdana, sans-serif'
                }
            }
        },
        yAxis: {
            min: 0,
            title: {
                text: 'Quantity'
            }
        },
        legend: {
            enabled: false
        },
        series: [{
            name: 'Quantity',
            data: [
                ['3 months old', data1],
                ['3-6 months old', data2],
                ['Older than 6 months', data3],
            ],
            dataLabels: {
                    enabled: true,
                    color: (Highcharts.theme && Highcharts.theme.dataLabelsColor) || 'gray',
                    style: {
                    }
                }
        }]
    });

});

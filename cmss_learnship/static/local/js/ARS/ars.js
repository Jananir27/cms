function not_mes(message, type, froms, aligns, enters, exits){
        $.growl({
            message: message
        },{
            type: type,
            allow_dismiss: false,
            label: 'Cancel',
            className: 'btn-xs btn-inverse',
            placement: {
                from: froms,
                align: aligns
            },
            delay: 2500,
            animate: {
                    enter: enters,
                    exit: exits
            },
            offset: {
                x: 20,
                y: 85
            }
        });
    };

var render_allocations = function(alloc_type, resp) {
    var allocated_tb = '',
        need_to_allocate_tb = '';

    $.each(resp['allocated'], function(idx, data) {
        allocated_tb += '<tr><td>' + data['customer'] + '</td><td>' + data['ean'] + '</td>';
        allocated_tb += '<td>' + data['style_code'] + '</td><td>' + data['size'] + '</td>';
        allocated_tb += '<td>' + data['norm'] + '</td>';
        allocated_tb += '<td>' + data['soh'] + '</td><td>' + data['git'] + '</td><td>' + data['order_qty'] + '</td>';
        allocated_tb += '<td>' + data['total_soh'] + '</td><td>' + data['allocated'] + '</td></tr>';
    });

    $.each(resp['unallocated'], function(idx, data) {
        need_to_allocate_tb += '<tr><td>' + data['customer'] + '</td><td>' + data['ean'] + '</td>';
        need_to_allocate_tb += '<td>' + data['style_code'] + '</td><td>' + data['size'] + '</td>';
        need_to_allocate_tb += '<td>' + data['norm'] + '</td>';
        need_to_allocate_tb += '<td>' + data['soh'] + '</td><td>' + data['git'] + '</td><td>' + data['order_qty'] + '</td>';
        need_to_allocate_tb += '<td>' + data['total_soh'] + '</td><td>' + data['need_to_allocate'] + '</td>';
        need_to_allocate_tb += '<td>' + data['reason'] + '</td></tr>';
    });

    if(alloc_type == 'FM') {
        $("table#fm-allocated-table > tbody").empty().append(allocated_tb);
        $("table#fm-unallocated-table > tbody").empty().append(need_to_allocate_tb);
        showDiv('#fm-allocations-div');
    }
    else if(alloc_type == 'SM') {
        $("table#sm-allocated-table > tbody").empty().append(allocated_tb);
        $("table#sm-unallocated-table > tbody").empty().append(need_to_allocate_tb);
        showDiv('#sm-allocations-div');
    }
    else if(alloc_type == 'NS') {
        $("table#ns-allocated-table > tbody").empty().append(allocated_tb);
        $("table#ns-unallocated-table > tbody").empty().append(need_to_allocate_tb);
        showDiv('#ns-allocations-div');
    }
    else if(alloc_type == 'CP') {
        $("table#cp-allocated-table > tbody").empty().append(allocated_tb);
        $("table#cp-unallocated-table > tbody").empty().append(need_to_allocate_tb);
        showDiv('#cp-allocations-div');
    }

};


function callAjax($this, url, method, data, alloc_type) {
    if (typeof(method)==='undefined')
        var method = 'GET';

    if (typeof(data)==='undefined')
        var data = {};

    var allocated_tb = '',
        need_to_allocate_tb = '';

    showLoading();

    $.ajax({
        url: url,
        type: method,
        asyn: false,
        success: function(resp) {
            render_allocations(alloc_type, resp);
            hideLoading();
        },
        error: function(resp) {
            alert('Error Occured');
            hideLoading();
        }
    });

}

function hideDiv(div_id) {
    var $divId = $(div_id);
    $divId.hide();
}

function showDiv(div_id) {
    var $divId = $(div_id);
    $divId.show();
}

function showLoading() {
    $(".page-loader").addClass("pl-add");
}

function hideLoading() {
    $(".page-loader").removeClass("pl-add");
}

$(document).ready(function() {
    hideDiv('#cr-allocations-div');
    hideDiv('#fm-allocations-div');
    hideDiv('#sm-allocations-div');
    hideDiv('#ns-allocations-div');
    hideDiv('#cp-allocations-div');

    hideDiv('#ros_calc_tab');
	hideDiv('#soh_calc_tab');
	hideDiv('#cat_sty_tab');

	$('#cr-allocate-btn').on('click', function(e) {
	    e.preventDefault();

        showLoading();
        hideDiv('#fm-allocations-div');
        hideDiv('#sm-allocations-div');
        hideDiv('#ns-allocations-div');
        hideDiv('#cp-allocations-div');
	    hideDiv('#alert');

        hideDiv('#ros_calc_tab');
	    hideDiv('#soh_calc_tab');
	    hideDiv('#cat_sty_tab');

        var allocated_tb = '',
            need_to_allocate_tb = '';

        var brand_channel = get_brand_channel();

        if(brand_channel == undefined) {
            hideLoading();
            return;
        }

		$.ajax({
			url: '/compute_allocations/?runall_flag=False&brand_channels='+JSON.stringify(brand_channel),
			type: 'GET',
			// async: false,
			success: function(resp) {
			    $.each(resp['allocated'], function(idx, data) {
			        allocated_tb += '<tr><td>' + data['customer'] + '</td><td>' + data['ean'] + '</td>';
			        allocated_tb += '<td>' + data['style_code'] + '</td><td>' + data['size'] + '</td>';
			        allocated_tb += '<td>' + data['min_norm'] + '</td><td>' + data['max_norm'] + '</td>';
			        allocated_tb += '<td>' + data['soh'] + '</td><td>' + data['git'] + '</td><td>' + data['order_qty'] + '</td>';
			        allocated_tb += '<td>' + data['total_soh'] + '</td><td>' + data['allocated'] + '</td></tr>';
			    });

			    $.each(resp['unallocated'], function(idx, data) {
			        need_to_allocate_tb += '<tr><td>' + data['customer'] + '</td><td>' + data['ean'] + '</td>';
			        need_to_allocate_tb += '<td>' + data['style_code'] + '</td><td>' + data['size'] + '</td>';
			        need_to_allocate_tb += '<td>' + data['min_norm'] + '</td><td>' + data['max_norm'] + '</td>';
			        need_to_allocate_tb += '<td>' + data['soh'] + '</td><td>' + data['git'] + '</td><td>' + data['order_qty'] + '</td>';
			        need_to_allocate_tb += '<td>' + data['total_soh'] + '</td><td>' + data['need_to_allocate'] + '</td>';
			        need_to_allocate_tb += '<td>' + data['reason'] + '</td></tr>';
			    });
		        $("table#cr-allocated-table > tbody").empty().append(allocated_tb);
        		$("table#cr-unallocated-table > tbody").empty().append(need_to_allocate_tb);
        		hideLoading();
			},
			error: function(resp) {
				hideLoading();
			}
		});

		showDiv('#cr-allocations-div');
		hideDiv('#fm-allocations-div');
	});

	$('#fm-allocate-btn').on('click', function(e) {
	    e.preventDefault();
        hideDiv('#cr-allocations-div');
        hideDiv('#sm-allocations-div');
        hideDiv('#ns-allocations-div');
        hideDiv('#cp-allocations-div');

        hideDiv('#ros_calc_tab');
	    hideDiv('#soh_calc_tab');
	    hideDiv('#cat_sty_tab');
	    hideDiv('#alert');

        var $this = this;

        var brand_channel = get_brand_channel();

        if(brand_channel == undefined) {
            hideLoading();
            return;
        }

	    var resp = callAjax($this, '/compute_fm_allocations/?runall_flag=False&brand_channels='+JSON.stringify(brand_channel), 'GET', {}, 'FM');
	});

	$('#sm-allocate-btn').on('click', function(e) {
	    e.preventDefault();
        hideDiv('#cr-allocations-div');
        hideDiv('#fm-allocations-div');
        hideDiv('#ns-allocations-div');
        hideDiv('#cp-allocations-div');

        hideDiv('#ros_calc_tab');
	    hideDiv('#soh_calc_tab');
	    hideDiv('#cat_sty_tab');
	    hideDiv('#alert');

        var $this = this;

        var brand_channel = get_brand_channel();

        if(brand_channel == undefined) {
            hideLoading();
            return;
        }

	    var resp = callAjax($this, '/compute_sm_allocations/?runall_flag=False&brand_channels='+JSON.stringify(brand_channel), 'GET', {}, 'SM');
	});

	$('#ns-allocate-btn').on('click', function(e) {
	    e.preventDefault();
        hideDiv('#cr-allocations-div');
        hideDiv('#fm-allocations-div');
        hideDiv('#sm-allocations-div');
        hideDiv('#cp-allocations-div');

        hideDiv('#ros_calc_tab');
	    hideDiv('#soh_calc_tab');
	    hideDiv('#cat_sty_tab');
	    hideDiv('#alert');

        var $this = this;

        var brand_channel = get_brand_channel();

        if(brand_channel == undefined) {
            hideLoading();
            return;
        }

	    var resp = callAjax($this, '/compute_ns_allocations/?runall_flag=False&brand_channels='+JSON.stringify(brand_channel), 'GET', {}, 'NS');
	});

	$('#cp-allocate-btn').on('click', function(e) {
	    e.preventDefault();
        hideDiv('#cr-allocations-div');
        hideDiv('#fm-allocations-div');
        hideDiv('#sm-allocations-div');
        hideDiv('#ns-allocations-div');

        hideDiv('#ros_calc_tab');
	    hideDiv('#soh_calc_tab');
	    hideDiv('#cat_sty_tab');
	    hideDiv('#alert');

        var $this = this;

        var brand_channel = get_brand_channel();

        if(brand_channel == undefined) {
            hideLoading();
            return;
        }

	    var resp = callAjax($this, '/compute_cp_allocations/?runall_flag=False&brand_channels='+JSON.stringify(brand_channel), 'GET', {}, 'CP');
	});


	var get_brand_channel = function() {
	    var brand_channel = [];
        $('select[name="brand_channel"]').children(':selected').each(function() { brand_channel.push($(this).val()); })

	    if(brand_channel == undefined || brand_channel.length == 0) {
	        alert('Select atleast one Brand-Channel to Continue');
	        return;
        }

	    return brand_channel
    };


	$('#populate-categorystyle').on('click', function(e) {
	    e.preventDefault();
        showLoading();

        var brand_channel = get_brand_channel();

        if(brand_channel == undefined) {
            hideLoading();
            return;
        }
        var cat_sty_tb = ''
	    $.ajax({
	        'url': '/populate_categorystyle_map/?brand_channels='+JSON.stringify(brand_channel),
	        'type': 'GET',
	        'success': function(resp) {
	            hideLoading();
	            if(resp.status == 1){
	            $("body").find("#alert").html('<div class="alert alert-success centered" role="alert"><span class="glyphicon glyphicon-exclamation-sign" aria-hidden="true"></span><span class="sr-only">Error:</span><strong> Well Done ! </strong>Done Mapping Category and Style</div>').show();
	            }else{

	            $("body").find("#alert").html('<div class="alert alert-danger centered" role="alert"><span class="glyphicon glyphicon-exclamation-sign" aria-hidden="true"></span><span class="sr-only">Error:</span><strong></strong>'+resp.msg+'</div>').show().fadeOut(5000); }

                /*
	            $.each(resp['cat_sty'], function(idx, data) {
			        cat_sty_tb += '<tr><td>' + data['Style'] + '</td><td>' + data['Category ID'] + '</td>';
			        cat_sty_tb += '<td>' + data['Category'] + '</td><td>' + data['Brand'] + '</td>';
			        cat_sty_tb += '<td>' + data['Channel'] + '</td></tr>';
			    });
			    $("table#cat_sty > tbody").empty().append(cat_sty_tb);*/
	        },
	        'error': function(resp) {
	            hideLoading();
	            $("body").find("#alert").html('<div class="alert alert-danger centered" role="alert"><span class="glyphicon glyphicon-exclamation-sign" aria-hidden="true"></span><span class="sr-only">Error:</span><strong> Caution ! </strong> Error While Running </div>').show().fadeOut(5000);
	        }
	    });
	    hideDiv('#ros_calc_tab');
	    hideDiv('#soh_calc_tab');
	    //showDiv('#cat_sty_tab');
	    hideDiv('#alert');

	    hideDiv('#cr-allocations-div');
        hideDiv('#fm-allocations-div');
        hideDiv('#sm-allocations-div');
        hideDiv('#ns-allocations-div');
        hideDiv('#cp-allocations-div');
	});

	$('#calculate-git').on('click', function(e) {
	    e.preventDefault();
	    showLoading();

	    $.ajax({
	        'url': '/calculategit/',
	        'type': 'GET',
	        'success': function(resp) {
	            hideLoading();
	            $("body").find("#alert").html('<div class="alert alert-success centered" role="alert"><span class="glyphicon glyphicon-exclamation-sign" aria-hidden="true"></span><span class="sr-only">Error:</span><strong> Well Done ! </strong> GIT Calculated Successfully</div>').show().fadeOut(5000);
	        },
	        'error': function(resp) {
	            hideLoading();
	            $("body").find("#alert").html('<div class="alert alert-danger centered" role="alert"><span class="glyphicon glyphicon-exclamation-sign" aria-hidden="true"></span><span class="sr-only">Error:</span><strong> Caution ! </strong> Error While Running </div>').show().fadeOut(5000);
	        }

	    });
	    hideDiv('#cr-allocations-div');
	    hideDiv('#fm-allocations-div');
	});

	$('#calculate-ros').on('click', function(e) {
	    e.preventDefault();
	    showLoading();
        var brand_channel = get_brand_channel();

        if(brand_channel == undefined) {
            hideLoading();
            return;
        }
        var calc_ros_tb=""
        $.ajax({
	        'url': '/calculateros/?brand_channels='+JSON.stringify(brand_channel),
	        'type': 'GET',
	        'success': function(resp) {
	            hideLoading();
	            if(resp.status == 1){
	                $("body").find("#alert").html('<div class="alert alert-success centered" role="alert"><span class="glyphicon glyphicon-exclamation-sign" aria-hidden="true"></span><span class="sr-only">Error:</span><strong> Well Done ! </strong>Calculated ROS</div>').show();
	            }else{

	            $("body").find("#alert").html('<div class="alert alert-danger centered" role="alert"><span class="glyphicon glyphicon-exclamation-sign" aria-hidden="true"></span><span class="sr-only">Error:</span><strong></strong>'+resp.msg+'</div>').show().fadeOut(5000); }

	            $.each(resp['calc_ros'], function(idx, data) {
			        calc_ros_tb += '<tr><td>' + data['Brand'] + '</td><td>' + data['Channel'] + '</td>';
			        calc_ros_tb += '<td>' + data['Customer'] + '</td><td>' + data['Style'] + '</td>';
			        calc_ros_tb += '<td>' + data['Size'] + '</td><td>' + data['Category ID'] + '</td>';
			        calc_ros_tb += '<td>' + data['Category'] + '</td><td>' + data['First GRN Date'] + '</td><td>' + data['Total Sold Qty'] + '</td>';
			        calc_ros_tb += '<td>' + data['GRN Quantity'] + '</td><td>' + data['Location SOH'] + '</td><td>' + data['Average GRN Trading Days'] + '</td>';
			        calc_ros_tb += '<td>' + data['ROS'] + '</td><td>' + data['Style ROS'] + '</td><td>' + data['Style Trading Days'] + '</td>';
			        calc_ros_tb += '<td>' + data['Sell Thru'] + '</td>';
			        calc_ros_tb += '<td>' + data['Item Type'] + '</td><td>' + data['Last Item Type'] + '</td></tr>';
			    });
			    $("table#ros_calc > tbody").empty().append(calc_ros_tb);
	        },
	        'error': function(resp) {
	            hideLoading();
	            $("body").find("#alert").html('<div class="alert alert-danger centered" role="alert"><span class="glyphicon glyphicon-exclamation-sign" aria-hidden="true"></span><span class="sr-only">Error:</span><strong> Caution ! </strong> Error While Running </div>').show().fadeOut(5000);
	        }

	    });
	    hideDiv('#cat_sty_tab');
	    hideDiv('#soh_calc_tab');
	    hideDiv('#alert');
	    //showDiv('#ros_calc_tab');

	    hideDiv('#cr-allocations-div');
        hideDiv('#fm-allocations-div');
        hideDiv('#sm-allocations-div');
        hideDiv('#ns-allocations-div');
        hideDiv('#cp-allocations-div');
	});

	$('#calculate-totalsoh').on('click', function(e) {
	    e.preventDefault();
	    showLoading();

        var brand_channel = get_brand_channel();

        if(brand_channel == undefined) {
            hideLoading();
            return;
        }
        $.ajax({
	        'url': '/calculatetotalsoh/?brand_channels='+JSON.stringify(brand_channel),
	        'type': 'GET',
	        'success': function(resp) {
	            hideLoading();
	            if(resp.status == 1){

	            //$("body").find("#alert").html('<div class="alert alert-success centered" role="alert"><span class="glyphicon glyphicon-exclamation-sign" aria-hidden="true"></span><span class="sr-only">Error:</span><strong> Well Done ! </strong>'+resp.msg+'</div>').show().fadeOut(5000);
	            console.log(resp);
	            showDiv('#soh_calc_tab');
	            }else{

	            $("body").find("#alert").html('<div class="alert alert-danger centered" role="alert"><span class="glyphicon glyphicon-exclamation-sign" aria-hidden="true"></span><span class="sr-only">Error:</span><strong></strong>'+resp.msg+'</div>').show().fadeOut(5000); }
	            /*
	            var calc_soh_tb = ""
	            $.each(resp['calc_soh'], function(idx, data) {
			        calc_soh_tb += '<tr><td>' + data['Customer'] + '</td><td>' + data['Brand'] + '</td>';
			        calc_soh_tb += '<td>' + data['Channel'] + '</td><td>' + data['Category'] + '</td>';
			        calc_soh_tb += '<td>' + data['Category ID'] + '</td><td>' + data['Style'] + '</td>';
			        calc_soh_tb += '<td>' + data['Size'] + '</td><td>' + data['SOH Quantity'] + '</td><td>' + data['GIT Quantity'] + '</td>';
			        calc_soh_tb += '<td>' + data['Order Quantity'] + '</td><td>' + data['FM Allocated'] + '</td>';
			        calc_soh_tb += '<td>' + data['SM Allocated'] + '</td><td>' + data['NS Allocated'] + '</td><td>' + data['CR Allocated'] + '</td>'
			        calc_soh_tb += '<td>' + data['Final SOH'] + '</td><td>' + data['Pivotal Flag'] + '</td><td>' + data['Size Set Classification'] + '</td>'
			        calc_soh_tb += '<td>' + data['Norm'] + '</td><td>' + data['Gap'] + '</td><td>' + data['Buy Plan Present'] + '</td></tr>'
			    });
		        $("table#soh_calc > tbody").empty().append(calc_soh_tb);*/
	        },
	        'error': function(resp) {
	            hideLoading();
	            $("body").find("#alert").html('<div class="alert alert-danger centered" role="alert"><span class="glyphicon glyphicon-exclamation-sign" aria-hidden="true"></span><span class="sr-only">Error:</span><strong> Caution ! </strong> Error While Running </div>').show().fadeOut(5000);
	        }
	    });
	    hideDiv('#cat_sty_tab');
	    hideDiv('#ros_calc_tab');
	    hideDiv('#alert');

	    hideDiv('#cr-allocations-div');
        hideDiv('#fm-allocations-div');
        hideDiv('#sm-allocations-div');
        hideDiv('#ns-allocations-div');
        hideDiv('#cp-allocations-div');
	});

	$('#pre-process-btn').on('click', function(e) {
	    e.preventDefault();
        showLoading();

	    $.ajax({
	        'url': '/preprocess/',
	        'type': 'GET',
	        'success': function(resp) {
	            hideLoading();
	            $("body").find("#alert").html('<div class="alert alert-success centered" role="alert"><span class="glyphicon glyphicon-exclamation-sign" aria-hidden="true"></span><span class="sr-only">Error:</span><strong> Well Done ! </strong> Preprocess Completed Successfully</div>').show().fadeOut(5000);
	        },
	        'error': function(resp) {
	            hideLoading();
	            $("body").find("#alert").html('<div class="alert alert-danger centered" role="alert"><span class="glyphicon glyphicon-exclamation-sign" aria-hidden="true"></span><span class="sr-only">Error:</span><strong> Caution ! </strong> Error While Running </div>').show().fadeOut(5000);
	        }

	    });
	    hideDiv('#cr-allocations-div');
	    hideDiv('#fm-allocations-div');
	});

	var render_cr_allocations = function(resp) {
	    var allocated_tb = '',
	        need_to_allocate_tb = '';

        $.each(resp['allocated'], function(idx, data) {
            allocated_tb += '<tr><td>' + data['customer'] + '</td><td>' + data['ean'] + '</td>';
            allocated_tb += '<td>' + data['style_code'] + '</td><td>' + data['size'] + '</td>';
            allocated_tb += '<td>' + data['min_norm'] + '</td><td>' + data['max_norm'] + '</td>';
            allocated_tb += '<td>' + data['soh'] + '</td><td>' + data['git'] + '</td><td>' + data['order_qty'] + '</td>';
            allocated_tb += '<td>' + data['total_soh'] + '</td><td>' + data['allocated'] + '</td></tr>';
        });

        $.each(resp['unallocated'], function(idx, data) {
            need_to_allocate_tb += '<tr><td>' + data['customer'] + '</td><td>' + data['ean'] + '</td>';
            need_to_allocate_tb += '<td>' + data['style_code'] + '</td><td>' + data['size'] + '</td>';
            need_to_allocate_tb += '<td>' + data['min_norm'] + '</td><td>' + data['max_norm'] + '</td>';
            need_to_allocate_tb += '<td>' + data['soh'] + '</td><td>' + data['git'] + '</td><td>' + data['order_qty'] + '</td>';
            need_to_allocate_tb += '<td>' + data['total_soh'] + '</td><td>' + data['need_to_allocate'] + '</td>';
            need_to_allocate_tb += '<td>' + data['reason'] + '</td></tr>';
        });
        $("table#cr-allocated-table > tbody").empty().append(allocated_tb);
        $("table#cr-unallocated-table > tbody").empty().append(need_to_allocate_tb);

        showDiv('#cr-allocations-div');

    };


    $('#reset_data').click(function() {
        showLoading();
        var brand_channel = $('select[name=brand_channel]').val();
        if ($('#delete_masters').is(":checked")){
            var x = "True";
        }
        else{
            var x = "False";
        }
        $.post('/reset/', {'brand_channels': brand_channel, 'delete_masters': x}, function(resp) {
            if (resp == 'success') {
                swal("Deleted Successfully!",resp,"success");
            }else if(resp.indexOf('login.js') > 0){
                 window.location.href = '/login/';
            }else{
                swal("Error Occured!",resp,"error");
            }
            hideLoading();
        });
    });

   $('#update_masters').change(function(){
    if ($('#update_masters').is(":checked")){
            var x = "True";
            swal("It will update directly in masters!!");
    }
    });

    $('#generate_styleattr').click(function() {
        showLoading();
        var brand_channel = $('select[name=brand_channel]').val();
        var subbrand = JSON.stringify($('select[name=subbrand]').val());
        var category = JSON.stringify($('select[name=category]').val());
        var season = JSON.stringify($('select[name=season]').val());
        if ($('#update_masters').is(":checked")){
            var x = "True";
        }
        else{
            var x = "False";
        }
        $.post('/generate_styleattr/', {'brand_channels': brand_channel, 'subbrand': subbrand, 'category': category, 'season': season, 'update_masters': x}, function(resp) {
            if (resp == 'success') {
                swal("Generated Successfully!",resp,"success");
                //ui = document.getElementById("generate");
                //$('<div class="col-md-4"> <button class="btn btn-block btn-default waves-effect " id="download_attr" style="font-size: 16px;margin-top: 50px;" data-toggle="tooltip" data-placement="bottom" name="reset" data-original-title="" title="">DOWNLOAD</button></div>').insertAfter(ui);
                //document.getElementById('download_attr').addEventListener('click', myAlert);
            }else if(resp.indexOf('login.js') > 0){
                 window.location.href = '/login/';
            }else{
                swal("Error Occured!",resp,"error");
            }
            hideLoading();
        });
    });

  function alert_mes(message, type, froms, aligns, enters, exits){
        $.growl({
            message: message
        },{
            type: type,
            allow_dismiss: false,
            label: 'Cancel',
            className: 'btn-xs btn-inverse',
            placement: {
                from: froms,
                align: aligns
            },
            delay: 2500,
            animate: {
                    enter: enters,
                    exit: exits
            },
            offset: {
                x: 20,
                y: 85
            }
        });
    };


    $('#download_attr, #style_attr_dwnld').click(function() {
        showLoading();
        var brand_channel = $('select[name=brand_channel]').val().split('-')
            brand = brand_channel[0]
            channel = brand_channel[1]
		bucket_val = $('#bucket').val()
 		datum = {}
        datum['brand'] = brand 
        datum['channel'] = channel
        datum['bucket'] = bucket_val
        var button = $(this).attr('id');
        if(button == "style_attr_dwnld")
        {
            datum['rep_name'] = 'STYLE_ATTRIBUTE_MASTER'
        }else{
            datum['rep_name'] = 'ATTRIBUTE_MASTER'
        }
        $.ajax({ url : '/tinys3_cat_attr/', method : "POST", 'data' : datum,
                'error' : function (xhr, error, thrown) {
                                alert('Error Occured');
                                hideLoading();
                        },
                'success' : function(response) {
                        if (response != "false")
                             {
                               alert_mes("File Download Started for Attribute Master", 'success', 'top', 'right', 'animated bounceInUp', 'animated bounceOutUp');
                            prep_url = 'https://s3.amazonaws.com/'+bucket_val+'/'+response
                            window.location.href = prep_url
                            }
                        else
                            {
                            swal("File Not Present. Generate the attribute", "error");
                            }
                        hideLoading();
                        }
        });
    });

	$('#run_ars_ui, #run_ars_ftp').click(function() {
        var brand_channel = get_brand_channel(),
            run_type = $(this).attr('name');

        if(run_type == "GUI"){
            titles = "Are you sure, want to Run ARS - UI ?";
            texts = "Make Sure All Six Transactional Data are uploaded through UI for ";
        }
        else if(run_type == "FTP"){
            titles = "Are you sure, want to Run ARS - FTP ?";
            texts = "Make Sure All Six Transactional Files are present in FTP for ";
        }

        $.post('/check_ars_run/', {'brand_channels': JSON.stringify(brand_channel)}, function (response) {
            if (response == "running") {
                swal("Please Wait !", "ARS is already running for "+brand_channel[0], "error");
            }
            else if(response.indexOf('login.js') > 0){
                  window.location.href = '/login/';
            } else {
                swal({
                    title: titles,
                    text: texts+brand_channel,
                    type: "info",
                    showCancelButton: true,
                    confirmButtonColor: "#DD6B55",
                    confirmButtonText: "Yes, Start Run",
                    closeOnConfirm: true
                }, function(){
                    showLoading();
                    hideDiv('#ros_calc_tab');
                    hideDiv('#soh_calc_tab');
                    hideDiv('#cat_sty_tab');
                    hideDiv('#alert');

                    var brand_channel = get_brand_channel();

                    if(brand_channel == undefined) {
                        hideLoading();
                        return;
                    }

                    $.post('/runars/', {'brand_channels': JSON.stringify(brand_channel), 'run_type':run_type}, function(resp) {

                        if (resp == 'Success') {
                            /*swal("Success!", "Started ARS Run for "+brand_channel[0], "success");*/
                            /*swal({ title: '<a href="/run_ars_log/">Track your Run</a>', type: 'success', html: '<i>Thanks</i>'});*/
                            swal({title: 'Track your Run', type: 'success'}, function(){ window.location.href = '/run_ars_log/?brand_channel=' +String(brand_channel);});
                        } else {
                            swal("Error Occured!",resp,"error");
                        }
                        hideLoading();
                    });
                });
            }
        }).fail(function() {
            alert('Unable to RUN ARS');
            hideLoading();
        });
    });

    function pop_dict(ist_type, bran_chan, subbrand, category){
        prep_dict = {}
        text_sent = "For "+bran_chan+" having Category "+category+" in Subbrand "+subbrand
        if (category == null && subbrand == null){
            text_sent = "For "+bran_chan
        }

        if (category != null && subbrand == null){
            text_sent = "For "+bran_chan+" having Category "+category
        }

        prep_dict = {
                    html : true,
                    title: "Are you sure you want to Run "+ist_type+" ?",
                    text: text_sent,
                    type: "info",
                    showCancelButton: true,
                    confirmButtonColor: "#DD6B55",
                    confirmButtonText: "Yes, Start it !",
                    closeOnConfirm: true }
        return prep_dict
    }

    $('#run_ist_ros').click(function() {
        var brand_channel = $('.bran_chan_select_flag').val(),
            subbrands = $('.subbran_select_flag').val(),
            cats = $('.cat_select_flag').val(),
            brand_channel_val = brand_channel.split('-'),
            prep_str = brand_channel_val[0]+'#_#'+brand_channel_val[1];
        if (subbrands== null || cats == null) {
            swal("Please Fill Required Fields");
            hideLoading();
            return false
        }

        var brand_channel_subbrand_cat = [];
        for(i in subbrands) {
            for(j in cats) {
                form_string = prep_str+"#_#"+subbrands[i]+"#_#"+cats[j];
                brand_channel_subbrand_cat.push(form_string);
            }
        }
        brand_channel_subbrand_cat = JSON.stringify(brand_channel_subbrand_cat);

        $.ajax({
            url : '/ist_run_checking/',
            method : "POST",
            data : {'brand_channel': brand_channel},
            success : function (response) {
                if (response == "running") {
                    swal("Please Wait !", "IST Program is Already Running for "+prep_str, "error");
                } else {
                    subbrands =  subbrands.join(', ')
                    cats = cats.join(', ')
                    swal_dict = pop_dict("IST - ROS",brand_channel, subbrands, cats);

                    swal(swal_dict , function(){
                        showLoading();

                        $.post('/compute_ist_ros/', {'brand_channel_subbrand_cat': brand_channel_subbrand_cat}, function(resp) {
                            $("#results").empty();

                            if(resp.status == 1) {
                                var text = '';
                                for(i in resp.run_ids) {
                                    text += '<p class="plan-ids">Plan Id for ' + i + ': ' + resp.run_ids[i] + '</p>';
                                }
                                swal({ title : "Run of IST ROS Started", text : text, html: true });
                            } else {
                                swal("Please Wait !", "IST Program is Already Running for "+prep_str, "error");
                            }
                            hideLoading();

                        }).fail(function() {
                            alert('Unable to do IST-ROS');
                            hideLoading();
                        });
                    });
                }
            }
        });
    });

    $('#run_ist_articulate').click(function() {
        var brand_channel = $('.bran_chan_select_flag').val(),
            subbrands = $('.subbran_select_flag').val(),
            cats = $('.cat_select_flag').val(),
            brand_channel_val = brand_channel.split('-'),
            prep_str = brand_channel_val[0]+'#_#'+brand_channel_val[1];

        if (subbrands== null || cats == null) {
            swal("Please Fill Required Fields");
            hideLoading();
            return false
        }

        var brand_channel_subbrand_cat = [];
        for(i in subbrands) {
            for(j in cats) {
                form_string = prep_str+"#_#"+subbrands[i]+"#_#"+cats[j];
                brand_channel_subbrand_cat.push(form_string);
            }
        }
        brand_channel_subbrand_cat = JSON.stringify(brand_channel_subbrand_cat);

        $.ajax({
            url : '/ist_run_checking/',
            method : "POST",
            data : {'brand_channel': brand_channel},
            success : function (response){

                if (response == "running") {
                    swal("Please Wait !", "IST Program is Already Running for "+prep_str, "error");
                } else {
                    subbrands =  subbrands.join(', ')
                    cats = cats.join(', ')
                    swal_dict = pop_dict("IST - ARTICULATE",brand_channel, subbrands, cats);

                    swal(swal_dict , function(){
                        showLoading();

                        $.post('/compute_ist_articulate/', {'brand_channel_subbrand_cat': brand_channel_subbrand_cat}, function(resp) {

                            $("#results").empty();

                            if(resp.status == 1){
                                var text = '';
                                for(i in resp.run_ids) {
                                    text += '<p class="plan-ids">Plan Id for ' + i + ': ' + resp.run_ids[i] + '</p>';
                                }
                                swal({ title : "Run of IST Articulate Started", text : text, 'html': true });
                            } else {
                                swal("Please Wait !", "IST Program is Already Running for "+prep_str, "error");
                            }
                            hideLoading();
                        }).fail(function() {
                            alert('Unable to do IST-Articulate');
                            hideLoading();
                        });
                    });
                }
            }
        });
    });

    $('#run_ist_bsc').click(function() {
        var brand_channel = $('.bran_chan_select_flag').val(),
            subbrands = $('.subbran_select_flag').val(),
            cats = $('.cat_select_flag').val(),
            brand_channel_val = brand_channel.split('-'),
            prep_str = brand_channel_val[0]+'#_#'+brand_channel_val[1];

        if (subbrands== null || cats == null) {
            swal("Please Fill Required Fields");
            hideLoading();
            return false
        }

        var brand_channel_subbrand_cat = [];
        for(i in subbrands) {
            for(j in cats) {
                form_string = prep_str+"#_#"+subbrands[i]+"#_#"+cats[j];
                brand_channel_subbrand_cat.push(form_string);
            }
        }
        brand_channel_subbrand_cat = JSON.stringify(brand_channel_subbrand_cat);

        $.ajax({
            url : '/ist_run_checking/',
            method : "POST",
            data : {'brand_channel': brand_channel},
            success : function (response) {
                if (response == "running"){
                    swal("Please Wait !", "IST Program is Already Running for "+prep_str, "error");
                } else {
                    subbrands =  subbrands.join(', ')
                    cats = cats.join(', ')
                    swal_dict = pop_dict("IST - BSC",brand_channel, subbrands, cats);

                    swal(swal_dict , function(){
                        showLoading();

                        $.post('/compute_ist_bsc/', {'brand_channel_subbrand_cat': brand_channel_subbrand_cat}, function(resp) {
                            $("#results").empty();

                            if(resp.status == 1){
                                var text = '';
                                for(i in resp.run_ids) {
                                    text += '<p class="plan-ids">Plan Id for ' + i + ': ' + resp.run_ids[i] + '</p>';
                                }
                                swal({ title : "Run of IST BSC Started", text : text, 'html': true });
                            } else {
                                swal("Please Wait !", "IST Program is Already Running for "+prep_str, "error");
                            }
                            hideLoading();
                        }).fail(function() {
                            alert('Unable to do IST-BSC');
                            hideLoading();
                        });
                    });
                }
            }
        });
    });


    $('#inbound-check').click(function(e) {
        e.preventDefault();

        var brand_channel = get_brand_channel();

        $.get('/inbound_check/?brand_channels='+JSON.stringify(brand_channel), function(resp) {

		not_mes( resp, 'success', 'top', 'right', 'animated bounceInUp', 'animated bounceOutUp');

        });
    });

    $('#master_validation').click(function(e) {
        e.preventDefault();
        showLoading();
        var brand_channel = get_brand_channel();

        $.get('/validate_master_data/?brand_channels='+JSON.stringify(brand_channel), function(resp) {

            if (resp['status'] == 'Success') {
                window.location.href = '/mas_valid/?brand_channels='+JSON.stringify(get_brand_channel());
                $('#mas_valid_section').removeClass('hide');
            } else {
                alert(resp['msg']);
            }

            hideLoading();
        }).fail(function() {
            alert('Unable to Validate Master Data');
            hideLoading();
        });
        //window.location.href = '/mas_valid/'
    });


    $('#purge_alloc').click(function() {
        var datum = {};

        datum['brand_channel'] = $('select[name=brand_channel]').val()
        datum['store_code'] = $('input[name=store_codes]').val()
        datum['dates'] = $('input[name=dates]').val()

        if (datum['store_code'] == "") {
            not_mes("Missing Store Code", 'danger', 'top', 'right', 'animated bounceInUp', 'animated bounceOutUp');
            return false;
        }

        brand_channel_val = datum['brand_channel'].split('-')
        prep_str = brand_channel_val[0]+' - '+brand_channel_val[1]

        if(datum['dates'] == "" && datum['store_code'] == "" ){
            sentence = "For All '"+prep_str+"' Brand and Channel"
        }

        else if(datum['dates'] != "" && datum['store_code'] != "" ){
            sentence = "For '"+prep_str+"' containing Store Code '"+datum['store_code']+"' on '"+datum['dates']+"'"
        }

        else if(datum['dates'] == ""){
            sentence = "For '"+prep_str+"' containing Store Code '"+datum['store_code']+"'"
        }

        else if(datum['store_code'] == ""){
            sentence = "For '"+prep_str+"' containing All Store Codes on '"+datum['dates']+"'"
        }

        swal({title: "Are you sure, want to Purge Allocations ?",
              text: sentence,
              type: "info",
              showCancelButton: true,
              confirmButtonColor: "#DD6B55",
              confirmButtonText: "Yes, Purge Allocations",
              closeOnConfirm: true
              }, function(){
                    $.ajax({
                        url : '/purge_alloc/',
                        method : 'POST',
                        data : datum,
                        success : function(response){
                            if(response.status == "success"){
                                swal("Good Job !", response.records+" Records Purged Successfully in Allocations "+sentence, "success")
                            }
                            else{
                                swal("Cannot Purge !", "Data Not Present "+sentence, "error")
                            }
                        }
                    });
        });
    });
});

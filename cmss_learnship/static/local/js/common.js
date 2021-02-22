$(document).ready(function() {

  $.fn.myfunction = function() {
    var data = [];
    if (this.find(".panel-body").length == 2) {
      var this_data = this.find(".panel-body.active")
    } else {
      var this_data = this;
    }
    $.each(this_data.find("th"), function(index, value) {
      data.push({
        "data": $(value).text()
      });
    });
    return data
  };

  $.fn.tableWidth = function() {
    var data = [];
    if (this.find(".panel-body").length == 2) {
      var this_data = this.find(".panel-body.active")
    } else {
      var this_data = this;
    }
    $.each(this_data.find("th"), function(index, value) {
      if ($(value).text() == "Product Description") {
        data.push({
          "width": "20%",
          "targets": index
        });
      }
    });
    return data
  };

  $("li").on("click", function() {
    $(this).next("li").find("ul").toggle();
  });

  $("ul ul li").on("click", function() {
    $(this).next("ul").css("display", "block")
  });

  var tab = $('#sortingTable').dataTable({
    "processing": true,
    "serverSide": true,
    "scrollX": true,
    "ajax": {
      "url": "/results_data/",
      "method": "POST"
    },
    "columns": $('#sortingTable').myfunction(),
    "columnDefs": $(this).tableWidth(),
    "autoWidth": false,
    "bAutoWidth": false,
    "fixedHeader": true,
  });

  $('#ars_tab').DataTable({
    "processing": true,
    "serverSide": true,
    "orderCellsTop": true,
    "scrollX": true,
    "scrollY": true,
    "ajax": {
      "url": "/results_data/",
      "method": "POST"
    },
    "columns": $('#ars_tab thead #den').myfunction(),
    "columnDefs": $(this).tableWidth(),
    "initComplete": function() {
      $('#ars_tab').DataTable().columns().every(function() {
        $('#checking', this.header()).on("click", function(e) {
          //if ($('#ars_tab').dataTable().fnSettings().aoData.length == 0) {
          //  $(this).removeClass("open");
          //} else {
            $(this).toggleClass("open");
            $('.checking').not(this).removeClass("open");
          //}
          e.stopPropagation();
        });
      //});
    });
    }
  });

  $('#ars_tab').DataTable().columns().every(function() {
    var dats = this;
    $('.cust_code,.brand,.flag,.cat_id,.day,.plant_code,.style,.size,.cat,.season', this.header()).on('keyup change', function() {
      var lis = [];
      $.each($(this).find("option:selected"), function() {
        lis.push($(this).val());
      });
      dats.search(lis.join("|")).draw();
    });
  });

  $("body").on("keypress", ".numvalid", function(e) {
    if (e.which != 8 && e.which != 0 && (e.which < 48 || e.which > 57)) {
      $(".insert-status").html("Type Numbers Only").show().fadeOut(2000);
      return false;
    }
  });

  $("body").on("keyup", ".float_valid", function(e) {
    var code = (e.keyCode ? e.keyCode : e.which);
    if (code == 37 || code == 38 || code == 39 || code == 40) {
      return;
    } else {
      this.value = this.value.replace(/[^\d\.]/g, "").replace(/\./, "x").replace(/\./g, "").replace(/x/, ".");
    }
  });

  $("#add_buy_plan").submit(function(event) {
    $('.loading').removeClass('display-none');
    var values = $(this).serialize();
    var this_data = $(this);
    var data = {};
    cust = $(this).find("input[name = customer]").val();
    sty = $(this).find("input[name = style]").val();
    siz_set = $(this).find("input[name = no_of_size_sets]").val();
    drop_date = $(this).find("input[name = planned_drop_date]").val();
    ear_date = $(this).find("input[name = earliest_drop_date]").val();
    date = $(this).find("input[name = date]").val();
    dep = $(this).find("input[name = depth]").val();
    brand = $(this).find("input[name = brand]").val();
    chan = $(this).find("input[name = channel]").val();
    sea = $(this).find("input[name = season]").val();
    if (cust != "" && sty != "" && siz_set != "" && drop_date != "" && ear_date != "" && date != "" && dep != "" && brand != "" && chan != "") {
      if (new Date(drop_date) <= new Date(date)) {
        if (new Date(ear_date) <= new Date(date)) {
          if (new Date(ear_date) <= new Date(drop_date)) {
            $.ajax({
              url: '/add_buy_plan?' + values,
              'success': function(response) {
                this_data.find(".insert-status").html(response);
                $("#buy_plan #ars_tab").dataTable().fnReloadAjax();
                if (response == "New Customer Buy Plan Added") {
                  $root = $('#buy_plan .dataTables_scroll .dataTables_scrollHead .display #box')
                  if($root.find('.cust_code option[value="' + cust + '"]').length > 0 == false) {
                    $root.find('.cust_code').append('<option value="' + cust + '">' + cust + '</option>');
                    $root.find('.cust_code').multiselect('rebuild').multiselect('refresh');
                    $root.find('.cust_code').next().find('.multiselect-group').css('display','none');
                  }
                  if ($root.find('.style option[value="' + sty + '"]').length > 0 == false) {
                    $root.find('.style').append('<option value="' + sty + '">' + sty + '</option>');
                    $root.find('.style').multiselect('rebuild').multiselect('refresh');
                    $root.find('.style').next().find('.multiselect-group').css('display','none');
                  }
                  if (sea != "")
                  {
                  if ($root.find('.season option[value="' + sea + '"]').length > 0 == false) {
                    $root.find('.season').append('<option value="' + sea + '">' + sea + '</option>');
                    $root.find('.season').multiselect('rebuild').multiselect('refresh');
                    $root.find('.season').next().find('.multiselect-group').css('display','none');
                  }
                  }
                }
                $('.loading').addClass('display-none');
              }
            });
          } else {
            this_data.find(".insert-status").html("Earliest Drop Date must be less than or equal to Planned Drop Date").show();
            $('.loading').addClass('display-none');
          }
        } else {
          this_data.find(".insert-status").html("Earliest Drop Date must be less than or equal to Last Drop Date").show();
          $('.loading').addClass('display-none');
        }
      } else {
        this_data.find(".insert-status").html("Planned Drop Date must be less than or equal to Last Drop Date").show();
        $('.loading').addClass('display-none');
      }
    } else {
      this_data.find(".insert-status").html("Please Fill Required fields").show();
      $('.loading').addClass('display-none');
    }
    event.preventDefault();
  });

  $('body').on("click", '#buy_plan .results', function() {
    var data_id = $(this).attr('id');
    var context = this;
    $('#update_buy_plan').empty();
    $.ajax({
      url: '/buy_plan_pop?data_id=' + data_id,
      'success': function(response) {
        $('#update_buy_plan').append(response);
        $("#update_buy_plan").find('.datepicker').Zebra_DatePicker();
      }
    });
    $("#update_buy_plan").modal();
  });

  $("body").on("submit", "#update_buy_plan", function(event) {
    event.stopPropagation();
    $('.loading').removeClass('display-none');
    var values = $(this).serialize();
    var this_data = $(this);
    siz_set = $(this).find("input[name = no_of_size_sets]").val();
    drop_date = $(this).find("input[name = planned_drop_date]").val();
    ear_date = $(this).find("input[name = earliest_drop_date]").val();
    date = $(this).find("input[name = date]").val();
    dep = $(this).find("input[name = depth]").val();
    sea = $(this).find("input[name = season]").val();
    flag = $(this).find("input[name = active_flag]").val();
    if (siz_set != "" && drop_date != "" && ear_date != "" && date != "" && dep != "") {
      if (new Date(drop_date) <= new Date(date)) {
        if (new Date(ear_date) <= new Date(date)) {
          if (new Date(ear_date) <= new Date(drop_date)) {
            $.ajax({
              url: '/buy_plan_update?' + values,
              'success': function(response) {
                this_data.find(".insert-status").html(response);
                $("#buy_plan #ars_tab").dataTable().fnReloadAjax();
                if (response == 'Updated Successfully') {
                  $root = $('#buy_plan .dataTables_scroll .dataTables_scrollHead .display #box')
                  if (sea != "")
                  {
                  if ($root.find('.season option[value="' + sea + '"]').length > 0 == false) {
                    $root.find('.season').append('<option value="' + sea + '">' + sea + '</option>');
                    $root.find('.season').multiselect('rebuild').multiselect('refresh');
                  }
                  }
                  if ($root.find('.flag option[value="' + flag + '"]').length > 0 == false) {
                    $root.find('.flag').append('<option value="' + flag + '">' + flag + '</option>');
                    $root.find('.flag').multiselect('rebuild').multiselect('refresh');
                  }
                }
                $('.loading').addClass('display-none');
              }
            });
          } else {
            this_data.find(".insert-status").html("Earliest Drop Date must be less than or equal to Planned Drop Date").show();
            $('.loading').addClass('display-none');
          }
        } else {
          this_data.find(".insert-status").html("Earliest Drop Date must be less than or equal to Last Drop Date").show();
          $('.loading').addClass('display-none');
        }
      } else {
        this_data.find(".insert-status").html("Planned Drop Date must be less than or equal to Last Drop Date").show();
        $('.loading').addClass('display-none');
      }
    } else {
      this_data.find(".insert-status").html("Please Fill Required fields").show();
      $('.loading').addClass('display-none');
    }
    event.preventDefault();
  });


  $("#add_bran_chan").submit(function(event) {
    $('.loading').removeClass('display-none');
    var values = $(this).serialize();
    var this_data = $(this);
    var data = {};
    brand = $(this).find("input[name = brand]").val();
    channel = $(this).find("input[name = channel]").val();
    if (brand != "" && channel != "") {
      $.ajax({url: '/add_bran_chan?' + values,
              'success': function(response) {
                this_data.find(".insert-status").html(response);
                $("#bran_chan #sortingTable").dataTable().fnReloadAjax();
                $('.loading').addClass('display-none');
                }
            });
    }
    else
    {
    this_data.find(".insert-status").html("Please Fill Required fields").show();
    $('.loading').addClass('display-none');
    }
    event.preventDefault();
    });

  $("#add_plano_norm").submit(function(event) {
    $('.loading').removeClass('display-none');
    var values = $(this).serialize();
    var this_data = $(this);
    var data = {};
    cust = $(this).find("input[name = customer]").val();
    cate = $(this).find("input[name = category]").val();
    start = $(this).find("input[name = start_date]").val();
    end = $(this).find("input[name = end_date]").val();
    seas = $(this).find("input[name = seasonal_index]").val();
    fast = $(this).find("input[name = fast_mover_days]").val();
    slow = $(this).find("input[name = slow_mover_days]").val();
    brand = $(this).find("input[name = brand]").val();
    chan = $(this).find("input[name = channel]").val();
    flag = $(this).find("select[name = allocation_flag]").val();
    full_siz = $("input[name = full_size_set_perc]").val();

    if (full_siz == "") {
      full_siz = 100;
    }

    if (cust != "" && cate != "" && start != "" && end != "" && seas != "" && fast != "" && slow != "" && brand != "" && chan != "") {
      if ( (parseInt(slow)) > (parseInt(fast)) ) {
          if (new Date(start) <= new Date(end)) {
            $.ajax({
              url: '/add_plano_norm?' + values,
              'success': function(response) {
                this_data.find(".insert-status").html(response);
                $("#plano_norm #ars_tab").dataTable().fnReloadAjax();
                if (response == "New Fashion Planogram Norm Added") {
                    $root = $('#plano_norm .dataTables_scroll .dataTables_scrollHead .display #box');
                  if ($root.find('.cust_code option[value="' + cust + '"]').length > 0 == false) {
                    $root.find('.cust_code').append('<option value="' + cust + '">' + cust + '</option>');
                    $root.find('.cust_code').multiselect('rebuild').multiselect('refresh');
                    $root.find('.cust_code').next().find('.multiselect-group').css('display','none');
                  }
                  if ($root.find('.cat_id option[value="' + cate + '"]').length > 0 == false) {
                    $root.find('.cat_id ').append('<option value="' + cate + '">' + cate + '</option>');
                    $root.find('.cat_id ').multiselect('rebuild').multiselect('refresh');
                    $root.find('.cat_id').next().find('.multiselect-group').css('display','none');
                  }
                  if ($root.find('.flag option[value="' + flag + '"]').length > 0 == false) {
                    $root.find('.flag ').append('<option value="' + flag + '">' + flag + '</option>');
                    $root.find('.flag ').multiselect('rebuild').multiselect('refresh');
                    $root.find('.flag').next().find('.multiselect-group').css('display','none');
                  }
                }
                $('.loading').addClass('display-none');
              }
            });
          } else {
            this_data.find(".insert-status").html("End Date must be greater than or equal to start date").show();
            $('.loading').addClass('display-none');
          }
      } else {
        this_data.find(".insert-status").html("Slow Mover Days must be greater than Fast Mover Days ").show();
        $('.loading').addClass('display-none');
      }
    } else {
      this_data.find(".insert-status").html("Please Fill Required fields").show();
      $('.loading').addClass('display-none');
    }
    event.preventDefault();
  });

  $('body').on("click", '#plano_norm .results', function() {
    var data_id = $(this).attr('data-id');
    var context = this;
    $('#update_plano_norm').empty();
    $.ajax({
      url: '/plano_norm_pop?data_id=' + data_id,
      'success': function(response) {
        $('#update_plano_norm').append(response);
        $("#update_plano_norm").find('.datepicker').Zebra_DatePicker();
      }
    });
    $("#update_plano_norm").modal();
  });

  $("body").on("submit", "#update_plano_norm", function(event) {
    event.stopPropagation();
    $('.loading').removeClass('display-none');
    var values = $(this).serialize();
    var this_data = $(this);
    start = $(this).find("input[name = start_date]").val();
    end = $(this).find("input[name = end_date]").val();
    seas = $(this).find("input[name = seasonal_index]").val();
    fast = $(this).find("input[name = fast_mover_days]").val();
    slow = $(this).find("input[name = slow_mover_days]").val();
    flag = $(this).find("select[name = allocation_flag]").val();
    full_siz = $(this).find("input[name = full_size_set_perc]").val();

    if (full_siz == "") {
      full_siz = 100;
    }

    if (start != "" && end != "" && seas != "" && fast != "" && slow != "") {
        if (new Date(start) <= new Date(end)) {
          if ( (parseInt(slow)) > (parseInt(fast)) ) {
            $.ajax({
              url: '/plano_norm_update?' + values,
              'success': function(response) {
                this_data.find(".insert-status").html(response);
                $("#plano_norm #ars_tab").dataTable().fnReloadAjax();
                if (response == 'Updated Successfully') {
                  $root = $('#plano_norm .dataTables_scroll .dataTables_scrollHead .display #box')
                  if ($root.find('.flag option[value="' + flag + '"]').length > 0 == false) {
                    $root.find('.flag').append('<option value="' + flag + '">' + flag + '</option>');
                    $root.find('.flag').multiselect('rebuild').multiselect('refresh');
                  }
                }
                $('.loading').addClass('display-none');
              }
            });
          } else {
            this_data.find(".insert-status").html("Slow Mover Days must be greater than Fast Mover Days").show();
            $('.loading').addClass('display-none');
          }
        } else {
          this_data.find(".insert-status").html("End Date must be greater than or equal to Start Date").show();
          $('.loading').addClass('display-none');
        }
    } else {
      this_data.find(".insert-status").html("Missing Required Fields").show();
      $('.loading').addClass('display-none');
    }
    event.preventDefault();
  });

  $("#add_store").submit(function(event) {
    $('.loading').removeClass('display-none');
    var values = $(this).serialize();
    var this_data = $(this);
    cust_cod = $(this).find("input[name=cust_code]").val();
    pri = $(this).find("input[name=priority]").val();
    flag = $(this).find("select[name=active_flag]").val();
    brand = $(this).find("input[name=brand]").val();
    channel = $(this).find("input[name=channel]").val();
    if (cust_cod != "" && brand != "" && pri != "" && channel != "") {
      if (parseInt(pri) != 0) {
        $.ajax({
          url: '/add_store?' + values,
          'success': function(response) {
            this_data.find(".insert-status").html(response);
            $("#store_master #ars_tab").dataTable().fnReloadAjax();
            if (response == "New Customer Priority Added") {
            $root = $('#store_master .dataTables_scroll .dataTables_scrollHead .display #box')
              if ($root.find('.cust_code option[value="' + cust_cod + '"]').length > 0 == false) {
                $root.find('.cust_code').append('<option value="' + cust_cod + '">' + cust_cod + '</option>');
                $root.find('.cust_code').multiselect('rebuild').multiselect('refresh');
                $root.find('.cust_code').next().find('.multiselect-group').css('display','none');
              }
              if ($root.find('.brand option[value="' + brand + '"]').length > 0 == false) {
                $root.find('.brand').append('<option value="' + brand + '">' + brand + '</option>');
                $root.find('.brand').multiselect('rebuild').multiselect('refresh');
                $root.find('.brand').next().find('.multiselect-group').css('display','none');
              }
              if ($root.find('.flag option[value="' + flag + '"]').length > 0 == false) {
                $root.find('.flag').append('<option value="' + flag + '">' + flag + '</option>');
                $root.find('.flag').multiselect('rebuild').multiselect('refresh');
                $root.find('.flag').next().find('.multiselect-group').css('display','none');
              }
            }
            $('.loading').addClass('display-none');
          }
        });
      } else {
        this_data.find(".insert-status").html("Priority must be Greater than Zero").show();
        $('.loading').addClass('display-none');
      }
    } else {
      this_data.find(".insert-status").html("Please Fill Required fields").show();
      $('.loading').addClass('display-none');
    }
    event.preventDefault();
  });

  $('body').on("click", '#store_master .results', function() {
    var data_id = $(this).attr('data-id');
    var context = this;
    $('#update_store').empty();
    $.ajax({
      url: '/store_data_pop?data_id=' + data_id,
      'success': function(response) {
        $('#update_store').append(response);
      }
    });
    $("#update_store").modal();
  });

  $("body").on("submit", "#update_store", function(event) {
    event.stopPropagation();
    $('.loading').removeClass('display-none');
    var values = $(this).serialize();
    var this_data = $(this);
    pri = $(this).find("input[name=priority]").val();
    flag = $(this).find("input[name=active_flag]").val();
    if (pri != "") {
      if (parseInt(pri) != 0) {
        $.ajax({
          url: '/store_data_update?' + values,
          'success': function(response) {
            this_data.find(".insert-status").html(response);
            $("#store_master #ars_tab").dataTable().fnReloadAjax();
            if (response == 'Updated Successfully') {
            $root = $('#store_master .dataTables_scroll .dataTables_scrollHead .display #box')
                  if ($root.find('.flag option[value="' + flag + '"]').length > 0 == false) {
                    $root.find('.flag').append('<option value="' + flag + '">' + flag + '</option>');
                    $root.find('.flag').multiselect('rebuild').multiselect('refresh');
                  }
                }
            $('.loading').addClass('display-none');
          }
        });
      } else {
        this_data.find(".insert-status").html("Priority must be Greater than Zero").show();
        $('.loading').addClass('display-none');
      }
    } else {
      this_data.find(".insert-status").html("Please Fill Required fields").show();
      $('.loading').addClass('display-none');
    }
    event.preventDefault();
  });

  $("#add_cat_id").submit(function(event) {
    $('.loading').removeClass('display-none');
    var values = $(this).serialize();
    var this_data = $(this);
    var data = {};
    cate = $(this).find("input[name=category]").val();
    style = $(this).find("input[name=category_id]").val();
    brand = $(this).find("input[name=brand]").val();
    channel = $(this).find("input[name=channel]").val();
    if (cate != "" && brand != "" && style != "" && channel != "") {
      $.ajax({
        url: '/add_cat_id?' + values,
        'success': function(response) {
          this_data.find(".insert-status").html(response);
          $("#cat_id #ars_tab").dataTable().fnReloadAjax();
          if (response == "New Category Master Added") {
            $root = $('#cat_id .dataTables_scroll .dataTables_scrollHead .display #box')
            if ($root.find('.cat_id option[value="' + style + '"]').length > 0 == false) {
              $root.find('.cat_id ').append('<option value="' + style + '">' + style + '</option>');
              $root.find('.cat_id ').multiselect('rebuild').multiselect('refresh');
              $root.find('.cat_id').next().find('.multiselect-group').css('display','none');
            }
            if ($root.find('.brand option[value="' + brand + '"]').length > 0 == false) {
              $root.find('.brand ').append('<option value="' + brand + '">' + brand + '</option>');
              $root.find('.brand ').multiselect('rebuild').multiselect('refresh');
              $root.find('.brand').next().find('.multiselect-group').css('display','none');
            }
            if ($root.find('.cat option[value="' + cate + '"]').length > 0 == false) {
              $root.find('.cat ').append('<option value="' + cate + '">' + cate + '</option>');
              $root.find('.cat').multiselect('rebuild').multiselect('refresh');
              $root.find('.cat').next().find('.multiselect-group').css('display','none');
            }
          }
          $('.loading').addClass('display-none');
        }
      });
    } else {
      this_data.find(".insert-status").html("Please Fill Required fields").show();
      $('.loading').addClass('display-none');
    }
    event.preventDefault();
  });

  $('body').on("click", '#cat_id .results', function() {
    var data_id = $(this).attr('id');
    var context = this;
    $('#update_cat_id').empty();
    $.ajax({
      url: '/cat_id_pop?data_id=' + data_id,
      'success': function(response) {
        $('#update_cat_id').append(response);
      }
    });
    $("#update_cat_id").modal();
  });

  $("body").on("submit", "#update_cat_id", function(event) {
    event.stopPropagation();
    $('.loading').removeClass('display-none');
    var values = $(this).serialize();
    var this_data = $(this);
    $.ajax({
      url: '/cat_id_update?' + values,
      'success': function(response) {
        this_data.find(".insert-status").html(response);
        $("#cat_id #ars_tab").dataTable().fnReloadAjax();
        $('.loading').addClass('display-none');
      }
    });
    event.preventDefault();
  });

  $("#add_style_attr").submit(function(event) {
    $('.loading').removeClass('display-none');
    var values = $(this).serialize();
    var this_data = $(this);
    var data = {};
    cate = $(this).find("input[name=category]").val();
    style = $(this).find("input[name=style]").val();
    brand = $(this).find("input[name=brand]").val();
    channel = $(this).find("input[name=channel]").val();
    if (cate != "" && brand != "" && style != "" && channel != "") {
      $.ajax({
        url: '/add_style_attr?' + values,
        'success': function(response) {
          this_data.find(".insert-status").html(response);
          $("#style_attr #ars_tab").dataTable().fnReloadAjax();
          if (response == "New Style Master Added") {
            $root = $('#style_attr .dataTables_scroll .dataTables_scrollHead .display #box')
            if ($root.find('.style option[value="' + style + '"]').length > 0 == false) {
              $root.find('.style').append('<option value="' + style + '">' + style + '</option>');
              $root.find('.style').multiselect('rebuild').multiselect('refresh');
            }
            if ($root.find('.cat option[value="' + cate + '"]').length > 0 == false) {
              $root.find('.cat').append('<option value="' + cate + '">' + cate + '</option>');
              $root.find('.cat').multiselect('rebuild').multiselect('refresh');
            }
            if ($root.find('.brand option[value="' + brand + '"]').length > 0 == false) {
              $root.find('.brand ').append('<option value="' + brand + '">' + brand + '</option>');
              $root.find('.brand ').multiselect('rebuild').multiselect('refresh');
            }
          }
          $('.loading').addClass('display-none');
        }
      });
    } else {
      this_data.find(".insert-status").html("Please Fill Required fields").show();
      $('.loading').addClass('display-none');
    }
    event.preventDefault();
  });

  $('body').on("click", '#style_attr .results', function() {
    var data_id = $(this).attr('id');
    var context = this;
    $('#update_style_attr').empty();
    $.ajax({
      url: '/style_attr_pop?data_id=' + data_id,
      'success': function(response) {
        $('#update_style_attr').append(response);
      }
    });
    $("#update_style_attr").modal();
  });

  $("body").on("submit", "#update_style_attr", function(event) {
    event.stopPropagation();
    $('.loading').removeClass('display-none');
    var values = $(this).serialize();
    var this_data = $(this);
    $.ajax({
      url: '/style_attr_update?' + values,
      'success': function(response) {
        this_data.find(".insert-status").html(response);
        $("#style_attr #ars_tab").dataTable().fnReloadAjax();
        $('.loading').addClass('display-none');
      }
    });
    event.preventDefault();
  });

  $("#add_cust_sch").submit(function(event) {
    $('.loading').removeClass('display-none');
    var values = $(this).serialize();
    var this_data = $(this);
    var data = {};
    cust_cod = $(this).find("input[name=customer]").val();
    startDate = $('input[name=start_date]').val();
    endDate = $('input[name=end_date]').val();
    brand = $(this).find("input[name=brand]").val();
    channel = $(this).find("input[name=channel]").val();
    category = $(this).find("input[name=category]").val();
    day = $(this).find("select[name=day]").val();
    flag = $(this).find("select[name=active_flag]").val();
    if (cust_cod != "" && brand != "" && category != "" && channel != "" && startDate != "" && endDate != "") {
      if (new Date(startDate) <= new Date(endDate)) {
        $.ajax({
          url: '/add_cust_sch?' + values,
          'success': function(response) {
            this_data.find(".insert-status").html(response);
            $("#cust_sch #ars_tab").dataTable().fnReloadAjax();
            if (response == "New Customer Schedule Added") {
                $root = $('#cust_sch .dataTables_scroll .dataTables_scrollHead .display #box')
              if ($root.find('.cust_code option[value="' + cust_cod + '"]').length > 0 == false) {
                $root.find('.cust_code').append('<option value="' + cust_cod + '">' + cust_cod + '</option>');
                $root.find('.cust_code').multiselect('rebuild').multiselect('refresh');
                $root.find('.cust_code').next().find('.multiselect-group').css('display','none');
              }
              if ($root.find('.brand option[value="' + brand + '"]').length > 0 == false) {
                $root.find('.brand').append('<option value="' + brand + '">' + brand + '</option>');
                $root.find('.brand').multiselect('rebuild').multiselect('refresh');
                $root.find('.brand').next().find('.multiselect-group').css('display','none');
              }
              if ($root.find('.flag option[value="' + flag + '"]').length > 0 == false) {
                $root.find('.flag').append('<option value="' + flag + '">' + flag + '</option>');
                $root.find('.flag').multiselect('rebuild').multiselect('refresh');
                $root.find('.flag').next().find('.multiselect-group').css('display','none');
              }
              if ($root.find('.day option[value="' + day + '"]').length > 0 == false) {
                $root.find('.day').append('<option value="' + day + '">' + day + '</option>');
                $root.find('.day').multiselect('rebuild').multiselect('refresh');
                $root.find('.day').next().find('.multiselect-group').css('display','none');
              }
            }
            $('.loading').addClass('display-none');
          }
        });
      } else {
        this_data.find(".insert-status").html("End Date must be greater than or equal to Start Date").show();
        $('.loading').addClass('display-none');
      }
    } else {
      this_data.find(".insert-status").html("Please Fill Required fields").show();
      $('.loading').addClass('display-none');
    }
    event.preventDefault();
  });

  $('body').on("click", '#cust_sch .results', function() {
    var data_id = $(this).attr('id');
    var context = this;
    $('#update_cust_sch').empty();
    $.ajax({
      url: '/cust_sch_pop?data_id=' + data_id,
      'success': function(response) {
        $('#update_cust_sch').append(response);
        $("#update_cust_sch").find('.datepicker').Zebra_DatePicker();
      }
    });
    $("#update_cust_sch").modal();
  });

  $("body").on("submit", "#update_cust_sch", function(event) {
    event.stopPropagation();
    $('.loading').removeClass('display-none');
    var values = $(this).serialize();
    var this_data = $(this);
    flag = $(this).find("select[name=active_flag]").val();
    day = $(this).find("select[name=day]").val();
    start = $(this).find("input[name=start_date]").val();
    end = $(this).find("input[name=end_date]").val();
    if (start != "" && end != "") {
      if (new Date(start) <= new Date(end)) {
        $.ajax({
          url: '/cust_sch_update?' + values,
          'success': function(response) {
            this_data.find(".insert-status").html(response);
            $("#cust_sch #ars_tab").dataTable().fnReloadAjax();
            if (response == 'Updated Successfully') {
                  $root = $('#cust_sch .dataTables_scroll .dataTables_scrollHead .display #box')
                  if ($root.find('.flag option[value="' + flag + '"]').length > 0 == false) {
                    $root.find('.flag').append('<option value="' + flag + '">' + flag + '</option>');
                    $root.find('.flag').multiselect('rebuild').multiselect('refresh');
                  }
                  if ($root.find('.day option[value="' + day + '"]').length > 0 == false) {
                    $root.find('.day').append('<option value="' + day + '">' + day + '</option>');
                    $root.find('.day').multiselect('rebuild').multiselect('refresh');
                  }
                }
            $('.loading').addClass('display-none');
          }
        });
      } else {
        this_data.find(".insert-status").html("End Date must be greater than or equal to Start Date").show();
        $('.loading').addClass('display-none');
      }
    } else {
      this_data.find(".insert-status").html("Please Fill Required fields").show();
      $('.loading').addClass('display-none');
    }
    event.preventDefault();
  });

  $("#add_stor_loc").submit(function(event) {
    $('.loading').removeClass('display-none');
    var values = $(this).serialize();
    var this_data = $(this);
    var data = {};
    cust_cod = $(this).find("input[name=customer]").val();
    loc_type = $(this).find("input[name=storage_location]").val();
    brand = $(this).find("input[name=brand]").val();
    channel = $(this).find("input[name=channel]").val();
    cate = $(this).find("input[name=category]").val();
    plant_code = $(this).find("input[name=plant_code]").val();
    pri = $(this).find("input[name=priority]").val();
    flag = $(this).find("select[name=active_flag]").val();

    if (cust_cod != "" && brand != "" && channel != "" && loc_type != "" && cate != "" && plant_code != "") {
      if (parseInt(pri) != 0) {
        $.ajax({
          url: '/add_stor_loc?' + values,
          'success': function(response) {
            this_data.find(".insert-status").html(response);
            $("#stor_loc #ars_tab").dataTable().fnReloadAjax();
            if (response == "New Customer Storage Location Added") {
                $root = $('#stor_loc .dataTables_scroll .dataTables_scrollHead .display #box')
              if ($root.find('.cust_code option[value="' + cust_cod + '"]').length > 0 == false) {
                $root.find('.cust_code').append('<option value="' + cust_cod + '">' + cust_cod + '</option>');
                $root.find('.cust_code').multiselect('rebuild').multiselect('refresh');
                $root.find('.cust_code').next().find('.multiselect-group').css('display','none');
              }
              if ($root.find('.cat option[value="' + cate + '"]').length > 0 == false) {
                $root.find('.cat').append('<option value="' + cate + '">' + cate + '</option>');
                $root.find('.cat').multiselect('rebuild').multiselect('refresh');
                $root.find('.cat').next().find('.multiselect-group').css('display','none');
              }
              if ($root.find('.plant_code option[value="' + plant_code + '"]').length > 0 == false) {
                $root.find('.plant_code').append('<option value="' + plant_code + '">' + plant_code + '</option>');
                $root.find('.plant_code').multiselect('rebuild').multiselect('refresh');
                $root.find('.plant_code').next().find('.multiselect-group').css('display','none');
              }
              if ($root.find('.brand option[value="' + brand + '"]').length > 0 == false) {
                $root.find('.brand').append('<option value="' + brand + '">' + brand + '</option>');
                $root.find('.brand').multiselect('rebuild').multiselect('refresh');
                $root.find('.brand').next().find('.multiselect-group').css('display','none');
              }
              if ($root.find('.flag option[value="' + flag + '"]').length > 0 == false) {
                $root.find('.flag').append('<option value="' + flag + '">' + flag + '</option>');
                $root.find('.flag').multiselect('rebuild').multiselect('refresh');
                $root.find('.flag').next().find('.multiselect-group').css('display','none');
              }
            }
            $('.loading').addClass('display-none');
          }
        });
      } else {
        this_data.find(".insert-status").html("Priority must be Greater than Zero").show();
        $('.loading').addClass('display-none');
      }
    } else {
      this_data.find(".insert-status").html("Please Fill Required fields").show();
      $('.loading').addClass('display-none');
    }
    event.preventDefault();
  });

  $('body').on("click", '#stor_loc .results', function() {
    var data_id = $(this).attr('id');
    var context = this;
    $('#update_stor_loc').empty();
    $.ajax({
      url: '/store_loc_pop?data_id=' + data_id,
      'success': function(response) {
        $('#update_stor_loc').append(response);
      }
    });
    $("#update_stor_loc").modal();
  });

  $("body").on("submit", "#update_stor_loc", function(event) {
    event.stopPropagation();
    $('.loading').removeClass('display-none');
    var values = $(this).serialize();
    var this_data = $(this);
    pri = $(this).find("input[name=priority]").val();
    flag = $(this).find("input[name=active_flag]").val();
    if (parseInt(pri) != 0) {
      $.ajax({
        url: '/store_loc_update?' + values,
        'success': function(response) {
          this_data.find(".insert-status").html(response);
          $("#stor_loc #ars_tab").dataTable().fnReloadAjax();
          if (response == 'Updated Successfully') {
                  $root = $('#stor_loc .dataTables_scroll .dataTables_scrollHead .display #box')
                  if ($root.find('.flag option[value="' + flag + '"]').length > 0 == false) {
                    $root.find('.flag').append('<option value="' + flag + '">' + flag + '</option>');
                    $root.find('.flag').multiselect('rebuild').multiselect('refresh');
                  }
                }
          $('.loading').addClass('display-none');
        }
      });
    } else {
      this_data.find(".insert-status").html("Priority must be Greater than Zero").show();
      $('.loading').addClass('display-none');
    }
    event.preventDefault();
  });

  $("#add_style_mas").submit(function(event) {
    $('.loading').removeClass('display-none');
    var values = $(this).serialize();
    var this_data = $(this);
    var data = {};
    brand = $(this).find("input[name=brand]").val();
    category = $(this).find("input[name=category]").val();
    style = $(this).find("input[name=style]").val();
    season = $(this).find("input[name=season]").val();
    fashion_type = $(this).find("input[name=fashion_type]").val();
    hit = $(this).find("input[name=hit]").val();
    off_date = new Date($(this).find("input[name=date]").val());
    subbrand = $(this).find("input[name=subbrand]").val();
    des_code = $(this).find("input[name=design_code]").val();
    des_typ = $(this).find("input[name=design_type]").val();
    fit = $(this).find("input[name=fit]").val();
    slev = $(this).find("input[name=sleeve]").val();
    color = $(this).find("input[name=color]").val();
    fab_code = $(this).find("input[name=fab_code]").val();
    fab_type = $(this).find("input[name=fab_type]").val();
    att1 = $(this).find("input[name=att1]").val();
    att2 = $(this).find("input[name=att2]").val();
    mrp = $(this).find("input[name=mrp]").val();
    size = $(this).find("input[name=size]").val();
    if (brand != "" && category != "" && style != "" && size != "" && off_date != "Invalid Date") {
      $.ajax({
        url: '/add_style_mas?' + values,
        'success': function(response) {
          this_data.find(".insert-status").html(response);
          $("#style_mas #sortingTable").dataTable().fnReloadAjax();
          $('.loading').addClass('display-none');
        }
      });
    } else {
      this_data.find(".insert-status").html("Please Fill Required fields").show();
      $('.loading').addClass('display-none');
    }
    event.preventDefault();
  });

  $('body').on("click", '#style_mas .results', function() {
    var data_id = $(this).attr('id');
    var context = this;
    $('#update_style_mas').empty();
    $.ajax({
      url: '/style_mas_pop?data_id=' + data_id,
      'success': function(response) {
        $('#update_style_mas').append(response);
        $("#update_style_mas").find('.datepicker').Zebra_DatePicker();
      }
    });
    $("#update_style_mas").modal();
  });

  $("body").on("submit", "#update_style_mas", function(event) {
    event.stopPropagation();
    $('.loading').removeClass('display-none');
    var values = $(this).serialize();
    var this_data = $(this);
    brand = $(this).find("input[name=brand]").val();
    category = $(this).find("input[name=category]").val();
    style = $(this).find("input[name=style]").val();
    size = $(this).find("input[name=size]").val();
    season = $(this).find("input[name=season]").val();
    fashion_type = $(this).find("input[name=fashion_type]").val();
    hit = $(this).find("input[name=hit]").val();
    off_date = new Date($(this).find("input[name=date]").val());
    subbrand = $(this).find("input[name=subbrand]").val();
    des_code = $(this).find("input[name=design_code]").val();
    des_typ = $(this).find("input[name=design_type]").val();
    fit = $(this).find("input[name=fit]").val();
    slev = $(this).find("input[name=sleeve]").val();
    color = $(this).find("input[name=color]").val();
    fab_code = $(this).find("input[name=fab_code]").val();
    fab_type = $(this).find("input[name=fab_type]").val();
    att1 = $(this).find("input[name=att1]").val();
    att2 = $(this).find("input[name=att2]").val();
    mrp = $(this).find("input[name=mrp]").val();
    if (brand != "" && category != "" && style != "" && size != "" && off_date != "Invalid Date") {
      $.ajax({
        url: '/style_mas_update?' + values,
        'success': function(response) {
          this_data.find(".insert-status").html(response);
          $("#style_mas #sortingTable").dataTable().fnReloadAjax();
          $('.loading').addClass('display-none');
        }
      });
    } else {
      this_data.find(".insert-status").html("Missing Required Fields").show();
      $('.loading').addClass('display-none');
    }
    event.preventDefault();
  });

  $("#add_cust_mas").submit(function(event) {
    $('.loading').removeClass('display-none');
    var values = $(this).serialize();
    var this_data = $(this);
    var data = {};
    cust = $(this).find("input[name=cust_code]").val();
    channel = $(this).find("input[name=channel]").val();
    cust_name = $(this).find("input[name=cust_name]").val();
    org = $(this).find("input[name=organization]").val();
    loc = $(this).find("input[name=location]").val();
    city = $(this).find("input[name=city]").val();
    postal = $(this).find("input[name=postal]").val();
    state = $(this).find("input[name=state]").val();
    region = $(this).find("input[name=region]").val();
    sales = $(this).find("input[name=sales_off]").val();
    if (cust != "" && channel != "" && cust_name != "" && org != "" && loc != "" && city != "" && postal != "" && state != "" && region != "") {
      $.ajax({
        url: '/add_cust_mas?' + values,
        'success': function(response) {
          this_data.find(".insert-status").html(response);
          $("#cust_mas #sortingTable").dataTable().fnReloadAjax();
          $('.loading').addClass('display-none');
        }
      });
    } else {
      this_data.find(".insert-status").html("Please Fill Required fields").show();
      $('.loading').addClass('display-none');
    }
    event.preventDefault();
  });

  $('body').on("click", '#cust_mas .results', function() {
    var data_id = $(this).attr('id');
    var context = this;
    $('#update_cust_mas').empty();
    $.ajax({
      url: '/cust_mas_pop?data_id=' + data_id,
      'success': function(response) {
        $('#update_cust_mas').append(response);
      }
    });
    $("#update_cust_mas").modal();
  });

  $("body").on("submit", "#update_cust_mas", function(event) {
    event.stopPropagation();
    $('.loading').removeClass('display-none');
    var values = $(this).serialize();
    var this_data = $(this);
    cust = $(this).find("input[name=cust_code]").val();
    channel = $(this).find("input[name=channel]").val();
    cust_name = $(this).find("input[name=cust_name]").val();
    org = $(this).find("input[name=organization]").val();
    loc = $(this).find("input[name=location]").val();
    city = $(this).find("input[name=city]").val();
    postal = $(this).find("input[name=postal]").val();
    state = $(this).find("input[name=state]").val();
    region = $(this).find("input[name=region]").val();
    sales = $(this).find("input[name=sales_off]").val();
    if (cust != "" && channel != "" && cust_name != "" && org != "" && loc != "" && city != "" && postal != "" && state != "" && region != "") {
      $.ajax({
        url: '/cust_mas_update?' + values,
        'success': function(response) {
          this_data.find(".insert-status").html(response);
          $("#cust_mas #sortingTable").dataTable().fnReloadAjax();
          $('.loading').addClass('display-none');
        }
      });
    } else {
      this_data.find(".insert-status").html("Missing Required Fields").show();
      $('.loading').addClass('display-none');
    }
    event.preventDefault();
  });

  $("#add_hol_cal").submit(function(event) {
    $('.loading').removeClass('display-none');
    var values = $(this).serialize();
    var this_data = $(this);
    var data = {};
    brand = $(this).find("input[name=brand]").val();
    channel = $(this).find("input[name=channel]").val();
    plant_code = $(this).find("input[name=plant_code]").val();
    flag = $(this).find("select[name=active_flag]").val();
    startDate = $('input[name=start_date]').val();
    endDate = $('input[name=end_date]').val();
    if (brand != "" && channel != "" && plant_code != "" && startDate != "" && endDate != "") {
      if (new Date(startDate) <= new Date(endDate)) {
        $.ajax({
          url: '/add_hol_cal?' + values,
          'success': function(response) {
            this_data.find(".insert-status").html(response);
            $("#plant_cal #ars_tab").dataTable().fnReloadAjax();
            if (response == "New Holiday Calendar Added") {
                $root = $('#plant_cal .dataTables_scroll .dataTables_scrollHead .display #box')
              if ($root.find('.plant_code option[value="' + plant_code + '"]').length > 0 == false) {
                $root.find('.plant_code').append('<option value="' + plant_code + '">' + plant_code + '</option>');
                $root.find('.plant_code').multiselect('rebuild').multiselect('refresh');
                $root.find('.plant_code').next().find('.multiselect-group').css('display','none');
              }
              if ($root.find('.flag option[value="' + flag + '"]').length > 0 == false) {
                $root.find('.flag').append('<option value="' + flag + '">' + flag + '</option>');
                $root.find('.flag').multiselect('rebuild').multiselect('refresh');
                $root.find('.flag').next().find('.multiselect-group').css('display','none');
              }
            }
            $('.loading').addClass('display-none');
          }
        });
      } else {
        this_data.find(".insert-status").html("End Date must be greater than or equal to Start Date").show();
        $('.loading').addClass('display-none');
      }
    } else {
      this_data.find(".insert-status").html("Please Fill Required fields").show();
      $('.loading').addClass('display-none');
    }
    event.preventDefault();
  });

  $('body').on("click", '#plant_cal .results', function() {
    var data_id = $(this).attr('id');
    var context = this;
    $('#update_hol_cal').empty();
    $.ajax({
      url: '/hol_cal_pop?data_id=' + data_id,
      'success': function(response) {
        $('#update_hol_cal').append(response);
        $("#update_hol_cal").find('.datepicker').Zebra_DatePicker();
      }
    });
    $("#update_hol_cal").modal();
  });

  $("body").on("submit", "#update_hol_cal", function(event) {
    event.stopPropagation();
    $('.loading').removeClass('display-none');
    var values = $(this).serialize();
    var this_data = $(this);
    startDate = $(this).find('input[name=start_date]').val();
    endDate = $(this).find('input[name=end_date]').val();
    flag = $(this).find('select[name=active_flag]').val();
    if (new Date(startDate) <= new Date(endDate)) {
      $.ajax({
        url: '/hol_cal_update?' + values,
        'success': function(response) {
          this_data.find(".insert-status").html(response);
          $("#plant_cal #ars_tab").dataTable().fnReloadAjax();
          if (response == 'Updated Successfully') {
                  $root = $('#plant_cal .dataTables_scroll .dataTables_scrollHead .display #box')
                  if ($root.find('.flag option[value="' + flag + '"]').length > 0 == false) {
                    $root.find('.flag').append('<option value="' + flag + '">' + flag + '</option>');
                    $root.find('.flag').multiselect('rebuild').multiselect('refresh');
                  }
                }
          $('.loading').addClass('display-none');
        }
      });
    } else {
      this_data.find(".insert-status").html("End Date must be greater than or equal to Start Date").show();
      $('.loading').addClass('display-none');
    }
    event.preventDefault();
  });

  $("#add_size_rat").submit(function(event) {
    $('.loading').removeClass('display-none');
    var values = $(this).serialize();
    var this_data = $(this);
    var data = {};
    cust_cod = $(this).find("input[name=customer]").val();
    cat = $(this).find("input[name=category]").val();
    size = $(this).find("input[name=size]").val();
    norm = $(this).find("input[name=norm]").val();
    brand = $(this).find("input[name=brand]").val();
    channel = $(this).find("input[name=channel]").val();
    if (cust_cod != "" && cat != "" && size != "" && norm != "" && brand != "" && channel != "") {
      $.ajax({
        url: '/add_size_rat?' + values,
        'success': function(response) {
          this_data.find(".insert-status").html(response);
          $("#plan_size #ars_tab").dataTable().fnReloadAjax();
          if (response == "New Size Ratio Added") {
            $root = $('#plan_size .dataTables_scroll .dataTables_scrollHead .display #box ')
            if ($root.find('.cust_code option[value="' + cust_cod + '"]').length > 0 == false) {
              $root.find('.cust_code ').append('<option value="' + cust_cod + '">' + cust_cod + '</option>');
              $root.find('.cust_code ').multiselect('rebuild').multiselect('refresh');
              $root.find('.cust_code').next().find('.multiselect-group').css('display','none');
            }
            if ($root.find('.cat_id option[value="' + cat + '"]').length > 0 == false) {
              $root.find('.cat_id ').append('<option value="' + cat + '">' + cat + '</option>');
              $root.find('.cat_id ').multiselect('rebuild').multiselect('refresh');
              $root.find('.cat_id').next().find('.multiselect-group').css('display','none');
            }
            if ($root.find('.size option[value="' + size + '"]').length > 0 == false) {
              $root.find('.size ').append('<option value="' + size + '">' + size + '</option>');
              $root.find('.size ').multiselect('rebuild').multiselect('refresh');
              $root.find('.size').next().find('.multiselect-group').css('display','none');
            }
          }
          $('.loading').addClass('display-none');
        }
      });
    } else {
      this_data.find(".insert-status").html("Please Fill Required fields").show();
      $('.loading').addClass('display-none');
    }
    event.preventDefault();
  });

  $('body').on("click", '#plan_size .results', function() {
    var data_id = $(this).attr('id');
    var context = this;
    $('#update_size_rat').empty();
    $.ajax({
      url: '/size_rat_data?data_id=' + data_id,
      'success': function(response) {
        $('#update_size_rat').append(response);
      }
    });
    $("#update_size_rat").modal();
  });

  $("body").on("submit", "#update_size_rat", function(event) {
    event.stopPropagation();
    $('.loading').removeClass('display-none');
    var values = $(this).serialize();
    var this_data = $(this);
    norm = $(this).find("input[name=norm]").val();
    size = $(this).find("input[name=size]").val();
    if (norm != "" && size != "") {
      $.ajax({
        url: '/size_rat_update?' + values,
        'success': function(response) {
          this_data.find(".insert-status").html(response);
          $("#plan_size #ars_tab").dataTable().fnReloadAjax();
          $('.loading').addClass('display-none');
        }
      });
    } else {
      this_data.find(".insert-status").html("Please Fill Required fields").show();
      $('.loading').addClass('display-none');
    }
    event.preventDefault();
  });

  $("#add_core_plan").submit(function(event) {
    $('.loading').removeClass('display-none');
    var values = $(this).serialize();
    var this_data = $(this);
    var data = {};
    cust = $(this).find("input[name=customer]").val();
    styl = $(this).find("input[name=style]").val();
    size = $(this).find("input[name=size]").val();
    brand = $(this).find("input[name=brand]").val();
    channel = $(this).find("input[name=channel]").val();
    flag = $(this).find("select[name=active_flag]").val();
    min_norm = $(this).find("input[name=min_norm]").val();
    max_norm = $(this).find("input[name=max_norm]").val();
    startDate = new Date($('input[name=start_date]').val());
    endDate = new Date($('input[name=end_date]').val());
    if (min_norm == '') {
      min_norm = 0
    }
    if (max_norm == '') {
      max_norm = 0
    }
    if (cust != "" && styl != "" && size != "" && brand != "" && channel != "" && startDate != "Invalid Date" && endDate != "Invalid Date") {
      if (parseInt(max_norm) >= parseInt(min_norm)) {
        if (startDate <= endDate) {
          $.ajax({
            url: '/add_core_plan?' + values,
            'success': function(response) {
              this_data.find(".insert-status").html(response);
              $("#core_plan #ars_tab").dataTable().fnReloadAjax();
              if (response == "New Core Planogram Added") {
              $root = $('#core_plan .dataTables_scroll .dataTables_scrollHead .display #box')
                if ($root.find('.cust_code option[value="' + cust + '"]').length > 0 == false) {
                  $root.find('.cust_code ').append('<option value="' + cust + '">' + cust + '</option>');
                  $root.find('.cust_code ').multiselect('rebuild').multiselect('refresh');
                  $root.find('.cust_code').next().find('.multiselect-group').css('display','none');
                }
                if ($root.find('.style option[value="' + styl + '"]').length > 0 == false) {
                  $root.find('.style ').append('<option value="' + styl + '">' + styl + '</option>');
                  $root.find('.style ').multiselect('rebuild').multiselect('refresh');
                  $root.find('.style').next().find('.multiselect-group').css('display','none');
                }
                if ($root.find('.size option[value="' + size + '"]').length > 0 == false) {
                  $root.find('.size ').append('<option value="' + size + '">' + size + '</option>');
                  $root.find('.size ').multiselect('rebuild').multiselect('refresh');
                  $root.find('.size').next().find('.multiselect-group').css('display','none');
                }
                if ($root.find('.flag option[value="' + flag + '"]').length > 0 == false) {
                  $root.find('.flag ').append('<option value="' + flag + '">' + flag + '</option>');
                  $root.find('.flag ').multiselect('rebuild').multiselect('refresh');
                  $root.find('.flag').next().find('.multiselect-group').css('display','none');
                }
              }
              $('.loading').addClass('display-none');
            }
          });
        } else {
          this_data.find(".insert-status").html("End Date must be greater than or equal to Start Date").show();
          $('.loading').addClass('display-none');
        }
      } else {
        this_data.find(".insert-status").html("Max Norm must be greater than or equal to Min Norm").show();
        $('.loading').addClass('display-none');
      }
    } else {
      this_data.find(".insert-status").html("Please Fill Required fields").show();
      $('.loading').addClass('display-none');
    }
    event.preventDefault();
  });

  $('body').on("click", '#core_plan .results', function() {
    var data_id = $(this).attr('id');
    var context = this;
    $('#update_core_plan').empty();
    $.ajax({
      url: '/core_plan_pop?data_id=' + data_id,
      'success': function(response) {
        $('#update_core_plan').append(response);
        $("#update_core_plan").find('.datepicker').Zebra_DatePicker();
      }
    });
    $("#update_core_plan").modal();
  });

  $("body").on("submit", "#update_core_plan", function(event) {
    event.stopPropagation();
    $('.loading').removeClass('display-none');
    var values = $(this).serialize();
    var this_data = $(this);
    min_norm = $(this).find("input[name=min_norm]").val();
    max_norm = $(this).find("input[name=max_norm]").val();
    startDate = new Date($(this).find('input[name=start_date]').val());
    endDate = new Date($(this).find('input[name=end_date]').val());
    flag = $(this).find("select[name=active_flag]").val();
    if (min_norm == '') {
      min_norm = 0
    }
    if (max_norm == '') {
      max_norm = 0
    }
    if (startDate != "Invalid Date" && endDate != "Invalid Date") {
      if (parseInt(min_norm) <= parseInt(max_norm)) {
        if (startDate <= endDate) {
          $.ajax({
            url: '/core_plan_update?' + values,
            'success': function(response) {
              this_data.find(".insert-status").html(response);
              $("#core_plan #ars_tab").dataTable().fnReloadAjax();
              if (response == 'Updated Successfully') {
                  $root = $('#core_plan .dataTables_scroll .dataTables_scrollHead .display #box')
                  if ($root.find('.flag option[value="' + flag + '"]').length > 0 == false) {
                    $root.find('.flag').append('<option value="' + flag + '">' + flag + '</option>');
                    $root.find('.flag').multiselect('rebuild').multiselect('refresh');
                  }
                }
              $('.loading').addClass('display-none');
            }
          });
        } else {
          this_data.find(".insert-status").html("End Date must be greater than or equal to Start Date").show();
          $('.loading').addClass('display-none');
        }
      } else {
        this_data.find(".insert-status").html("Max Norm must be greater than or equal to Min Norm").show();
        $('.loading').addClass('display-none');
      }
    } else {
      this_data.find(".insert-status").html("Please Fill Required fields").show();
      $('.loading').addClass('display-none');
    }
    event.preventDefault();
  });

  $("body").on("submit", "#rep_adh", function(event) {
    event.preventDefault();
    data = $(this).serialize();
    $('#sortingTable').dataTable({
      "bDestroy": true,
      "bPaginate": true,
      "processing": true,
      "serverSide": true,
      "scrollX": true,
      "ajax": {
        "url": '/adh_filter/?' + data,
        "type": "POST"
      },
      "dom": '<"top"l><"pull-right">rt<"bottom"ip>',
      "columns": $('#sortingTable').myfunction(),
      "columnDefs": $(this).tableWidth(),
      "bAutoWidth": false,
    });
    $("#tab_adh #plan_rep input[name=level_name]").val($('#rep_adh input[name=level_name]:checked').val());
    $("#tab_adh #plan_rep input[name=start_date]").val($('#rep_adh input[name=start_date]').val());
    $("#tab_adh #plan_rep input[name=end_date]").val($('#rep_adh input[name=end_date]').val());
    var $store_code = $("#rep_adh #plan_adh select[name='store_code'] > option:selected").clone().prop('selected', true);
    $('#plan_rep select[name="store_code"]').append($store_code);
    var $brand = $("#rep_adh #plan_adh select[name='brand'] > option:selected").clone().prop('selected', true);
    $('#plan_rep select[name="brand"]').append($brand);
    var $category = $("#rep_adh #plan_adh select[name='category'] > option:selected").clone().prop('selected', true);
    $('#plan_rep select[name="category"]').append($category);
    $("#tab_adh").removeClass("display-none");
    $(".fa-chevron-left").removeClass("display-none");
    $("#rep_adh").addClass("display-none");
  });

  $("body").on("submit", "#rate_sale", function(event) {
    event.preventDefault();
    data = $(this).serialize();
    $('#sortingTable').dataTable({
      "bDestroy": true,
      "processing": true,
      "serverSide": true,
      "scrollX": true,
      "dom": '<"top"l><"pull-right">rt<"bottom"ip>',
      "ajax": {
        "url": '/rate_sale_filter/?' + data,
        "type": "POST"
      },
      "columns": $('#sortingTable').myfunction(),
      "columnDefs": $(this).tableWidth(),
    });
    $("#tab_sell #ros_rep input[name=level_name]").val($('#rate_sale input[name=level_name]:checked').val());
    $("#tab_sell #ros_rep input[name=start_date]").val($('#rate_sale input[name=start_date]').val());
    $("#tab_sell #ros_rep input[name=end_date]").val($('#rate_sale input[name=end_date]').val());
    var $store_code = $("#rate_sale #tab_rate_sale select[name='store_code'] > option:selected").clone().prop('selected', true);
    $('#ros_rep select[name="store_code"]').append($store_code);
    var $brand = $("#rate_sale #tab_rate_sale select[name='brand'] > option:selected").clone().prop('selected', true);
    $('#ros_rep select[name="brand"]').append($brand);
    var $category = $("#rate_sale #tab_rate_sale select[name='category'] > option:selected").clone().prop('selected', true);
    $('#ros_rep select[name="category"]').append($category);
    var $style = $("#rate_sale #tab_rate_sale select[name='style'] > option:selected").clone().prop('selected', true);
    $('#ros_rep select[name="style"]').append($style);
    var $size = $("#rate_sale #tab_rate_sale select[name='size'] > option:selected").clone().prop('selected', true);
    $('#ros_rep select[name="size"]').append($size);
    $("#tab_sell").removeClass("display-none")
    $(".fa-chevron-left").removeClass("display-none");
    $("#rate_sale").addClass("display-none");
  });

  $("body").on("submit", "#sell_thru", function(event) {
    event.preventDefault();
    data = $(this).serialize();
    $('#sortingTable').dataTable({
      "bDestroy": true,
      "deferRender": true,
      "processing": true,
      "serverSide": true,
      "scrollX": true,
      "dom": '<"top"l><"pull-right">rt<"bottom"ip>',
      "ajax": {
        "url": '/sell_thru_filter/?' + data,
        "type": "POST"
      },
      "columns": $('#sortingTable').myfunction(),
      "columnDefs": $(this).tableWidth(),
    });
    $("#rep_sell_thru #sell_rep input[name=level_name]").val($('#sell_thru input[name=level_name]:checked').val());
    $("#rep_sell_thru #sell_rep input[name=start_date]").val($('#sell_thru input[name=start_date]').val());
    $("#rep_sell_thru #sell_rep input[name=end_date]").val($('#sell_thru input[name=end_date]').val());
    var $store_code = $("#sell_thru #tab_sell_thru select[name='store_code'] > option:selected").clone().prop('selected', true);
    $('#sell_rep select[name="store_code"]').append($store_code);
    var $brand = $("#sell_thru #tab_sell_thru select[name='brand'] > option:selected").clone().prop('selected', true);
    $('#sell_rep select[name="brand"]').append($brand);
    var $category = $("#rep_adh #plan_adh select[name='category'] > option:selected").clone().prop('selected', true);
    $('#sell_rep select[name="category"]').append($category);
    var $style = $("#rep_adh #plan_adh select[name='style'] > option:selected").clone().prop('selected', true);
    $('#sell_rep select[name="style"]').append($style);
    var $size = $("#rep_adh #plan_adh select[name='size'] > option:selected").clone().prop('selected', true);
    $('#sell_rep select[name="size"]').append($size);
    $("#rep_sell_thru").removeClass("display-none");
    $(".fa-chevron-left").removeClass("display-none");
    $("#sell_thru").addClass("display-none");
  });

  $("body").on("submit", "#alloc_rep", function(event) {
    event.preventDefault();
    data = $(this).serialize();
    $('#sortingTable').dataTable({
      "bDestroy": true,
      "processing": true,
      "serverSide": true,
      "scrollX": true,
      "dom": '<"top"l><"pull-right">rt<"bottom"ip>',
      "ajax": {
        "url": '/alloc_rep_filter/?' + data,
        "type": "POST"
      },
      "columns": $('#sortingTable').myfunction(),
      "columnDefs": $(this).tableWidth(),
    });
    $("#rep_alloc_rep #allocation_rep input[name=level_name]").val($('#alloc_rep input[name=level_name]:checked').val());
    $("#rep_alloc_rep #allocation_rep input[name=start_date]").val($('#alloc_rep input[name=start_date]').val());
    $("#rep_alloc_rep #allocation_rep input[name=end_date]").val($('#alloc_rep input[name=end_date]').val());
    var $store_code = $("#alloc_rep #tab_alloc_rep select[name='store_code'] > option:selected").clone().prop('selected', true);
    $('#allocation_rep select[name="store_code"]').append($store_code);
    var $brand = $("#alloc_rep #tab_alloc_rep select[name='brand'] > option:selected").clone().prop('selected', true);
    $('#allocation_rep select[name="brand"]').append($brand);
    var $category = $("#alloc_rep #tab_alloc_rep select[name='category'] > option:selected").clone().prop('selected', true);
    $('#allocation_rep select[name="category"]').append($category);
    var $style = $("#alloc_rep #tab_alloc_rep select[name='style'] > option:selected").clone().prop('selected', true);
    $('#allocation_rep select[name="style"]').append($style);
    var $size = $("#alloc_rep #tab_alloc_rep select[name='size'] > option:selected").clone().prop('selected', true);
    $('#allocation_rep select[name="size"]').append($size);
    var $alloc_typ = $("#alloc_rep #tab_alloc_rep select[name='alloc_typ'] > option:selected").clone().prop('selected', true);
    $('#allocation_rep select[name="alloc_type"]').append($alloc_typ);
    $("#rep_alloc_rep").removeClass("display-none")
    $(".fa-chevron-left").removeClass("display-none");
    $("#alloc_rep").addClass("display-none");
  });

  $("body").on("submit", "#stor_suf", function(event) {
    event.preventDefault();
    data = $(this).serialize();
    $('#sortingTable').dataTable({
      "bDestroy": true,
      "processing": true,
      "serverSide": true,
      "scrollX": true,
      "dom": '<"top"l><"pull-right">rt<"bottom"ip>',
      "ajax": {
        "url": '/stor_stock_filter/?' + data,
        "type": "POST"
      },
      "columns": $('#sortingTable').myfunction(),
      "columnDefs": $(this).tableWidth(),
    });
    $("#rep_stor_suf #stor_suf_rep input[name=level_name]").val($('#stor_suf input[name=level_name]:checked').val());
    $("#rep_stor_suf #stor_suf_rep input[name=start_date]").val($('#stor_suf input[name=start_date]').val());
    $("#rep_stor_suf #stor_suf_rep input[name=end_date]").val($('#stor_suf input[name=end_date]').val());
    var $store_code = $("#stor_suf #tab_stor_suf select[name='store_code'] > option:selected").clone().prop('selected', true);
    $('#stor_suf_rep select[name="store_code"]').append($store_code);
    var $brand = $("#stor_suf_rep #tab_stor_suf select[name='brand'] > option:selected").clone().prop('selected', true);
    $('#stor_suf_rep select[name="brand"]').append($brand);
    var $category = $("#stor_suf_rep #tab_stor_suf select[name='category'] > option:selected").clone().prop('selected', true);
    $('#stor_suf_rep select[name="category"]').append($category);
    var $style = $("#stor_suf_rep #tab_stor_suf select[name='style'] > option:selected").clone().prop('selected', true);
    $('#stor_suf_rep select[name="style"]').append($style);
    var $size = $("#stor_suf_rep #tab_stor_suf select[name='size'] > option:selected").clone().prop('selected', true);
    $('#stor_suf_rep select[name="size"]').append($size);
    $("#rep_stor_suf").removeClass("display-none")
    $(".fa-chevron-left").removeClass("display-none");
    $("#stor_suf").addClass("display-none");
  });

  $("body").on("submit", "#sale_alloc", function(event) {
    event.preventDefault();
    data = $(this).serialize();
    $('#sortingTable').dataTable({
      "bDestroy": true,
      "processing": true,
      "serverSide": true,
      "scrollX": true,
      "dom": '<"top"l><"pull-right">rt<"bottom"ip>',
      "ajax": {
        "url": '/sale_alloc_report/?' + data,
        "type": "POST"
      },
      "columns": $('#sortingTable').myfunction(),
      "columnDefs": $(this).tableWidth(),
    });
    $("#rep_sale_alloc #sale_alloc_rep input[name=level_name]").val($('#sale_alloc #tab_sale_alloc input[name=level_name]:checked').val());
    $("#rep_sale_alloc #sale_alloc_rep input[name=start_date]").val($('#sale_alloc #tab_sale_alloc input[name=start_date]').val());
    $("#rep_sale_alloc #sale_alloc_rep input[name=end_date]").val($('#sale_alloc #tab_sale_alloc input[name=end_date]').val());
    var $store_code = $("#sale_alloc #tab_sale_alloc select[name='store_code'] > option:selected").clone().prop('selected', true);
    $('#sale_alloc_rep select[name="store_code"]').append($store_code);
    var $brand = $("#sale_alloc #tab_sale_alloc select[name='brand'] > option:selected").clone().prop('selected', true);
    $('#sale_alloc_rep select[name="brand"]').append($brand);
    var $category = $("#sale_alloc #tab_sale_alloc select[name='category'] > option:selected").clone().prop('selected', true);
    $('#sale_alloc_rep select[name="category"]').append($category);
    var $style = $("#sale_alloc #tab_sale_alloc select[name='style'] > option:selected").clone().prop('selected', true);
    $('#sale_alloc_rep select[name="style"]').append($style);
    var $size = $("#sale_alloc #tab_sale_alloc select[name='size'] > option:selected").clone().prop('selected', true);
    $('#sale_alloc_rep select[name="size"]').append($size);
    $("#rep_sale_alloc").removeClass("display-none")
    $(".fa-chevron-left").removeClass("display-none");
    $("#sale_alloc").addClass("display-none");
  });

  $("body").on("submit", "#ware_suf", function(event) {
    event.preventDefault();
    data = $(this).serialize();
    $('#sortingTable').dataTable({
      "bDestroy": true,
      "processing": true,
      "serverSide": true,
      "scrollX": true,
      "ajax": {
        "url": '/ware_suf_filter/?' + data,
        "type": "POST"
      },
      "columns": $('#sortingTable').myfunction(),
      "columnDefs": $(this).tableWidth(),
    });
    $("#rep_ware_suf").removeClass("display-none")
    $(".fa-chevron-left").removeClass("display-none");
    $("#ware_suf").addClass("display-none");
  });

  $("body").on("click", "#rep_sell_thru #dea", function(event) {
    $(".loading").removeClass("display-none");
    event.preventDefault();
    data = $('#sell_thru').serialize();
    $.ajax({
      url: '/sell_thru_pdf/?' + data,
      'success': function(response) {
        $("#down")[0].click()
        $(".loading").addClass("display-none")
      }
    });
  });

  $("body").on("click", "#tab_adh #dea", function(event) {
    $(".loading").removeClass("display-none");
    event.preventDefault();
    data = $('#rep_adh').serialize();
    $.ajax({
      url: '/plan_adh_pdf/?' + data,
      'success': function(response) {
        $("#down")[0].click()
        $(".loading").addClass("display-none")
      }
    });
  });

  $("body").on("click", "#tab_sell #dea", function(event) {
    $(".loading").removeClass("display-none");
    event.preventDefault();
    data = $('#rate_sale').serialize();
    $.ajax({
      url: '/ros_pdf/?' + data,
      'success': function(response) {
        $("#down")[0].click()
        $(".loading").addClass("display-none");
      }
    });
  });

  $("body").on("click", "#rep_alloc_rep #dea", function(event) {
    $(".loading").removeClass("display-none");
    event.preventDefault();
    data = $('#alloc_rep').serialize();
    $.ajax({
      url: '/allocation_pdf/?' + data,
      'success': function(response) {
        $("#down")[0].click()
        $(".loading").addClass("display-none");
      }
    });
  });

  $("body").on("click", "#rep_stor_suf #dea", function(event) {
    $(".loading").removeClass("display-none");
    event.preventDefault();
    data = $('#stor_suf').serialize();
    $.ajax({
      url: '/store_sufficiency_pdf/?' + data,
      'success': function(response) {
        $("#down")[0].click()
        $(".loading").addClass("display-none");
      }
    });
  });

  $("body").on("click", "#rep_sale_alloc #dea", function(event) {
    $(".loading").removeClass("display-none");
    event.preventDefault();
    data = $('#sale_alloc').serialize();
    $.ajax({
      url: '/sale_alloc_pdf/?' + data,
      'success': function(response) {
        $("#down")[0].click()
        $(".loading").addClass("display-none");
      }
    });
  });

  $("body").on("click", ".fa-chevron-left", function() {
    $(".fa-chevron-left").addClass("display-none");
    $("#tab_adh,#tab_sell,#rep_sell_thru,#rep_alloc_rep,#rep_stor_suf,#rep_sale_alloc,#rep_ware_suf").addClass("display-none");
    $("#rep_adh,#rate_sale,#sell_thru,#alloc_rep,#stor_suf,#sale_alloc,#ware_suf").removeClass("display-none");
  });

  $('.datepicker').Zebra_DatePicker();

  $(".cust_code").multiselect({
    includeSelectAllOption: true,
    enableFiltering: true,
    dropRight: false,
    maxHeight: 200,
    buttonClass: 'btn btn-link',
    buttonContainer: '<div id="checking" class="btn-group checking" >',
    buttonText: function(options, select) {
      if (options.length === 0) {
        return 'Customer Code';
      }
    }
  });

  $(".cat_id").multiselect({
    includeSelectAllOption: true,
    enableFiltering: true,
    dropRight: false,
    maxHeight: 200,
    buttonClass: 'btn btn-link',
    buttonContainer: '<div id="checking" class="btn-group checking" >',
    buttonText: function(options, select) {
      if (options.length === 0) {
        return 'Category ID';
      }
    }
  });

  $(".brand").multiselect({
    includeSelectAllOption: true,
    enableFiltering: true,
    dropRight: false,
    maxHeight: 200,
    buttonClass: 'btn btn-link',
    buttonContainer: '<div id="checking" class="btn-group checking" >',
    buttonText: function(options, select) {
      if (options.length === 0) {
        return 'Brand';
      }
    }
  });

  $(".flag").multiselect({
    includeSelectAllOption: true,
    enableFiltering: true,
    dropRight: false,
    maxHeight: 200,
    buttonClass: 'btn btn-link',
    buttonContainer: '<div id="checking" class="btn-group checking" >',
    buttonText: function(options, select) {
      if (options.length === 0) {
        return 'Active Flag';
      }
    }
  });

  $(".day").multiselect({
    includeSelectAllOption: true,
    enableFiltering: true,
    dropRight: false,
    maxHeight: 200,
    buttonClass: 'btn btn-link',
    buttonContainer: '<div id="checking" class="btn-group checking" >',
    buttonText: function(options, select) {
      if (options.length === 0) {
        return 'Day';
      }
    }
  });

  $(".plant_code").multiselect({
    includeSelectAllOption: true,
    enableFiltering: true,
    dropRight: false,
    maxHeight: 200,
    buttonClass: 'btn btn-link',
    buttonContainer: '<div id="checking" class="btn-group checking" >',
    buttonText: function(options, select) {
      if (options.length === 0) {
        return 'Plant Code';
      }
    }
  });

  $(".style").multiselect({
    includeSelectAllOption: true,
    enableFiltering: true,
    dropRight: false,
    maxHeight: 200,
    buttonClass: 'btn btn-link',
    buttonContainer: '<div id="checking" class="btn-group checking" >',
    buttonText: function(options, select) {
      if (options.length === 0) {
        return 'Style Code';
      }
    }
  });

  $(".size").multiselect({
    includeSelectAllOption: true,
    enableFiltering: true,
    dropRight: false,
    maxHeight: 200,
    buttonClass: 'btn btn-link',
    buttonContainer: '<div id="checking" class="btn-group checking" >',
    buttonText: function(options, select) {
      if (options.length === 0) {
        return 'Size';
      }
    }
  });

  $(".cat").multiselect({
    includeSelectAllOption: true,
    enableFiltering: true,
    dropRight: false,
    maxHeight: 200,
    buttonClass: 'btn btn-link',
    buttonContainer: '<div id="checking" class="btn-group checking" >',
    buttonText: function(options, select) {
      if (options.length === 0) {
        return 'Category';
      }
    }
  });

  $(".season").multiselect({
    includeSelectAllOption: true,
    enableFiltering: true,
    dropRight: false,
    maxHeight: 200,
    buttonClass: 'btn btn-link',
    buttonContainer: '<div id="checking" class="btn-group checking" >',
    buttonText: function(options, select) {
      if (options.length === 0) {
        return 'Season';
      }
    }
  });


  $(".store").multiselect({
    includeSelectAllOption: true,
    enableFiltering: true,
    dropRight: true,
    nonSelectedText: 'Select Store Code',
    maxHeight: 200,
    buttonWidth: '100%',
    buttonContainer: '<div id="checking" class="btn-group" >'
  });

  $(".brands").multiselect({
    includeSelectAllOption: true,
    enableFiltering: true,
    dropRight: true,
    nonSelectedText: 'Select Brand',
    maxHeight: 200,
    buttonWidth: '100%',
    buttonContainer: '<div id="checking" class="btn-group" >'
  });

  $(".category").multiselect({
    includeSelectAllOption: true,
    enableFiltering: true,
    dropRight: true,
    nonSelectedText: 'Select Category',
    maxHeight: 200,
    buttonWidth: '100%',
    buttonContainer: '<div id="checking" class="btn-group" >'
  });

  $(".styl").multiselect({
    includeSelectAllOption: true,
    enableFiltering: true,
    dropRight: true,
    nonSelectedText: 'Select Style',
    maxHeight: 200,
    buttonWidth: '100%',
    buttonContainer: '<div id="checking" class="btn-group" >'
  });

  $(".siz").multiselect({
    includeSelectAllOption: true,
    enableFiltering: true,
    dropRight: true,
    nonSelectedText: 'Select Size',
    maxHeight: 200,
    buttonWidth: '100%',
    buttonContainer: '<div id="checking" class="btn-group" >'
  });

  $(".all_typ").multiselect({
    includeSelectAllOption: true,
    enableFiltering: true,
    dropRight: true,
    nonSelectedText: 'Select Allocation Type',
    maxHeight: 200,
    buttonWidth: '100%',
    buttonContainer: '<div id="checking" class="btn-group" >'
  });

  function clear_head($panel, level_name, report_type) {
    $("#sortingTable").DataTable().clear().destroy();
    $panel.find('thead').remove();
    $panel.find('tbody').remove();
    var headers = [];
    if (report_type == 'plan_adh' && level_name == 'Store Level') {
      headers = ['Store Code', 'Store Desc', 'Options Norm', 'Quantity Norm', 'Norm', 'Full Store SOH Quantity', 'Cut Store SOH Quantity', 'Store SOH Quantity', 'Planogram Adherence (SOH%)', 'Store GIT Quantity', 'Open Order Quantity', 'Allocation Quantity', 'Full Total SOH Quantity', 'Cut Total SOH Quantity', 'Total SOH Quantity', 'Adherence Total SOH%'];
    } else if (report_type == 'plan_adh' && level_name == 'Store Brand Level') {
      headers = ['Store Code', 'Store Desc', 'Brand', 'Fashion/Core', 'Options Norm', 'Quantity Norm', 'Norm', 'Full Store SOH Quantity', 'Cut Store SOH Quantity', 'Store SOH Quantity', 'Planogram Adherence (SOH%)', 'Store GIT Quantity', 'Open Order Quantity', 'Allocation Quantity', 'Full Total SOH Quantity', 'Cut Total SOH Quantity', 'Total SOH Quantity', 'Adherence Total SOH%']
    } else if (report_type == 'plan_adh' && level_name == 'Store Brand Category Level') {
      headers = ['Store Code', 'Store Desc', 'Brand', 'Category', 'Category ID', 'Fashion/Core', 'Options Norm', 'Quantity Norm', 'Norm', 'Full Store SOH Quantity', 'Cut Store SOH Quantity', 'Store SOH Quantity', 'Planogram Adherence (SOH%)', 'Store GIT Quantity', 'Open Order Quantity', 'Allocation Quantity', 'Full Total SOH Quantity', 'Cut Total SOH Quantity', 'Total SOH Quantity', 'Adherence Total SOH%']
    } else if (report_type == 'tab_sell_thru' && level_name == 'Store Level') {
      headers = ['Store Code', 'Store Desc', 'Channel', 'GRN Quantity', 'Sales Quantity', 'SOH Quantity', 'Sell Through', 'City', 'State', 'Region', 'Store Class', 'Fashion Type']
    } else if (report_type == 'tab_sell_thru' && level_name == 'Store Brand Level') {
      headers = ['Store Code', 'Store Desc', 'Brand', 'Channel', 'GRN Quantity', 'Sales Quantity', 'SOH Quantity', 'Sell Through', 'City', 'State', 'Region', 'Store Class', 'Fashion Type']
    } else if (report_type == 'tab_sell_thru' && level_name == 'Store Brand Category Level') {
      headers = ['Store Code', 'Store Desc', 'Brand', 'Channel', 'Category', 'Category ID', 'GRN Quantity', 'Sales Quantity', 'SOH Quantity', 'Sell Through', 'City', 'State', 'Region', 'Store Class', 'Fashion Type']
    } else if (report_type == 'tab_sell_thru' && level_name == 'Store Brand Category Style Level') {
      headers = ['Store Code', 'Store Desc', 'Brand', 'Channel', 'Category', 'Category ID', 'Style', 'GRN Quantity', 'Sales Quantity', 'SOH Quantity', 'Sell Through', 'City', 'State', 'Region', 'Store Class', 'Fashion Type']
    } else if (report_type == 'tab_sell_thru' && level_name == 'Store Brand Category Style Size Level') {
      headers = ['Store Code', 'Store Desc', 'Brand', 'Channel', 'Category', 'Category ID', 'Style', 'Size', 'GRN Quantity', 'Sales Quantity', 'SOH Quantity', 'Sell Through', 'City', 'State', 'Region', 'Store Class', 'Fashion Type']
    } else if (report_type == 'tab_rate_sale' && level_name == 'Store Level') {
      headers = ['Store Code', 'Store Desc', 'Channel', 'First GRN Date', 'GRN Quantity', 'Sales Quantity', 'SOH Quantity', 'Average Trading Days', 'Rate Of Sale', 'City', 'State', 'Region', 'Store Class', 'Fashion Type']
    } else if (report_type == 'tab_rate_sale' && level_name == 'Store Brand Level') {
      headers = ['Store Code', 'Store Desc', 'Brand', 'Channel', 'First GRN Date', 'GRN Quantity', 'Sales Quantity', 'SOH Quantity', 'Average Trading Days', 'Rate Of Sale', 'City', 'State', 'Region', 'Store Class', 'Fashion Type']
    } else if (report_type == 'tab_rate_sale' && level_name == 'Store Brand Category Level') {
      headers = ['Store Code', 'Store Desc', 'Brand', 'Channel', 'Category', 'Category ID', 'First GRN Date', 'GRN Quantity', 'Sales Quantity', 'SOH Quantity', 'Average Trading Days', 'Rate Of Sale', 'City', 'State', 'Region', 'Store Class', 'Fashion Type']
    } else if (report_type == 'tab_rate_sale' && level_name == 'Store Brand Category Style Level') {
      headers = ['Store Code', 'Store Desc', 'Brand', 'Channel', 'Category', 'Category ID', 'Style', 'First GRN Date', 'GRN Quantity', 'Sales Quantity', 'SOH Quantity', 'Average Trading Days', 'Rate Of Sale', 'City', 'State', 'Region', 'Store Class', 'Fashion Type']
    } else if (report_type == 'tab_rate_sale' && level_name == 'Store Brand Category Style Size Level') {
      headers = ['Store Code', 'Store Desc', 'Brand', 'Channel', 'Category', 'Category ID', 'Style', 'Size', 'First GRN Date', 'GRN Quantity', 'Sales Quantity', 'SOH Quantity', 'Average Trading Days', 'Rate Of Sale', 'City', 'State', 'Region', 'Store Class', 'Fashion Type']
    } else if (report_type == 'tab_alloc_rep' && level_name == 'Store Level') {
      headers = ['Store Code', 'Store Desc', 'Channel', 'City', 'State', 'Region', 'Store Class', 'Fashion type', 'EAN', 'Allocation Type', 'Allocated Quantity', 'Document Number']
    } else if (report_type == 'tab_alloc_rep' && level_name == 'Store Brand Level') {
      headers = ['Store Code', 'Store Desc', 'Brand', 'Channel', 'City', 'State', 'Region', 'Store Class', 'Fashion type', 'EAN', 'Allocation Type', 'Allocated Quantity', 'Document Number']
    } else if (report_type == 'tab_alloc_rep' && level_name == 'Store Brand Category Level') {
      headers = ['Store Code', 'Store Desc', 'Brand', 'Channel', 'City', 'State', 'Region', 'Store Class', 'Category', 'Category ID', 'Fashion type', 'EAN', 'Allocation Type', 'Allocated Quantity', 'Document Number']
    } else if (report_type == 'tab_alloc_rep' && level_name == 'Store Brand Category Style Level') {
      headers = ['Store Code', 'Store Desc', 'Brand', 'Channel', 'City', 'State', 'Region', 'Store Class', 'Category', 'Category ID', 'Fashion type', 'Style', 'EAN', 'Allocation Type', 'Allocated Quantity', 'Document Number']
    } else if (report_type == 'tab_alloc_rep' && level_name == 'Store Brand Category Style Size Level') {
      headers = ['Store Code', 'Store Desc', 'Brand', 'Channel', 'City', 'State', 'Region', 'Store Class', 'Category', 'Category ID', 'Fashion type', 'Style', 'Size', 'EAN', 'Allocation Type', 'Allocated Quantity', 'Document Number']
    } else if (report_type == 'tab_stor_suf' && level_name == 'Store Level') {
      headers = ['Store Code', 'Store Desc', 'Channel', 'City', 'State', 'Region', 'Store Class', 'Fashion type', 'EAN', 'SOH Quantity', 'GIT Quantity', 'Order Quantity', 'FM Allocated', 'SM Allocated', 'NS Allocated', 'CR Allocated', 'Final SOH', 'Pivotal Flag', 'Size Set Classification']
    } else if (report_type == 'tab_stor_suf' && level_name == 'Store Brand Level') {
      headers = ['Store Code', 'Store Desc', 'Brand', 'Channel', 'City', 'State', 'Region', 'Store Class', 'Fashion type', 'EAN', 'SOH Quantity', 'GIT Quantity', 'Order Quantity', 'FM Allocated', 'SM Allocated', 'NS Allocated', 'CR Allocated', 'Final SOH', 'Pivotal Flag', 'Size Set Classification']
    } else if (report_type == 'tab_stor_suf' && level_name == 'Store Brand Category Level') {
      headers = ['Store Code', 'Store Desc', 'Brand', 'Channel', 'City', 'State', 'Region', 'Store Class', 'Category', 'Category ID', 'Fashion type', 'EAN', 'SOH Quantity', 'GIT Quantity', 'Order Quantity', 'FM Allocated', 'SM Allocated', 'NS Allocated', 'CR Allocated', 'Final SOH', 'Pivotal Flag', 'Size Set Classification']
    } else if (report_type == 'tab_stor_suf' && level_name == 'Store Brand Category Style Level') {
      headers = ['Store Code', 'Store Desc', 'Brand', 'Channel', 'City', 'State', 'Region', 'Store Class', 'Category', 'Category ID', 'Fashion type', 'Style', 'EAN', 'SOH Quantity', 'GIT Quantity', 'Order Quantity', 'FM Allocated', 'SM Allocated', 'NS Allocated', 'CR Allocated', 'Final SOH', 'Pivotal Flag', 'Size Set Classification']
    } else if (report_type == 'tab_stor_suf' && level_name == 'Store Brand Category Style Size Level') {
      headers = ['Store Code', 'Store Desc', 'Brand', 'Channel', 'City', 'State', 'Region', 'Store Class', 'Category', 'Category ID', 'Fashion type', 'Style', 'Size', 'EAN', 'SOH Quantity', 'GIT Quantity', 'Order Quantity', 'FM Allocated', 'SM Allocated', 'NS Allocated', 'CR Allocated', 'Final SOH', 'Pivotal Flag', 'Size Set Classification']
    } else if (report_type == 'tab_sale_alloc' && level_name == 'Store Level') {
      headers = ['Store Code', 'Store Desc', 'Channel', 'City', 'State', 'Region', 'Store Class', 'Fashion Type', 'Sales Quantity', 'Allocation Quantity']
    } else if (report_type == 'tab_sale_alloc' && level_name == 'Store Brand Level') {
      headers = ['Store Code', 'Store Desc', 'Brand', 'Channel', 'City', 'State', 'Region', 'Store Class', 'Fashion Type', 'Sales Quantity', 'Allocation Quantity']
    } else if (report_type == 'tab_sale_alloc' && level_name == 'Store Brand Category Level') {
      headers = ['Store Code', 'Store Desc', 'Brand', 'Channel', 'City', 'State', 'Region', 'Store Class', 'Category', 'Category ID', 'Fashion Type', 'Sales Quantity', 'Allocation Quantity']
    } else if (report_type == 'tab_sale_alloc' && level_name == 'Store Brand Category Style Level') {
      headers = ['Store Code', 'Store Desc', 'Brand', 'Channel', 'City', 'State', 'Region', 'Store Class', 'Category', 'Category ID', 'Fashion Type', 'Style', 'Sales Quantity', 'Allocation Quantity']
    } else if (report_type == 'tab_sale_alloc' && level_name == 'Store Brand Category Style Size Level') {
      headers = ['Store Code', 'Store Desc', 'Brand', 'Channel', 'City', 'State', 'Region', 'Store Class', 'Category', 'Category ID', 'Fashion Type', 'Style', 'Size', 'Sales Quantity', 'Allocation Quantity']
    } else if (report_type == 'tab_stor_suf' && level_name == 'Store Level') {
      headers = ['Store Code', 'Store Desc', 'Channel', 'City', 'State', 'Region', 'Store Class', 'Fashion type', 'EAN', 'SOH Quantity', 'GIT Quantity', 'Order Quantity', 'FM Allocated', 'SM Allocated', 'NS Allocated', 'CR Allocated', 'Final SOH', 'Pivotal Flag', 'Size Set Classification']
    } else if (report_type == 'tab_stor_suf' && level_name == 'Store Brand Level') {
      headers = ['Store Code', 'Store Desc', 'Brand', 'Channel', 'City', 'State', 'Region', 'Store Class', 'Fashion type', 'EAN', 'SOH Quantity', 'GIT Quantity', 'Order Quantity', 'FM Allocated', 'SM Allocated', 'NS Allocated', 'CR Allocated', 'Final SOH', 'Pivotal Flag', 'Size Set Classification']
    } else if (report_type == 'tab_stor_suf' && level_name == 'Store Brand Category Level') {
      headers = ['Store Code', 'Store Desc', 'Brand', 'Channel', 'City', 'State', 'Region', 'Store Class', 'Category', 'Category ID', 'Fashion type', 'EAN', 'SOH Quantity', 'GIT Quantity', 'Order Quantity', 'FM Allocated', 'SM Allocated', 'NS Allocated', 'CR Allocated', 'Final SOH', 'Pivotal Flag', 'Size Set Classification']
    } else if (report_type == 'tab_stor_suf' && level_name == 'Store Brand Category Style Level') {
      headers = ['Store Code', 'Store Desc', 'Brand', 'Channel', 'City', 'State', 'Region', 'Store Class', 'Category', 'Category ID', 'Fashion type', 'Style', 'EAN', 'SOH Quantity', 'GIT Quantity', 'Order Quantity', 'FM Allocated', 'SM Allocated', 'NS Allocated', 'CR Allocated', 'Final SOH', 'Pivotal Flag', 'Size Set Classification']
    } else if (report_type == 'tab_stor_suf' && level_name == 'Store Brand Category Style Size Level') {
      headers = ['Store Code', 'Store Desc', 'Brand', 'Channel', 'City', 'State', 'Region', 'Store Class', 'Category', 'Category ID', 'Fashion type', 'Style', 'Size', 'EAN', 'SOH Quantity', 'GIT Quantity', 'Order Quantity', 'FM Allocated', 'SM Allocated', 'NS Allocated', 'CR Allocated', 'Final SOH', 'Pivotal Flag', 'Size Set Classification']
    }
    var thead = render_head(headers);
    $panel.find('table').prepend(thead);
  };

  function render_head(headers) {
    var thead = "<thead><tr>";
    $.each(headers, function(ind, value) {
      thead += "<th>" + value + "</th>";
    });
    thead += "</tr></thead>";
    return thead;
  };



  $(".check_level").on("mouseup", function(e) {
    lev_nam = $(this).find('input[name=level_name]').val()
    if (lev_nam == "Store Brand Category Style Size Level"){
      brands = false, category = false, styl = false, siz = false, br = "block", ca = "block", st = "block", si = "block"
    }
    else if (lev_nam == "Store Brand Category Style Level"){
      brands = false, category = false, styl = false, siz = true, br = "block", ca = "block", st = "block", si = "none"
    }
    else if (lev_nam == "Store Brand Category Level"){
      brands = false, category = false, styl = true, siz = true, br = "block", ca = "block", st = "none", si = "none"
    }
    else if (lev_nam == "Store Brand Level"){
      brands = false, category = true, styl = true, siz = true, br = "block", ca = "none", st = "none", si = "none"
    }
    else if (lev_nam == "Store Level"){
      brands = true, category = true, styl = true, siz = true, br = "none", ca = "none", st = "none", si = "none"
    }
    $(".brands").parent().parent().parent().css("display", br);
    $(".brands").prop('disabled', brands);
    $(".category").parent().parent().parent().css("display", ca);
    $(".category").prop('disabled', category);
    $(".styl").parent().parent().parent().css("display", st);
    $(".styl").prop('disabled', styl);
    $(".siz").parent().parent().parent().css("display", si);
    $(".siz").prop('disabled', siz);
    var $panel = $(this).parents('form').next();
    clear_head($panel, $(this).children().val(), $(this).parents('.panel').attr('id'));
  });

  $("button[type='get_input']").click(function() {
    $("form").trigger('reset');
    $("form").find(".insert-status").empty();
  });

  $(".fa-chevron-left").click(function() {
    $("form input[name=start_date],form input[name=end_date]").val('');
    $('.fas,.store,.brands,.category,.siz,.styl,.all_typ').find('option:selected').removeAttr("selected");
    $('.store,.fas,.brands,.category,.siz,.styl,.all_typ').multiselect('refresh');
  });

  function stat_msg(data_res) {
    if (data_res == "Success") {
        return $("body").find(".stat").html('<div class="alert alert-success" role="alert"><span class="glyphicon glyphicon-exclamation-sign" aria-hidden="true"></span><span class="sr-only">Error:</span><strong> Well Done ! </strong> File Uploaded Successfully </div>').show().fadeOut(5000);
    }
    else if (data_res == "Invalid File") {
        return $("body").find(".stat").html('<div class="alert alert-danger" role="alert"><span class="glyphicon glyphicon-exclamation-sign" aria-hidden="true"></span><span class="sr-only">Error:</span><strong> Caution ! </strong> Invalid File </div>').show().fadeOut(5000);
    }
    else {
        return $("body").find(".stat").html('<div class="alert alert-danger" role="alert"><span class="glyphicon glyphicon-exclamation-sign" aria-hidden="true"></span><span class="sr-only">Error:</span><strong> Error Data ! </strong>  Download Error Form </div>').show().fadeOut(5000);
    }
  }

  $('.form_upl').fileupload({
    add: function(e, data) {
      data.context = $(".loading").removeClass("display-none");
      data.submit();
    },
    done: function(e, data) {
      if (data.result == "Success")
      {
        $(this).parent().parent().find('.form_err').attr("value", "");
      }
      else if (data.result != "Invalid File")
      {
        $(this).parent().parent().find('.form_dow').text("Download Error Form");
        $(this).parent().parent().find('.form_err').attr("value", data.result);
      }
      stat_msg(data.result)
      $(".loading").addClass("display-none");
    },
    fail: function(e, data) {
        alert('Error While Uploading File');
        $(".loading").addClass("display-none");
    }
  });

  $("#menu-toggle").click(function(e) {
    e.preventDefault();
    $("#wrapper").toggleClass("display-none");
    $('.content').toggleClass("che");
    $('.headerBar').toggleClass("che");
  });

  $('#user_permissions > table').DataTable();

  $add_user_form = $('#add-user-form'),$add_user_modal = $('#add_user_modal');

  $('#add_user_modal .save-user').click(function(e) {
    $('.loading').removeClass('display-none');
    var username = $add_user_form.find('input[name="username"]').val().trim(),group_id = $add_user_form.find('select[name="user_groups"]').children('option:selected').val();
    if (!username || username == '') {
      $add_user_modal.find(".insert-status").html('UserName is required').removeClass('hide');
      $('.loading').addClass('display-none');
      return;
    }
    if (!group_id || group_id == '') {
      $add_user_modal.find(".insert-status").html('Select Group').removeClass('hide');
      $('.loading').addClass('display-none');
      return;
    }
    var data = $add_user_form.serialize();
    $.post('/update_user_permissions/', data, function(resp) {
      $add_user_modal.find(".insert-status").html(resp).removeClass('hide');
      $('.loading').addClass('display-none');
      if (resp == 'User Already Exists') {
        return;
      }
      window.setTimeout(function() {
        $add_user_modal.modal('hide');
        window.location = window.location.href;
      }, 1000);
    }).fail(function() {
      $add_user_modal.find(".insert-status").html("Error Occured while Updating User").show();
      $('.loading').addClass('display-none');
    });
  });

  $('#user_permissions').on('click', 'table tr.user-row', function(e) {
    e.preventDefault();
    var $tr = $(this),group_id = $tr.find('td.groups').attr('data-groups'),brands = $tr.find('td.brand_channel').attr('data-brands').split(', ');
    $add_user_form.find('input[name="username"]').val($tr.find('td.username').text());
    $add_user_form.find('input[name="email"]').val($tr.find('td.email').text());
    $add_user_form.find('input[name="firstname"]').val($tr.find('td.firstname').text());
    $add_user_form.find('input[name="lastname"]').val($tr.find('td.lastname').text());
    $add_user_form.find('input[name="userid"]').val($tr.attr('data-user_id'));
    $add_user_form.find('select[name="user_groups"]').children('option[value="' + group_id + '"]').attr('selected', 'selected');

    $.each(brands, function(index, value) {
      $add_user_form.find('select[name="user_brands"]').children('option[value="' + value + '"]').attr('selected', 'selected');
    });
    $add_user_form.find('.password-block').addClass('hide');
    $add_user_modal.find('.modal-title').text('Update User');
    $add_user_modal.modal('show');
  });
  $add_user_modal.on('shown.bs.modal', function() {
    $add_user_modal.find(".insert-status").addClass('hide');
  });

  $('#add-user').click(function() {
    $add_user_form.find('input').val('');
    $add_user_form.find('select[name="user_groups"]').children('option[value=""]').attr('selected', 'selected');
    $add_user_form.find('select[name="user_brands"]').children('option:selected').removeAttr('selected');
    $add_user_form.find('.password-block').removeClass('hide');
    $add_user_modal.find('.modal-title').text('Add New User');
  });


  //$('#alert_conf').find('input.tag').tagedit();
  //var sampleTags = ['c++', 'java', 'php', 'coldfusion', 'javascript', 'asp', 'ruby', 'python', 'c', 'scala', 'groovy', 'haskell', 'perl', 'erlang', 'apl', 'cobol', 'go', 'lua'];
  $(".tag").tagit();





  $('.pageheader').fadeIn(750).css({
    display: 'block'
  });

  $('.content').fadeIn(750).css({
    display: 'block'
  });
});

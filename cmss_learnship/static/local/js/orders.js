$(document).ready(function() {
  $("[name='fifo-switch']").bootstrapSwitch();
  $("[name='fifo-switch']").on('switchChange.bootstrapSwitch', function(event, state) {
    var state = state;
    $.ajax({url: '/switches?fifo_switch=' + state,
        'success': function(response) {
      if(state == true) {
          $("[name='fifo-switch']").attr("checked", true);
      }
      else {
          $("[name='fifo-switch']").attr("checked", false);
      }
    }});
  });
$("[name='batch-process']").bootstrapSwitch();
  $("[name='batch-process']").on('switchChange.bootstrapSwitch', function(event, state) {
    var state = state;
    $.ajax({url: '/switches?batch_switch=' + state,
        'success': function(response) {
      if(state == true) {
          $("[name='batch-process']").attr("checked", true);
          $("#sortingTable").addClass('display-none');
	  $("#batch-table").removeClass('display-none');
	  $("#sortingTable_wrapper").hide();
	  $("#batch-table_wrapper").show();
      }
      else {
          $("[name='batch-process']").attr("checked", false);
	  $("#batch-table").addClass('display-none');
          $("#sortingTable").removeClass('display-none');
	  $("#sortingTable_wrapper").show();
	  $("#batch-table_wrapper").hide();
      }
    }});
  });


});

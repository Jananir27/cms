$(document).ready(function() {
    function presend(jx){
            $('.content').load(jx);
        }
        function presend_blog() {
            var title=$('#title').val();
            var content = $('#content').val();
            $.ajax({
                url: '/save/',
                data: {'title':title, 'content':content},
                method:"POST",
                'success': function(response) {
                    alert(response, 'danger', 'bottom', 'center', 'animated bounceInUp', 'animated bounceOutUp');
                },
                 'error': function (xhr, error, thrown) {
                     alert('Error Occured');
                 }
            });

        }

});
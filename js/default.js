/* helpers */
var dreamToDelete;
var captionLength = 0;
var caption = "";
var sleepingPeriods = new Array();

function testTypingEffect() {
    caption = "dreamlog";
    type();
}

function type() {
    $('.caption').html(caption.substr(0, captionLength++));
    if (captionLength < caption.length + 1) {
        setTimeout("type()", 50);
    }
    else {
        captionLength = 0;
        caption = "";
    }
}

function cursorAnimation() {
    $(".cursor").animate({
        opacity: 0
    }, "fast", "swing", function () {
        $(".cursor").animate({
            opacity: 1
        }, "fast", "swing", function () {
            $(".cursor").animate({
                opacity: 0
            }, "fast", "swing", function () {
                $(".cursor").animate({
                    opacity: 1
                }, "fast", "swing")
            })
        })
    });
}

$(function () {

    /* on all pages */
    //typewriter
    setTimeout("cursorAnimation()", 600);
    testTypingEffect();



    /* reset password */
    $('.step2').hide();
    $('.step3').hide();
    $('.step1 .btn').on('click', function () {
        $('.step1').hide();
        $('.step2').show();
    });
    $('.step2 .btn').on('click', function () {
        $('.step1').hide();
        $('.step2').hide();
        $('.step3').show();
    });



    /* home */
    //datepicker
    $('.datepicker').datepicker({
        dateFormat: "DD, d MM, yy",
        prevText: "&laquo;",
        nextText: "&raquo;",
        onSelect: function (date) {
            $("h1").html(date);
        },
        altField: "#alternate",
        altFormat: "DD, d MM, yy",
        firstDay: 1
    });
    $("h1").html($("#alternate").val());



    //prepare sleeping period
    $('.timepicker').timepicker();
    $('.action-new-sleep').on('click', function () {
        //todo: refactor bed/wake time selection
    });



    //add dream
    $('.empty').hide();
    $('.action-add').on('click', function () {
        //hide and disable previous dream
        $('.dream:first .form-group').hide();
        $('.dream:first').find('.form-group:nth-child(1)').show();
        $('.dream:first').find('.form-group:nth-child(2)').show();
        $('.dream:first').find('.form-group:nth-child(3)').show();
        $('.dream:first .form-control').attr('disabled', true);
        $('.dream:first label').addClass('text-muted');
        //close the dummy mockup
        $('.empty').clone(true).insertAfter('.dream:last').removeClass('empty').fadeIn(function () {
            $(".autocomplete-dreams", this).chosen();
            $(".autocomplete-symbols", this).chosen({ addNewElementCallback: addTagCallback, no_results_text: "Create new symbol" });
            $('.timepicker', this).timepicker();
        });
        //copy the sleep period to the next dream as default
        var sleepperiod = $('.dream:first').find('.timepicker').eq(0).val() + " - "
            + $(this).parent().find('.timepicker').eq(1).val();
        sleepingPeriods[sleepingPeriods.length] = sleepperiod;
        $.each(sleepingPeriods, function (key, value) {
            $('.sleeping-periods')
                .append($("<option></option>")
                .attr("value", key)
                .text(value));
        });
    });

    //delete dream
    $('.action-delete').on('click', function () {
        dreamToDelete = $(this).parents('.dream');
        if (dreamToDelete.find('input[type="text"]:nth-child(1)').val() == "") {
            $('.dream-to-delete').html("this dream");
        } else {
            $('.dream-to-delete').html(dreamToDelete.find('input[type="text"]:nth-child(1)').val());
        }
    });
    $('#confirmation .btn-primary').on('click', function () {
        dreamToDelete.fadeOut(400, function () {
            dreamToDelete.remove();
        });
    });

    //dummy save to database
    $('.loader').hide();
    $('.form-control').on('blur', function () {
        $('.loader').show(0, function () {
            $(this).fadeOut(2000);
        });
        //localStorage.setItem('contenteditable', this.innerHTML);
        //
        //http://www.json.org/js.html
        //var testObject = { 'one': 1, 'two': 2, 'three': 3 };
        //// Put the object into storage
        //localStorage.setItem('testObject', JSON.stringify(testObject));
        //// Retrieve the object from storage
        //var retrievedObject = localStorage.getItem('testObject');
        //console.log('retrievedObject: ', JSON.parse(retrievedObject));
    });

    //autocomplete
    var addTagCallback = function (tagText, selector) {
        $('.autocomplete-symbols').append($('<option></option>').val(tagText).html(tagText));
        $("option:last", selector.form_field).attr('selected', 'selected');
        $('.autocomplete-symbols').trigger("liszt:updated");
    };
    $(".dream:first .autocomplete-dreams").chosen();
    $(".dream:first .autocomplete-symbols").chosen({ addNewElementCallback: addTagCallback, no_results_text: "Create new symbol" });

});


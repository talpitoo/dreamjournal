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
    $('.js-new-sleep').on('click', function () {
        //todo: refactor bed/wake time selection
    });



    //add dream
    $('.empty').hide();
    $('.js-edit').hide();
    $('.action-add').on('click', function () {
        //hide and disable previous dream
        $('.dream:first').addClass('inactive');
        $('.dream:first .form-control').removeClass('col-sm-10').addClass('col-sm-12').attr('disabled', true);
        $('.dream:first .form-control').parent().removeClass('col-sm-10').addClass('col-sm-12')
        $('.js-edit', '.dream:first').show();
        //close the dummy mockup
        $('.empty').clone(true).insertAfter('.dream:last').removeClass('empty').fadeIn(function () {
            $(".js-autocomplete-dreams", this).chosen();
            $(".js-autocomplete-symbols", this).chosen({ addNewElementCallback: addTagCallback, no_results_text: "Create new symbol" });
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
    $('.js-delete').on('click', function () {
        dreamToDelete = $(this).parents('.dream');
        if (dreamToDelete.find('input[type="text"]:nth-child(1)').val() == "") {
            $('.js-dream-to-delete').html("this dream");
        } else {
            $('.js-dream-to-delete').html(dreamToDelete.find('input[type="text"]:nth-child(1)').val());
        }
    });
    $('#confirmation .btn-primary').on('click', function () {
        dreamToDelete.fadeOut(400, function () {
            dreamToDelete.remove();
        });
    });

    //toggle lucidity level
    $('.js-lucidity-level').hide();
    $('.js-type label').on('click', function () {
        //$(this).parents('.dream').find('.js-lucidity-level').hide();
        $(this).closest('fieldset').find('.js-lucidity-level').hide();
    });
    $('.js-lucid').on('click', function () {
        //$(this).parents('.dream').find('.js-lucidity-level').show();
        $(this).closest('fieldset').find('.js-lucidity-level').show();
    });

    //update dream summary icons
    $('.js-mood .btn').on('click', function () {
        var selectedMood = $(this).find('input').val();
        $(this).closest('.dream').find('.js-summary-mood').removeClass().addClass('js-summary-mood lucidicon lucidicon-' + selectedMood);
    });
    $('.js-recall .btn').on('click', function () {
        var selectedRecall = $(this).find('input').val();
        switch (selectedRecall) {
            case "blurry":
                selectedRecall = "batteryempty";
                break;
            case "na":
                selectedRecall = "batteryhalf";
                break;
            case "clear":
                selectedRecall = "batteryfull";
                break;
        }
        $(this).closest('.dream').find('.js-summary-recall').removeClass().addClass('js-summary-recall lucidicon lucidicon-' + selectedRecall);
    });
    $('.js-type .btn').on('click', function () {
        var selectedType = $(this).find('input').val();
        switch (selectedType) {
            case "regular":
                selectedType = "";
                break;
            case "lucid":
                selectedType = "lightning";
                break;
            case "obe":
                selectedType = "users";
                break;
            case "precognition":
                selectedType = "camera";
                break;
            case "falseawakening":
                selectedType = "alarm";
                break;
        }
        $(this).closest('.dream').find('.js-summary-type').removeClass().addClass('js-summary-type lucidicon lucidicon-' + selectedType);
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
        $('.js-autocomplete-symbols').append($('<option></option>').val(tagText).html(tagText));
        $("option:last", selector.form_field).attr('selected', 'selected');
        $('.js-autocomplete-symbols').trigger("liszt:updated");
    };
    $(".dream:first .js-autocomplete-dreams").chosen();
    $(".dream:first .js-autocomplete-symbols").chosen({ addNewElementCallback: addTagCallback, no_results_text: "Create new symbol" });



    /* advanced search */
    $('.dates input[type="text"]').datepicker({
        prevText: "&laquo;",
        nextText: "&raquo;"
    });
    $(".js-search .js-autocomplete-symbols").chosen();
    $(".js-search-results").hide();
    $(".js-advanced-search").on('click', function () {
        $(".js-search-results").show();
    });



    /* symbol editor */
    $('.js-symbol-editor .details').hide();
    $('table a').on('click', function () {
        $('.js-symbol-editor .overview').hide();
        $('.js-symbol-editor .details').show();
    });

});


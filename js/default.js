var dreamToDelete;
var captionLength = 0;
var caption = "";
var sleepingPeriods = new Array();

/* helpers */
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

    /* generic */
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



    //add dream
    $('.empty').hide();
    $('.action-add').on('click', function () {
        $('.empty').clone(true).insertAfter('.dream:last').removeClass('empty').fadeIn(function () {
            //$("#autocompleteRelatedDreams").chosen();
            $(".autocomplete").chosen();
            //$("#autocompleteRelatedDreams2").chosen();
            //$("#autocompleteSymbols").chosen({ addNewElementCallback: addTagCallback, addNewElementCallbackSelector: '#autocompleteSymbols', no_results_text: "Create new symbol" });
            //$("#autocompleteSymbols2").chosen({ addNewElementCallback: addTagCallback, addNewElementCallbackSelector: '#autocompleteSymbols2', no_results_text: "Create new symbol" });
        });
    });

    //delete dream
    $('.action-delete').on('click', function () {
        dreamToDelete = $(this).parents('.dream');
        if (dreamToDelete.children('h2').html() == "") {
            $('.dream-to-delete').html("this dream");
        } else {
            $('.dream-to-delete').html(dreamToDelete.children('h2').html());
        }
    });
    $('#confirmation .btn-primary').on('click', function () {
        dreamToDelete.fadeOut(400, function () {
            dreamToDelete.remove();
        });
    });

    //contenteditable
    $('.loader').hide();
    $('[contenteditable]').on('blur', function () {
        $('.loader').show(0, function () {
            $(this).fadeOut(2000);
        });
        //localStorage.setItem('contenteditable', this.innerHTML);
    });

    //dream details
    $('.switch .dropdown-menu li a').on('click', function () {
        if ($(this).parents('.btn-group').children('.dropdown-toggle').hasClass('mood')) {
            $(this).parents('.btn-group').children('.dropdown-toggle').html($(this).html());
        } else {
            var innertext = $(this).parents('.btn-group').children('.dropdown-toggle').text();
            var labelstring = innertext.split(" ");
            label = labelstring[0].replace(":", "");
            $(this).parents('.btn-group').children('.dropdown-toggle').html(label + ': ' + $(this).html());
        }
    });
    $('.starred').on('click', function () {
        if ($(this).children('.glyphicon').hasClass('glyphicon-star-empty')) {
            $(this).children('.glyphicon').removeClass('glyphicon-star-empty').addClass('glyphicon-star');
        } else {
            $(this).children('.glyphicon').removeClass('glyphicon-star').addClass('glyphicon-star-empty');
        }
    });
    $('.sleep .action-done').on('click', function () {
        var sleepperiod = $(this).parent().find('select').eq(0).val() + ":"
            + $(this).parent().find('select').eq(1).val() + " - "
            + $(this).parent().find('select').eq(2).val() + ":"
            + $(this).parent().find('select').eq(3).val();
        sleepingPeriods[sleepingPeriods.length] = sleepperiod;
        $(this).parents('.btn-group').children('.dropdown-toggle.action-sleep').html(sleepperiod);
        $(this).parents('.btn-group').removeClass('open');
        $('.sleeping-periods').prepend("<li><a href='javascript:'>" + sleepingPeriods[0] + "</a></li>");
        $('.dropdown-toggle.action-sleep').html(sleepingPeriods[0]);
    });

    //autocomplete
    var addTagCallback = function(tagText, selector) {
        var newElement = null;

        /* server check version
        $.ajax({
            url: that.actionUrl,
            async: false,
            dataType: "json",
            data: { // ....},
                success: function (response) {
                    if (response) {
                        $('#tagSelection').append(
                            $('<option></option>')
                                  .val(data.Item.Id)
                                  .html(data.Item.Value)
                                  .attr("selected", "selected"));
                        $("#tagSelection").trigger("liszt:updated");
                        // Get the element - will necessarily be the last element - so the following selector will work
                        newElement = $("#tagSelection_chzn li#tagSelection_chzn_o_" + ($("#tagSelection option").length - 1));
                    } else {
                        // Handle Error
                    }
                }
            }
        });
        */

        /* direct select version */
        $(selector).append($('<option></option>').val(tagText).html(tagText).attr("selected", "selected"));
        $(selector).trigger("liszt:updated");
        //newElement = $(selector + "_chzn li" + selector + "_chzn_o_" + ($(selector + " option").length - 1));
        //return newElement;
    };
    //$("#autocompleteRelatedDreams").chosen();
    //$("#autocompleteRelatedDreams2").chosen();
    //$("#autocompleteSymbols").chosen({ addNewElementCallback: addTagCallback, addNewElementCallbackSelector: '#autocompleteSymbols', no_results_text: "Create new symbol" });
    //$("#autocompleteSymbols2").chosen({ addNewElementCallback: addTagCallback, addNewElementCallbackSelector: '#autocompleteSymbols2', no_results_text: "Create new symbol" });
    $(".autocomplete").chosen();

    //timepickers
    $('.dropdown-menu .custom').click(function (e) {
        e.stopPropagation();
    });

});

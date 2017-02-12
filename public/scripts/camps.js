/**
 * GLOBALS
 */
$(document).ajaxStart(function() {
    $('#ajax_indicator').removeClass('done').removeClass('hide').fadeIn('fast');
});
$(document).ajaxComplete(function() {
    $('#ajax_indicator').addClass('done').fadeOut('slow');
});
$(function() {
    // tooltips
    $('[data-toggle="tooltip"]').tooltip()
});

/**
 * Scroll to top - footer button
 */
$('#scroll_top').click(function() {
    $("html, body").stop().animate({
        scrollTop: 0
    }, '250', 'swing');
});
/**
 * evalute & validate camp name (English) must be > 3 letters
 * listen to change with timer, to prevent redundant http requests
 */
var interval = 800,
    typingTimer,
    $input = $(".camps.camp_index input[name='camp_name_en']");

$input.keyup(function() {
    clearTimeout(typingTimer);
    typingTimer = setTimeout(doneTyping, interval);
});

$input.keydown(function() {
    clearTimeout(typingTimer);
});

function doneTyping() {
    var val = $input.val(),
        lang = $('body').attr('lang'),
        status = $(".choose_name span.indicator span.glyphicon"),
        input = $input,
        btn = $('#check_camp_name');
    if (val.length > 3) {
        var data = $.get('../camps/' + val);
        data.done(function() {
            if (data.status === 204) {
                input.removeClass('error');
                status.removeClass('glyphicon-remove').addClass('glyphicon-ok');
                btn.removeClass('hidden').attr('href', '/' + lang + '/camps/new?c=' + val);
            } else {
                input.addClass('error');
                status.removeClass('glyphicon-ok').addClass('glyphicon-remove');
                btn.addClass('hidden').removeAttr('href');
            }
        });
    } else {
        btn.addClass('hidden').removeAttr('href');
        status.removeClass('glyphicon-ok')
    }
}

/**
 * getting user list from API
 */
var fetchedUsersOnce = false;

function fetchUsersOnce(elm) {
    if (!elm.attr('fetched')) {
        $.getJSON('/users', function(data) {
            users = data.users;
            for (var i = 0; i < users.length; i++) {
                elm.append(template(users[i]));
            }
        });

        function template(data) {
            return "<option value='" + data.user_id + "'>" + data.fullName + "</option>"
        }
        elm.attr('fetched', true);
    }
}
$(function() {
    var $inputs = '#edit_camp_contact_person_id, #create_camp_contact_person_id';
    if ($('.camps').is('.camp_edit') || $('.camps').is('.camp_create')) {
        fetchUsersOnce($($inputs));
    }
});
/**
 * getting camp list from API
 */
var fetchedCampsOnce = false,
    $stats_table = $('.camps.stats .table');

function fetchCampsOnce() {
    if (!fetchedCampsOnce) {
        var data,
            tbody = $stats_table.find('tbody');
        tbody.html('');
        $.get('/camps', function(data) {
            camps = data.camps;
            for (var i = 0; i < camps.length; i++) {
                tbody.append(template(camps[i]));
            }
            data = camps;
        });

        function template(data) {
            var last_update = new Date(data.updated_at).toDateString(),
                created_at = new Date(data.created_at).toDateString(),
                enabled = data.enabled
                    ? 'Yes'
                    : 'No';
            return "<tr><td>" + data.id + "</td><td><a href='camps/" + data.id + "'>" + data.camp_name_en + "</a></td><td>" + data.contact_person + "</td><td>" + data.status + "</td><td class='hidden-xs'>" + last_update + "</td><td class='hidden-xs'>" + created_at + "</td><td class=''>" + enabled + "</td><td class=''><a href='" + data.facebook_page_url + "' target='_blank'><i class='fa fa-facebook-official'></i></a></td><td><a href='camps/" + data.id + "/edit'><span class='glyphicon glyphicon-pencil'></span><span class='sr-only' aria-hidden='true'>Edit Camp</span></a></td><td><a onclick='_removeCamp(" + data.id + ")'><span class='glyphicon glyphicon-trash'></span><span class='sr-only' aria-hidden='true'>Remove Camp</span></a></td></tr>";
        }
        fetchedCampsOnce = true;
    }
}
function _removeCamp(camp_id) {
    var agree_remove = confirm('Remove camp\n\n\nThis action will remove camp #' + camp_id + '.\n\n\n---\n Are you sure?');
    if (agree_remove) {
        $.get("camps/" + camp_id + "/remove", function(res) {
            window.location.reload();
        });
    }
}
$stats_table.load(fetchCampsOnce());

// Search camp
$('#camps_stats_search_camp').keyup(function(input) {
    $('.camps.stats table').find('tr:not(.headers)').hide();
    var camp_name_en = input.target.value;
    $('.camps.stats table').find('td:contains("' + camp_name_en + '")').parent().show();

});
// TODO: fix inner height for dynamic width size changing
function innerHeightChange() {
    var card_height = $('.cards--wrapper .card').not('.card-hide').outerHeight();
    $('.camps .cards--wrapper').css({
        'min-height': card_height + 'px'
    });
}
$(function() {
    innerHeightChange();
});

function closeCards(currentButton) {
    $('.card').addClass('card-hide');
}

// Camp details card transition
$('.card-switcher--card2').click(function() {
    // show card-2 ; hide card-1
    $('.card-second').removeClass('card-hide');
    $('.card-first').addClass('card-hide');
    $('.card-switcher--card1').removeClass('Btn__default');
    $('.card-switcher--card1').addClass('Btn__transparent');
    $('.card-switcher--card2').removeClass('Btn__transparent');
    $('.card-switcher--card2').addClass('Btn__default');
    innerHeightChange();
});
$('.card-switcher--card1').click(function() {
    // show card-1 ; hide card-2
    $('.card-second').addClass('card-hide');
    $('.card-first').removeClass('card-hide');
    $('.card-switcher--card1').removeClass('Btn__transparent');
    $('.card-switcher--card2').removeClass('Btn__default');
    $('.card-switcher--card2').addClass('Btn__transparent');
    $('.card-switcher--card1').addClass('Btn__default');
    innerHeightChange();
});
$('.reveal_create_camp_btn').click(function() {
    if (!($('.choose_name').hasClass('card-hide'))) {
        $('.choose_name').toggleClass('card-hide');
        return;
    } else {
        closeCards();
        $('.choose_name').removeClass('card-hide');
    }
    innerHeightChange();
});
$('.reveal_join_camp_btn').click(function() {
    if (!($('.card-second').hasClass('card-hide'))) {
        $('.card-second').toggleClass('card-hide');
        return;
    } else {
        closeCards();
        $('.card-second').removeClass('card-hide');
    }
    innerHeightChange();
});
$('.reveal_manage_camp_btn').click(function() {
    if (!($('.card-third').hasClass('card-hide'))) {
        $('.card-third').toggleClass('card-hide');
        return;
    } else {
        closeCards();
        $('.card-third').removeClass('card-hide');
    }
    innerHeightChange();
});
$('.card--close').click(function() {
    closeCards();
});
/**
 * Component: Join a camp
 */
var fetchOpenCampsOnce = false;

function fetchOpenCamps(elm) {
    if (!fetchOpenCampsOnce) {
        $.ajax({
            url: '/camps_open',
            type: 'GET',
            success: function(data) {
                camps = [data.camps];
                for (var i = 0; i < camps.length; i++) {
                    $('<option>').appendTo(elm).attr('camp_id', camps[i].id).text(camps[i].camp_name_en);
                }
            },
            error: function(data) {
                alert('woops! no camps found.');
            }
        });
        fetchOpenCampsOnce = true;
    }
}
$('.camp_index .join_camp select[name="camp_name_en"]').focus(function() {
    fetchOpenCamps($(this));
});
/**
 * Component: View camp details
 */
function _fetchCampContactPersonDetails() {
    $.get('/camps_contact_person/' + contact_person_id, function(res) {
        $('span.contact_person_name').text(res.user.name);
        $('span.contact_person_phone').text(res.user.phone);
        $('span.contact_person_email').text(res.user.email);
    });
}
if ($('.camps').hasClass('camp_details')) {
    var contact_person_id = $('.contact-person').attr('data-camp-contact-person-id');
    if (contact_person_id !== "null") {
        _fetchCampContactPersonDetails();
    }
}
/**
 * Component: Editing camp
 * (PUT) /camps/:camp_id/edit
 */
$('#camp_edit_save').click(function() {
    var camp_id = $('#camp_edit_camp_id').val(),
        camp_data = {
            camp_name_he: $('#edit_camp_name_he').val(),
            camp_name_en: $('#edit_camp_name_en').val(),
            camp_desc_he: $('#edit_camp_desc_he').val(),
            camp_desc_en: $('#edit_camp_desc_en').val(),
            contact_person_id: $('#edit_camp_contact_person_id option:selected').attr('value') || $('label[for="edit_camp_contact_person_id"]').attr('data-camp-contact-person-id'),
            facebook_page_url: $('#edit_camp_facebook_page_url').val(),
            main_contact: $('#edit_camp_main_contact option:selected').val(),
            moop_contact: $('#edit_camp_moop_contact option:selected').val(),
            safety_contact: $('#edit_camp_safety_contact option:selected').val(),
            status: $('#edit_camp_status option:selected').attr('value') || $('label[for="edit_camp_status"]').attr('data-camp-status'),
            type: $('#edit_camp_type option:selected').attr('value') || $('label[for="edit_camp_type"]').attr('data-camp-type'),
            enabled: $('#edit_camp_enabled option:selected').val(),
            noise_level: $('#edit_camp_noise_level option:selected').val(),
            camp_activity_time: $('#edit_camp_activity_time option:selected').text(),
            child_friendly: $('#edit_camp_child_friendly:checked').length,
            noise_level: $('#edit_camp_noise_level option:selected').val(),
            public_activity_area_sqm: $('#edit_camp_public_activity_area_sqm').val(),
            public_activity_area_desc: $('#edit_camp_public_area_desc').val(),
            support_art: $('#edit_support_art:checked').length,
            location_comments: $('#edit_location_comments').val(),
            camp_location_street: $('#edit_camp_location_street').val(),
            camp_location_street_time: $('#edit_camp_location_street_time').val(),
            camp_location_area: $('#edit_camp_location_area').val(),
            accept_families: $('#edit_camp_accept_families:checked').length
        };
    $.ajax({
        url: '/camps/' + camp_id + '/edit',
        type: 'PUT',
        data: camp_data,
        success: function(result) {
            console.log(result);
        }
    });
});
$('#camp_edit_publish').click(function() {
    var camp_id = $('#camp_edit_camp_id').val();
    $.ajax({
        url: '/camps/' + camp_id + '/publish',
        type: 'PUT',
        success: function(result) {
            console.log(result);
        }
    });
});
$('#camp_edit_unpublish').click(function() {
    var camp_name = $('#meta__camp_name_en').attr('value'),
        agree_unpublish = confirm('Un-publish camp\n\n\nThis action will remove ' + camp_name + ' from the public camps list.\n\n\n---\n Are you sure?');
    if (agree_unpublish) {
        var camp_id = $('#camp_edit_camp_id').val();
        $.ajax({
            url: '/camps/' + camp_id + '/unpublish',
            type: 'PUT',
            success: function(result) {
                console.log(result);
            }
        });
    }
});

/**
 * Component: Create new camp with approval modal
 */
$('#camp_create_save').click(function() {
    var camp_data = {
        camp_name_he: $('#create_camp_name_he').val() || 'camp' + (+ new Date()),
        camp_name_en: $('#create_camp_name_en').val(),
        camp_desc_he: $('#create_camp_desc_he').val(),
        camp_desc_en: $('#create_camp_desc_en').val(),
        contact_person_id: $('#create_camp_contact_person_id option:selected').val(),
        facebook_page_url: $('#create_camp_facebook_page_url').val(),
        main_contact: $('#create_camp_main_contact option:selected').val(),
        moop_contact: $('#create_camp_moop_contact option:selected').val(),
        safety_contact: $('#create_camp_safety_contact option:selected').val(),
        type: $('#create_camp_type option:selected').val(),
        camp_activity_time: $('#create_camp_activity_time option:selected').val(),
        child_friendly: $('#create_camp_child_friendly:checked').length,
        noise_level: $('#create_camp_noise_level option:selected').val(),
        public_activity_area_sqm: $('#create_camp_public_activity_area_sqm').val(),
        public_activity_area_desc: $('#create_camp_public_area_desc').val(),
        support_art: $('#create_support_art:checked').length,
        location_comments: $('#create_location_comments').val(),
        camp_location_street: $('#create_camp_location_street').val(),
        camp_location_street_time: $('#create_camp_location_street_time').val(),
        camp_location_area: $('#create_camp_location_area').val()
    };
    // show modal & present details in modal
    $('#create_camp_request_modal').modal('show');
    $('.camp_details').html(_campDataAsAList());
    // approve create camp
    $('#camp_create_save_modal_request').click(function() {
        _sendRequest();
    });
    function _campDataAsAList() {
        var _list = '';
        $.each(camp_data, function(label, data) {
            _list += '<li>' + label + ': <b>' + data + '</b></li>';
        })
        return $('<ul>').html(_list);
    }
    function _sendRequest() {
        $.ajax({
            url: '/camps/new',
            type: 'POST',
            data: camp_data,
            success: function(result) {
                var camp_id = result.data.camp_id;
                $('#create_camp_request_modal').find('.modal-body').html('<h4>Camp created succesfully. <br><span class="Btn Btn__sm Btn__inline">you can edit it: <a href="' + [window.location.origin, $('body').attr('lang')].join('/') + '/camps/' + camp_id + '/edit">here</a><span></h4>');
                $('#create_camp_request_modal').find('#camp_create_save_modal_request').hide();
                // 10 sec countdown to close modal
                var sec = 10;
                setInterval(function() {
                    $('#create_camp_request_modal').find('#create_camp_close_btn').text('Close ' + sec);
                    sec -= 1;
                }, 1000);
                setTimeout(function() {
                    $('#create_camp_request_modal').modal('hide');
                }, sec * 1000);
            }
        });
    }
});
/**
 * Component: join a camp
 */
$('#join_camp_request_join_btn').click(function() {
    var join_camp_id = $('.join_camp select[name="camp_name_en"] option:selected').attr('camp_id'),
        join_camp_name_en = $('.join_camp select[name="camp_name_en"] option:selected').val(),
        user_id = $('#join_camp_request_join_user_id').val();
    if (join_camp_name_en !== undefined) {
        $.get('/camps/join/' + join_camp_id + '/' + user_id, (res) => {
            fetchSuccess(res);
        })
    } else {
        alert('Choose a camp to request a join.')
    }

    function fetchSuccess(res) {
        // Run modal with user details to approve request
        var template = '<ul><li>Camp Name: <u>' + join_camp_name_en + '</u></li><li>Full Name: <u>' + [res.first_name, res.last_name].join(', ') + '</u></li><li> Email: <u>' + res.email + '</u></li></ul>';
        $('#join_camp_request_modal .user_details').html(template);
        $('#join_camp_request_modal').modal('show');
    }

    // Send request
    // allow user 4 second to cancel
    $('#join_camp_send_request_btn').click(function() {
        var request_data = {},
            _sendRequestBtn = $(this);
        $('#join_camp_close_btn').text('Cancel').click(function(e) {
            e.preventDefault();
            clearTimeout(_srt);
            $(this).text('Close');
            _sendRequestBtn.removeClass('Btn__is-loading').text('Send Request');
        });
        _sendRequestBtn.addClass('Btn__is-loading').text('Sending');

        function _sendRequest() {
            $.ajax({
                url: '/camps/join/request',
                type: 'POST',
                data: request_data,
                success: function() {
                    $('#join_camp_request_modal > div').html('<h4>Your request have sent. We will contact you soon.</h4>');
                    setTimeout(function() {
                        $('#join_camp_request_modal').modal('hide');
                    }, 4000);
                }
            });
        }
        var _srt = setTimeout(function() {
            _sendRequest();
        }, 4000);
    });
    /**
     * Component: camp members
     */

    // TODO

    /**
      * Component: camp document & forms
      */

    // TODO

    /**
     * Component: create camp program
     */

    // TODO
})

function onOptionChange() {
    /*
       When the select box is changed the form needs to
       be updated with the employees data, so we grab the
       value and make an ajax request to the database to
       pull the data

       Returns undefined and takes no parameters
    */
    "use strict";

    var user_id = $("#user_select").val();
    if (user_id === 'null') {
        clearForm()
        return false;
    }

    $.ajaxSetup({type: 'POST'});

    $.ajax({
        url: '/ajax/',
        dataType: "json",
        data: {
            'user_id': user_id,
            'form_type': 'get_user_data'
        },

        success: function (data) {
            if (data.success === true) {
                $("#id_breaklength").timepicker("destroy");
                $("#id_shiftlength").timepicker("destroy");

                setupUI();

                $("#id_user_id").val(data.username);
                $("#id_firstname").val(data.firstname);
                $("#id_lastname").val(data.lastname);
                $("#id_user_type").val(data.user_type);
                $("#id_market").val(data.market);
                $("#id_process").val(data.process);
                $("#id_start_date").val(data.start_date);
                $("#id_breaklength").val(data.breaklength);
                $("#id_shiftlength").val(data.shiftlength);
                $("#id_job_code").val(data.job_code);
                $("#id_holiday_balance").val(data.holiday_balance);

            } else {
                alert(data.error);
            }
        }
    });
    return true;
}

function clearForm() {

    /*
       Clears the entire form

       Takes no parameters and gives no fucks
    */

    "use strict";

    $("#user-edit-form")
        .find(":input")
        .not(":button")
        .each( function () {
            $(this).val('');
        }
    );
    return true;
}

function deleteEntry() {

    /*
       Asynchrously deletes an entry

       Takes no parameters and returns undefined
    */

    var user_id = $("#user_select").val();
    if (user_id === 'null') {
        return false;
    }

    if (!confirm("Are you sure?")) {
        return false;
    }

    $.ajaxSetup({
        type: "POST",
        dataType: "json"
    });

    $.ajax({
        url: '/ajax/',
        data: {
            'user_id': user_id,
            'form_type': 'delete_user'
        },
        success: function(data) {
            if (data.success === true) {
                $("#edit-user-wrapper").load(
                    "/user_edit/ #edit-user-table",
                    function () {
                        ajaxSuccess();
                    }
                );
            } else {
                alert(data.error);
            }
        }
    });
    return true;
}


function addChangeEntry(entryType) {

    /*
       Asynchronously adds a user

       Takes no parameters and returns true/false for success
    */

    if ( !validateDate("#id_start_date") ) {
        alert("validation fail");
        return false;
    }

    if (!confirm("Are you sure?")) {
        return false;
    }

    $.ajaxSetup({
        type: "POST",
        dataType: "json"
    });

    var data = [
        'user_id',
        'firstname',
        'lastname',
        'user_type',
        'market',
        'process',
        'start_date',
        'breaklength',
        'shiftlength',
        'job_code',
        'holiday_balance'
    ]

    /*
       here we run an anon function against
       the passed in variable, if it's the
       string add, we are creating a new
       entry in the db.

       Else we are changing an entry so
       we take the current option box and
       change that entry server-side
    */
       var form_data = {
        'form_type': 'useredit',
        'mode': function() {
            if (entryType === 'add') {
                return false;
            } else {
                return $("#user_select").val();
            }
        }()
    };

    var index = 0;
    // loop through the wrapped set which is the same,
    // size as the data array, that way we can get the
    // vals easy
    $("#user-edit-form").find(":input").not(":button").each(
        function () {
            form_data[data[index]] = $(this).val();
            index++
        }
    );

    $.ajax({
        url: '/ajax/',
        data: form_data,
        success: function (data) {
            if (data.success === true) {
                $("#edit-user-wrapper")
                    .load("/user_edit/ #edit-user-table",
                          function() {
                              $("#user_select").change(function() {
                                  onOptionChange();
                              });
                              ajaxSuccess();
                          });
            } else {
                alert(data.error);
            }
        }
    });
    return true;
}

function setupUI() {
    "use strict";

    $("#id_start_date").datepicker().val('');
    $("#id_start_date").datepicker("option", "dateFormat", 'yy-mm-dd');
    $("#id_breaklength").timepicker({
        showHour: false,
        timeFormat: 'hh:mm:ss'
    });
    $("#id_shiftlength").timepicker({
        timeFormat: 'hh:mm:ss'
    });

    return true;
}

function ajaxSuccess() {

    /*
       Lazy method for ajaxSuccess
    */

    "use strict";

    setupUI();
    clearForm();
    $("#user_select").val("null");
    $("#user_select").change(function() {
        onOptionChange();
    });


    // The form is automatically generated from the
    // model, this means that it's got some fields
    // that we don't want to show. We remove the
    // password field and the label associated with it.
    $("#user-edit-form")
        .find("label")
        .each( function () {
            if ($(this).attr("for") === "id_password") {
                $(this).remove();
                $("#id_password").remove();
            }
        });

    if ( $("#is_team_leader").attr("value") ) {
        $("#id_job_code").hide();
    }
    return true;
}

$(function () {
    "use strict";
    ajaxSuccess();
});
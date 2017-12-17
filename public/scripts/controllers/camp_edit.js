var angular_getMembers = function ($http, $scope, camp_id) {
    if (camp_id === 'new') {
        $http.get('/users').then((res) => {
            $scope.members = [];
            $scope.approved_members = res.data.users;
        });
    } else {
        $http.get(`/camps/${camp_id}/members`).then((res) => {
            var members = res.data.members;
            var _members = [];
            var approved_members = [];
            var total_camp_tickets = 0;
            var total_in_event = 0;
            var preSaleTicketsCount=0;
            for (var i in members) {
                var newMember=members[i]
                //check if the user has a pre_sale ticket 
                //if so the set the checkbox to true 
                if (members[i].pre_sale_ticket) {
                    newMember.pre_sale_ticket_approved=members[i].pre_sale_ticket;
                    preSaleTicketsCount++;
                }
                else {
                    newMember.pre_sale_ticket_approved = false;
                }
                if (['approved', 'pending', 'pending_mgr', 'approved_mgr', 'rejected'].indexOf(newMember.member_status) > -1) {
                    _members.push(newMember);
                }
                if (['approved', 'approved_mgr'].indexOf(newMember.member_status) > -1) {
                    approved_members.push(newMember);
                }
                total_in_event += parseInt(newMember.inside_event);
                total_camp_tickets += parseInt(newMember.ticket_count) || 0;
            }
            $scope.preSaleTicketsCount = preSaleTicketsCount;
            $scope.members = _members;
            $scope.approved_members = approved_members;
            $scope.all_approved_members = approved_members.length;
            $scope.total_camp_tickets = total_camp_tickets;
            $scope.total_in_event = total_in_event;
        });
    }
}
var angular_updateUser = function ($http, $scope, action_type, user_rec) {
    var camp_id = user_rec.camp_id;
    var user_name = user_rec.user_name;
    var user_id = user_rec.user_id;
    var lang = $scope.lang;
    if (lang === undefined) {
        lang = 'he';
    }
    var tpl, action_tpl;

    if (lang === "he") {
        // debugger;
        action_tpl = {
            approve: 'לאשר את',
            delete: 'למחוק את',
            reject: 'לדחות את',
            approve_mgr: 'להפוך למנהל את',
            remove: 'להסיר את',
            pre_sale_ticket : 'לאשר כרטיס מוקדם',
        };
        tpl = {
            alert_title: "האם את/ה בטוח?",
            alert_text: "האם את/ה בטוח שתרצה " + action_tpl[action_type] + " משתמש " + user_name + "?",
            alert_success_1: action_type + "!",
            alert_success_2: "משתמש " + user_name + action_type,
            alert_success_3: " בהצלחה",
        };
    } else {
        action_tpl = {
            approve: 'Approve',
            delete: 'Delete',
            reject: 'Reject',
            approve_mgr: 'Set Manager',
            remove: 'Remove',
            pre_sale_ticket: 'Update Pre Sale Ticket',
        };
        tpl = {
            alert_title: "Are you sure?",
            alert_text: "Are you sure you would like to " + action_tpl[action_type] + " " + user_name + "?",
            alert_success_1: action_type + "!",
            alert_success_2: user_name + "has been " + action_type,
            alert_success_3: "success",
        };
    }

    sweetAlert({
        title: tpl.alert_title,
        text: tpl.alert_text,
        type: "warning",
        showCancelButton: true,
        confirmButtonColor: "#DD6B55",
        confirmButtonText: "Yes",
        closeOnConfirm: false
    },
        () => {
            var request_str = `/camps/${camp_id}/members/${user_id}/${action_type}`
            $http.get(request_str).then((res) => {
                sweetAlert(tpl.alert_success_1, tpl.alert_success_1, "success");
                $scope.getMembers(camp_id);
            }).catch((err) => {
                jsonError=err.data.data.message;
                sweetAlert("Error!", "Something went wrong, please try again later \n" + jsonError, "error");
            })
        });
}

app.controller("campEditController", ($scope, $http, $filter) => {
    var camp_id = document.querySelector('#meta__camp_id').value;
    var lang = $scope.lang;
    if (lang === undefined) {
        lang = 'he';
    }
    if (lang === "he") {
        $scope.status_options = [
            { id: 'open', value: 'מחנה פתוח למצטרפים חדשים' },
            { id: 'closed', value: 'סגור למצטרפים חדשים' }];
        $scope.noise_level_options = [
            { id: 'quiet', value: 'שקט' },
            { id: 'medium', value: 'בינוני' },
            { id: 'noisy', value: 'רועש' },
            { id: 'very noisy', value: 'מאוד רועש' }];
    } else {
        $scope.status_options = ['Opened to new member', 'Closed to new members'];
        $scope.status_options = [
            { id: 'open', value: 'Opened to new member' },
            { id: 'closed', value: 'Closed to new members' }];
        $scope.noise_level_options = [
            { id: 'quiet', value: 'Quiet' },
            { id: 'medium', value: 'Medium' },
            { id: 'noisy', value: 'Noisy' },
            { id: 'very noisy', value: 'Very Noisy' }];
    }

    $scope.getMembers = () => {
        angular_getMembers($http, $scope, camp_id);
        setTimeout(() => {
            innerHeightChange();
        }, 500)
    }
    $scope.changeOrderBy = (orderByValue) => {
        $scope.orderMembers = orderByValue;
    }
    if (typeof camp_id !== 'undefined') {
        $scope.current_camp_id = camp_id;
        $scope.getMembers();
    }
    $scope.lang = document.getElementById('meta__lang').value;
    // $scope.grouptype = document.getElementById('meta__grouptype').value;
    $scope.addMember = () => {
        var camp_id = $scope.current_camp_id;
        var new_user_email = $scope.camps_members_add_member
        var data = {
            user_email: new_user_email,
            camp_id: camp_id,
        }
        $http.post(`/camps/${camp_id}/members/add`, data).then(function (res) {
            // update table with new data
            $scope.getMembers();
            $scope.camps_members_add_member = '';
        }).catch((err) => {
            sweetAlert("Error!", "Add new member error: " + err.data.data.message, "error");
        });
    }
    $scope.updateUser = (user_name, user_id,action_type) => {
        var camp_id = $scope.current_camp_id;
        var user_rec = {
            camp_id: camp_id,
            user_name: user_name,
            user_id: user_id,
            addinfo_json : parsedJsonInfo,
        }
        angular_updateUser($http, $scope, action_type, user_rec);
    }

    //when the user wants to update a pre sale ticket
    //this method is executed
    $scope.updatePreSaleTicket = (user_name, user_id,action_type,pre_sale_ticket_approved) => {
        var camp_id = $scope.current_camp_id;
        var user_rec = {
            camp_id: camp_id,
            user_name: user_name,
            user_id: user_id,
        }
   
        angular_updateUser($http, $scope, action_type, user_rec);
    }
});

app.controller("homeController", ($scope, $http, $filter) => {
    $scope.angular_getMyGroups = function ($http, $scope) {
        $http.get(`/my_groups`).then((res) => {
            // debugger;
            $scope.groups = res.data.groups;
            $scope.stat = res.data.stats;
        });
    }
    $scope.angular_getMyGroups($http, $scope);
});

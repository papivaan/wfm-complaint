// complaintRoutes.js
'use strict';

const   Worker = require('camunda-worker-node'),
        Backoff = require('camunda-worker-node/lib/backoff'),
        rp = require('request-promise');

const   engineEndpoint = 'http://35.158.119.79:8080/engine-rest/';

const options = {
        uri : 'http://35.158.119.79:8080/engine-rest/user?memberOfGroup=taxback',
        json: true
    }

const assignUser = Worker(engineEndpoint, {
    workerId: 'assign-user',
    use: [
        Backoff
    ]
});

module.exports = function(app) {
    assignUser.subscribe('assign-user', async () => {
       var member = await getGroup();
       console.log(member);
       // member = await getGroup();
       return {
           variables: {
               assignee: member,
               status: 'inReview'
           }
       }
        // return selectUser().then((member) => {
        //     console.log(member);
        //     return {
        //         variables: {
        //             assignee: member
        //         }
        //     };
        // }).catch((e) => {
        //     return {
        //         variables: {
        //             assignee: 'virhe'
        //         }
        //     };
        // });
    });
};

async function getGroup() {
    var group = [];
    console.log('Fetching group...');
    return rp(options)
        .then(function (res) {
            var obj = res;
            for (var i in obj)
                group.push(obj[i].id);
                return selectUser(group);
        })
        .catch(function (err) {
            console.log(err);
        });
}

async function selectUser(group) {
    console.log('Selecting user from group: ' + group);
    
    var user = group[Math.floor(Math.random() * group.length)];
    console.log(user);

    return user;
}

// var group = [];
//         var obj =  JSON.parse(data);
//         for (var i in obj)
//             group.push(obj[i].id);
//             return selectUser(group);

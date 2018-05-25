// complaintRoutes.js
'use strict';
const Worker = require('camunda-worker-node'),
    Backoff = require('camunda-worker-node/lib/backoff'),
    Prompt = require('prompt');

const engineEndpoint = 'http://localhost:8080/engine-rest/';

const processComplaint = Worker(engineEndpoint, {
    workerId: 'process-complaint',
    use: [
        Backoff
    ]
});

module.exports = function(app) {

    processComplaint.subscribe('process-complaint', async () => {
        return {
            variables: {
            complaintAccepted: isAccepted(),
            }
        };
    });

};

function isAccepted() {
    var isAccept = false;

    //This is to mock the admin actions in the admin-page
    Prompt.start();

    console.log('You have a pending complaint. Do you want to accept Y/N?')

    Prompt.get(['accept'], function (err, result) {
        if(result.accept === 'y') {
            isAccept = true
            console.log('Complaint accepted')
        } else {
            console.log('Complaint NOT accepted')
        }
      });
    return isAccept;
}

    // app.post('/complaint', (req, res) => {
    //     var complaint = req.body;

    //     if (complaint.taxBack > 500) {
    //         complaint.complaintStatus = 'rejected'
    //         res.send(complaint)
    //     }

    //     complaint.complaintStatus = 'accepted'
    //     res.send(complaint)
    //   });
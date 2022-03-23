const {fetchService} = require("../models/services.models");
const {fetchAllMachines} = require("../models/machines.models");
const {fetchAllRevisions} = require("../models/revisions.models");

exports.getServiceService = async params => {
    const service = await fetchService(params.id).catch(err => {
        Promise.reject(err);
    });
    const machines = await fetchAllMachines({department_id: service.department.id}).catch(err => {
        Promise.reject(err);
    });
    const revisionsLookup = await fetchAllRevisions(service.id);
    machines.forEach(machine => {
        const {id} = machine;
        /* eslint no-param-reassign: ["error", { "props": false }] */
        machine.revisions = [];
        revisionsLookup.forEach(revision => {
            if (id === revision.machine_id) {
                machine.revisions.push(revision);
            }
        });
    });
    console.log(machines[0].revisions);
};

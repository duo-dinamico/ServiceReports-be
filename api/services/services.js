const {fetchService, updateService, addServiceService} = require("../models/services.models");
const {fetchAllMachines} = require("../models/machines.models");
const {fetchAllRevisions} = require("../models/revisions.models");

const getServiceService = async ({service_id}) => {
    const service = await fetchService(service_id);
    const machines = await fetchAllMachines({department_id: service.department.id});
    const revisionsLookup = await fetchAllRevisions(service.id);
    machines.forEach(machine => {
        const {id} = machine;
        /* eslint no-param-reassign: ["error", { "props": false }] */
        machine.revisions = [];
        delete machine.department;
        revisionsLookup.forEach(revision => {
            if (id === revision.machine_id) {
                machine.revisions.push(revision);
            }
        });
    });
    const {id, department, ...rest} = service;
    return {id, department, machines, ...rest};
};

const patchServiceService = async ({service_id}, body) => {
    await updateService(service_id, body);
    const service = await getServiceService({service_id});
    return service;
};

const postServiceService = async body => {
    const {id} = await addServiceService(body);
    const service = await getServiceService({service_id: id});
    return service;
};

module.exports = {getServiceService, patchServiceService, postServiceService};

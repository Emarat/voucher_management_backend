const convertRes = (rawCustomer) => {
    const customers = [];
    const customerMap = {};

    rawCustomer.forEach(obj => {
        const customerId = obj.customer_id;

        if (!customerMap[customerId]) {
            customerMap[customerId] = {
                customer_id: customerId,
                customer_name: obj.customer_name,
                customer_contact: obj.customer_contact,
                customer_address: obj.customer_address,
                customer_type: obj.customer_type,
                projects: []
            };

            customers.push(customerMap[customerId]);
        }

        customerMap[customerId].projects.push({
            project_name: obj.project_name,
            project_contact: obj.project_contact,
            project_id: obj.project_id
        });
    });

    return customers;
}

module.exports = convertRes;
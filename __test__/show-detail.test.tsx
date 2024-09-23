import '@testing-library/jest-dom';
import { describe, expect, test } from '@jest/globals';

type RequestPartiesDetailForm = {
    requestorType: string,
    shippingType: string,
    voyageNumber: string,
    vesselName: string,
    ladingBillNumber: string,
    ladingBillDate: string,
    ladingBillType: string,
    doExpired: string,
    paymentType: string,

    shipperName: string,
    consigneeName: string,
    consigneeNpwp: string,
    notifyPartyName: string,
    notifyPartyNpwp: string,
    placeOfLoading: string,
    portOfLoading: string,
    portOfDischarge: string,
    portOfDestination: string,
}

const updateRequiredNotificationData = (dataForm: RequestPartiesDetailForm) => {
    const listRequired = []
    listRequired.push(`Request Detail - Requestor Type - ${!!dataForm?.requestorType ? true : false}`);
    listRequired.push(`Request Detail - Shipping Line - ${!!dataForm?.shippingType ? true : false}`)
    listRequired.push(`Request Detail - Bill of Lading Number - ${!!dataForm?.ladingBillNumber ? true : false}`)
    listRequired.push(`Request Detail - Bill of Lading Date - ${!!dataForm?.ladingBillDate ? true : false}`)
    listRequired.push(`Request Detail - Bill of Lading Type - ${!!dataForm?.ladingBillType ? true : false}`)
    listRequired.push(`Request Detail - Request DO Expired - ${!!dataForm?.doExpired ? true : false}`);
    listRequired.push(`Request Detail - Payment Method - ${!!dataForm?.paymentType ? true : false}`)
    listRequired.push(`Request Detail - Vessel Name - ${!!dataForm?.vesselName ? true : false}`)
    listRequired.push(`Request Detail - Voyage Number - ${!!dataForm?.voyageNumber ? true : false}`)
    listRequired.push(`Parties Detail - Consignee Name - ${!!dataForm?.consigneeName ? true : false}`)
    listRequired.push(`Parties Detail - Consignee NPWP - ${!!dataForm?.consigneeNpwp ? true : false}`)
    listRequired.push(`Parties Detail - Notify Party Name - ${!!dataForm?.notifyPartyName ? true : false}`)
    listRequired.push(`Parties Detail - Notify Party NPWP - ${!!dataForm?.notifyPartyNpwp ? true : false}`)
    listRequired.push(`Parties Detail - Shipper Name - ${!!dataForm?.shipperName ? true : false}`)
    listRequired.push(`Parties Detail - Place of Loading - ${!!dataForm?.placeOfLoading ? true : false}`);
    listRequired.push(`Parties Detail - Port of Loading - ${!!dataForm?.portOfLoading ? true : false}`);
    listRequired.push(`Parties Detail - Port of Discharge - ${!!dataForm?.portOfDischarge ? true : false}`);
    listRequired.push(`Parties Detail - Port of Destination - ${!!dataForm?.portOfDestination ? true : false}`);
    const result = listRequired.filter((item) => item.includes(" - false"));
    return result;
}

const notificationResult1 = [
    'Request Detail - Requestor Type - false',
    'Request Detail - Shipping Line - false',
    'Request Detail - Bill of Lading Number - false',
    'Request Detail - Bill of Lading Date - false',
    'Request Detail - Bill of Lading Type - false',
    'Request Detail - Request DO Expired - false',
    'Request Detail - Payment Method - false',
    'Request Detail - Vessel Name - false',
    'Request Detail - Voyage Number - false'
]

const notificationData1: RequestPartiesDetailForm = {
    doExpired: "",
    paymentType: '',
    vesselName: "",
    voyageNumber: "",
    shippingType: "",
    ladingBillNumber: "",
    ladingBillDate: "",
    ladingBillType: "",
    requestorType: "",
    shipperName: "Shipper Nusantara",
    consigneeName: "Consignee 23532",
    consigneeNpwp: "1256789364578998",
    notifyPartyName: "Notify Party2",
    notifyPartyNpwp: "1894097890877889",
    placeOfLoading: "MY | Malaysia",
    portOfLoading: "MYKLP | Kuala Lumpur",
    portOfDischarge: "IDMRK | Merak",
    portOfDestination: "IDBLW | Belawan"
}

const notificationResult2 = [
    'Parties Detail - Consignee Name - false',
    'Parties Detail - Consignee NPWP - false',
    'Parties Detail - Notify Party Name - false',
    'Parties Detail - Notify Party NPWP - false',
    'Parties Detail - Shipper Name - false',
    'Parties Detail - Place of Loading - false',
    'Parties Detail - Port of Loading - false',
    'Parties Detail - Port of Discharge - false',
    'Parties Detail - Port of Destination - false',
]

const notificationData2 = {
    doExpired: "2024-09-09",
    paymentType: '2',
    vesselName: "vessel234",
    voyageNumber: "voyage8784",
    shippingType: "YML | Yang Ming Line",
    ladingBillNumber: "BL232873",
    ladingBillDate: "2024-01-09",
    ladingBillType: "3",
    requestorType: "1",
    shipperName: "",
    consigneeName: "",
    consigneeNpwp: "",
    notifyPartyName: "",
    notifyPartyNpwp: "",
    placeOfLoading: "",
    portOfLoading: "",
    portOfDischarge: "",
    portOfDestination: ""
}

// Case 1: Check for request detail data
test('Check show detail Request Detail Data - Successfully', () => {
    expect(updateRequiredNotificationData(notificationData1)).toEqual(notificationResult1)
})
// Case 2: Check for parties detail data
test('Check show detail Parties Detail Data - Successfully', () => {
    expect(updateRequiredNotificationData(notificationData2)).toEqual(notificationResult2)
})


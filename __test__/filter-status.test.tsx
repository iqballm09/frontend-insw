import { ListDo } from '@/models/ListDo';
import '@testing-library/jest-dom';
import {describe, expect, test} from '@jest/globals';

const sampleData: ListDo[] = [
  { id: 1, requestNumber: 'LNSW1234', requestTime: '2024-07-01T12:00:00Z', blNumber: 'BL12345', blDate: '2024-07-01', doExp: '2024-07-10', requestName: 'Request 1', transactionId: 'abcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890', shippingLine: 'YML', status: 'Submitted', isContainer: true },
  { id: 2, requestNumber: 'LNSW5678', requestTime: '2024-07-02T12:00:00Z', blNumber: 'BL67890', blDate: '2024-07-02', doExp: '2024-07-11', requestName: 'Request 2', transactionId: '1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef', shippingLine: 'EVG', status: 'Processed', isContainer: false },
  { id: 3, requestNumber: 'LNSW9012', requestTime: '2024-07-03T12:00:00Z', blNumber: 'BL90123', blDate: '2024-07-03', doExp: '2024-07-12', requestName: 'Request 3', transactionId: 'abcdefabcdefabcdefabcdefabcdefabcdefabcdefabcdefabcdefabcdefabcdefabcdef', shippingLine: 'MSC', status: 'Draft', isContainer: true },
  { id: 4, requestNumber: 'LNSW3456', requestTime: '2024-07-04T12:00:00Z', blNumber: 'BL34567', blDate: '2024-07-04', doExp: '2024-07-13', requestName: 'Request 4', transactionId: '1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef', shippingLine: 'HAPAG', status: 'Released', isContainer: false },
  { id: 5, requestNumber: 'LNSW7890', requestTime: '2024-07-05T12:00:00Z', blNumber: 'BL78901', blDate: '2024-07-05', doExp: '2024-07-14', requestName: 'Request 5', transactionId: 'abcdefabcdefabcdefabcdefabcdefabcdefabcdefabcdefabcdefabcdefabcdefabcdef', shippingLine: 'CMA', status: 'Rejected', isContainer: true },
  { id: 6, requestNumber: 'LNSW2345', requestTime: '2024-07-06T12:00:00Z', blNumber: 'BL23456', blDate: '2024-07-06', doExp: '2024-07-15', requestName: 'Request 6', transactionId: '1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef', shippingLine: 'ONE', status: 'Cancelled', isContainer: false },
  { id: 7, requestNumber: 'LNSW6789', requestTime: '2024-07-07T12:00:00Z', blNumber: 'BL67890', blDate: '2024-07-07', doExp: '2024-07-16', requestName: 'Request 7', transactionId: 'abcdefabcdefabcdefabcdefabcdefabcdefabcdefabcdefabcdefabcdefabcdefabcdef', shippingLine: 'YML', status: 'Draft', isContainer: true },
  { id: 8, requestNumber: 'LNSW0123', requestTime: '2024-07-08T12:00:00Z', blNumber: 'BL01234', blDate: '2024-07-08', doExp: '2024-07-17', requestName: 'Request 8', transactionId: '1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef', shippingLine: 'EVG', status: 'Processed', isContainer: false },
  { id: 9, requestNumber: 'LNSW4567', requestTime: '2024-07-09T12:00:00Z', blNumber: 'BL45678', blDate: '2024-07-09', doExp: '2024-07-18', requestName: 'Request 9', transactionId: 'abcdefabcdefabcdefabcdefabcdefabcdefabcdefabcdefabcdefabcdefabcdefabcdef', shippingLine: 'MSC', status: 'Submitted', isContainer: true },
  { id: 10, requestNumber: 'LNSW8901', requestTime: '2024-07-10T12:00:00Z', blNumber: 'BL89012', blDate: '2024-07-10', doExp: '2024-07-19', requestName: 'Request 10', transactionId: '1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef', shippingLine: 'HAPAG', status: 'Released', isContainer: false }
];

const submittedData: ListDo[] = [
  { id: 1, requestNumber: 'LNSW1234', requestTime: '2024-07-01T12:00:00Z', blNumber: 'BL12345', blDate: '2024-07-01', doExp: '2024-07-10', requestName: 'Request 1', transactionId: 'abcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890', shippingLine: 'YML', status: 'Submitted', isContainer: true },
  { id: 9, requestNumber: 'LNSW4567', requestTime: '2024-07-09T12:00:00Z', blNumber: 'BL45678', blDate: '2024-07-09', doExp: '2024-07-18', requestName: 'Request 9', transactionId: 'abcdefabcdefabcdefabcdefabcdefabcdefabcdefabcdefabcdefabcdefabcdefabcdef', shippingLine: 'MSC', status: 'Submitted', isContainer: true },
];

const releasedData: ListDo[] = [
  { id: 4, requestNumber: 'LNSW3456', requestTime: '2024-07-04T12:00:00Z', blNumber: 'BL34567', blDate: '2024-07-04', doExp: '2024-07-13', requestName: 'Request 4', transactionId: '1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef', shippingLine: 'HAPAG', status: 'Released', isContainer: false },
  { id: 10, requestNumber: 'LNSW8901', requestTime: '2024-07-10T12:00:00Z', blNumber: 'BL89012', blDate: '2024-07-10', doExp: '2024-07-19', requestName: 'Request 10', transactionId: '1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef', shippingLine: 'HAPAG', status: 'Released', isContainer: false }
]

const rejectedData: ListDo[] = [
  { id: 5, requestNumber: 'LNSW7890', requestTime: '2024-07-05T12:00:00Z', blNumber: 'BL78901', blDate: '2024-07-05', doExp: '2024-07-14', requestName: 'Request 5', transactionId: 'abcdefabcdefabcdefabcdefabcdefabcdefabcdefabcdefabcdefabcdefabcdefabcdef', shippingLine: 'CMA', status: 'Rejected', isContainer: true },
]

const draftData: ListDo[] = [
  { id: 3, requestNumber: 'LNSW9012', requestTime: '2024-07-03T12:00:00Z', blNumber: 'BL90123', blDate: '2024-07-03', doExp: '2024-07-12', requestName: 'Request 3', transactionId: 'abcdefabcdefabcdefabcdefabcdefabcdefabcdefabcdefabcdefabcdefabcdefabcdef', shippingLine: 'MSC', status: 'Draft', isContainer: true },
  { id: 7, requestNumber: 'LNSW6789', requestTime: '2024-07-07T12:00:00Z', blNumber: 'BL67890', blDate: '2024-07-07', doExp: '2024-07-16', requestName: 'Request 7', transactionId: 'abcdefabcdefabcdefabcdefabcdefabcdefabcdefabcdefabcdefabcdefabcdefabcdef', shippingLine: 'YML', status: 'Draft', isContainer: true },
]

const processedData: ListDo[] = [
  { id: 2, requestNumber: 'LNSW5678', requestTime: '2024-07-02T12:00:00Z', blNumber: 'BL67890', blDate: '2024-07-02', doExp: '2024-07-11', requestName: 'Request 2', transactionId: '1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef', shippingLine: 'EVG', status: 'Processed', isContainer: false },
  { id: 8, requestNumber: 'LNSW0123', requestTime: '2024-07-08T12:00:00Z', blNumber: 'BL01234', blDate: '2024-07-08', doExp: '2024-07-17', requestName: 'Request 8', transactionId: '1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef', shippingLine: 'EVG', status: 'Processed', isContainer: false },
]

const cancelledData: ListDo[] = [
  { id: 6, requestNumber: 'LNSW2345', requestTime: '2024-07-06T12:00:00Z', blNumber: 'BL23456', blDate: '2024-07-06', doExp: '2024-07-15', requestName: 'Request 6', transactionId: '1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef', shippingLine: 'ONE', status: 'Cancelled', isContainer: false },
]

const filteredFuncTest = (status: string, data: ListDo[]): ListDo[] => {
  const filteredData = status === "All Status" ? data : data.filter((item: ListDo) => item.status === status);
  return filteredData
}

// Case 1: Filter data by status submitted
test('Filtered Data by Status Submitted Successfull!', () => {
  expect(filteredFuncTest('Submitted', sampleData)).toEqual(submittedData)
})

// Case 2: Filter data by status Released
test('Filtered Data by Status Released Successfull!', () => {
  expect(filteredFuncTest('Released', sampleData)).toEqual(releasedData)
})

// Case 3: Filter data by all status (default)
test('Filtered Data by All Status (Default) Successfull!', () => { 
  expect(filteredFuncTest("All Status", sampleData)).toEqual(sampleData)
})

// Case 4: Filter data by status Draft
test('Filtered Data by Status Draft Successfull!', () => {
  expect(filteredFuncTest('Draft', sampleData)).toEqual(draftData)
})

// Case 5: Filter data by status Processed
test('Filtered Data by Status Processed Successfull!', () => {
  expect(filteredFuncTest('Processed', sampleData)).toEqual(processedData)
})

// Case 6: Filter data by status Cancelled
test('Filtered Data by Status Cancelled Successfull!', () => { 
  expect(filteredFuncTest("Cancelled", sampleData)).toEqual(cancelledData)
})
import { getMockRecords } from '../mocks/moduleData';
import type { MockRecord } from '../types';
import { withDerivedEmployeeFields } from './employeeStatus';

const pageTitles: Record<string, string> = {
  '/employee/list': '员工信息',
  '/employee/contract': '合同与协议',
};

const recordStore = new Map<string, MockRecord[]>();

const cloneRecords = (records: MockRecord[]) => records.map((record) => ({ ...record }));

export function getSharedMockRecords(path: string, title = pageTitles[path] ?? '') {
  if (!recordStore.has(path)) {
    const records = getMockRecords(path, title);
    recordStore.set(path, path === '/employee/list' ? records.map((record) => withDerivedEmployeeFields(record)) : records);
  }

  return cloneRecords(recordStore.get(path) ?? []);
}

export function updateSharedMockRecords(path: string, updater: (records: MockRecord[]) => MockRecord[]) {
  const currentRecords = getSharedMockRecords(path, pageTitles[path]);
  const nextRecords = updater(currentRecords);
  const normalizedRecords = path === '/employee/list' ? nextRecords.map((record) => withDerivedEmployeeFields(record)) : nextRecords;
  recordStore.set(path, cloneRecords(normalizedRecords));
  return cloneRecords(normalizedRecords);
}

export function syncEmployeeFromContract(contract: MockRecord) {
  const actualEndDate = String(contract.actualEndDate ?? '');
  const plannedEndDate = String(contract.endDate ?? '');
  const contractStatus = String(contract.contractStatus ?? contract.status ?? '');
  const contractEndDate = ['已解除', '已终止'].includes(contractStatus) && actualEndDate ? actualEndDate : plannedEndDate;
  const employeeNo = String(contract.employeeNo ?? '');
  const employeeName = String(contract.name ?? contract.employee ?? '');

  updateSharedMockRecords('/employee/list', (employees) =>
    employees.map((employee) => {
      const matchedByNo = employeeNo && String(employee.employeeNo ?? '') === employeeNo;
      const matchedByName = employeeName && String(employee.name ?? '') === employeeName;

      if (!matchedByNo && !matchedByName) {
        return employee;
      }

      return {
        ...employee,
        contractCompany: contract.contractCompany ?? employee.contractCompany,
        startDate: contract.startDate ?? employee.startDate,
        contractStartDate: contract.startDate ?? employee.contractStartDate,
        endDate: contractEndDate || employee.endDate,
        contractEndDate: contractEndDate || employee.contractEndDate,
      };
    }),
  );
}

export function syncContractFromEmployee(employee: MockRecord) {
  const employeeNo = String(employee.employeeNo ?? '');
  const employeeName = String(employee.name ?? '');
  const startDate = employee.contractStartDate ?? employee.startDate;
  const endDate = employee.contractEndDate ?? employee.endDate;

  updateSharedMockRecords('/employee/contract', (contracts) => {
    const matchedIndex = contracts.findIndex((contract) => {
      const matchedByNo = employeeNo && String(contract.employeeNo ?? '') === employeeNo;
      const matchedByName = employeeName && String(contract.name ?? contract.employee ?? '') === employeeName;
      return matchedByNo || matchedByName;
    });

    const contractPatch: Partial<MockRecord> = {
      name: employeeName || String(employee.name ?? ''),
      employee: employeeName || String(employee.name ?? ''),
      employeeNo: employeeNo || String(employee.employeeNo ?? ''),
      contractCompany: employee.contractCompany,
      startDate,
      endDate,
      actualEndDate: endDate,
    };

    if (matchedIndex >= 0) {
      return contracts.map((contract, index) => (index === matchedIndex ? { ...contract, ...contractPatch } : contract));
    }

    return [
      {
        id: `contract-${Date.now()}`,
        code: `CON${Date.now()}`,
        department: String(employee.department ?? ''),
        owner: String(employee.owner ?? ''),
        status: '生效中',
        contractStatus: '生效中',
        date: String(startDate ?? ''),
        signDate: String(startDate ?? ''),
        contractType: '劳动合同',
        termType: '固定期限',
        files: '',
        reminderDays: 30,
        ...contractPatch,
      } as MockRecord,
      ...contracts,
    ];
  });
}

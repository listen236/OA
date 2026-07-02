import type { FieldConfig, MockRecord } from '../types';

type SearchValues = Record<string, unknown>;

const fieldAliasMap: Record<string, string[]> = {
  keyword: ['name', 'code', 'department', 'position', 'owner'],
  orgCode: ['code'],
  orgName: ['name'],
  positionCode: ['code'],
  positionName: ['position', 'name'],
  categoryCode: ['categoryCode', 'code'],
  contractStatus: ['contractStatus'],
  flowStatus: ['flowStatus'],
  employee: ['name'],
  clockDate: ['date'],
  statDate: ['date'],
};

function isEmptySearchValue(value: unknown) {
  return (
    value === undefined ||
    value === null ||
    value === '' ||
    (Array.isArray(value) && value.every((item) => item === undefined || item === null || item === ''))
  );
}

function formatSearchValue(value: unknown): string[] {
  if (value === undefined || value === null) {
    return [];
  }

  if (Array.isArray(value)) {
    return value.flatMap((item) => formatSearchValue(item));
  }

  if (typeof value === 'object' && 'format' in value && typeof value.format === 'function') {
    const formattedDate = value.format('YYYY-MM-DD');
    return formattedDate ? [formattedDate] : [];
  }

  const normalized = String(value).trim();
  return normalized ? [normalized] : [];
}

function getFieldCandidates(fieldName: string, record: MockRecord) {
  const directField = Object.prototype.hasOwnProperty.call(record, fieldName) ? [fieldName] : [];
  const aliasFields = fieldAliasMap[fieldName] ?? [];
  const suffixFields = [
    ...(fieldName.endsWith('Code') ? ['code'] : []),
    ...(fieldName.endsWith('Name') ? ['name'] : []),
    ...(fieldName.endsWith('Status') ? ['status'] : []),
  ];

  return Array.from(new Set([...directField, ...aliasFields, ...suffixFields])).filter((field) => record[field] !== undefined);
}

function matchesDateRange(recordValues: string[], searchValues: string[]) {
  if (searchValues.length < 2) {
    return true;
  }

  const [start, end] = searchValues;
  return recordValues.some((value) => {
    const currentValue = value.slice(0, 10);
    return currentValue >= start && currentValue <= end;
  });
}

function matchesField(record: MockRecord, field: FieldConfig, value: unknown) {
  if (isEmptySearchValue(value)) {
    return true;
  }

  const searchValues = formatSearchValue(value);
  const recordValues = getFieldCandidates(String(field.name), record)
    .map((candidate) => record[candidate])
    .filter((candidate): candidate is string | number => candidate !== undefined && candidate !== null)
    .map((candidate) => String(candidate).trim())
    .filter(Boolean);

  if (!recordValues.length) {
    return true;
  }

  if (field.type === 'dateRange') {
    return matchesDateRange(recordValues, searchValues);
  }

  if (field.type === 'date' || field.type === 'month' || field.type === 'time') {
    return searchValues.some((searchValue) => recordValues.some((recordValue) => recordValue.includes(searchValue.slice(0, field.type === 'month' ? 7 : 10))));
  }

  if (field.type === 'select' || field.type === 'treeSelect' || field.type === 'radio') {
    return searchValues.some((searchValue) => recordValues.includes(searchValue));
  }

  if (field.type === 'number') {
    return searchValues.some((searchValue) => recordValues.includes(searchValue));
  }

  return searchValues.some((searchValue) => recordValues.some((recordValue) => recordValue.toLowerCase().includes(searchValue.toLowerCase())));
}

export function filterRecordsBySearch(records: MockRecord[], searchFields: FieldConfig[], searchValues: SearchValues) {
  return records.filter((record) =>
    searchFields.every((field) => matchesField(record, field, searchValues[String(field.name)])),
  );
}

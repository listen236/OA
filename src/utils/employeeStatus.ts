import dayjs from 'dayjs';
import type { Dayjs } from 'dayjs';
import type { MockRecord } from '../types';

type DateInput = string | Dayjs;

function toDayjs(value?: DateInput) {
  if (!value) {
    return undefined;
  }
  const date = typeof value === 'string' ? dayjs(value) : value;
  return date.isValid() ? date : undefined;
}

export function calculateProbationEndDate(hireDate?: string, probationMonths?: string | number) {
  const months = Number(probationMonths);
  if (!hireDate || !Number.isInteger(months) || months < 0) {
    return '';
  }

  const startDate = dayjs(hireDate);
  if (!startDate.isValid()) {
    return '';
  }

  return startDate.add(months, 'month').format('YYYY-MM-DD');
}

export function deriveEmployeeStatus(record: MockRecord, today: DateInput = dayjs()) {
  const rawStatus = String(record.status ?? '');
  if (rawStatus.includes('离职')) {
    return rawStatus || '离职';
  }

  const currentDate = toDayjs(today) ?? dayjs();
  const regularizationDate = toDayjs(record.regularizationDate ? String(record.regularizationDate) : undefined);
  if (regularizationDate && !regularizationDate.isAfter(currentDate, 'day')) {
    return '在职';
  }

  const probationDate = toDayjs(record.probationDate ? String(record.probationDate) : undefined);
  if (probationDate) {
    return probationDate.isAfter(currentDate, 'day') ? '试用期' : '在职';
  }

  return rawStatus && rawStatus !== '试用' ? rawStatus : '在职';
}

export function withDerivedEmployeeFields(record: MockRecord, today?: DateInput): MockRecord {
  const calculatedProbationDate =
    String(record.probationDate ?? '') ||
    calculateProbationEndDate(String(record.hireDate ?? record.date ?? ''), record.probationMonths as string | number | undefined);
  const nextRecord = {
    ...record,
    ...(calculatedProbationDate ? { probationDate: calculatedProbationDate } : {}),
  };

  return {
    ...nextRecord,
    status: deriveEmployeeStatus(nextRecord, today),
  };
}

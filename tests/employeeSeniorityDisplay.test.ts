import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const detailSource = readFileSync('src/components/EmployeeDetailPage.tsx', 'utf8');

assert.ok(detailSource.includes('function formatYearValue'), 'employee detail should format seniority values');
assert.ok(detailSource.includes('return value.toFixed(1);'), 'numeric year values should keep one decimal');
assert.ok(detailSource.includes('return numericValue.toFixed(1);'), 'string numeric year values should keep one decimal');
assert.ok(detailSource.includes('return (years + months / 12).toFixed(1);'), 'year and month text should be rounded to one decimal');
assert.ok(detailSource.includes("const seniority = formatYearValue(record?.seniority, fallbackValues.seniority);"), 'seniority should use formatted year value');
assert.ok(detailSource.includes("const workSeniority = formatYearValue(record?.workSeniority, fallbackValues.workSeniority);"), 'work seniority should use formatted year value');
assert.ok(detailSource.includes("{ label: '工龄', value: workSeniority, editable: false }"), 'work seniority display should use formatted value');

console.log('employee seniority display test passed');

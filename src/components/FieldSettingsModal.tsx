import { Checkbox, Modal, Space } from 'antd';
import type { ColumnConfig } from '../types';

interface FieldSettingsModalProps {
  open: boolean;
  columns: ColumnConfig[];
  visibleKeys: string[];
  requiredKeys?: string[];
  onChange: (keys: string[]) => void;
  onClose: () => void;
}

export function FieldSettingsModal({ open, columns, visibleKeys, requiredKeys = [], onChange, onClose }: FieldSettingsModalProps) {
  const requiredKeySet = new Set(requiredKeys);
  const options = columns
    .filter((column) => column.dataIndex !== 'index')
    .map((column) => ({ label: column.title, value: String(column.dataIndex), required: requiredKeySet.has(String(column.dataIndex)) }));

  return (
    <Modal title="字段设置" open={open} onOk={onClose} onCancel={onClose} width={520}>
      <div className="field-setting-panel">
        <div className="field-setting-tip">勾选后立即影响当前表格显示，带“必显”的字段不可取消。</div>
        <Checkbox.Group
          value={visibleKeys}
          onChange={(values) => {
            const next = Array.from(new Set([...requiredKeys, ...values.map(String)]));
            if (next.length > 0) {
              onChange(next);
            }
          }}
        >
          <Space wrap>
            {options.map((option) => (
              <Checkbox key={option.value} value={option.value} disabled={option.required}>
                {option.label}
                {option.required ? '（必显）' : ''}
              </Checkbox>
            ))}
          </Space>
        </Checkbox.Group>
      </div>
    </Modal>
  );
}

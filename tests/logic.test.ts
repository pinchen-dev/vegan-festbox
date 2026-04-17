import { describe, it, expect } from 'vitest';
import { InvoiceSchema} from '../src/validators/order-validators'

describe('Order Validator - 發票邏輯單元測試', () => {
  
  it('應該接受正確的電子載具格式', () => {
  const input = { type: 'ELECTRONIC', value: '/ABC1234' };
  const result = InvoiceSchema.safeParse(input);
  expect(result.success).toBe(true);
});

  it('應過濾統編中的全形數字並轉為半形', () => {
    const input = { type: 'COMPANY', value: '１２３４５６７８', companyTitle: '測試公司' };
    const result = InvoiceSchema.safeParse(input);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.value).toBe('12345678');
    }
  });

  it('統編長度不滿 8 碼應驗證失敗', () => {
    const input = { type: 'COMPANY', value: '1234567' };
    const result = InvoiceSchema.safeParse(input);
    expect(result.success).toBe(false);
  });

  it('載具格式錯誤（缺少斜槓）應驗證失敗', () => {
    const input = { type: 'ELECTRONIC', value: 'ABC1234' };
    const result = InvoiceSchema.safeParse(input);
    expect(result.success).toBe(false);
  });
});
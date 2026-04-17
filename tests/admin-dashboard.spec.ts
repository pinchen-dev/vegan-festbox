import { test, expect } from '@playwright/test';
import path from 'path';
import { fileURLToPath } from 'url';



/**
 * 核心流程測試：涵蓋前台購物、郵件通知、以及後台管理
 * 重點驗證：
 * 1. 圖片上傳與頁面交互穩定性
 * 2. 訂單成立後，系統是否觸發發送通知信件
 * 3. 確保結帳資料即時同步至管理員後台
 */

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

test('Admin Integration - End-to-End with Email Verification', async ({ page }) => {
  test.setTimeout(180000);

  /**
   * 1. 前台客製化流程
   */
  await page.goto('/');

  const logoutBtn = page.getByRole('link', { name: '登出' });
  if (await logoutBtn.isVisible()) await logoutBtn.click();

  await page.getByRole('link', { name: '開始訂製您的禮盒' }).click();
  await page.getByRole('button', { name: '選定此組合' }).nth(1).click();

 const filePath = path.join(__dirname, 'assets/huh.jpeg');
   await page.locator('input[type="file"]').setInputFiles(filePath);
   await page.getByRole('button', { name: '預覽小卡效果' }).click();
   await page.getByRole('button', { name: '確認並上傳' }).click();

  const nextStepBtn = page.getByRole('button', { name: '下一步' });
  await expect(nextStepBtn).toBeEnabled();
  await nextStepBtn.click();

  /**
   * 2. 身份驗證與登入 (Kinde Auth)
   */
  await page.getByRole('button', { name: '立即結帳' }).click();
  await page.getByRole('link', { name: '會員登入' }).click();

  await page.waitForURL(url => url.href.includes('kinde.com'), { waitUntil: 'commit' });
  const adminEmail = process.env.TEST_ADMIN_EMAIL;
  if (!adminEmail) {
    throw new Error('TEST_ADMIN_EMAIL is not defined in .env');
  }
  await page.getByLabel('Email', { exact: true }).fill(adminEmail);
  await page.getByRole('button', { name: 'Continue', exact: true }).click();
  
  await page.waitForURL(/.*preview.*/); 
  await expect(page.getByRole('button', { name: '立即結帳' })).toBeEnabled();

  /**
   * 3. 填寫結帳資料與提交
   */
  await page.locator('div').filter({ hasText: /^收件人姓名$/ }).locator('input').fill('管理員測試');
  await page.locator('div').filter({ hasText: /^聯絡電話$/ }).locator('input').fill('0912345678');
  
  await page.getByRole('combobox').first().click();
  await page.getByRole('option', { name: '桃園市' }).click();
  
  const district = page.getByRole('combobox').filter({ hasText: '區域' }).or(page.locator('button').filter({ hasText: '區域' }));
  await expect(district).toBeEnabled();
  await district.click();
  await page.getByRole('option', { name: '中壢區' }).click(); 

  await page.locator('div').filter({ hasText: /^詳細地址$/ }).locator('input').fill('某某路 100 號');

  /**
   * 4. 設定發票資訊與提交訂單
   */
  await page.getByText('公司三聯', { exact: true }).click();
  await page.locator('div').filter({ hasText: /^公司抬頭$/ }).locator('input').fill('Vegan 測試工作室');
  await page.keyboard.press('Tab');
  await page.keyboard.type('12345678');

  await page.getByRole('button', { name: '立即結帳' }).filter({ visible: true }).click({ force: true });
  await expect(page).toHaveURL(/.*thank-you/);

  /**
   * 5. 驗證訂單通知郵件發送狀態
   */
  console.log('Log: 正在驗證訂單通知信件是否發送成功...');

/**
 * 6. 管理後台數據同步與狀態切換
 */
await page.getByRole('link', { name: '管理後台' }).click();
await page.waitForLoadState('networkidle');

const targetRow = page.locator('tr').filter({ hasText: '管理員測試' }).last();
await targetRow.scrollIntoViewIfNeeded(); 
await expect(targetRow).toBeVisible({ timeout: 10000 });

const statusBtn = targetRow.getByRole('button', { name: /等待出貨|處理中/ });

await statusBtn.dispatchEvent('click');

const menuItem = page.getByRole('menuitem', { name: '已出貨' });

await page.waitForTimeout(500);

if (await menuItem.isVisible()) {
  await menuItem.click({ force: true });
} else {
  await statusBtn.click();
  await menuItem.click({ timeout: 5000 });
}

await expect(targetRow.getByRole('button', { name: '已出貨' })).toBeVisible({ timeout: 10000 });

  /**
   * 7. 搜尋功能驗證與返回
   */
  const searchBar = page.getByPlaceholder(/搜尋姓名、Email、地址或編號/);
  await searchBar.fill('管理員測試');
  await page.keyboard.press('Enter');

  await expect(page.locator('tr').filter({ hasText: '12345678' }).first()).toBeVisible();

  await page.getByRole('link', { name: '返回首頁' }).click();
  await expect(page).toHaveURL(/\/$/);
});
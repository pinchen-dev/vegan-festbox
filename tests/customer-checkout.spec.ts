import { test, expect } from '@playwright/test';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * 測試案例：模擬客戶從挑選禮盒到完成下單的完整路徑
 * 核心目標：驗證客製化流程的連貫性、檔案上傳功能，以及登入攔截邏輯
 */
test('客戶完整下單流程 - 客製小卡和禮盒配置驗證', async ({ page }) => {
  // 因圖片上傳與第三方登入頁面跳轉耗時較長，給予多一點執行時間
  test.setTimeout(120000);

  /**
   * 1. 進入首頁
   */
  await page.goto('/'); 

  /**
   * 2. Step1. 挑選商品組合
   */
  await page.getByRole('link', { name: '開始訂製您的禮盒' }).click();
  await page.getByRole('button', { name: '選定此組合' }).nth(1).click();

  /**
   * 3. Step2. 客製化小卡：照片上傳與預覽
   * 驗證使用者是否能順利上傳圖片並即時預覽效果
   */
  const filePath = path.join(__dirname, 'assets/huh.jpeg');
  await page.locator('input[type="file"]').setInputFiles(filePath);
  await page.getByRole('button', { name: '預覽小卡效果' }).click();
  await page.getByRole('button', { name: '確認並上傳' }).click();
  
  // 確保頁面成功載入到第三步驟
  await page.getByText('Step 3').waitFor({ state: 'visible' });

  /**
   * 4. Step3. 禮盒外觀配置
   * 測試頁面上的顏色、材質與配件開關是否能正常運作
   */
  // 選擇禮盒顏色與材質
  await page.getByText('節慶紅').click();
  await page.getByRole('radio').nth(1).click();
  await page.getByRole('radio', { name: '永續再生禮盒' }).click();
  await page.getByRole('radio', { name: '亞麻質感禮盒' }).click();

  // 測試「蠟封選單」的開啟與樣式切換
  await page.locator('div').filter({ hasText: '搭配專屬蠟封' }).getByRole('switch').first().click();
  await page.getByRole('button', { name: 'seal 永續日常' }).waitFor({ state: 'visible' });
  await page.getByRole('button', { name: 'seal 永續日常' }).click();
  
  await page.getByText('新年春節').click();
  await page.getByRole('button', { name: 'seal 新年春節' }).click();
  await page.keyboard.press('Escape'); // 測試使用鍵盤關閉選單

  // 開啟其他裝飾選項
  await page.locator('div').filter({ hasText: '天然環保亞麻繩' }).getByRole('switch').first().click();
  await page.locator('div').filter({ hasText: '乾燥花材' }).getByRole('switch').first().click();

  await page.getByRole('button', { name: '下一步' }).click();

  /**
   * 5. Step4. 填寫資訊和確認
   */
  await page.locator('input[name="name"]').fill('王XX');
  await page.locator('input[name="phoneNumber"]').fill('0911904533');
  
  // 選擇地址與填寫載具
  await page.getByRole('combobox').filter({ hasText: '選擇縣市' }).click();
  await page.getByRole('option', { name: '基隆市' }).click();
  await page.getByRole('combobox').filter({ hasText: '區域' }).click();
  await page.getByRole('option', { name: '仁愛區' }).click();
  await page.locator('input[name="address"]').fill('基隆路100號');
  await page.getByPlaceholder(/ABC123D/i).fill('/K7TL32'); 

  /**
   * 6. 登入攔截機制驗證
   * 當使用者未登入就點擊結帳時，系統應引導至登入頁面
   */
  await page.getByRole('button', { name: '立即結帳' }).click();

  const loginModalBtn = page.getByRole('link', { name: '會員登入' });
  const logoutBtn = page.getByRole('link', { name: '登出' });

  if (await logoutBtn.isVisible()) {
    const isAdmin = await page.getByRole('link', { name: '管理後台' }).isVisible();
    
    if (!isAdmin) {
      console.log('Log: 當前為客戶帳號，執行強制登出以切換管理員');
      await logoutBtn.click();
      await page.waitForURL(/\/$/);
      // 登出後重新回到結帳點，再次觸發登入彈窗
      await page.goto('/configure/preview');
      await page.getByRole('button', { name: '立即結帳' }).click();
    }
  }
  
  try {
    // 檢查是否出現登入彈窗，若已登入則會跳過此段
    await loginModalBtn.waitFor({ state: 'visible', timeout: 5000 });
    console.log('Log: 偵測到登入引導，執行登入動作');
    await loginModalBtn.click();
    
    // 進入第三方登入頁面填寫帳號
    await page.waitForURL(url => url.href.includes('kinde.com'), { timeout: 20000 });
    const customerEmail = process.env.TEST_CUSTOMER_EMAIL;
  if (!customerEmail) {
    throw new Error('TEST_CUSTOMER_EMAIL is not defined in .env');
  }

    await page.getByRole('button', { name: 'Continue', exact: true }).click();
    
    // await page.pause();
    
    // 驗證登入後是否自動跳回預覽頁面
    await page.waitForURL(/.*preview.*/, { timeout: 30000 });
  } catch (e) {
    console.log('Log: 目前為登入狀態，直接繼續結帳流程');
  }

  // 改選別的發票類型
  const paperRadio = page.getByText('個人紙本', { exact: true });
await paperRadio.scrollIntoViewIfNeeded();
await paperRadio.click();

  /**
   * 7. Thank-You 頁面和最終下單與結果檢查
   */
  await page.getByRole('button', { name: '立即結帳' }).click();
  await expect(page).toHaveURL(/.*thank-you/);
  await expect(page.getByText('Order Successful')).toBeVisible();
  await page.getByRole('link', { name: '我的訂單' }).click();
  await expect(page).toHaveURL(/.*my-orders/);
  await expect(page.getByText('處理中').first()).toBeVisible({ timeout: 15000 });

  /**
   * 8. 流程結束
   */
  await page.getByRole('link', { name: '返回首頁' }).click(); 
  await expect(page).toHaveURL(/\/$/); 
});
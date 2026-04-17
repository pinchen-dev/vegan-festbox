import { z } from "zod";

export const InvoiceSchema = z
  .object({
    type: z.enum(["ELECTRONIC", "COMPANY", "PAPER"]),
    value: z.string().trim().optional(),
    companyTitle: z.string().trim().optional(),
  })
      .transform((data) => {
    if (data.value) {
      const transformedValue = data.value
        .replace(/[０-９]/g, (s) => String.fromCharCode(s.charCodeAt(0) - 0xfee0)) // 全形轉半形
        .toUpperCase();
      return { ...data, value: transformedValue };
    }
    return data;
  })
  .superRefine((val, ctx) => {
    if (val.type === "ELECTRONIC") {
      const cleanValue = val.value || "";
      const carrierRegex = /^\/[A-Z0-9.+\-]{7}$/;
      if (!carrierRegex.test(cleanValue)) {
        ctx.addIssue({
          code: "custom",
          message: "載具格式不正確 (需為 / 開頭，後接 7 碼數字、大寫英文、符號 . - +",
          path: ["value"],
        });
      }
    }

    if (val.type === "COMPANY") {
      const cleanTaxId = val.value || "";
      const title = val.companyTitle || "";

      if (!/^\d{8}$/.test(cleanTaxId)) {
        ctx.addIssue({
          code: "custom",
          message: "統一編號格式不正確（需為 8 位半形數字）",
          path: ["value"],
        });
      }

      const hasChinese = /[\u4E00-\u9FFF]/.test(title);
      const forbiddenKeywords = ["基金會", "協會", "工會", "公會", "政府"];
      const hasForbidden = forbiddenKeywords.some((keyword) =>
        title.includes(keyword)
      );

      if (!title || title.length < 2) {
        ctx.addIssue({
          code: "custom",
          message: "公司抬頭不得為單字或空白（需 2 字以上）",
          path: ["companyTitle"],
        });
      } else if (!hasChinese) {
        ctx.addIssue({
          code: "custom",
          message: "商業名稱登記應使用中文",
          path: ["companyTitle"],
        });
      } else if (hasForbidden) {
        ctx.addIssue({
          code: "custom",
          message: "包含非法字眼，請確認是否為正確商業名稱",
          path: ["companyTitle"],
        });
      }
    }
  });

export const ShippingInfoSchema = z.object({
  name: z.string().trim().min(1, "請輸入收件人姓名"),
  phoneNumber: z.string().trim().regex(/^09\d{8}$/, "請輸入正確的 09 開頭的手機號碼"),
  city: z.string().min(1, "請選擇縣市"),
  district: z.string().min(1, "請選擇區域"),
  address: z
    .string()
    .trim()
    .min(5, "地址太短了，請輸入完整的路名與門牌號碼")
    .max(100, "地址長度超出限制"),
  invoice: InvoiceSchema,
});
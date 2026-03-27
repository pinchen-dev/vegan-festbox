"use client";

import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";

const STEPS = [
  { name: "Step 1: 挑選商品", description: "選擇您的純素禮贈方案", url: "/select" },
  { name: "Step 2: 上傳照片", description: "挑選您的客製小卡照片", url: "/upload" },
  { name: "Step 3: 訂製禮盒", description: "配置客製化包裝和組合內容", url: "/design" },
  { name: "Step 4: 確認與結帳", description: "最後檢查訂單並完成支付", url: "/preview" },
];

const Steps = () => {
  const pathname = usePathname();

  return (
    <ol className="rounded-xl bg-white/60 backdrop-blur-md shadow-sm border border-primary/10 lg:flex lg:rounded-xl lg:border-none overflow-hidden">
      {STEPS.map((step, i) => {
        const isCurrent = pathname.endsWith(step.url);
        const isCompleted = STEPS.slice(i + 1).some((s) =>
          pathname.endsWith(s.url)
        );

        return (
          <li key={step.name} className="relative overflow-hidden lg:flex-1">
            <div className="group">
              <span
                className={cn(
                  "absolute left-0 top-0 h-full w-1 bg-primary/10 lg:bottom-0 lg:top-auto lg:h-1 lg:w-full transition-all duration-300",
                  {
                    "bg-primary": isCurrent || isCompleted,
                  }
                )}
                aria-hidden="true"
              />

              <span className={cn(i !== 0 ? "lg:pl-9" : "", "flex items-center px-6 py-5 text-sm font-medium")}>
                <span className="flex-shrink-0">
                  <div
                    className={cn(
                      "flex h-10 w-10 items-center justify-center rounded-full border-2 text-md font-bold transition-all",
                      {
                        "border-primary text-primary bg-primary/5": isCurrent,
                        "border-primary text-white bg-primary": isCompleted,
                        "border-primary/20 text-primary/30": !isCurrent && !isCompleted,
                      }
                    )}
                  >
                    {i + 1}
                  </div>
                </span>

                <span className="ml-4 h-full mt-0.5 flex min-w-0 flex-col justify-center">
                  <span
                    className={cn("text-sm transition-colors", {
                      "font-black text-primary": isCompleted,
                      "font-bold text-primary/80": isCurrent,
                      "font-medium text-primary/40": !isCurrent && !isCompleted,
                    })}
                  >
                    {step.name}
                  </span>
                  <span className={cn("text-xs transition-colors", {
                    "text-primary/70": isCompleted,
                    "text-primary/60": isCurrent,
                    "text-primary/30": !isCurrent && !isCompleted,
                  })}>
                    {step.description}
                  </span>
                </span>
              </span>

              {i !== 0 ? (
                <div className="absolute inset-0 hidden w-3 lg:block">
                  <svg className="h-full w-full text-primary/10" viewBox="0 0 12 82" fill="none" preserveAspectRatio="none">
                    <path d="M0.5 0V31L10.5 41L0.5 51V82" stroke="currentcolor" vectorEffect="non-scaling-stroke" />
                  </svg>
                </div>
              ) : null}
            </div>
          </li>
        );
      })}
    </ol>
  );
};

export default Steps;
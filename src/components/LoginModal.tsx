"use client";

import type { Dispatch, SetStateAction } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import Image from "next/image";
import { LoginLink, RegisterLink } from "@kinde-oss/kinde-auth-nextjs";
import { buttonVariants } from "./ui/button";
import { usePathname, useSearchParams } from "next/navigation";

const LoginModal = ({
  isOpen,
  setIsOpen,
}: {
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
}) => {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  
  const fullPath = searchParams.toString() 
    ? `${pathname}?${searchParams.toString()}` 
    : pathname;

  return (
    <Dialog onOpenChange={setIsOpen} open={isOpen}>
      <DialogContent className="fixed z-[9999999]">
        <DialogHeader>
          <div className="relative mx-auto w-24 h-24 mb-2">
            <Image
              src="/logo-1.png"
              alt="logo"
              className="object-contain"
              fill
            />
          </div>
          <DialogTitle className="text-3xl text-center font-bold tracking-tight text-gray-900">
            請登入以繼續購買
          </DialogTitle>

          <DialogDescription className="text-base text-center py-2">
            <span className="font-medium text-zinc-900">您的設計已儲存!</span>{" "}
            請登入或註冊會員，即可完成最後的下單步驟。
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-2 gap-6 divide-x divide-gray-200">
          <LoginLink 
            postLoginRedirectURL={fullPath} 
            className={buttonVariants({ variant: "outline" })}
          >
            會員登入
          </LoginLink>
          <RegisterLink 
            postLoginRedirectURL={fullPath} 
            className={buttonVariants({ variant: "default" })}
          >
            註冊新帳號
          </RegisterLink>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default LoginModal;
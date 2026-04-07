import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { buttonVariants } from "./ui/button";
import MaxWidthWrapper from "./MaxWidthWrapper";

const Navbar = async () => {
  const { getUser } = getKindeServerSession();
  const user = await getUser();
  const isAdmin = user?.email === process.env.ADMIN_EMAIL;

  return (
    <nav className="sticky z-[100] h-14 inset-x-0 top-0 w-full border-b border-stone-200 bg-white/80 backdrop-blur-md transition-all">
      <MaxWidthWrapper>
        <div className="flex h-14 items-center justify-between">
          <Link href="/" className="flex z-40 font-bold text-xl tracking-tighter text-primary">
            Vegan<span className="text-secondary">festbox</span>
          </Link>

          <div className="h-full flex items-center space-x-6">
            {user ? (
              <>
                <Link
                  href="/api/auth/logout"
                  className={buttonVariants({
                    size: "sm",
                    variant: "ghost",
                    className: "text-stone-600 hover:text-stone-900"
                  })}
                >
                  登出
                </Link>
{isAdmin ? (
                  <Link
                    href="/dashboard"
                    className={buttonVariants({
                      size: "sm",
                      variant: "ghost",
                      className: "text-stone-600 hover:text-stone-900",
                    })}
                  >
                    管理後台
                  </Link>
                ) : (
                  <Link
                    href="/my-orders"
                    className={buttonVariants({
                      size: "sm",
                      variant: "ghost",
                      className: "text-stone-600 hover:text-stone-900",
                    })}
                  >
                    我的訂單
                  </Link>
                )}

                <Link
                  href="/configure/select"
                  className={buttonVariants({
                    size: "sm",
                    className: "hidden sm:flex items-center gap-1 bg-emerald-700 hover:bg-emerald-800 text-white shadow-sm transition-all",
                  })}
                >
                  立即開始訂製
                  <ChevronRight className="ml-1.5 h-4 w-4" />
                </Link>
              </>
            ) : (
              <>
                <Link
                  href="/api/auth/register"
                  className={buttonVariants({
                    size: "sm",
                    variant: "ghost",
                    className: "text-stone-600 hover:text-stone-900"
                  })}
                >
                  註冊
                </Link>

                <Link
                  href="/api/auth/login"
                  className={buttonVariants({
                    size: "sm",
                    variant: "ghost",
                    className: "text-stone-600 hover:text-stone-900"
                  })}
                >
                  登入
                </Link>

                <div className="h-6 w-px bg-stone-200 hidden sm:block " />

                <Link
                  href="/configure/select"
                  className={buttonVariants({
                    size: "sm",
                    className: "hidden sm:flex items-center gap-1 bg-emerald-700 hover:bg-emerald-800 text-white shadow-sm transition-all",
                  })}
                >
                  開始客製
                  <ChevronRight className="ml-1.5 h-4 w-4" />
                </Link>
              </>
            )}
          </div>
        </div>
      </MaxWidthWrapper>
    </nav>
  );
};

export default Navbar;
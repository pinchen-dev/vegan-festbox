import MaxWidthWrapper from "@/components/MaxWidthWrapper";
import { ChevronRight , Check, Star } from "lucide-react";
import Box from "@/components/Box";
import { Icons } from "@/components/Icons";
import { Reviews } from "@/components/Reviews";
import { buttonVariants } from "@/components/ui/button";
import Link from "next/link";

export default function Home() {
  return (
    <div className="bg-background">
      <section className="relative overflow-hidden">
        <MaxWidthWrapper className="pb-24 pt-10 lg:grid lg:grid-cols-3 sm:pb-32 lg:gap-x-0 lg:pt-24 xl:pt-32 lg:pb-52">
          <div className="col-span-2 px-6 lg:px-0 lg:pt-4 z-10">
            <div className="relative mx-auto text-center lg:text-left flex flex-col items-center lg:items-start">
              <div className="absolute w-32 left-0 -top-20 hidden lg:block">
                <img src="/logo.png" className="w-full" alt="logo" />
              </div>
              <h1 className="relative w-fit tracking-tight mt-16 font-black leading-[1.1] text-foreground text-5xl md:text-6xl lg:text-8xl">
                訂製您的 <br />
                <span className="bg-secondary px-4 text-white inline-block my-2">
                  純素生活
                </span> <br />
                永續禮盒
              </h1>

              <div className="mt-8 flex flex-col items-center lg:items-start space-y-4">
                <p className="text-lg leading-7 text-mute max-w-prose text-center lg:text-left text-balance">
                  「從零殘忍居家用品到純素零食，<br className="hidden md:block" />
                  我們為您 <span className="font-semibold text-primary">量身打造</span> 每次的驚喜。」
                </p>

                <p className="text-lg leading-7 text-mute max-w-prose text-center lg:text-left text-balance">
                  <span className="font-semibold text-foreground">Vegan Festbox</span> 友善動物、更友善地球環境。
                </p>
              </div>

              <div className="mt-10">
                <Link 
                  className={buttonVariants({ 
                    size: "lg", 
                    className: "gap-2 px-8 py-6 text-lg font-bold bg-primary hover:bg-primary/90 transition-all shadow-xl hover:shadow-primary/20 active:scale-95" 
                  })} 
                  href="/configure/select">
                  開始訂製您的禮盒 <ChevronRight className="h-5 w-5" />
                </Link>
                <p className="mt-10 text-m font-medium text-foreground/60 text-center lg:text-left">
                  加入我們，讓您每次開箱都像在拆一份精心準備的禮物。
                </p>
              </div>

              <ul className="mt-10 space-y-2 text-left font-medium flex flex-col items-center sm:items-start">
                <div className="space-y-2">
                  <li className="flex gap-1.5 items-center text-left">
                    <Check className="h-5 w-5 shrink-0 text-primary" />
                    100% 全植物成分與零殘忍認證
                  </li>
                  <li className="flex gap-1.5 items-center text-left">
                    <Check className="h-5 w-5 shrink-0 text-primary" />
                    嚴選在地小農與永續品牌
                  </li>
                  <li className="flex gap-1.5 items-center text-left">
                    <Check className="h-5 w-5 shrink-0 text-primary" />
                    跨足飲食與居家的多樣化純素選物
                  </li>
                </div>
              </ul>

              <div className="mt-12 flex flex-col sm:flex-row items-center sm:items-start gap-5">
                <div className="flex -space-x-4">
                  <img className="inline-block h-10 w-10 rounded-full ring-2 ring-slate-100" src="/users/user-1.png" alt="user" />
                  <img className="inline-block h-10 w-10 rounded-full ring-2 ring-slate-100" src="/users/user-2.png" alt="user" />
                  <img className="inline-block h-10 w-10 rounded-full ring-2 ring-slate-100" src="/users/user-3.png" alt="user" />
                  <img className="inline-block h-10 w-10 rounded-full ring-2 ring-slate-100" src="/users/user-4.jpg" alt="user" />
                  <img className="inline-block object-cover h-10 w-10 rounded-full ring-2 ring-slate-100" src="/users/user-5.jpg" alt="user" />
                </div>

                <div className="flex flex-col justify-between items-center sm:items-start">
                  <div className="flex gap-0.5">
                    <Star className="h-4 w-4 text-primary fill-secondary" />
                    <Star className="h-4 w-4 text-primary fill-secondary" />
                    <Star className="h-4 w-4 text-primary fill-secondary" />
                    <Star className="h-4 w-4 text-primary fill-secondary" />
                    <Star className="h-4 w-4 text-primary fill-secondary" />
                  </div>
                  <p>
                    <span className="font-semibold">1,250</span> 位客戶好評回饋
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="col-span-full lg:col-span-1 w-full flex justify-center mt-20 lg:mt-0 relative">
            <div className="relative lg:absolute lg:-right-20 lg:top-1/2 lg:-translate-y-1/2 w-full max-w-lg xl:max-w-xl">
              <img 
                src="/leaf-hero.jpg" 
                className="w-full h-auto object-cover transform lg:rotate-3 lg:scale-110 lg:translate-x-10 drop-shadow-[0_35px_35px_rgba(0,0,0,0.15)]" 
                alt="leaf-hero" 
                style={{ clipPath: "polygon(8% 0%, 100% 0%, 100% 100%, 0% 92%)" }}
              />
              <div className="absolute -left-4 bottom-12 bg-white/95 backdrop-blur-md p-4 rounded-full shadow-2xl border border-white/20 hidden lg:block z-20">
                <div className="flex items-center gap-3 px-2">
                  <div className="relative flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-primary"></span>
                  </div>
                  <p className="text-xs font-black text-zinc-900 uppercase tracking-[0.2em]">Organic & Sustainable</p>
                </div>
              </div>
            </div>
          </div>
        </MaxWidthWrapper>
      </section>

      <section className="bg-card py-24">
        <MaxWidthWrapper className="flex flex-col items-center gap-16 sm:gap-20">
          <div className="flex flex-col lg:flex-row items-center gap-2 sm:gap-6">
            <h2 className="order-1 mt-0 tracking-tight text-center text-balance leading-tight! font-bold text-5xl md:text-6xl text-foreground">
              來自客戶們的「 真實見證 」
              <span className="relative px-2 whitespace-nowrap">
              </span>
            </h2>
            <img src="/logo-1.png" className="w-24 order-0 lg:order-2" alt="logo" />
          </div>

          <div className="mx-auto grid max-w-2xl grid-cols-1 px-4 lg:mx-0 lg:max-w-none lg:grid-cols-2 gap-y-16">
  <div className="flex flex-auto flex-col gap-4 lg:pr-8 xl:pr-20">
    <div className="flex gap-0.5 mb-2">
      <Star className="h-5 w-5 text-primary fill-secondary" />
      <Star className="h-5 w-5 text-primary fill-secondary" />
      <Star className="h-5 w-5 text-primary fill-secondary" />
      <Star className="h-5 w-5 text-primary fill-secondary" />
      <Star className="h-5 w-5 text-primary fill-secondary" />
    </div>
    <div className="text-lg leading-8 text-foreground min-h-[100px] md:min-h-[100px]">
      <p>
        "禮盒的質感超出預期，
        <span className="p-0.5 bg-secondary text-white whitespace-nowrap">所有的零食都是全植成分</span>
        ，口感卻非常驚艷。第一次購買純素商品當禮物，朋友收到也非常開心！"
      </p>
    </div>
    <div className="flex gap-4 mt-2">
      <img className="rounded-full h-12 w-12 object-cover" src="/users/user-1.png" alt="user" />
      <div className="flex flex-col">
        <p className="font-semibold">Jonathan</p>
        <div className="flex gap-1.5 items-center text-zinc-600">
          <Check className="h-4 w-4 stroke-[3px] text-primary" />
          <p className="text-sm">已驗證購買</p>
        </div>
      </div>
    </div>
  </div>

  <div className="flex flex-auto flex-col gap-4 lg:pr-8 xl:pr-20">
    <div className="flex gap-0.5 mb-2">
      <Star className="h-5 w-5 text-primary fill-secondary" />
      <Star className="h-5 w-5 text-primary fill-secondary" />
      <Star className="h-5 w-5 text-primary fill-secondary" />
      <Star className="h-5 w-5 text-primary fill-secondary" />
      <Star className="h-5 w-5 text-primary fill-secondary" />
    </div>
    <div className="text-lg leading-8 text-foreground min-h-[100px] md:min-h-[100px]">
      <p>
        "我很喜歡永續居家組的選品，
        <span className="p-0.5 bg-secondary text-white">完全沒有多餘塑膠包裝</span>
        ，洗髮餅和天然棉織品的品質超好。支持友善地球的理念！"
      </p>
    </div>
    <div className="flex gap-4 mt-2">
      <img className="rounded-full h-12 w-12 object-cover" src="/users/user-4.jpg" alt="user" />
      <div className="flex flex-col">
        <p className="font-semibold">Josh</p>
        <div className="flex gap-1.5 items-center text-zinc-600">
          <Check className="h-4 w-4 stroke-[3px] text-primary" />
          <p className="text-sm">已驗證購買</p>
        </div>
      </div>
    </div>
  </div>
</div>
        </MaxWidthWrapper>

        <div className="pt-10">
          <Reviews />
        </div>
      </section>

      <section>
        <MaxWidthWrapper className="py-24">
          <div className="mb-12 px-6 lg:px-8">
            <div className="mx-auto max-w-2xl sm:text-center">
              <h2 className="order-1 mt-2 tracking-tight text-center text-balance leading-tight! font-bold text-5xl md:text-6xl text-foreground">
                上傳照片 <br />
                <span className="relative px-2 bg-secondary text-white inline-block my-2">
                  訂製專屬小卡
                </span> <br />
                刻畫永續回憶
              </h2>
            </div>
          </div>

          <div className="mx-auto max-w-6xl px-6 lg:px-8">
            <div className="relative flex flex-col items-center md:grid grid-cols-2 gap-40">
              <img src="/arrow.png" className="absolute top-[25rem] md:top-1/2 -translate-y-1/2 z-10 left-1/2 -translate-x-1/2 rotate-90 md:rotate-0" alt="arrow" />
              <div className="relative h-80 md:h-full w-full md:justify-self-end max-w-sm rounded-xl bg-gray-900/5 ring-inset ring-gray-900/10 lg:rounded-2xl">
                <img src="/horse.jpg" className="rounded-md object-cover bg-white shadow-2xl ring-1 ring-gray-900/10 h-full w-full" alt="preview" />
              </div>
              <Box className="w-100" imgSrc="/horse&gift.png" />
            </div>
          </div>

          <ul className="mx-auto mt-12 max-w-prose sm:text-lg space-y-2 w-fit">
            <li className="w-fit">
              <Check className="h-5 w-5 text-primary inline mr-1.5" />
              環保再生紙漿禮盒材質
            </li>
            <li className="w-fit">
              <Check className="h-5 w-5 text-primary inline mr-1.5" />
              大豆油墨高質感封面印刷
            </li>
            <li className="w-fit">
              <Check className="h-5 w-5 text-primary inline mr-1.5" />
              支持在地友善小農與品牌
            </li>
            <li className="w-fit">
              <Check className="h-5 w-5 text-primary inline mr-1.5" />
              附贈專屬暖心手寫卡片服務
            </li>

            <div className="flex justify-center">
              <Link className={buttonVariants({ size: "lg", className: "mx-auto mt-8 font-bold gap-2 shadow-lg" })} href="/configure/select">
                我也要訂製一份驚喜 <ChevronRight className="h-4 w-4" />
              </Link>
            </div>
          </ul>
        </MaxWidthWrapper>
      </section>
    </div>
  );
}
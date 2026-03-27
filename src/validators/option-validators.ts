import { PRODUCT_PRICES } from "@/config/products";
import { 
  Sprout, 
  Gift, 
  Heart, 
  Waves, 
  Moon, 
  TreePine, 
} from "lucide-react";

export const COLORS = [
  { label: "節慶紅", value: "festive_red", tw: "red-600", hex: "#dc2626" },
  { label: "櫻花粉", value: "sakura_pink", tw: "rose-200", hex: "#fecdd3" },
  { label: "艾草綠", value: "sage_green", tw: "muted-olive", hex: "#ADC178" },
  { label: "月見金", value: "moon_gold", tw: "light-gold", hex: "#FFEE99" },
  { label: "燕麥白", value: "oat", tw: "talcum-white", hex: "#F0EDE5" },
  { label: "亞麻灰", value: "linen", tw: "alabaster-grey", hex: "#E2E2E2" },
] as const;

export const MODELS = {
  name: "models",
  options: [
    { label: "永續日常", value: "daily", Icon: Sprout },
    { label: "新年春節", value: "cny", Icon: Gift },
    { label: "浪漫情人", value: "valentine", Icon: Heart },
    { label: "仲夏端午", value: "dragonboat", Icon: Waves },
    { label: "團圓中秋", value: "moonfest", Icon: Moon },
    { label: "歡樂聖誕", value: "christmas", Icon: TreePine },
  ],
} as const;

export const BOX_SETS = {
  name: "boxSet",
  options: [
    { 
      label: "經典點心組", 
      value: "snack", 
      description: "職人手作的純素溫潤，每一口都是對土地的溫柔對待。", 
      price: PRODUCT_PRICES.boxSet.snack, 
      image: "/sets/snack.png",
      features: [
        { title: "手工美式軟餅乾", desc: "堅持使用純淨食材，無動物性成分及添加物，外酥內軟的道地口感，每口都能嚐到優質食材的香氣。" },
        { title: "低溫慢烘原味堅果", desc: "粒粒細心揀選，每日新鮮製作，低溫烘焙鎖住營養與飽滿甘甜。" },
        { title: "手作天然抹醬", desc: "減糖配方、完美比例，不含人工香料，保留最純粹的風味。" }
      ]
    },
    { 
      label: "在地蔬果箱", 
      value: "produce", 
      description: "縮短從產地到餐桌的距離，帶走整季鮮甜與大地的祝福。", 
      price: PRODUCT_PRICES.boxSet.produce, 
      image: "/sets/produce.png",
      features: [
        { title: "8-10 種有機認證蔬果", desc: "產地新鮮直送，無農藥殘農，依時令挑選最當季的清甜。" },
        { title: "主廚研發電子食譜", desc: "針對箱內食材設計，新手也能輕鬆煮出驚艷蔬食料理。" },
        { title: "友善耕作產地故事卡", desc: "掃碼了解作物的家，支持台灣永續小農與土地共好。" }
      ]
    },
    { 
      label: "浴室呵護組", 
      value: "bath", 
      description: "告別塑膠瓶裝，用天然植物精華洗淨身心疲憊。", 
      price: PRODUCT_PRICES.boxSet.bath, 
      image: "/sets/bath.png",
      features: [
        { title: "植萃濃縮洗髮餅", desc: "取自植物精華，成分天然、不含皂鹼，溫和清潔頭皮並帶來蓬鬆感。" },
        { title: "冷製香氛精油手工皂", desc: "採用純天然、有機原料，採用低溫熟成技術保留甘油潤澤，洗後肌膚溫潤不乾澀。" },
        { title: "孟宗竹天然軟毛牙刷", desc: "全支可自然生物降解，給牙齦最溫柔舒適的環保清潔。" },
        { title: "在地日曬絲瓜絡", desc: "使用天然有機絲瓜日曬風乾，柔軟的植物纖維溫和去除角質，讓肌膚重拾細緻呼吸感。" }
      ]
    },
    { 
      label: "永續居家組", 
      value: "kitchen", 
      description: "簡約與機能並行，建構一個友善環境的純素之家。", 
      price: PRODUCT_PRICES.boxSet.kitchen, 
      image: "/sets/kitchen.png",
      features: [
        { title: "天然椰油洗碗皂", desc: "椰子油搭配植物萃取精華，強效去油且不傷手，告別化學殘留。" },
        { title: "純天然植物蠟布套組", desc: "取代一次性保鮮膜，具備天然抑菌力，可冷藏、冷凍、水洗重複使用。" },
        { title: "矽膠折疊密封保鮮盒", desc: "食品級安全矽膠，可冷凍、可微波加熱的耐熱材質，溫度約 -20℃~120℃ ，完美適配外帶與剩食保鮮需求。" },
        { title: "無漂白有機棉濾布", desc: "可重複使用於咖啡或手作植物奶，實踐零廢棄生活。" }
      ]
    },
    { 
      label: "豪華選品組", 
      value: "premium", 
      description: "集結職人精神之作，獻給對生活品質挑剔的靈魂。", 
      price: PRODUCT_PRICES.boxSet.premium, 
      image: "/sets/premium.png",
      features: [
        { title: "精品冷萃藝妓咖啡濃縮液", desc: "世界級莊園豆低溫萃取，在家也能調製頂級純素拿鐵。" },
        { title: "頂級黑松露松子抹醬", desc: "選用義大利頂級黑松露，與綿密堅果碰撞出的奢華鹹點體驗。" },
        { title: "職人級咖啡渣再生鋼筆", desc: "由回收咖啡渣製成，具備獨特溫潤手感與淡雅香氣。" },
        { title: "純素環保皮革多功能墊", desc: "高階合成纖維打造絲綢觸感，適用於餐桌美學或辦公陳設。" }
      ]
    },
    { 
      label: "靈魂療癒組", 
      value: "healing", 
      description: "在香氛與恬靜中，開啟一場與內在對話的旅程。", 
      price: PRODUCT_PRICES.boxSet.healing, 
      image: "/sets/healing.png",
      features: [
        { title: "天然大豆香氛蠟燭", desc: "無石蠟黑煙，燃燒乾淨無毒。添加真正薰衣草、大西洋雪松和佛手柑精油，沉浸在舒緩放鬆的香氣中。" },
        { title: "草本植萃精油洗沐組", desc: "歐盟有機認證原料，深層洗淨壓力並散發淡雅香氣。" },
        { title: "阿育吠陀平衡清體草本茶", desc: "有機種植精選的茴香、薄荷、橙皮和聖羅勒等多種草本植物調配而成，散發出獨特的香氣，促進身心靈的自然平衡。" },
        { title: "環保棉紗紓壓午安枕", desc: "柔軟高彈力的天然透氣材質，搭配人體工學設計，可緩解頸椎壓力，支撐每一次短暫而深刻的休息。" }
      ]
    },
    { 
      label: "戶外職人組", 
      value: "outdoor", 
      description: "輕量化與永續精神並行，陪伴你的每次探險計畫。", 
      price: PRODUCT_PRICES.boxSet.outdoor, 
      image: "/sets/outdoor.png",
      features: [
        { title: "航太級極輕量純鈦杯", desc: "純鈦材質不僅極致輕盈且抗腐蝕，更無金屬異味干擾。雷雕專屬圖騰與磨砂手感，是登山露營者的終極裝備。" },
        { title: "rPET 抗撕裂機能收納袋", desc: "由回收寶特瓶纖維製成，具備超高抗撕裂強度與防潑水性能。輕量化摺疊設計，是山林生活最可靠的永續夥伴。" },
        { title: "純植高蛋白修復能量棒", desc: "嚴選大豆蛋白與超級食物，針對高強度活動設計。無添加精製糖與人工香料，快速補充體力且溫和易消化。" },
        { title: "生物可分解野炊餐具組", desc: "不含 BPA 與塑化劑，採用天然植物纖維強化材質。輕便耐摔且耐熱性佳，專為實踐零廢棄露營而生。" }
      ]
    },
    { 
      label: "尊爵旗艦箱", 
      value: "ultimate", 
      description: "匯聚全系列頂級選物，定義當代純素生活的頂級典範。", 
      price: PRODUCT_PRICES.boxSet.ultimate, 
      image: "/sets/ultimate.png",
      features: [
        { title: "Vegan Festbox 精選套組", desc: "集結 2 種隨機套組，一次擁有一切關於永續生活的美好想像。" },
        { title: "永續再生毛氈手提收納箱", desc: "由回收纖維壓製而成，具備柔軟且紮實的高級手感。簡約優雅的設計，可作為居家或辦公空間的高質感收納箱。" },
        { title: "1 對 1 專業純素營養諮詢", desc: "隨箱附贈專屬預約卡，由資深營養師提供一對一飲食評估，為收禮者量身打造專屬的健康生活提案。" },
        { title: "品牌雷雕 VIP 數位金鑰", desc: "獨家雷雕不鏽鋼紀念卡，內嵌專屬序號。除具備收藏價值外，掃碼即可開啟 VIP 終身選物優惠與新品優先購買權。" }
      ]
    },
  ],
} as const;

export const FINISHES = {
  name: "finish",
  options: [
    { label: "標準簡約禮盒", value: "standard", description: "經典極簡設計", price: PRODUCT_PRICES.finish.standard },
    { label: "永續再生禮盒", value: "recycled", description: "自然的纖維手感，100% 可回收材質", price: PRODUCT_PRICES.finish.recycled },
    { label: "亞麻質感禮盒", value: "linen", description: "表面帶有優雅織紋，觸感溫潤高級", price: PRODUCT_PRICES.finish.linen },
  ],
} as const;

export const DECORATIONS = {
  name: "decorations",
  options: [
    { 
      label: "天然環保亞麻繩", 
      value: "twine", 
      type: "fixed",
      price: PRODUCT_PRICES.decoration.twine,
      description: "植物纖維製成，增添手作溫暖質感" 
    },
    { 
      label: "Vegan 植物蠟封", 
      value: "wax_seal", 
      type: "seasonal",
      price: PRODUCT_PRICES.decoration.wax_seal,
      description: "大豆蠟基底製作，燙印專屬標章" 
    },
    { 
      label: "乾燥花材", 
      value: "botanical", 
      type: "fixed",
      price: PRODUCT_PRICES.decoration.botanical,
      description: "手工製作天然乾燥花材，為整體增添柔和的自然點綴。" ,
      variants: [
        { id: 1, name: "晨曦" },
        { id: 2, name: "薄暮" },
        { id: 3, name: "秋分" },
        { id: 4, name: "情書" },
        { id: 5, name: "暖陽" },
        { id: 6, name: "春櫻" },
        { id: 7, name: "初戀" },
        { id: 8, name: "麥田" },
        { id: 9, name: "靜謐" },
      ]
    },
  ],
} as const;

export type ColorValue = (typeof COLORS)[number]["value"];
export type ModelValue = (typeof MODELS.options)[number]["value"];
export type BoxSetValue = (typeof BOX_SETS.options)[number]["value"];
export type FinishValue = (typeof FINISHES.options)[number]["value"];
export type DecorationValue = (typeof DECORATIONS.options)[number]["value"];
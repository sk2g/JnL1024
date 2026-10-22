/* 修改這個檔案即可更新網站。
   driveFolder：貼上 Google Drive 資料夾的分享連結（知道連結的任何人可檢視）
   photos：想用網站上的照片牆時，把每一張照片的分享連結放進來
   tables：座位。name 是姓名，title 是稱呼，aliases 是暱稱
   換成正式名單後，把 sampleSeating 改成 false
*/
window.WEDDING = {
  partnerA: "J",
  partnerB: "L",
  dateLabel: "2026.10.24",
  weekday: "星期六",
  timeLabel: "",
  venue: "",
  sampleSeating: true,
  driveFolder: "",
  photos: [],
  tables: [
    {
      id: "main",
      label: "主桌",
      note: "家人",
      guests: [
        { name: "林建國", title: "新郎爸爸", aliases: ["爸爸"] },
        { name: "陳淑芬", title: "新郎媽媽", aliases: ["媽媽"] },
        { name: "黃志明", title: "新娘爸爸", aliases: ["爸爸"] },
        { name: "李美玲", title: "新娘媽媽", aliases: ["媽媽"] },
      ],
    },
    {
      id: "1",
      label: "第 1 桌",
      note: "新娘親戚",
      guests: [
        { name: "黃志強", title: "舅舅" },
        { name: "黃美惠", title: "舅媽" },
        { name: "李雅琪", title: "小姨", aliases: ["小姨"] },
        { name: "陳柏宇", title: "表哥", aliases: ["柏宇"] },
      ],
    },
    {
      id: "2",
      label: "第 2 桌",
      note: "新郎親戚",
      guests: [
        { name: "林國榮", title: "伯父" },
        { name: "林春梅", title: "伯母" },
        { name: "林可欣", title: "表妹", aliases: ["可欣"] },
        { name: "張宏達", title: "姑丈" },
      ],
    },
    {
      id: "3",
      label: "第 3 桌",
      note: "大學好友",
      guests: [
        { name: "陳雅婷", title: "大學室友", aliases: ["雅婷", "婷婷"] },
        { name: "周子軒", title: "大學同學", aliases: ["子軒"] },
        { name: "吳承恩", title: "學長" },
        { name: "許安安", title: "社團好友", aliases: ["安安"] },
      ],
    },
    {
      id: "4",
      label: "第 4 桌",
      note: "同事",
      guests: [
        { name: "張偉誠", title: "同事" },
        { name: "劉欣怡", title: "同事", aliases: ["欣怡"] },
        { name: "蔡明哲", title: "主管" },
        { name: "楊書涵", title: "同事", aliases: ["書涵"] },
      ],
    },
    {
      id: "5",
      label: "第 5 桌",
      note: "高中同學",
      guests: [
        { name: "王小明", title: "高中同學", aliases: ["小明", "明明"] },
        { name: "鄭宇翔", title: "高中同學", aliases: ["阿翔"] },
        { name: "謝宜蓁", title: "高中同學", aliases: ["宜蓁"] },
        { name: "洪浩宇", title: "高中死黨", aliases: ["浩宇"] },
      ],
    },
    {
      id: "6",
      label: "第 6 桌",
      note: "朋友",
      guests: [
        { name: "孫詩涵", title: "閨蜜", aliases: ["詩涵"] },
        { name: "徐浩然", title: "朋友" },
        { name: "馬俊傑", title: "球友" },
        { name: "丁柔安", title: "朋友", aliases: ["柔安"] },
      ],
    },
  ],
};

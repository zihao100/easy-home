module.exports = {
  // base: "/home/",
  title: "前端小站",
  description: "前端技术栈，快速入门学习手册",
  head: [
    ["link", { rel: "icon", href: "/images/logo.png" }],
    ["meta", { name: "author", content: "zihao" }],
    ["meta", { name: "keywords", content: "前端技术栈，快速入门学习手册" }],
  ],
  themeConfig: {
    displayAllHeaders: true,
    nav: [
      {
        text: "前端知识",
        items: [
          {
            text: "javascript",
            link: "/note/javascript/",
          },
          {
            text: "vue2",
            link: "/note/vue2/",
          },
          {
            text: "vue3",
            link: "/note/vue3/",
          },
          {
            text: "react",
            link: "/note/react/",
          },
        ],
      },
      {
        text: "后端知识",
        items: [
          {
            text: "nodejs",
            link: "/note/nodejs/",
          },
        ],
      },

      { text: "easy-admin演示站", link: "https://qianduan.icu/admin/login" },
    ],

    sidebar: {
      "/note/javascript/": [
        {
          title: "javascript",
          collapsable: false,
          children: [""],
        },
      ],
      "/note/vue2/": [
        {
          title: "基础",
          collapsable: true,
          sidebarDepth: 6,
          children: [
            "",
            "/note/vue2/02.options.md",
            "/note/vue2/05.component.md",
          ],
        },
        {
          title: "进阶",
          collapsable: true,
          sidebarDepth: 6,
          children: [
            "/note/vue2/11.reuse.md",
            "/note/vue2/12.router.md",
            "/note/vue2/13.vuex.md",
            "/note/vue2/14.mobile-adaptation.md",
          ],
        },
        {
          title: "总结",
          collapsable: true,
          sidebarDepth: 6,
          children: [
            "/note/vue2/99.sumup.md",
          ],
        },
      ],
      "/note/vue3/": [
        {
          title: "vue3",
          collapsable: true,
          sidebarDepth: 6,
          children: [""],
        },
      ],
      "/note/react/": [
        {
          title: "react",
          collapsable: false,
          children: [""],
        },
      ],
      "/note/nodejs/": [
        {
          title: "nodejs",
          collapsable: false,
          children: [""],
        },
      ],
    },
  },
};

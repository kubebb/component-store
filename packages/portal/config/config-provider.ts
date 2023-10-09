const config = {
  antd: {
    configProvider: {
      space: { size: 12 },
      theme: {
        token: {
          fontSize: 12,
          colorLink: '#4461eb',
          borderRadius: 4,
          colorPrimary: '#4461eb',
          colorLinkHover: '#6f8bf7',
        },
        components: {
          Row: { rowVerticalGutter: 16, rowHorizontalGutter: 16 },
          Page: {
            pagePadding: 20,
            pageBackground: '#ecf0f4',
            pagePaddingTop: 16,
            pagePaddingBottom: 32,
          },
        },
      },
      componentSize: 'middle',
    },
  },
  space: { size: 12 },
  theme: {
    token: {
      fontSize: 12,
      colorLink: '#4461EB',
      colorError: '#f85a5a',
      borderRadius: 4,
      colorPrimary: '#4461EB',
      colorSuccess: '#5cb85c',
      colorWarning: '#ffbf00',
      colorLinkHover: '#6f8bf7',
    },
    components: {
      Row: { rowVerticalGutter: 16, rowHorizontalGutter: 16 },
      Page: {
        pagePadding: 20,
        pageBackground: 'transparent',
        pagePaddingTop: 16,
        pagePaddingBottom: 32,
      },
    },
  },
  translate: { baidu: { appid: '20220803001292685', secret: '19Kxdh1bibvfsPduL9Qm' } },
  componentSize: 'middle',
};

export default config;

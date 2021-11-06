module.exports = {
  chainWebpack: (config) => {
    config
      .plugin('html')
      .tap((args) => {
        // eslint-disable-next-line no-param-reassign
        args[0].title = '闹钟房间';
        return args;
      });
  },
  pluginOptions: {
    electronBuilder: {
      builderOptions: {
        appId: 'ltd.zklighting.timer',
        // eslint-disable-next-line no-template-curly-in-string
        copyright: 'Copyright © year ${author}',
        productName: '闹钟房间',
      },
    },
  },
};

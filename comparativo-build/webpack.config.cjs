// =====================================================================
// webpack.config.cjs — o MESMO projeto, empacotado com o WEBPACK
// =====================================================================
// ARQUIVO DE LEITURA (comparação). Não é usado na aula nem no deploy.
// Instalação necessária se quiser experimentar:
//   npm install -D webpack webpack-cli webpack-dev-server html-webpack-plugin \
//                  mini-css-extract-plugin css-loader
// (Você também precisaria remover a tag <script> do index.html, pois o
//  HtmlWebpackPlugin injeta a dele sozinho.)
//
// O Webpack é o "pai" dos bundlers modernos: MUITO configurável, ecossistema
// gigante de loaders/plugins — e justamente por isso exige mais configuração.
// Compare o tamanho deste arquivo com o vite.config.js!

const path = require('node:path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = {
  mode: 'production',                           // ativa minificação e tree-shaking
  entry: './src/main.js',                       // ponto de entrada
  output: {
    path: path.resolve(__dirname, '../dist-webpack'),
    filename: 'assets/[name]-[contenthash].js', // hash no nome
    clean: true,                                // limpa a pasta antes de gerar
  },
  module: {
    rules: [
      // LOADERS ensinam o Webpack a "entender" outros tipos de arquivo.
      { test: /\.css$/, use: [MiniCssExtractPlugin.loader, 'css-loader'] },
      { test: /\.svg$/, type: 'asset/resource' }, // imagens viram arquivos com hash
    ],
  },
  plugins: [
    // PLUGINS adicionam recursos ao processo de build.
    new HtmlWebpackPlugin({ template: './index.html' }),
    new MiniCssExtractPlugin({ filename: 'assets/[name]-[contenthash].css' }),
    new webpack.DefinePlugin({                  // equivalente ao "define" do Vite
      'import.meta.env.VITE_APP_TITULO': JSON.stringify('Mini Tarefas'),
      'import.meta.env.MODE': JSON.stringify('production'),
      'import.meta.env.PROD': 'true',
      __APP_VERSAO__: JSON.stringify('1.0.0'),
      __BUILD_DATA__: JSON.stringify(new Date().toISOString()),
    }),
  ],
  devServer: { port: 8080 },                    // "npx webpack serve"
};

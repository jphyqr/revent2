const ServiceWorkerWebpackPlugin = require('serviceworker-webpack-plugin');
 
   plugins: [
    
      new ServiceWorkerWebpackPlugin({
         entry: path.join(__dirname, './firebase-messaging-sw.js'),
      })
   ]
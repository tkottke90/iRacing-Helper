import App from './src/app';

const PORT = Number(process.env.PORT) ?? 8080;
const HOST = process.env.HOST ?? '127.0.0.1';

App.listen(PORT, HOST, () => {
  console.log('info', `Server started at: http://${HOST}:${PORT}`);
});

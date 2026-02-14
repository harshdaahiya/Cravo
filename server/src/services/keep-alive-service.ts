import fetch from 'node-fetch';

export const keepAlive = (url: string): void => {
  setInterval(async () => {
    try {
      await fetch(url);
      console.log('Keep-alive ping sent to:', url);
    } catch (err: any) {
      console.log('Keep-alive ping failed for:', url, err.message);
    }
  }, 840000); // 14 minutes (Render's timeout is 15 minutes)
};

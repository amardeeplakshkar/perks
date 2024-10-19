// telegram.d.ts
interface Window {
  Telegram?: {
    WebApp: {
      openLink: (url: string) => void;
    };
  };
}

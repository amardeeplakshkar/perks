// telegram.d.ts
interface Window {
  Telegram?: {
    WebApp: {
      close(): unknown;
      initDataUnsafe: {};
      ready(): unknown;
      openLink: (url: string) => void;
    };
  };
}

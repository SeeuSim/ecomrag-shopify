// global.d.ts
export {}; // This line ensures that the file is treated as a module.

declare global {
  interface Window {
    askShopAI_data?: {
      shopId?: string; // Replace with the actual type of your variable
    };
  }
}
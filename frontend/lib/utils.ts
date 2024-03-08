import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import api from '@/lib/api';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

type TGetShopSettingsReturnType = Partial<{ name: string; introductionMessage: string }>

export async function getShopSettings(gadgetApi: typeof api) {
  let payload: TGetShopSettingsReturnType = {};
  const shopId = sessionStorage.getItem('shop-id')!;
  if (typeof shopId !== 'string') {
    // TODO: add logging
    return payload;
  }

  const query = new URLSearchParams();
  query.set('shopId', shopId);
  const url = `/chatbotSettings?${query.toString()}`;

  const settingsResponse: Response = await gadgetApi.fetch(url, {
    method: 'GET',
  });

  if (!settingsResponse.ok) {
    // TODO: add logging
    return payload;
  }

  const data: Partial<{ name: string; introductionMessage: string }> =
    await settingsResponse.json();

  if (data.name) {
    payload = { ...payload, name: data.name };
  }
  if (data.introductionMessage) {
    payload = { ...payload, introductionMessage: data.introductionMessage };
  }

  return payload;
};

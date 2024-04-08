import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import api from '@/lib/api';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

type TGetShopSettingsReturnType = Partial<{ name: string; introductionMessage: string }>;

export async function getShopSettings(gadgetApi: typeof api) {
  let payload: TGetShopSettingsReturnType = {};

  if (!window.askShopAI_data || !window.askShopAI_data.shopId) {
    // TODO: add logging
    return payload;
  }
  const shopId = window.askShopAI_data.shopId;

  const query = new URLSearchParams();
  query.set('shopId', shopId);
  const url = `/chatbotSettings?${query.toString()}`;

  const settingsResponse: Response = await gadgetApi.fetch(url, {
    method: 'GET',
    headers: {
      'Access-Control-Allow-Origin': window.location.origin,
    },
  });

  if (!settingsResponse.ok) {
    // TODO: add logging
    return payload;
  }

  const data: Partial<{ name: string; introductionMessage: string }> =
    await settingsResponse.json();

  payload = { ...payload, ...data };

  return payload;
}

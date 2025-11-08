import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import Constants from 'expo-constants';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}


export const generateAPIUrl = (relativePath: string) => {
  console.log(Constants.experienceUrl)
  console.log(process.env.EXPO_PUBLIC_API_BASE_URL)
  const origin = Constants.experienceUrl?.replace('exp://', 'http://');

  const path = relativePath.startsWith('/') ? relativePath : `/${relativePath}`;

  if (process.env.NODE_ENV === 'development') {
    return origin?.concat(path);
  }

  if (!process.env.EXPO_PUBLIC_API_BASE_URL) {
    throw new Error(
      'EXPO_PUBLIC_API_BASE_URL environment variable is not defined',
    );
  }

  return process.env.EXPO_PUBLIC_API_BASE_URL?.concat(path);
};
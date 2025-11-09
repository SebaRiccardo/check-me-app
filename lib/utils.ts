import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import Constants from "expo-constants";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const generateAPIUrl = (relativePath: string) => {
  const path = relativePath.startsWith("/") ? relativePath : `/${relativePath}`;
 
  // if (process.env.NODE_ENV === "development") {
  //   // En SDK 49+, usa hostUri en lugar de experienceUrl
  //   const hostUri = Constants.expoConfig?.hostUri;

  //   if (!hostUri) {
  //     // Fallback para cuando hostUri no esté disponible

  //     return `http://localhost:8081${path}`;
  //   }

  //   const origin = `http://${hostUri}`;
  //   console.log("URL generada:", { origin, path, full: origin.concat(path) });
  //   return origin.concat(path);
  // }

  if (!process.env.EXPO_PUBLIC_API_BASE_URL) {
    throw new Error(
      "EXPO_PUBLIC_API_BASE_URL no está definida en las variables de entorno",
    );
  }

  const finalPath = process.env.EXPO_PUBLIC_API_BASE_URL.concat(path);
  //console.log("URL de producción generada:", finalPath);
  return finalPath;
};

// export const generateAPIUrl = (relativePath: string) => {
//   console.log("host",Constants)

//   const origin = Constants.experienceUrl?.replace('exp://', 'http://');

//   const path = relativePath.startsWith('/') ? relativePath : `/${relativePath}`;

//   if (process.env.NODE_ENV === 'development') {
//     console.log({ origin,path});
//     return origin?.concat(path);
//   }

//   if (!process.env.EXPO_PUBLIC_API_BASE_URL) {
//     throw new Error(
//       'EXPO_PUBLIC_API_BASE_URL environment variable is not defined',
//     );
//   }

//   return process.env.EXPO_PUBLIC_API_BASE_URL?.concat(path);
// };

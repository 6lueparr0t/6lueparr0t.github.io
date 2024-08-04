import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function sleep(n: number = 500) {
  return new Promise((r) => setTimeout(r, n));
}

export const isEqual = <T extends Record<string, unknown>>(option: T, emptyObject: T): boolean => {
  return Object.keys(option).length === 0 && Object.keys(emptyObject).length === 0;
};

export const get = <T extends object, K extends keyof T>(obj: T, path: K | string, defaultValue?: object): unknown|string => {
  const keys = (typeof path === 'string' ? path.split('.') : [path]) as Array<keyof T>;
  let result: unknown = obj;

  for (const key of keys) {
    result = (result as T)[key];
    if (result === undefined) {
      return defaultValue;
    }
  }

  return result;
}

export const isEmptyObject = (obj: object): boolean => {
  return Object.keys(obj).length === 0;
};

// 객체에서 특정 속성을 선택하는 함수
export const pick = <T, K extends keyof T>(keys: K[], object: T): Pick<T, K> => {
  return Object.assign(
    {},
    ...keys.map(key => {
      if (object && Object.prototype.hasOwnProperty.call(object, key)) {
        return { [key]: object[key] };
      }
    })
  );
};

export const deepClone = (data: string | number | boolean | object): string | number | boolean | object => {
  if (["string", "number", "boolean"].includes(typeof data)) {
    return data;
  } else {
    if (Array.isArray(data)) {
      return data.map((item) => deepClone(item));
    } else {
      const obj: Record<string, unknown> = {};
      for (const key of Object.keys(data)) {
        obj[key] = deepClone((data as Record<string, object>)[key]);
      }
      return obj;
    }
  }
}

export const getColor = (name : string = "red"): string => {
  const colorList = [ "red", "orange", "amber", "yellow", "lime", "green", "emerald", "teal", "cyan", "sky", "blue", "indigo", "violet", "purple", "fuchsia", "pink", "pink" ];

  return colorList.includes(name) ? name : colorList[Math.floor(Math.random() * colorList.length)];
}

import { MoreInfoCustomConfig } from '@types';
import { CONFIG_PATH, CONFIG_NAME } from '../constants';
import YAML from 'yaml';
const randomId = (): string => Math.random().toString(16).slice(2);

export const fetchConfig = async (): Promise<MoreInfoCustomConfig | undefined> => {
  const errorNotFound = `${CONFIG_NAME} not found. Make sure you have a valid ${CONFIG_NAME} file in your www folder.`;
  const randomUrl = `${CONFIG_PATH}?hash=${randomId()}`;
  try {
    const response = await fetch(randomUrl);
    const yamlText = await response.text();
    const config = YAML.parse(yamlText) as MoreInfoCustomConfig;
    return config;
  } catch (e) {
    console.warn(errorNotFound, e);
    return undefined;
  }
};

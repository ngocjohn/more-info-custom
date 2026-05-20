export const CONFIG_NAME = 'more-info-custom-config.yaml';
export const CONFIG_PATH = `/local/${CONFIG_NAME}`;

export enum ELEMENT {
  HA_EXPANSION_PANEL = 'ha-expansion-panel',
  HA_MORE_INFO_DETAILS = 'ha-more-info-details',
  HA_ICON = 'ha-icon',
}

export enum ATTRIBUTE {
  DETAILS_PROCESSED = 'details-processed',
  SLOT = 'slot',
  ICON = 'icon',
}

export enum ATTR_VALUE {
  LEADING_ICON = 'leading-icon',
  EMPTY = '',
  ICONS = 'icons',
}

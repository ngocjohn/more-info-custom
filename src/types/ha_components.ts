import { HomeAssistant } from 'custom-card-helpers';
import { ExtEntityRegistryEntry } from './entity_registry';

export interface HaExtended extends HTMLElement {
  hass: HomeAssistant;
}

export interface HaExpansionPanel extends HTMLElement {
  expanded?: boolean;
  outlined?: boolean;
  leftChevron?: boolean;
  noCollapse?: boolean;
  header?: string;
  secondary?: string;
}

export interface HaMoreInfoDialog extends HTMLElement {
  _entityId?: string | null;
  _currView?: string | null;
  _initialView?: string | null;
  _contentElement?: HTMLDivElement;
  _entry?: ExtEntityRegistryEntry | null;
  _detailsYamlMode?: boolean;
  _toggleDetailsYamlMode(): void;
  _setView(view: string): void;
}

export interface HaMoreInfoDialogInfo extends HTMLElement {
  hass: HomeAssistant;
  entityId: string;
  entry?: ExtEntityRegistryEntry | null;
}

export interface HaMoreInfoDetails extends HTMLElement {
  hass: HomeAssistant;
  params?: {
    entityId: string;
  };
  entry?: ExtEntityRegistryEntry | null;
  yamlMode?: boolean;
}

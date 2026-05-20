import { HomeAssistant } from 'custom-card-helpers';
import { ExtEntityRegistryEntry } from './entity_registry';
export * from './entity_registry';

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

export interface FilterConfig {
  domains?: string[];
  entities?: string[];
}
export interface DetailsEntryConfig {
  exclude?: FilterConfig;
  include?: FilterConfig;
}

export interface ExpansionPanelUiConfig {
  /*
   * Set content expanded by default. Default: false
   */
  expanded?: boolean;
  /*
   * Use outlined style for the expansion panel. Default: false
   */
  outlined?: boolean;
  /*
   * Set chevron toggle icon to the left side. Default: false
   */
  left_chevron?: boolean;
  /*
   * Disable collapsing the expansion panel. Default: false
   */
  no_collapse?: boolean;
  /*
   * Header text for the expansion panel. Default: localized "Details"
   */
  header?: string;
  /*
   * Secondary text for the expansion panel header. Default: none
   */
  secondary?: string;
  /*
   * Icon for the expansion panel header. Default: none
   */
  icon?: string;
  /*
   * Show YAML mode button. Default: false
   */
  show_yaml_mode_button?: boolean;
}

export interface MoreInfoCustomConfig {
  /*
   * Filter to exclude or include entities/domains from showing in the details view.
   */
  filter?: DetailsEntryConfig;
  /*
   * UI configuration for the expansion panel wrapping the details view.
   */
  expansion_panel?: ExpansionPanelUiConfig;
  /*
   * Hide state section in details view. Default: false
   */
  hide_state_details?: boolean;
}

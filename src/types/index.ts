export * from './entity_registry';
export * from './ha_components';

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

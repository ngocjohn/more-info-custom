import { HaExtended, MoreInfoCustomConfig } from '@types';
import { computeDomain } from '@utils/compute_domain';
import { fetchConfig } from '@utils/fetch';
import { HomeAssistant } from 'custom-card-helpers';
import type { HaMoreInfoDialog, HaMoreInfoDialogInfo, HaExpansionPanel, HaMoreInfoDetails } from '@types';
import { HAQuerySelector, HAQuerySelectorEvent, OnMoreInfoDialogOpenDetail } from 'home-assistant-query-selector';
import { ATTR_VALUE, ATTRIBUTE, ELEMENT } from './constants';
import { HomeAssistantStylesManager } from 'home-assistant-styles-manager';

declare global {
  interface Window {
    MoreInfoCustom: object;
  }
}
class MoreInfoCustom {
  constructor() {
    const instance = new HAQuerySelector();
    instance.addEventListener(
      HAQuerySelectorEvent.ON_LISTEN,
      async (event) => {
        const { HOME_ASSISTANT } = event.detail;
        this._ha = (await HOME_ASSISTANT.element) as HaExtended;
        this.run();
      },
      { once: true },
    );

    instance.addEventListener(
      HAQuerySelectorEvent.ON_MORE_INFO_DIALOG_OPEN,
      async (event: CustomEvent<OnMoreInfoDialogOpenDetail>) => {
        this._moreInfoDialog = (await event.detail.HA_MORE_INFO_DIALOG.element) as HaMoreInfoDialog;
        this._moreInfoDialogInfo = (await event.detail.HA_MORE_INFO_DIALOG_INFO.element) as HaMoreInfoDialogInfo;
        this._watchMoreInfoDialog();
      },
    );

    this._styleManager = new HomeAssistantStylesManager({
      prefix: 'more-info-custom',
      namespace: 'more-info-custom',
    });
    instance.listen();
  }

  private _ha!: HaExtended;
  private _config?: MoreInfoCustomConfig;

  private _moreInfoDialog!: HaMoreInfoDialog;
  private _moreInfoDialogInfo!: HaMoreInfoDialogInfo;
  private _styleManager: HomeAssistantStylesManager;
  private _detailsElement?: HaMoreInfoDetails;

  get hass(): HomeAssistant {
    return this._ha.hass;
  }

  private async run() {
    this._config = await fetchConfig();
  }

  private async _watchMoreInfoDialog(): Promise<void> {
    if (!this._moreInfoDialog || !this._moreInfoDialogInfo) return;
    const { _entityId } = this._moreInfoDialog;
    if (!_entityId || !this._evaluateEntityCriteria(_entityId)) {
      return;
    }
    const detailsElement = this.createDetailsElement(_entityId, this._moreInfoDialogInfo.entry);
    const infoContentDiv = this._moreInfoDialogInfo.shadowRoot?.querySelector('.content') as HTMLDivElement;
    if (infoContentDiv && !this._moreInfoDialogInfo.hasAttribute(ATTRIBUTE.DETAILS_PROCESSED)) {
      this._moreInfoDialogInfo.setAttribute(ATTRIBUTE.DETAILS_PROCESSED, ATTR_VALUE.EMPTY);
      infoContentDiv.appendChild(detailsElement);
      this._addStyleToDetailsElement();
    }
  }

  private createDetailsElement(entityId: string, entry?: HaMoreInfoDialogInfo['entry']): HaExpansionPanel {
    const {
      expanded,
      outlined,
      left_chevron: leftChevron,
      no_collapse: noCollapse,
      header,
      secondary,
      icon,
      show_yaml_mode_button: showYamlModeButton,
    } = this._config?.expansion_panel || {};
    const panel = document.createElement(ELEMENT.HA_EXPANSION_PANEL) as HaExpansionPanel;
    panel.expanded = expanded;
    panel.outlined = outlined;
    panel.leftChevron = leftChevron;
    panel.noCollapse = noCollapse;
    panel.header = header ?? this.hass.localize('ui.dialogs.more_info_control.details');
    panel.secondary = secondary;
    if (noCollapse) {
      // Force expanded content
      panel.expanded = true;
    }
    if (icon) {
      panel.appendChild(this._computeHaIcon(icon, ATTR_VALUE.LEADING_ICON));
    }
    if (showYamlModeButton) {
      const yamlModeButton = this._computeHaIcon('mdi:code-braces', ATTR_VALUE.ICONS);
      yamlModeButton.addEventListener('click', this._toggleYamlMode.bind(this));
      panel.appendChild(yamlModeButton);
      panel.leftChevron = true; // Force chevron to left when YAML mode button is shown for better UX
    }
    panel.style.marginTop = 'var(--ha-space-2, 8px)';

    const details = document.createElement(ELEMENT.HA_MORE_INFO_DETAILS) as HaMoreInfoDetails;
    details.hass = this.hass;
    details.params = { entityId };
    details.entry = entry;
    this._detailsElement = details;
    panel.appendChild(details);

    return panel;
  }

  private _computeHaIcon(icon: string, slot?: string): HTMLElement {
    const iconEl = document.createElement(ELEMENT.HA_ICON) as HTMLElement;
    iconEl.setAttribute(ATTRIBUTE.ICON, icon);
    if (slot) {
      iconEl.setAttribute(ATTRIBUTE.SLOT, slot);
    }
    return iconEl;
  }

  private _addStyleToDetailsElement() {
    if (!this._detailsElement) return;
    const style = {
      [':host .content']: {
        padding: '8px 4px !important',
      },
      [':host .content ha-card']: {
        border: 'none',
      },
      [':host .content ha-card .card-content']: {
        paddingInline: 'var(--ha-space-2, 8px) !important',
      },
      [':host .content section']: {
        marginTop: 'var(--ha-space-2, 8px)',
      },

      ...(this._config?.hide_state_details && {
        [':host .content section:first-child']: {
          maxHeight: '0',
          overflow: 'hidden',
          marginBottom: 'calc(-1 * var(--ha-space-4, 16px))',
        },
      }),
    };

    this._styleManager.addStyle(style, this._detailsElement.shadowRoot!);
  }

  private _toggleYamlMode(event: MouseEvent) {
    event?.stopPropagation();
    this._moreInfoDialog._setView('details');
    setTimeout(() => {
      this._moreInfoDialog._toggleDetailsYamlMode();
    }, 0);
  }

  private _evaluateEntityCriteria(entityId: string): boolean {
    if (!this._config) return true;
    const domain = computeDomain(entityId);
    const { exclude, include } = this._config.filter || {};
    const isEntityExcluded = exclude?.entities?.includes(entityId);
    const isDomainExcluded = exclude?.domains?.includes(domain);
    const isEntityIncluded = include?.entities?.includes(entityId);
    const isDomainIncluded = include?.domains?.includes(domain);

    if (isEntityExcluded) return false;
    if (isDomainExcluded && !isEntityIncluded) return false;
    if (isEntityIncluded) return true;
    if (isDomainIncluded && !isEntityExcluded) return true;

    // if include filter domains is empty or not defined, all domains are included by default
    if (include?.domains && include.domains.length === 0) {
      return !isEntityExcluded && !isDomainExcluded;
    }

    // if include filter is not defined, include all by default, and exclude only those explicitly excluded
    if (!include && exclude) {
      return !isEntityExcluded && !isDomainExcluded;
    }

    // if include filter is defined, but the entity/domain is not included, exclude by default
    if (include && !isEntityIncluded && !isDomainIncluded) {
      return false;
    }

    return true;
  }
}

if (!window.MoreInfoCustom) {
  console.info('more-info-custom v0.0.1');
  window.MoreInfoCustom = new MoreInfoCustom();
}

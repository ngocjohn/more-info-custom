# MORE-INFO-CUSTOM

## Installation

1. Download the latest release of the `more-info-custom.js` file and place it in your `www` folder.

2. Add the path to `extra_module_url` in your `configuration.yaml`:

```yaml
frontend:
  extra_module_url:
	- /local/more-info-custom.js
```

3. Restart Home Assistant.

## Configuration

The configuration file must be named `more-info-custom-config.yaml` and placed in the `www` folder root, accessible at `/local/more-info-custom-config.yaml`.

| Property             | Type      | Description                                                                     |
| -------------------- | --------- | ------------------------------------------------------------------------------- |
| `filter`             | `object`  | Filter to exclude or include entities/domains from showing in the details view. |
| `expansion_panel`    | `object`  | UI configuration for the expansion panel wrapping the details view.             |
| `hide_state_details` | `boolean` | Hide state section in details view. Default: `false`                            |

### Filter Configuration

| Property  | Type     | Description                                |
| --------- | -------- | ------------------------------------------ |
| `exclude` | `object` | Filter config to exclude entities/domains. |
| `include` | `object` | Filter config to include entities/domains. |

#### Filter options:

| Property   | Type       | Description                   |
| ---------- | ---------- | ----------------------------- |
| `domains`  | `string[]` | List of domains to filter.    |
| `entities` | `string[]` | List of entity IDs to filter. |

### `ExpansionPanelUiConfig`

| Property                | Type      | Description                                                       |
| ----------------------- | --------- | ----------------------------------------------------------------- |
| `expanded`              | `boolean` | Set content expanded by default. Default: `false`                 |
| `outlined`              | `boolean` | Use outlined style for the expansion panel. Default: `false`      |
| `left_chevron`          | `boolean` | Set chevron toggle icon to the left side. Default: `false`        |
| `no_collapse`           | `boolean` | Disable collapsing the expansion panel. Default: `false`          |
| `header`                | `string`  | Header text for the expansion panel. Default: localized "Details" |
| `secondary`             | `string`  | Secondary text for the expansion panel header. Default: none      |
| `icon`                  | `string`  | Icon for the expansion panel header. Default: none                |
| `show_yaml_mode_button` | `boolean` | Show YAML mode button. Default: `false`                           |

### Example `more-info-custom-config.yaml`

```yaml
filter:
  include:
    domains:
      - light
      - binary_sensor
      - climate
    entities:
      - sensor.adblue_level
      - sensor.outside_temperature
      - sensor.amg_door_frontleft
      - sensor.amg_window_frontleft
      - sensor.amg_door_frontright
      - sensor.amg_window_frontright
      - media_player.living_room_tv
  exclude:
    entities:
      - light.living_room_lamp
      - binary_sensor.front_door
      - climate.living_room_thermostat
expansion_panel:
  header: Custom Title
  secondary: This is a custom details section added to the More Info Dialog.
  show_yaml_mode_button: true
  outlined: true
hide_state_details: true
```

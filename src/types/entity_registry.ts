export interface RegistryEntry {
  created_at: number;
  modified_at: number;
}
export interface EntityRegistryEntry extends RegistryEntry {
  id: string;
  entity_id: string;
  name: string | null;
  icon: string | null;
  platform: string;
  config_entry_id: string | null;
  config_subentry_id: string | null;
  device_id: string | null;
  area_id: string | null;
  labels: string[];
  disabled_by: 'user' | 'device' | 'integration' | 'config_entry' | null;
  hidden_by: Exclude<EntityRegistryEntry['disabled_by'], 'config_entry'>;
  entity_category: 'config' | 'diagnostic' | null;
  has_entity_name: boolean;
  original_name?: string;
  unique_id: string;
  translation_key?: string;
  options: Record<string, unknown> | null;
  categories: Record<string, string>;
}

export interface ExtEntityRegistryEntry extends EntityRegistryEntry {
  capabilities: Record<string, unknown>;
  original_icon?: string;
  device_class?: string;
  original_device_class?: string;
  aliases: (string | null)[];
}

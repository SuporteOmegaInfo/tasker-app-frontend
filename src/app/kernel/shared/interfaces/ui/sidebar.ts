export interface ISidebarItem {
    label: string;
    type: string;
    icon?: string;
    expanded?: boolean;
    disabled?: boolean;
    route?: string;
    entity?: string;
    items?: ISidebarItem[];
    permissions?: string[];
  }
  
  export interface ISidebarItemOptions {
    items: ISidebarItem[];
  }
  
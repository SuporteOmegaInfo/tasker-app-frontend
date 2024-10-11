export interface INavbarItem {
  label: string;
  type: string;
  icon?: string;
  expanded?: boolean;
  disabled?: boolean;
  route?: string;
  entity?: string;
  items?: INavbarItem[];
  roles?: string[];
  action?: string,
  color?: string;
}
  
export interface INavbarItemOptions {
  items?: INavbarItem[];
  side_items?: INavbarItem[];
}
  
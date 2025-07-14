interface MenuItem {
    label: string;
    icon: string;
    path?: string;
    showChildren?: boolean;
    children?: MenuItem[];
}

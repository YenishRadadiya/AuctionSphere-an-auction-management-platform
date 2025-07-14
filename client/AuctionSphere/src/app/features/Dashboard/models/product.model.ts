// models/product.model.ts
export interface Product {
    id: string;
    title: string;
    description: string;
    category: string;
    subCategory?: string;
    price: number;
    quantity: number;
    inventoryStatus: string;
    image?: string;
}

// models/dropdown.model.ts
export interface DropdownItem {
    label: string;
    value: string | number;
}

export interface SubCategoryMapping {
    [key: string]: DropdownItem[];
}
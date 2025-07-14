import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { BehaviorSubject, Observable, catchError, throwError } from 'rxjs';

export interface Product {
    id?: number;
    title: string;
    description: string;
    main_image_url?: string;
    category_id: number;
    seller_id?: number;
    status: 'draft' | 'active' | 'inactive';
    created_at?: string;
    category?: Category;  // ✅ Use full Category type here
    seller?: {
        id: number;
        username: string;
        email: string;
    };
}


export interface Category {
    id: number;
    name: string;
    parent_id?: number; // ✅ Required for main-sub linking
    is_active: boolean;
}



export interface ProductsResponse {
    products: Product[];
    pagination: {
        current_page: number;
        total_pages: number;
        total_products: number;
        has_next: boolean;
        has_prev: boolean;
    };
}

export interface ProductQueryParams {
    page?: number;
    limit?: number;
    category_id?: number;
    status?: string;
    seller_id?: number;
    search?: string;
}

@Injectable({
    providedIn: 'root'
})
export class ProductService {
    private apiUrl = `http://localhost:5000/api/product`;
    private productsSubject = new BehaviorSubject<Product[]>([]);
    products$ = this.productsSubject.asObservable();

    constructor(private http: HttpClient) { }

    // Get Categories
    getCategories(parentId?: number): Observable<Category[]> {
        let params = new HttpParams();
        if (parentId !== undefined) {
            params = params.set('parent_id', parentId.toString());
        }

        return this.http.get<Category[]>(`${this.apiUrl}/category`, { params })
            .pipe(
                catchError(this.handleError)
            );
    }

    // Create Product
    createProduct(productData: FormData): Observable<{ message: string; product: Product }> {
        return this.http.post<{ message: string; product: Product }>(`${this.apiUrl}/add`, productData)
            .pipe(
                catchError(this.handleError)
            );
    }

    // Get All Products with filtering and pagination
    getProducts(queryParams?: ProductQueryParams): Observable<ProductsResponse> {
        let params = new HttpParams();

        if (queryParams) {
            if (queryParams.page) params = params.set('page', queryParams.page.toString());
            if (queryParams.limit) params = params.set('limit', queryParams.limit.toString());
            if (queryParams.category_id) params = params.set('category_id', queryParams.category_id.toString());
            if (queryParams.status) params = params.set('status', queryParams.status);
            if (queryParams.seller_id) params = params.set('seller_id', queryParams.seller_id.toString());
            if (queryParams.search) params = params.set('search', queryParams.search);
        }

        return this.http.get<ProductsResponse>(this.apiUrl, { params })
            .pipe(
                catchError(this.handleError)
            );
    }

    // Get Single Product
    getProduct(id: number): Observable<{ product: Product }> {
        return this.http.get<{ product: Product }>(`${this.apiUrl}/${id}`)
            .pipe(
                catchError(this.handleError)
            );
    }

    // Update Product
    updateProduct(id: number, productData: FormData): Observable<{ message: string; product: Product }> {
        return this.http.put<{ message: string; product: Product }>(`${this.apiUrl}/${id}`, productData)
            .pipe(
                catchError(this.handleError)
            );
    }

    // Delete Product
    deleteProduct(id: number): Observable<{ message: string }> {
        return this.http.delete<{ message: string }>(`${this.apiUrl}/${id}`)
            .pipe(
                catchError(this.handleError)
            );
    }

    // Toggle Product Status
    toggleProductStatus(id: number): Observable<{ message: string; product: Product }> {
        return this.http.patch<{ message: string; product: Product }>(`${this.apiUrl}/${id}/toggle-status`, {})
            .pipe(
                catchError(this.handleError)
            );
    }

    // Helper method to create FormData for product creation/update
    createProductFormData(product: Partial<Product>, imageFile?: File): FormData {
        const formData = new FormData();

        if (product.title) formData.append('title', product.title);
        if (product.description) formData.append('description', product.description);
        if (product.category_id) formData.append('category_id', product.category_id.toString());
        if (product.status) formData.append('status', product.status);
        if (imageFile) formData.append('image', imageFile);

        return formData;
    }

    // Update local products state (for reactive UI)
    updateLocalProducts(products: Product[]): void {
        this.productsSubject.next(products);
    }

    // Add product to local state
    addProductToLocalState(product: Product): void {
        const currentProducts = this.productsSubject.value;
        this.productsSubject.next([product, ...currentProducts]);
    }

    // Update product in local state
    updateProductInLocalState(updatedProduct: Product): void {
        const currentProducts = this.productsSubject.value;
        const index = currentProducts.findIndex(p => p.id === updatedProduct.id);
        if (index !== -1) {
            currentProducts[index] = updatedProduct;
            this.productsSubject.next([...currentProducts]);
        }
    }

    // Remove product from local state
    removeProductFromLocalState(productId: number): void {
        const currentProducts = this.productsSubject.value;
        const filtered = currentProducts.filter(p => p.id !== productId);
        this.productsSubject.next(filtered);
    }

    // Get current products from local state
    getCurrentProducts(): Product[] {
        return this.productsSubject.value;
    }

    // Helper method for file upload validation
    validateImageFile(file: File): { isValid: boolean; error?: string } {
        const maxSize = 5 * 1024 * 1024; // 5MB
        const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];

        if (!allowedTypes.includes(file.type)) {
            return { isValid: false, error: 'Only JPEG, PNG, and WebP images are allowed' };
        }

        if (file.size > maxSize) {
            return { isValid: false, error: 'Image size should not exceed 5MB' };
        }

        return { isValid: true };
    }

    // Helper method to preview image
    previewImage(file: File): Observable<string> {
        return new Observable(observer => {
            const reader = new FileReader();
            reader.onload = () => {
                observer.next(reader.result as string);
                observer.complete();
            };
            reader.onerror = error => observer.error(error);
            reader.readAsDataURL(file);
        });
    }

    // Error handling
    private handleError(error: any): Observable<never> {
        console.error('ProductService error:', error);

        let errorMessage = 'An error occurred';
        if (error.error?.message) {
            errorMessage = error.error.message;
        } else if (error.message) {
            errorMessage = error.message;
        }

        return throwError(() => new Error(errorMessage));
    }

    // Bulk operations (if needed)
    deleteMultipleProducts(productIds: number[]): Observable<any> {
        // If your backend supports bulk delete, implement here
        // For now, we'll delete one by one
        const deletePromises = productIds.map(id => this.deleteProduct(id).toPromise());
        return new Observable(observer => {
            Promise.all(deletePromises)
                .then(results => {
                    observer.next(results);
                    observer.complete();
                })
                .catch(error => observer.error(error));
        });
    }

    // Search products (convenience method)
    searchProducts(searchTerm: string, page: number = 1, limit: number = 10): Observable<ProductsResponse> {
        return this.getProducts({ search: searchTerm, page, limit });
    }

    // Filter products by category
    getProductsByCategory(categoryId: number, page: number = 1, limit: number = 10): Observable<ProductsResponse> {
        return this.getProducts({ category_id: categoryId, page, limit });
    }

    // Filter products by status
    getProductsByStatus(status: string, page: number = 1, limit: number = 10): Observable<ProductsResponse> {
        return this.getProducts({ status, page, limit });
    }
}
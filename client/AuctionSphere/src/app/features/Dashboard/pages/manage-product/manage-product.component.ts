import { Component, OnInit } from '@angular/core';
import { Product, ProductService } from '../../services/product.service';
import { MessageService, ConfirmationService } from 'primeng/api';
import { ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Table, TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';
import { ToolbarModule } from 'primeng/toolbar';
import { InputTextModule } from 'primeng/inputtext';
import { DialogModule } from 'primeng/dialog';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DropdownModule } from 'primeng/dropdown';
import { Category } from '../../services/product.service';


@Component({
  selector: 'app-manage-product',
  templateUrl: './manage-product.component.html',
  styleUrls: ['./manage-product.component.css'],
  imports: [CommonModule, ReactiveFormsModule,
    FormsModule,
    TableModule,
    ButtonModule,
    RippleModule,
    ToolbarModule,
    InputTextModule,
    DialogModule,
    ConfirmDialogModule,
    DropdownModule],
  providers: [MessageService, ConfirmationService],
})

export class ManageProductComponent implements OnInit {
  @ViewChild('dt') table!: Table;

  products: Product[] = [];
  selectedProducts: Product[] = [];

  productDialog = false;
  productForm!: FormGroup;

  mainCategories: Category[] = [];
  subCategories: Category[] = [];

  imageFile: File | null = null;
  imagePreview: string | ArrayBuffer | null = null;

  submitted = false;
  isEdit = false;
  currentEditId: number | null = null;

  constructor(
    private fb: FormBuilder,
    private productService: ProductService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService
  ) { }

  ngOnInit(): void {
    this.initForm();
    this.loadProducts();
    this.loadMainCategories();
  }

  initForm(): void {
    this.productForm = this.fb.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
      main_category_id: [null, Validators.required],
      sub_category_id: [null, Validators.required],
      status: ['draft', Validators.required]
    });

    this.productForm.get('main_category_id')?.valueChanges.subscribe((mainId: number) => {
      this.loadSubCategories(mainId);
      this.productForm.get('sub_category_id')?.reset();
    });
  }

  loadMainCategories(): void {
    this.productService.getCategories().subscribe({
      next: (res) => this.mainCategories = res,
      error: (err) => this.messageService.add({ severity: 'error', summary: 'Error', detail: err.message })
    });
  }

  loadSubCategories(mainCatId: number): void {
    this.productService.getCategories(mainCatId).subscribe({
      next: (res) => this.subCategories = res,
      error: (err) => this.messageService.add({ severity: 'error', summary: 'Error', detail: err.message })
    });
  }

  loadProducts(): void {
    this.productService.getProducts().subscribe({
      next: (res) => this.products = res.products,
      error: (err) => this.messageService.add({ severity: 'error', summary: 'Error', detail: err.message })
    });
  }

  openNew(): void {
    this.submitted = false;
    this.isEdit = false;
    this.currentEditId = null;
    this.productForm.reset();
    this.imagePreview = null;
    this.imageFile = null;
    this.productDialog = true;
  }

  editProduct(product: Product): void {
    this.isEdit = true;
    this.currentEditId = product.id!;
    this.imagePreview = product.main_image_url || null;

    const parentId = product.category?.parent_id || null;

    this.productForm.patchValue({
      title: product.title,
      description: product.description,
      main_category_id: parentId,
      sub_category_id: product.category_id,
      status: product.status
    });

    if (parentId) {
      this.loadSubCategories(parentId);
    }

    this.productDialog = true;
  }

  onFileChange(event: Event): void {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      const validation = this.productService.validateImageFile(file);
      if (!validation.isValid) {
        this.messageService.add({ severity: 'error', summary: 'Invalid Image', detail: validation.error });
        return;
      }

      this.imageFile = file;
      this.productService.previewImage(file).subscribe(preview => this.imagePreview = preview);
    }
  }

  saveProduct(): void {
    this.submitted = true;

    if (this.productForm.invalid) return;

    const { title, description, sub_category_id, status } = this.productForm.value;

    const formData = this.productService.createProductFormData({
      title,
      description,
      category_id: sub_category_id,
      status
    }, this.imageFile || undefined);

    const obs = this.isEdit && this.currentEditId
      ? this.productService.updateProduct(this.currentEditId, formData)
      : this.productService.createProduct(formData);

    obs.subscribe({
      next: (res) => {
        this.messageService.add({ severity: 'success', summary: 'Success', detail: res.message });
        this.loadProducts();
        this.productDialog = false;
      },
      error: (err) => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: err.message });
      }
    });
  }

  deleteProduct(product: Product): void {
    this.confirmationService.confirm({
      message: `Are you sure you want to delete "${product.title}"?`,
      header: 'Confirm Delete',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.productService.deleteProduct(product.id!).subscribe({
          next: () => {
            this.messageService.add({ severity: 'success', summary: 'Deleted', detail: 'Product deleted' });
            this.loadProducts();
          },
          error: (err) => {
            this.messageService.add({ severity: 'error', summary: 'Delete Failed', detail: err.message });
          }
        });
      }
    });
  }

  deleteSelectedProducts(): void {
    const ids = this.selectedProducts.map(p => p.id!);
    this.confirmationService.confirm({
      message: 'Delete selected products?',
      header: 'Confirm Bulk Delete',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.productService.deleteMultipleProducts(ids).subscribe({
          next: () => {
            this.messageService.add({ severity: 'success', summary: 'Deleted', detail: 'Selected products deleted' });
            this.loadProducts();
            this.selectedProducts = [];
          },
          error: (err) => {
            this.messageService.add({ severity: 'error', summary: 'Error', detail: err.message });
          }
        });
      }
    });
  }

  hideDialog(): void {
    this.productDialog = false;
    this.submitted = false;
  }

  onGlobalFilter(table: Table, event: Event): void {
    const input = event.target as HTMLInputElement;
    table.filterGlobal(input.value, 'contains');
  }

  customExport = (products: Product[]): any[] => {
    return products.map(product => ({
      Title: product.title,
      Description: product.description,
      Category: product.category?.name || '',
      Status: product.status,
      CreatedAt: product.created_at || '',
    }));
  };


  exportCSV(): void {
    if (!this.table || !this.products || this.products.length === 0) {
      this.messageService.add({ severity: 'warn', summary: 'No Data', detail: 'Nothing to export' });
      return;
    }

    this.table.exportCSV(); // ✅ now works with customExport
  }


  downloadCSV(): void {
    if (!this.products || this.products.length === 0) {
      this.messageService.add({ severity: 'warn', summary: 'No Data', detail: 'Nothing to export' });
      return;
    }

    const headers = ['Title', 'Description', 'Category', 'Status', 'Created At', 'Image URL'];
    const rows = this.products.map(p => [
      `"${p.title}"`,
      `"${p.description}"`,
      `"${p.category?.name || ''}"`,
      `"${p.status}"`,
      `"${p.created_at || ''}"`,
      `"${p.main_image_url || ''}"`
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map(r => r.join(','))].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', 'products.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }





}

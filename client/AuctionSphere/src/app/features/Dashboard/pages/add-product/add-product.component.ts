import { Component, ElementRef, ViewChild, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { ProductService, Category } from '../../services/product.service';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { DropdownModule } from 'primeng/dropdown';
import { FileUploadModule } from 'primeng/fileupload';
import { ButtonModule } from 'primeng/button';
import { NgIf } from '@angular/common';
import { ToastModule } from 'primeng/toast';

@Component({
  selector: 'app-add-product',
  standalone: true,
  templateUrl: './add-product.component.html',
  styleUrl: './add-product.component.css',
  imports: [
    FormsModule,
    ReactiveFormsModule,
    DropdownModule,
    FileUploadModule,
    ButtonModule,
    ToastModule,
    NgIf
  ],
  providers: [MessageService]
})
export class AddProductComponent implements OnInit {
  productForm!: FormGroup;

  mainCategories: Category[] = [];
  subCategories: Category[] = [];

  imageFile: File | null = null;
  imagePreview: string | ArrayBuffer | null = null;

  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;

  constructor(
    private fb: FormBuilder,
    private productService: ProductService,
    private router: Router,
    private messageService: MessageService
  ) { }

  ngOnInit() {
    this.productForm = this.fb.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
      main_category_id: [null, Validators.required],
      sub_category_id: [null, Validators.required]
    });

    this.loadMainCategories();

    // Watch for main category changes
    this.productForm.get('main_category_id')?.valueChanges.subscribe(mainCatId => {
      this.loadSubCategories(mainCatId);
      this.productForm.get('sub_category_id')?.reset(); // clear sub category
    });
  }

  loadMainCategories() {
    this.productService.getCategories().subscribe({
      next: (res) => (this.mainCategories = res),
      error: (err) => this.messageService.add({ severity: 'error', summary: 'Main Category Load Failed', detail: err.message })
    });
  }

  loadSubCategories(mainCatId: number) {
    this.productService.getCategories(mainCatId).subscribe({
      next: (res) => (this.subCategories = res),
      error: (err) => this.messageService.add({ severity: 'error', summary: 'Sub-Category Load Failed', detail: err.message })
    });
  }

  onFileSelect(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];
      const validation = this.productService.validateImageFile(file);
      if (!validation.isValid) {
        this.messageService.add({ severity: 'error', summary: 'Image Error', detail: validation.error });
        return;
      }

      this.imageFile = file;
      this.productService.previewImage(file).subscribe(preview => (this.imagePreview = preview));
    }
  }

  removeImage(event: Event) {
    event.stopPropagation();
    this.imageFile = null;
    this.imagePreview = null;
    this.fileInput.nativeElement.value = '';
  }

  onSubmit() {
    if (this.productForm.valid && this.imageFile) {
      const { title, description, sub_category_id } = this.productForm.value;

      const formData = this.productService.createProductFormData(
        {
          title,
          description,
          category_id: sub_category_id,
          status: 'draft'
        },
        this.imageFile
      );

      this.productService.createProduct(formData).subscribe({
        next: (res) => {
          this.messageService.add({ severity: 'success', summary: 'Product Created', detail: res.message });
          this.productForm.reset();
          this.imageFile = null;
          this.imagePreview = null;
          this.fileInput.nativeElement.value = '';
        },
        error: (err) => {
          this.messageService.add({ severity: 'error', summary: 'Creation Failed', detail: err.message });
        }
      });
    } else {
      this.messageService.add({ severity: 'error', summary: 'Form Invalid', detail: 'Fill all fields and upload image.' });
    }
  }
}

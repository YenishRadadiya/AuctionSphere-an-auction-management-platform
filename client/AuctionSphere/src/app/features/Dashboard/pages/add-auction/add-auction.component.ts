// src/app/pages/auction/add-auction.component.ts
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AuctionService } from '../../services/auction.service';
import { ProductService, Product } from '../../services/product.service';
import { MessageService } from 'primeng/api';
import { Router } from '@angular/router';
import { DropdownModule } from 'primeng/dropdown';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
// import { InputTextareaModule } from 'primeng/inputtextarea';
import { CalendarModule } from 'primeng/calendar';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';



@Component({
  selector: 'app-add-auction',
  standalone: true,
  templateUrl: './add-auction.component.html',
  styleUrls: ['./add-auction.component.css'],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    DropdownModule,
    ButtonModule,
    InputTextModule,
    // InputTextareaModule,
    CalendarModule,
  ]
})
export class AddAuctionComponent implements OnInit {
  auctionForm!: FormGroup;
  products: Product[] = [];

  constructor(
    private fb: FormBuilder,
    private auctionService: AuctionService,
    private productService: ProductService,
    private messageService: MessageService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.auctionForm = this.fb.group({
      title: ['', Validators.required],
      description: [''],
      product_id: [null, Validators.required],
      base_price: [null, Validators.required],
      increment_percentage: [null, Validators.required],
      publish_time: ['', Validators.required],
      start_time: ['', Validators.required],
      end_time: ['', Validators.required],
      extend_duration: [null],
      auto_extend_threshold: [null],
      status: ['draft', Validators.required]
    });

    this.productService.getProducts().subscribe(res => {
      this.products = res.products;
    });
  }

  submit(): void {
    if (this.auctionForm.invalid) return;

    this.auctionService.create(this.auctionForm.value).subscribe({
      next: () => {
        this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Auction created!' });
        this.router.navigate(['/auctions']);
      },
      error: err => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: err });
      }
    });
  }
}

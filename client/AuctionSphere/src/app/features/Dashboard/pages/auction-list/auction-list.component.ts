import { Component, OnInit, ViewChild } from '@angular/core';
import { AuctionService } from '../../services/auction.service';
import { Auction } from '../../services/auction.service';
import { Table } from 'primeng/table';
import { MessageService } from 'primeng/api';

import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { ToolbarModule } from 'primeng/toolbar';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-auction-list',
  standalone: true,
  templateUrl: './auction-list.component.html',
  styleUrls: ['./auction-list.component.css'],
  providers: [MessageService],
  imports: [
    CommonModule,
    TableModule,
    ToolbarModule,
    InputTextModule,
    ButtonModule
  ]
})
export class AuctionListComponent implements OnInit {
  @ViewChild('dt') table!: Table;
  auctions: Auction[] = [];

  constructor(
    private auctionService: AuctionService,
    private messageService: MessageService,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    const type = this.route.snapshot.data['type'];

    if (type === 'user') {
      this.auctionService.getUserAuctions().subscribe({
        next: (res) => this.auctions = res,
        error: (err) => this.messageService.add({ severity: 'error', summary: 'Error', detail: err })
      });
    } else if (type === 'active') {
      this.auctionService.getActiveAuctions().subscribe({
        next: (res) => this.auctions = res,
        error: (err) => this.messageService.add({ severity: 'error', summary: 'Error', detail: err })
      });
    }
  }

  loadAuctions(): void {
    this.auctionService.getAll().subscribe({
      next: (res) => this.auctions = res,
      error: (err) => this.messageService.add({ severity: 'error', summary: 'Error', detail: err.message })
    });
  }

  onGlobalFilter(table: Table, event: Event): void {
    const input = event.target as HTMLInputElement;
    table.filterGlobal(input.value, 'contains');
  }

  exportCSV(): void {
    this.table.exportCSV();
  }
}

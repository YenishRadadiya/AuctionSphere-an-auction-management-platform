import { Component } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { RouterOutlet } from '@angular/router';
import { ToastModule } from 'primeng/toast';
import { ToastService } from './shared/service/toast/toast.service';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-root',
  imports: [ReactiveFormsModule, RouterOutlet, ToastModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
  providers: [ToastService, MessageService]
})
export class AppComponent {
  title = 'AuctionSphere';
}

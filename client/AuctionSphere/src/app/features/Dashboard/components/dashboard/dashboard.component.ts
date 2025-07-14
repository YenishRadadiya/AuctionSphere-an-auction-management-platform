import { Component } from '@angular/core';
import { SidebarComponent } from "../sidebar/sidebar.component";
import { NavbarComponent } from "../navbar/navbar.component";
import { RouterOutlet, Router } from '@angular/router';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-dashboard',
  imports: [SidebarComponent, NavbarComponent, RouterOutlet, NgIf],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent {
  constructor(public router: Router) { }

  isMainDashboard(): boolean {
    return this.router.url === '/'; // update this path as per your route
  }

}

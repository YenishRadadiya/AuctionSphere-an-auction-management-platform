import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MenuItem } from 'primeng/api';

@Component({
  selector: 'app-sidebar',
  imports: [CommonModule, RouterLink],
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent {
  selectedMenu: string = '';

  // Type the menuItems array using the MenuItem interface
  menuItems: MenuItem[] = [
    { label: 'Dashboard', icon: 'pi pi-home', path: '' },
    {
      label: 'Products',
      icon: 'pi pi-box',
      showChildren: false,
      children: [
        { label: 'Add Product', path: 'product/add', icon: 'pi pi-plus' },
        { label: 'Manage Product', path: 'product/manage', icon: 'pi pi-cog' }
      ]
    },
    {
      label: 'Auctions',
      icon: 'pi pi-tags',
      showChildren: false,
      children: [
        { label: 'Add Auction', path: 'auction/create', icon: 'pi pi-plus' },
        { label: 'Browse All', path: 'auction/all', icon: 'pi pi-eye' },
        { label: 'My Auctions', icon: 'pi pi-list' }
      ]
    },
    {
      label: 'Reportd Auctions', icon: 'pi pi-flag'
    }
    // { label: 'Bids', icon: 'pi pi-chart-bar' },
    // { label: 'Users', icon: 'pi pi-users' },
    // { label: 'Settings', icon: 'pi pi-cog' },

  ];

  // Type the item parameter using the MenuItem interface
  toggleChildMenu(item: MenuItem) {
    item['showChildren'] = !item['showChildren'];
  }

  toggleSidebar() {
    // Logic to toggle the sidebar visibility

  }
}
import { NgIf } from '@angular/common';
import { Component, HostListener } from '@angular/core';
import { AuthenticationService } from '../../../user-auth/services/user-auth/authentication.service';
import { Router, RouterLink } from '@angular/router';
import { ToastService } from '../../../../shared/service/toast/toast.service';

@Component({
  selector: 'app-navbar',
  imports: [NgIf, RouterLink],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {
  constructor(private authService: AuthenticationService, private router: Router, private toast: ToastService) { }

  profileDropdownOpen = false;
  notificationDropdownOpen = false;
  hasNotification = true;

  toggleNotificationDropdown() {
    this.notificationDropdownOpen = !this.notificationDropdownOpen;
  }

  toggleProfileDropdown() {
    this.profileDropdownOpen = !this.profileDropdownOpen;
  }

  @HostListener('document:click', ['$event'])
  handleClickOutside(event: Event) {
    const target = event.target as HTMLElement;

    const clickedInsideNotification = target.closest('.notification-root');
    const clickedInsideProfile = target.closest('.profile-root');

    if (!clickedInsideNotification) {
      this.notificationDropdownOpen = false;
    }

    if (!clickedInsideProfile) {
      this.profileDropdownOpen = false;
    }
  }

  handleLogout() {
    this.authService.logout();
    this.toast.showSuccess('Logout Successful');
    this.router.navigate(['/login']);
  }
}
import { Component, inject } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { debounceTime, distinctUntilChanged } from 'rxjs';
import { AuthService } from '../../../core/services/auth-service';

@Component({
  selector: 'app-navbar',
  imports: [RouterLink, RouterLinkActive, ReactiveFormsModule],
  templateUrl: './navbar.html',
  styleUrl: './navbar.scss',
})
export class Navbar {
  private readonly authService = inject(AuthService);

  searchControl = new FormControl('');
  currentUser = this.authService.currentUser;
  isAuthenticated = this.authService.isAuthenticated;

  constructor(private router: Router) {
    this.searchControl.valueChanges
      .pipe(debounceTime(500), distinctUntilChanged())
      .subscribe((query) => {
        if (query && query.trim().length > 0) {
          this.router.navigate(['/search'], { queryParams: { q: query } });
        }
      });
  }

  clearSearch(): void {
    this.searchControl.setValue('');
  }

  logout(): void {
    this.authService.logout();
  }
}

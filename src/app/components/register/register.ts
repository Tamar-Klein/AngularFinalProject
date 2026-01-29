import { Component, inject } from '@angular/core';
import { AbstractControl, FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth-service';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';

// Material Imports
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'register',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterLink,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatSnackBarModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './register.html',
  styleUrl: './register.css',
})
export class Register {

  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);
  private snackBar = inject(MatSnackBar);

  isLoading = false;
  hidePassword = true;
  hideConfirmPassword = true;

  userForm = this.fb.nonNullable.group({
    name: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
    confirmPassword: ['', Validators.required]
  }, { validators: this.matchPassword });

  matchPassword(form: AbstractControl) {
    const password = form.get('password')?.value;
    const confirm = form.get('confirmPassword')?.value;
    if (password && confirm && password !== confirm) {
      return { passwordsNotMatch: true }
    }
    return null;
  }

  onSubmit() {
    if (this.userForm.valid) {
      this.isLoading = true; 
      
      const { name, email, password } = this.userForm.getRawValue();
      
      this.authService.register({ name, email, password }).subscribe({
        next: (response) => {
          this.isLoading = false;
          this.snackBar.open('🎉 Registration successful! Redirecting...', 'Close', {
            duration: 3000,
            panelClass: ['success-snackbar'],
            verticalPosition: 'top'
          });
          this.router.navigate(['/projects']);
        },
        error: (err) => {
          this.isLoading = false;
          const errorMsg = err.error?.message || 'An unexpected error occurred.';
          
          this.snackBar.open(`❌ ${errorMsg}`, 'Close', {
            duration: 5000,
            panelClass: ['error-snackbar'],
            verticalPosition: 'top'
          });
        }
      });
    }
  }

  getNameError() {
    return this.userForm.get('name')?.hasError('required') ? 'Name is required' : '';
  }

  getEmailError() {
    if (this.userForm.get('email')?.hasError('required')) return 'Email is required';
    if (this.userForm.get('email')?.hasError('email')) return 'Invalid email address';
    return '';
  }

  getPasswordError() {
    if (this.userForm.get('password')?.hasError('required')) return 'Password is required';
    if (this.userForm.get('password')?.hasError('minlength')) return 'At least 6 characters required';
    return '';
  }
}
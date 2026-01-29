import { Component, inject, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AuthService } from './services/auth-service';


@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('project');
private authService = inject(AuthService);

  ngOnInit() {
    const token = this.authService.getToken();
    if (token) {
      this.authService.getCurrentUser().subscribe({
        error: () => this.authService.logout() 
      });
    }

}
}

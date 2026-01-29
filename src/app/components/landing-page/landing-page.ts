import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'landing-page',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule
  ],
  templateUrl: './landing-page.html',
  styleUrl: './landing-page.css',
})
export class LandingPage {
  private router = inject(Router);
  features = [
    {
      icon: 'dashboard',
      title: 'Unified Dashboard',
      description: 'See everything at a glance. Your tasks, projects, and deadlines in one beautiful view.'
    },
    {
      icon: 'people',
      title: 'Team Collaboration',
      description: 'Work together seamlessly. Real-time updates keep everyone on the same page.'
    },
    {
      icon: 'analytics',
      title: 'Smart Analytics',
      description: 'Track progress effortlessly. Visual insights that help you make better decisions.'
    },
    {
      icon: 'integration_instructions',
      title: 'Easy Integration',
      description: 'Connect your favorite tools. TaskPilot plays nice with everything you already use.'
    }
  ];

  testimonials = [
    {
      name: 'Sarah Chen',
      role: 'Product Manager',
      company: 'TechCorp',
      text: 'TaskPilot transformed how our team works. We\'re 40% more productive and actually enjoy using it.',
      avatar: '👩‍💼'
    },
    {
      name: 'Marcus Johnson',
      role: 'Startup Founder',
      company: 'GrowthLab',
      text: 'Finally, a project management tool that doesn\'t feel like homework. Simple, powerful, beautiful.',
      avatar: '👨‍💻'
    },
    {
      name: 'Emma Rodriguez',
      role: 'Design Lead',
      company: 'CreativeStudio',
      text: 'The interface is gorgeous and the features are exactly what we need. Nothing more, nothing less.',
      avatar: '👩‍🎨'
    }
  ];

  goToLogin() {
    this.router.navigate(['/login']);
  }

  goToRegister() {
    this.router.navigate(['/register']);
  }

  scrollToFeatures() {
    document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' });
  }
}

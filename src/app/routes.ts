import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: 'slide-wizard', loadComponent: () => import('../wizards/slide-wizard.component').then(m => m.SlideWizardComponent) },
  { path: 'cube-wizard', loadComponent: () => import('../wizards/cube-wizard.component').then(m => m.CubeWizardComponent) },
  { path: 'flip-wizard', loadComponent: () => import('../wizards/flip-wizard.component').then(m => m.FlipWizardComponent) },
  { path: '', redirectTo: '/slide-wizard', pathMatch: 'full' }
];
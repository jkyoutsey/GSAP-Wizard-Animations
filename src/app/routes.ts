import { Routes } from '@angular/router';

export const routes: Routes = [
	{
		path: 'slide-wizard',
		loadComponent: () => import('../wizards/slide-wizard.component').then((m) => m.SlideWizardComponent),
	},
	{
		path: 'flip-wizard',
		loadComponent: () => import('../wizards/flip-wizard.component').then((m) => m.FlipWizardComponent),
	},
	{
		path: 'glass-slide-wizard',
		loadComponent: () => import('../wizards/glass-slide-wizard.component').then((m) => m.GlassSlideWizardComponent),
	},
	{ path: '', redirectTo: '/slide-wizard', pathMatch: 'full' },
];

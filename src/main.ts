import { Component } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter, RouterLink, RouterOutlet } from '@angular/router';
import { routes } from './app/routes';

@Component({
	selector: 'app-root',
	standalone: true,
	imports: [RouterOutlet, RouterLink],
	template: `
		<div class="container">
			<div class="buttons">
				<a routerLink="/slide-wizard" class="button">Slide Wizard</a>
				<a routerLink="/flip-wizard" class="button">Flip Wizard</a>
			</div>
			<router-outlet></router-outlet>
		</div>
	`,
	styles: [
		`
			.container {
				min-height: 100vh;
				display: flex;
				flex-direction: column;
				padding: 2rem;
			}
			.buttons {
				display: flex;
				gap: 1rem;
				justify-content: center;
				margin-bottom: 2rem;
			}
			.button {
				padding: 0.75rem 1.5rem;
				background-color: #3f51b5;
				color: white;
				border-radius: 4px;
				text-decoration: none;
				transition: background-color 0.3s;
			}
			.button:hover {
				background-color: #283593;
			}
		`,
	],
})
export class App {}

bootstrapApplication(App, {
	providers: [provideRouter(routes)],
});

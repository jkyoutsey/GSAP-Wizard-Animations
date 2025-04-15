import { CommonModule } from '@angular/common';
import { AfterViewInit, Component } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { gsap } from 'gsap';
import { BaseWizardComponent } from './base-wizard.component';

@Component({
	selector: 'app-glass-slide-wizard',
	standalone: true,
	imports: [CommonModule, ReactiveFormsModule],
	template: `
		<div class="wizard-container">
			<div class="steps-container">
				<div *ngFor="let step of steps; let i = index" #step class="step" [class.active]="i === currentStep">
					<div class="step-content">
						<h2>Glass Slide Wizard - Step {{ i + 1 }}</h2>
						<p>{{ step.content }}</p>

						<ng-container *ngIf="i === 1">
							<div class="radio-group">
								<div *ngFor="let option of step.options" class="radio-option">
									<input
										type="radio"
										[id]="option.id"
										[value]="option.id"
										name="step2option"
										(change)="onOptionChange($event)"
									/>
									<label [for]="option.id">{{ option.label }}</label>
								</div>
							</div>

							<div class="date-form" [style.display]="'none'">
								<p class="form-description">Please select your preferred dates:</p>
								<div class="date-inputs" [formGroup]="dateForm">
									<div class="date-field">
										<label for="startDate">Start Date</label>
										<input type="date" id="startDate" formControlName="startDate" />
									</div>
									<div class="date-field">
										<label for="endDate">End Date</label>
										<input type="date" id="endDate" formControlName="endDate" />
									</div>
								</div>
							</div>
						</ng-container>
					</div>
				</div>
			</div>
			<div class="navigation">
				<button (click)="previousStep()" [disabled]="currentStep === 0">Previous</button>
				<button (click)="nextStep()" [disabled]="currentStep === steps.length - 1">Next</button>
			</div>
		</div>
	`,
	styles: [
		`
			.wizard-container {
				max-width: 600px;
				margin: 0 auto;
				overflow: hidden;
			}
			.steps-container {
				position: relative;
				height: 400px;
			}
			.step {
				position: absolute;
				width: 100%;
				height: 100%;
				padding: 2rem;
				background: white;
				border-radius: 8px;
				box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
				opacity: 0;
				overflow-y: auto;
			}
			.step-content {
				opacity: 1;
			}
			.navigation {
				display: flex;
				justify-content: space-between;
				margin-top: 2rem;
			}
			button {
				padding: 0.75rem 1.5rem;
				background-color: #3f51b5;
				color: white;
				border: none;
				border-radius: 4px;
				cursor: pointer;
			}
			button:disabled {
				background-color: #ccc;
				cursor: not-allowed;
			}
			.radio-group {
				margin: 1rem 0;
			}
			.radio-option {
				margin: 0.5rem 0;
			}
			.radio-option label {
				margin-left: 0.5rem;
			}
			.date-form {
				margin-top: 1rem;
			}
			.form-description {
				margin-bottom: 0.5rem;
				color: #666;
			}
			.date-inputs {
				display: flex;
				gap: 1rem;
			}
			.date-field {
				flex: 1;
			}
			.date-field label {
				display: block;
				margin-bottom: 0.5rem;
				color: #333;
			}
			.date-field input {
				width: 100%;
				padding: 0.5rem;
				border: 1px solid #ccc;
				border-radius: 4px;
			}
		`,
	],
})
export class GlassSlideWizardComponent extends BaseWizardComponent implements AfterViewInit {
	ngAfterViewInit() {
		this.stepElements.forEach((el, index) => {
			gsap.set(el.nativeElement, {
				opacity: index === 0 ? 1 : 0,
				scale: index === 0 ? 1 : 1.05,
				zIndex: index === 0 ? 10 : 1,
			});

			// Initialize date form in hidden state but don't affect its height or opacity yet
			const dateForm = el.nativeElement.querySelector('.date-form');
			if (dateForm) {
				gsap.set(dateForm, {
					display: 'none',
				});
			}
		});
	}

	animateToStep(newStep: number) {
		const direction = newStep > this.currentStep ? 1 : -1;
		const currentEl = this.stepElements.get(this.currentStep)?.nativeElement;
		const nextEl = this.stepElements.get(newStep)?.nativeElement;

		// Apply glass effect during transition
		gsap.to(currentEl, {
			backdropFilter: 'blur(8px)',
			WebkitBackdropFilter: 'blur(8px)',
			background: 'rgba(255, 255, 255, 0.85)',
			duration: 0.3,
		});

		// Animate current step out
		gsap.to(currentEl, {
			opacity: 0.3,
			scale: 0.95,
			duration: 0.5,
			ease: 'power2.inOut',
			onComplete: () => {
				// Reset styles when animation completes
				gsap.set(currentEl, {
					backdropFilter: 'none',
					WebkitBackdropFilter: 'none',
					background: 'white',
					zIndex: 1,
				});
			},
		});

		// Prepare and animate the next step
		gsap.set(nextEl, {
			opacity: 0,
			scale: 1.05,
			zIndex: 10,
			xPercent: direction * 5,
		});

		gsap.to(nextEl, {
			opacity: 1,
			scale: 1,
			xPercent: 0,
			duration: 0.5,
			ease: 'power2.out',
		});
	}

	animateDateForm(show: boolean, element: HTMLElement) {
		// Kill any running animations
		gsap.killTweensOf(element);

		if (show) {
			// Force display block first
			element.style.display = 'block';

			// Set initial state
			gsap.set(element, {
				opacity: 0,
				scale: 0.95,
				xPercent: -3,
				transformOrigin: 'top center',
				display: 'block', // Ensure it's visible
			});

			// Create glass-like appearing animation similar to step transitions
			gsap.to(element, {
				opacity: 1,
				scale: 1,
				xPercent: 0,
				duration: 0.5,
				ease: 'power2.out',
				backdropFilter: 'blur(4px)',
				WebkitBackdropFilter: 'blur(4px)',
				background: 'rgba(255, 255, 255, 0.95)',
				onComplete: () => {
					// Reset backdrop filter after animation completes
					gsap.to(element, {
						backdropFilter: 'none',
						WebkitBackdropFilter: 'none',
						background: 'white',
						duration: 0.2,
					});
				},
			});
		} else {
			// Create glass-like disappearing animation
			gsap.to(element, {
				opacity: 0,
				scale: 0.95,
				xPercent: 3,
				duration: 0.4,
				ease: 'power2.in',
				backdropFilter: 'blur(4px)',
				WebkitBackdropFilter: 'blur(4px)',
				background: 'rgba(255, 255, 255, 0.85)',
				onComplete: () => {
					element.style.display = 'none'; // Directly set display none
				},
			});
		}
	}

	override onOptionChange(event: Event) {
		// Log the selected value to debug
		const target = event.target as HTMLInputElement;
		console.log('Selected option:', target.value, target.id);

		const stepElement = this.stepElements.get(1)?.nativeElement;

		if (stepElement) {
			const dateForm = stepElement.querySelector('.date-form');
			console.log('Date form found:', !!dateForm);

			if (dateForm) {
				// Show the date form for ANY option that contains "2" (like "option2" or "choice2")
				// This makes our check more flexible
				if (target.value.includes('2') || target.id.includes('2')) {
					console.log('Showing date form');
					this.animateDateForm(true, dateForm);
				} else {
					console.log('Hiding date form');
					this.animateDateForm(false, dateForm);
				}
			}
		}
	}
}

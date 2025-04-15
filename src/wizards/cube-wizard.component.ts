import { CommonModule } from '@angular/common';
import { AfterViewInit, Component } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { gsap } from 'gsap';
import { BaseWizardComponent } from './base-wizard.component';

@Component({
	selector: 'app-cube-wizard',
	standalone: true,
	imports: [CommonModule, ReactiveFormsModule],
	template: `
		<div class="wizard-container">
			<div class="cube-container">
				<div class="cube">
					<div
						*ngFor="let step of steps; let i = index"
						#step
						class="step"
						[class.active]="i === currentStep"
						[class.inactive]="i !== currentStep"
					>
						<h2>{{ step.title }}</h2>
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
				perspective: 2000px;
			}
			.cube-container {
				height: 400px;
				position: relative;
				transform-style: preserve-3d;
			}
			.cube {
				position: relative;
				width: 100%;
				height: 100%;
				transform-style: preserve-3d;
				transition: transform 0.6s;
				pointer-events: none; /* Let events pass through to children */
			}
			.step {
				position: absolute;
				width: 100%;
				height: 100%;
				padding: 2rem;
				background: white;
				border-radius: 8px;
				box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
				backface-visibility: hidden;
				transform-origin: center;
				transform-style: flat; /* Change from preserve-3d to flat */
				overflow-y: auto;
				pointer-events: auto; /* Ensure pointer events work */
			}
			.step.active {
				z-index: 10;
				pointer-events: auto;
			}
			.step.inactive {
				z-index: -1;
				pointer-events: none;
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
				position: relative;
				z-index: 10;
			}
			.radio-option {
				margin: 0.5rem 0;
				position: relative;
				z-index: 10;
				pointer-events: auto; /* Explicitly enable pointer events */
			}
			.radio-option input[type='radio'] {
				pointer-events: auto; /* Make sure radio inputs receive clicks */
				position: relative;
				z-index: 15;
			}
			.radio-option label {
				margin-left: 0.5rem;
				pointer-events: auto; /* Make sure labels receive clicks */
				position: relative;
				z-index: 15;
			}
			.date-form {
				margin-top: 1.5rem;
				position: relative;
				transform-style: preserve-3d;
				perspective: 1000px;
			}
			.form-description {
				margin-bottom: 1rem;
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
export class CubeWizardComponent extends BaseWizardComponent implements AfterViewInit {
	ngAfterViewInit() {
		this.stepElements.forEach((el, index) => {
			// Fix for radio buttons in step 2
			if (index === 1) {
				const options = el.nativeElement.querySelectorAll('.radio-option input');
				options.forEach((option: HTMLElement) => {
					option.style.pointerEvents = 'auto';
					option.style.position = 'relative';
					option.style.zIndex = '20';
				});
			}

			gsap.set(el.nativeElement, {
				rotateY: index * 90,
				translateZ: 300,
				transformOrigin: 'center center -300px',
				// Ensure only the current step is visible initially
				visibility: index === this.currentStep ? 'visible' : 'hidden',
				zIndex: index === this.currentStep ? 10 : -1,
			});

			// Initialize date form in hidden state
			const dateForm = el.nativeElement.querySelector('.date-form');
			if (dateForm) {
				gsap.set(dateForm, {
					display: 'none', // Start with display none instead of block
					opacity: 0,
					scale: 0.5,
				});
			}
		});

		// Ensure the first step is visible and active
		this.updateStepVisibility(0);
	}

	// Update which step is visible after animation
	updateStepVisibility(activeStep: number) {
		this.stepElements.forEach((el, index) => {
			if (index === activeStep) {
				gsap.set(el.nativeElement, {
					visibility: 'visible',
					zIndex: 10,
					pointerEvents: 'auto',
				});
			} else {
				gsap.set(el.nativeElement, {
					visibility: 'hidden',
					zIndex: -1,
					pointerEvents: 'none',
				});
			}
		});
	}

	animateToStep(newStep: number) {
		const rotation = newStep * -90;

		gsap.to(this.stepElements.first.nativeElement.parentElement, {
			rotateY: rotation,
			duration: 1,
			ease: 'power2.inOut',
			onComplete: () => {
				// When animation completes, ensure only the current step is visible
				this.updateStepVisibility(newStep);
			},
		});
	}

	animateDateForm(show: boolean, element: HTMLElement) {
		if (show) {
			// First set display to block before animating
			gsap.set(element, { display: 'block' });

			// Then animate the other properties
			gsap.to(element, {
				rotateY: 0,
				opacity: 1,
				scale: 1,
				duration: 0.8,
				ease: 'elastic.out(1,0.7)',
			});
		} else {
			// Hide animation with 3D rotation effect
			gsap.to(element, {
				rotateY: -90,
				opacity: 0,
				scale: 0.5,
				duration: 0.6,
				ease: 'back.in(1.5)',
				onComplete: () => {
					gsap.set(element, { display: 'none' });
				},
			});
		}
	}
}

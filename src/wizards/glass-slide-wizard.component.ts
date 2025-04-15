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

			// Initialize date form in hidden state
			const dateForm = el.nativeElement.querySelector('.date-form');
			if (dateForm) {
				gsap.set(dateForm, {
					display: 'none',
					height: 0,
					opacity: 0,
					overflow: 'hidden',
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
		gsap.killTweensOf(element.children);

		if (show) {
			// Make the container visible but with zero height
			gsap.set(element, {
				display: 'block',
				height: 0,
				opacity: 1,
				overflow: 'hidden',
			});

			// Hide the children initially
			gsap.set(element.children, {
				opacity: 0,
				y: 20,
			});

			// Create animation timeline
			const tl = gsap.timeline();

			// First expand the container
			tl.to(element, {
				height: 'auto',
				duration: 0.4,
				ease: 'power2.out',
				onComplete: () => {
					gsap.set(element, { overflow: 'visible' });
				},
			});

			// Then animate in the children with stagger
			tl.to(
				element.children,
				{
					opacity: 1,
					y: 0,
					duration: 0.3,
					ease: 'power2.out',
					stagger: 0.05,
				},
				'-=0.1'
			);
		} else {
			// For hiding, first capture current height
			const currentHeight = element.offsetHeight;

			// Set fixed height to prepare for animation
			gsap.set(element, {
				height: currentHeight,
				overflow: 'hidden',
			});

			// Create timeline for exit animation
			const tl = gsap.timeline({
				onComplete: () => {
					gsap.set(element, { display: 'none' });
				},
			});

			// First animate out the children
			tl.to(element.children, {
				opacity: 0,
				y: 10,
				duration: 0.25,
				ease: 'power2.in',
				stagger: 0.03,
			});

			// Then collapse the container
			tl.to(
				element,
				{
					height: 0,
					duration: 0.35,
					ease: 'power2.inOut',
				},
				'-=0.15'
			);
		}
	}
}

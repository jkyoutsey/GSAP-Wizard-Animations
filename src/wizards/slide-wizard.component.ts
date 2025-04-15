import { Component, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { gsap } from 'gsap';
import { BaseWizardComponent } from './base-wizard.component';

@Component({
  selector: 'app-slide-wizard',
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
                  >
                  <label [for]="option.id">{{ option.label }}</label>
                </div>
              </div>

              <div *ngIf="showDateForm" class="date-form">
                <p class="form-description">Please select your preferred dates:</p>
                <div class="date-inputs" [formGroup]="dateForm">
                  <div class="date-field">
                    <label for="startDate">Start Date</label>
                    <input 
                      type="date" 
                      id="startDate" 
                      formControlName="startDate"
                    >
                  </div>
                  <div class="date-field">
                    <label for="endDate">End Date</label>
                    <input 
                      type="date" 
                      id="endDate" 
                      formControlName="endDate"
                    >
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
  styles: [`
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
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
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
      margin-top: 1.5rem;
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
  `]
})
export class SlideWizardComponent extends BaseWizardComponent implements AfterViewInit {
  ngAfterViewInit() {
    this.stepElements.forEach((el, index) => {
      gsap.set(el.nativeElement, {
        opacity: index === 0 ? 1 : 0,
        x: index === 0 ? 0 : '100%'
      });
    });
  }

  animateToStep(newStep: number) {
    const direction = newStep > this.currentStep ? 1 : -1;
    const currentEl = this.stepElements.get(this.currentStep)?.nativeElement;
    const nextEl = this.stepElements.get(newStep)?.nativeElement;

    gsap.to(currentEl, {
      x: -100 * direction + '%',
      opacity: 0,
      duration: 0.5
    });

    gsap.fromTo(nextEl,
      { x: 100 * direction + '%', opacity: 0 },
      { x: 0, opacity: 1, duration: 0.5 }
    );
  }
}
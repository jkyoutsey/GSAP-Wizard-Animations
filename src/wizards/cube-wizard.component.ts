import { Component, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
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
          <div *ngFor="let step of steps; let i = index" #step class="step" [class.active]="i === currentStep">
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
    }
    .step {
      position: absolute;
      width: 100%;
      height: 100%;
      padding: 2rem;
      background: white;
      border-radius: 8px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
      backface-visibility: hidden;
      transform-origin: center;
      transform-style: preserve-3d;
      overflow-y: auto;
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
export class CubeWizardComponent extends BaseWizardComponent implements AfterViewInit {
  ngAfterViewInit() {
    this.stepElements.forEach((el, index) => {
      gsap.set(el.nativeElement, {
        rotateY: index * 90,
        translateZ: 300,
        transformOrigin: "center center -300px"
      });
    });
  }

  animateToStep(newStep: number) {
    const rotation = newStep * -90;
    
    gsap.to(this.stepElements.first.nativeElement.parentElement, {
      rotateY: rotation,
      duration: 1,
      ease: 'power2.inOut'
    });
  }
}
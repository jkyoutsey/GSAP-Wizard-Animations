import { Component, ElementRef, ViewChildren, QueryList, AfterViewInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';

@Component({ template: '' })
export abstract class BaseWizardComponent implements AfterViewInit {
  currentStep = 0;
  showDateForm = false;
  dateForm = new FormGroup({
    startDate: new FormControl(''),
    endDate: new FormControl('')
  });

  steps = [
    { title: 'Step 1', content: 'This is the first step of the wizard.' },
    {
      title: 'Step 2',
      content: 'Please select an option:',
      options: [
        { id: 'option1', label: 'Choice 1' },
        { id: 'option2', label: 'Choice 2' }
      ]
    },
    { title: 'Step 3', content: 'This is the third step of the wizard.' },
    { title: 'Step 4', content: 'This is the final step of the wizard.' }
  ];

  @ViewChildren('step') stepElements!: QueryList<ElementRef>;

  abstract ngAfterViewInit(): void;
  abstract animateToStep(newStep: number): void;

  onOptionChange(event: Event) {
    const target = event.target as HTMLInputElement;
    this.showDateForm = target.value === 'option2';
  }

  nextStep() {
    if (this.currentStep < this.steps.length - 1) {
      this.animateToStep(this.currentStep + 1);
      this.currentStep++;
    }
  }

  previousStep() {
    if (this.currentStep > 0) {
      this.animateToStep(this.currentStep - 1);
      this.currentStep--;
    }
  }
}
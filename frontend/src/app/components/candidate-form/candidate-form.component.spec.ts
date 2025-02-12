import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CandidateFormComponent } from './candidate-form.component';
import { CandidateService } from '../../services/candidate.service';
import { of, throwError } from 'rxjs';
import * as jest from 'jest-mock';

describe('CandidateFormComponent', () => {
  let component: CandidateFormComponent;
  let fixture: ComponentFixture<CandidateFormComponent>;
  let candidateService: CandidateService;

  beforeEach(async () => {
    const candidateServiceMock = {
      uploadCandidateData: jest.fn(),
    };

    await TestBed.configureTestingModule({
      declarations: [CandidateFormComponent],
      imports: [
        ReactiveFormsModule,
        MatSnackBarModule,
        MatFormFieldModule,
        MatInputModule,
        MatSelectModule,
        MatCheckboxModule,
        MatButtonModule,
        MatIconModule,
        BrowserAnimationsModule,
      ],
      providers: [
        { provide: CandidateService, useValue: candidateServiceMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(CandidateFormComponent);
    component = fixture.componentInstance;
    candidateService = TestBed.inject(CandidateService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display validation errors when form is invalid', () => {
    component.submitForm();
    fixture.detectChanges();

    const snackBar = fixture.nativeElement.querySelector('simple-snack-bar');
    expect(snackBar).toBeTruthy();
    expect(snackBar.textContent).toContain('Please fill out all required fields and select a file.');
  });

  it('should call uploadCandidateData when form is valid', () => {
    component.candidateForm.setValue({
      name: 'John',
      surname: 'Doe',
      seniority: 'junior',
      yearsOfExperience: 3,
      availability: true,
    });
    component.selectedFile = new File([''], 'test.xlsx');
    jest.spyOn(candidateService, 'uploadCandidateData').mockReturnValue(of({}));

    component.submitForm();
    fixture.detectChanges();

    expect(candidateService.uploadCandidateData).toHaveBeenCalled();
  });

  it('should display error message when upload fails', () => {
    component.candidateForm.setValue({
      name: 'John',
      surname: 'Doe',
      seniority: 'junior',
      yearsOfExperience: 3,
      availability: true,
    });
    component.selectedFile = new File([''], 'test.xlsx');
    jest.spyOn(candidateService, 'uploadCandidateData').mockReturnValue(throwError('Error'));

    component.submitForm();
    fixture.detectChanges();

    const snackBar = fixture.nativeElement.querySelector('simple-snack-bar');
    expect(snackBar).toBeTruthy();
    expect(snackBar.textContent).toContain('Error uploading candidate data. Please try again.');
  });

  it('should reset form and file input after successful upload', () => {
    component.candidateForm.setValue({
      name: 'John',
      surname: 'Doe',
      seniority: 'junior',
      yearsOfExperience: 3,
      availability: true,
    });
    component.selectedFile = new File([''], 'test.xlsx');
    jest.spyOn(candidateService, 'uploadCandidateData').mockReturnValue(throwError('Error'));

    component.submitForm();
    fixture.detectChanges();

    expect(component.candidateForm.value).toEqual({
      name: '',
      surname: '',
      seniority: '',
      yearsOfExperience: null,
      availability: false,
    });
    expect(component.selectedFile).toBeNull();
    const fakeFileInput = fixture.nativeElement.querySelector('#fakeFileInput');
    expect(fakeFileInput.value).toBe('');
  });
});
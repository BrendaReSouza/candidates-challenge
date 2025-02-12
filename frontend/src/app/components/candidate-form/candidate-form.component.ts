import { Component, EventEmitter, Output, Input, ViewChild, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatError, MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { CandidateService } from '../../services/candidate.service';
import { CandidateTableComponent } from '../candidate-table/candidate-table.component';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-candidate-form',
  standalone: true,
  templateUrl: './candidate-form.component.html',
  imports: [CommonModule, ReactiveFormsModule, MatIconModule, MatFormFieldModule, MatInputModule, MatSelectModule, MatCheckboxModule, MatButtonModule, MatTableModule, CandidateTableComponent, MatCardModule, MatError],
  styleUrls: ['./candidate-form.component.scss'],
})
export class CandidateFormComponent implements OnInit {
  @ViewChild(CandidateTableComponent) candidateTable!: CandidateTableComponent;

  candidateForm: FormGroup;
  selectedFile: File | null = null;
  candidates: any[] = [];
  @Input() matLabel: string = 'Upload File';
  @Output() fileSelected = new EventEmitter<File>();
  selectedFileName: string = '';

  constructor(private fb: FormBuilder, private candidateService: CandidateService, private snackBar: MatSnackBar) {
    this.candidateForm = this.fb.group({
      name: ['', Validators.required],
      surname: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.candidateTable.getCandidate();
  }

  getFileOnLoad(event: any) {
    var file = event.target.files[0];
    var element = document.getElementById("fakeFileInput") as HTMLInputElement | null;
    this.selectedFile = file;
    if (element != null) {
      element.value = file?.name;
    }
  }

  submitForm() {
    if (this.candidateForm.valid && this.selectedFile) {
      const formValues = this.candidateForm.value;
      const formData = new FormData();
      formData.append('file', this.selectedFile);
      formData.append('formValues', JSON.stringify(formValues));
      this.uploadCandidate(formData);
    } else {
      this.snackBar.open('Please fill out all required fields and select a file.', 'Close', {
        duration: 3000,
      });
    }
  }

  private uploadCandidate(formData: FormData): void {
    this.candidateService.uploadCandidateData(formData).subscribe({
      next: (response) => {
        this.candidates.push(response);
        localStorage.setItem('candidates', JSON.stringify(this.candidates));
        this.candidateTable.getCandidate();
        this.clearFormValues();
      },
      error: (err) => {
        console.error('Error uploading candidate data:', err);
        this.snackBar.open('Error uploading candidate data. Please try again.', 'Close', {
          duration: 3000,
        });
      },
    });
  }

  private clearFormValues(): void {
    this.candidateForm.reset();
    this.selectedFile = null;
    const fakeFileInput = document.getElementById('fakeFileInput') as HTMLInputElement;
    const file = document.getElementById('file') as HTMLInputElement;
    if (fakeFileInput) {
      fakeFileInput.value = '';
      file.value = '';
    }
  }
}
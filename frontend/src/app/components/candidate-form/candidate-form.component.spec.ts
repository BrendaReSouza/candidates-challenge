import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatTableModule } from '@angular/material/table';
import { MatCardModule } from '@angular/material/card';
import { HttpClientModule } from '@angular/common/http';
import { CandidateService } from '../../services/candidate.service';
import { ChangeDetectorRef } from '@angular/core';
import { CandidateTableComponent } from '../candidate-table/candidate-table.component';

describe('CandidateTableComponent', () => {
  let component: CandidateTableComponent;
  let fixture: ComponentFixture<CandidateTableComponent>;
  let candidateService: CandidateService;

  beforeEach(async () => {    
    const candidateServiceMock = {
      getCandidates: jest.fn(),
    };
    await TestBed.configureTestingModule({
      imports: [MatTableModule, MatCardModule, HttpClientModule, CandidateTableComponent],
      providers: [
        { provide: CandidateService, useValue: candidateServiceMock },
        ChangeDetectorRef,
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(CandidateTableComponent);
    component = fixture.componentInstance;
    candidateService = TestBed.inject(CandidateService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load candidates from localStorage on init', () => {
    const storedCandidates = [
      { name: 'John', surname: 'Doe', seniority: 'junior', yearsOfExperience: 3, availability: true },
    ];
    localStorage.setItem('candidates', JSON.stringify(storedCandidates));

    component.getCandidate();
    fixture.detectChanges();

    expect(component.candidates).toEqual(storedCandidates);
  });

  it('should display candidates in the table', () => {
    component.candidates = [
      { name: 'John', surname: 'Doe', seniority: 'junior', yearsOfExperience: 3, availability: true },
    ];
    fixture.detectChanges();

    const tableRows = fixture.nativeElement.querySelectorAll('mat-row');
    expect(tableRows.length).toBe(1);

    const firstRowCells = tableRows[0].querySelectorAll('mat-cell');
    expect(firstRowCells[0].textContent).toContain('John');
    expect(firstRowCells[1].textContent).toContain('Doe');
    expect(firstRowCells[2].textContent).toContain('junior');
    expect(firstRowCells[3].textContent).toContain('3');
    expect(firstRowCells[4].textContent).toContain('true');
  });
});
import { ChangeDetectorRef, Component, Input } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { MatCardModule } from '@angular/material/card';
import { CandidateService } from '../../services/candidate.service';

@Component({
  selector: 'app-candidate-table',
  standalone: true,
  templateUrl: './candidate-table.component.html',
  styleUrls: ['./candidate-table.component.scss'],
  imports: [MatTableModule, MatCardModule]
})
export class CandidateTableComponent {
  @Input() candidates: any[] = []; // Recebe a lista de candidatos como Input
  displayedColumns: string[] = ['name', 'surname', 'seniority', 'yearsOfExperience', 'availability'];

  constructor(private candidateService: CandidateService, private cdr: ChangeDetectorRef) {}

  getCandidate() {
    const storedCandidates = localStorage.getItem('candidates');
    if (storedCandidates) {
      this.candidates = JSON.parse(storedCandidates);
    }
    this.cdr.detectChanges();
  }
}

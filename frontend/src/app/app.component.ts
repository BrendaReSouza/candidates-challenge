import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CandidateFormComponent } from './components/candidate-form/candidate-form.component';

@Component({
  selector: 'app-root',
  standalone: true,  // Torna o componente standalone
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  imports: [CandidateFormComponent]
})
export class AppComponent {
  constructor(private http: HttpClient) {}
}

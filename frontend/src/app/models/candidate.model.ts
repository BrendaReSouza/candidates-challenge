export interface Candidate {
  name: string;
  surname: string;
  seniority: 'junior' | 'senior';
  yearsOfExperience: number;
  availability: boolean;
}

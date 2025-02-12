import { Injectable } from '@nestjs/common';
import * as XLSX from 'xlsx';

export interface Candidate {
  name: string;
  surname: string;
  seniority: string;
  yearsOfExperience: number;
  availability: boolean;
}

@Injectable()
export class CandidatesService {
  private candidates: Candidate[] = [];

  processExcelFile(buffer: Buffer): Candidate[] {
    const workbook = XLSX.read(buffer, { type: 'buffer' });
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];

    const jsonData: any[] = XLSX.utils.sheet_to_json(sheet);

    const processedCandidates = jsonData.map((row) => ({
      name: row['name'],
      surname: row['surname'],
      seniority: row['seniority'],
      yearsOfExperience: Number(row['yearsOfExperience']),
      availability: row['availability'],
    }));

    this.candidates.push(...processedCandidates);
    return processedCandidates;
  }

}
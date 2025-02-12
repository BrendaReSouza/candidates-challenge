import { Test, TestingModule } from '@nestjs/testing';
import { CandidatesService } from './candidates.service';
import * as XLSX from 'xlsx';

describe('CandidatesService', () => {
  let service: CandidatesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CandidatesService],
    }).compile();

    service = module.get<CandidatesService>(CandidatesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('processExcelFile', () => {
    it('should process an Excel file and return candidates', () => {
      const buffer = createTestExcelBuffer();
      const candidates = service.processExcelFile(buffer);

      expect(candidates).toEqual([
        {
          name: 'John',
          surname: 'Doe',
          seniority: 'junior',
          yearsOfExperience: 3,
          availability: true,
        },
      ]);
    });
  });
});

// Helper function to create a test Excel buffer
function createTestExcelBuffer(): Buffer {
  const data = [
    ['name', 'surname', 'seniority', 'yearsOfExperience', 'availability'],
    ['John', 'Doe', 'junior', 3, true],
  ];
  const worksheet = XLSX.utils.aoa_to_sheet(data);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');
  return XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' });
}
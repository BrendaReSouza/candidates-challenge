import { Test, TestingModule } from '@nestjs/testing';
import { CandidatesController } from './candidates.controller';
import { CandidatesService } from './candidates.service';
import { BadRequestException } from '@nestjs/common';
import * as XLSX from 'xlsx';

describe('CandidatesController', () => {
  let controller: CandidatesController;
  let service: CandidatesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CandidatesController],
      providers: [CandidatesService],
    }).compile();

    controller = module.get<CandidatesController>(CandidatesController);
    service = module.get<CandidatesService>(CandidatesService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('uploadCandidateData', () => {
    it('should throw BadRequestException if no file is uploaded', () => {
      const mockFile = {} as Express.Multer.File;
      expect(() => controller.uploadCandidateData(mockFile, JSON.stringify({ name: 'John', surname: 'Doe' })))
        .toThrow(BadRequestException);
    });
 

    it('should throw BadRequestException if an empty file is uploaded', () => {
      const mockFile = {} as Express.Multer.File;
      expect(() => controller.uploadCandidateData(mockFile, JSON.stringify({ name: 'John', surname: 'Doe' })))
        .toThrow(BadRequestException);
    });

    it('should throw BadRequestException if Excel file is invalid', () => {
      const file = {
        buffer: Buffer.from('invalid data'),
      } as Express.Multer.File;

      expect(() => controller.uploadCandidateData(file, JSON.stringify({ name: 'John', surname: 'Doe' })))
        .toThrow(BadRequestException);
    });

    it('should process a valid Excel file and return combined data', () => {
      const buffer = createTestExcelBuffer();
      const file = {
        buffer: buffer,
      } as Express.Multer.File;

      const formValues = JSON.stringify({ name: 'John', surname: 'Doe' });

      const result = controller.uploadCandidateData(file, formValues);

      expect(result).toEqual({
        name: 'John',
        surname: 'Doe',
        seniority: 'junior',
        yearsOfExperience: 3,
        availability: true,
      });
    });
  });
});

// Helper function to create a test Excel buffer
function createTestExcelBuffer(): Buffer {
  const data = [
    ['seniority', 'yearsOfExperience', 'availability'],
    ['junior', 3, true],
  ];
  const worksheet = XLSX.utils.aoa_to_sheet(data);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');
  return XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' });
}
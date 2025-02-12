import { Controller, Post, UploadedFile, Body, UseInterceptors, BadRequestException } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import * as XLSX from 'xlsx';
import { CandidatesService } from './candidates.service';

@Controller('candidates')
export class CandidatesController {
  constructor(private readonly candidatesService: CandidatesService) {}

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  uploadCandidateData(@UploadedFile() file: Express.Multer.File, @Body('formValues') formValues: string) {
    if (!file) {
      throw new BadRequestException('No file uploaded');
    }
    const formValuesObj = JSON.parse(formValues);

    let workbook;
    try {
      workbook = XLSX.read(file.buffer, { type: 'buffer' });
    } catch (error) {
      console.error('Error reading Excel file:', error);
      throw new BadRequestException('Error reading Excel file');
    }

    if (!workbook.SheetNames || workbook.SheetNames.length === 0) {
      throw new BadRequestException('No sheets found in Excel file');
    }

    const firstSheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[firstSheetName];
    const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

    if (!jsonData || jsonData.length < 2) {
      throw new BadRequestException('Planilha vazia ou com dados insuficientes');
    }

    const headers: any = jsonData[0];
    const rows = jsonData.slice(1);

    const dataObjects = rows.map((row: any) => {
      const entry: any = {};
      headers.forEach((header: string, index: number) => {
        entry[header.trim()] = row[index];
      });
      return entry;
    });

    if (dataObjects.length === 0) {
      throw new BadRequestException('No data found in Excel file');
    }

    const firstEntry = dataObjects[0];
    
    const combinedData = {
      ...formValuesObj,
      name: formValuesObj.name,
      surname: formValuesObj.surname,
      seniority: firstEntry['seniority'],
      yearsOfExperience: parseInt(firstEntry['yearsOfExperience']),
      availability: firstEntry['availability']
    };

    return combinedData;
  }
}
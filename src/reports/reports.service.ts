import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateReportDto } from './dto/create-report.dto';
import { ApproveReportDto } from './dto/approve-report.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Report } from './entities/report.entity';
import { User } from 'src/users/entities/user.entity';
import { GetEstimateDto } from './dto/get-estimate.dto';

@Injectable()
export class ReportsService {
  constructor(@InjectRepository(Report) private repo: Repository<Report>) {}

  create(createReportDto: CreateReportDto, user: User) {
    const newReport = this.repo.create(createReportDto);
    newReport.user = user;
    return this.repo.save(newReport);
  }

  async changeApproval(id: string, approveReportDto: ApproveReportDto) {
    const report = await this.repo.findOne({ where: { id: parseInt(id) } });
    // checking the existence of report
    if (!report) {
      throw new NotFoundException('No report exists with the given id');
    }

    report.approved = approveReportDto.approved;
    return this.repo.save(report);
  }

  async getEstimate(query: GetEstimateDto) {
    console.log('query.lat = ', query.lat);
    return this.repo
      .createQueryBuilder()
      .select('AVG(price)', 'price')
      .where('make = :make', { make: query.make })
      .andWhere('model = :model', { model: query.model })
      .andWhere('lat - :lat BETWEEN -5 AND 5', { lat: query.lat })
      .andWhere('long - :long BETWEEN -5 AND 5', { long: query.long })
      .andWhere('year - :year BETWEEN -30 AND 30', { year: query.year })
      .andWhere('approved IS TRUE') // approved status
      .andWhere('mileage - :mileage BETWEEN -5000 AND 5000', {
        mileage: query.mileage,
      })
      .limit(3)
      .orderBy('mileage', 'ASC')
      .getRawOne();
  }

  findAll() {
    return `This action returns all reports`;
  }

  findOne(id: number) {
    return `This action returns a #${id} report`;
  }

  remove(id: number) {
    return `This action removes a #${id} report`;
  }
}

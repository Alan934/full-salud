import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseService } from '../../common/bases/base.service';
import { Repository } from 'typeorm';
import { MedicationRequest } from '../../domain/entities/MedicationRequest.entity';
import { ErrorManager } from '../../common/exceptions/error.manager';
import { Medication } from '../../domain/entities';
import { PatientService } from '../patient/patient.service';
import { PractitionerService } from '../practitioner/Practitioner.service';
import { CreateMedicationRequestDto, UpdateMedicationRequestDto } from '../../domain/dtos/medication-request/MedicationRequest.dto';

@Injectable()
export class MedicationRequestsService extends BaseService<
    MedicationRequest,
    CreateMedicationRequestDto,
    UpdateMedicationRequestDto
> {
    constructor(
        @InjectRepository(MedicationRequest) protected repository: Repository<MedicationRequest>,
        protected readonly patientService: PatientService,
        protected readonly SpecialistService: PractitionerService,
    ) {
        super(repository);
    }

    override async create(createDto: CreateMedicationRequestDto): Promise<MedicationRequest> {
        try {
            const doctor = await this.SpecialistService.findOne(createDto.practitionerId)
            if (!doctor) {
                throw ErrorManager.createSignatureError('Doctor not found');
            }

            const patient = await this.patientService.findOne(createDto.patientId)
            if (!patient) {
                throw ErrorManager.createSignatureError('Patient not found');
            }
            //falta control de lista de medicine, conviene hacerlo en el servicio de medicine
            return await this.repository.manager.transaction(
                async (transactionalEntityManager) => {
                    const newMedicationRequest = new MedicationRequest();
                    newMedicationRequest.indications = createDto.indications;
                    newMedicationRequest.diagnosis = createDto.diagnosis;
                    newMedicationRequest.isValidSignature = createDto.isValidSignature ?? false;
                    newMedicationRequest.practitioner = doctor;
                    newMedicationRequest.patient = patient;
                    const medicines: Medication[] = [];
                    for (const medicineDto of createDto.medicines) {
                        const medicine = await transactionalEntityManager.findOne(Medication, {
                            where: { id: medicineDto.id },
                        });
                        if (medicine) {
                            medicines.push(medicine);
                        } else {
                            throw new Error(`Medicine with ID ${medicineDto.id} not found`);
                        }
                    }

                    newMedicationRequest.medicines = medicines;
                    await transactionalEntityManager.save(MedicationRequest, newMedicationRequest);
                    return newMedicationRequest;
                }
            );
        } catch (error) {
            throw ErrorManager.createSignatureError((error as Error).message);
        }
    }

    override async update(id: string, updateDto: UpdateMedicationRequestDto): Promise<MedicationRequest> {
        try {
            const existingMedicationRequest = await this.repository.findOne({
                where: { id },
                relations: ['practitioner', 'patient', 'medicines'],
            });

            if (!existingMedicationRequest) {
                throw ErrorManager.createSignatureError('MedicationRequest not found');
            }

            const doctor = updateDto.practitionerId
                ? await this.SpecialistService.findOne(updateDto.practitionerId)
                : existingMedicationRequest.practitioner;

            if (!doctor) {
                throw ErrorManager.createSignatureError('Doctor not found');
            }

            const patient = updateDto.patientId
                ? await this.patientService.findOne(updateDto.patientId)
                : existingMedicationRequest.patient;

            if (!patient) {
                throw ErrorManager.createSignatureError('Patient not found');
            }

            return await this.repository.manager.transaction(
                async (transactionalEntityManager) => {
                    existingMedicationRequest.indications = updateDto.indications ?? existingMedicationRequest.indications;
                    existingMedicationRequest.diagnosis = updateDto.diagnosis ?? existingMedicationRequest.diagnosis;
                    existingMedicationRequest.isValidSignature = updateDto.isValidSignature ?? existingMedicationRequest.isValidSignature;
                    existingMedicationRequest.practitioner = doctor;
                    existingMedicationRequest.patient = patient;

                    if (updateDto.medicines) {
                        const updatedMedicines: Medication[] = [];
                        for (const medicineDto of updateDto.medicines) {
                            const medicine = await transactionalEntityManager.findOne(Medication, {
                                where: { id: medicineDto.id },
                            });
                            if (!medicine) {
                                throw new Error(`Medicine with ID ${medicineDto.id} not found`);
                            }
                            updatedMedicines.push(medicine);
                        }
                        existingMedicationRequest.medicines = updatedMedicines;
                    }

                    return await transactionalEntityManager.save(MedicationRequest, existingMedicationRequest);
                }
            );
        } catch (error) {
            throw ErrorManager.createSignatureError((error as Error).message);
        }
    }


    async findAllMedicationRequestByDoctorId(doctorId: string): Promise<MedicationRequest[]> {
        try {
            const doctor = await this.SpecialistService.findOne(doctorId)
            if (!doctor) {
                throw ErrorManager.createSignatureError('Doctor not found');
            }
            const MedicationRequests = await this.repository.find({
                where: {
                    practitioner: { id: doctorId },
                },
                relations: ['doctor', 'patient', 'medicines'],
            });
            return MedicationRequests;
        } catch (error) {
            throw ErrorManager.createSignatureError((error as Error).message);
        }
    }

    async findAllMedicationRequestByPatientId(patientId: string): Promise<MedicationRequest[]> {
        try {
            const patient = await this.patientService.findOne(patientId)
            if (!patient) {
                throw ErrorManager.createSignatureError('Patient not found');
            }
            const MedicationRequests = await this.repository.find({
                where: {
                    patient: { id: patientId },
                },
                relations: ['doctor', 'patient', 'medicines'],
            });

            return MedicationRequests;
        } catch (error) {
            throw ErrorManager.createSignatureError((error as Error).message);
        }
    }


}

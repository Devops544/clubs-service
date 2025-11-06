import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, ILike, In, Repository, SelectQueryBuilder } from 'typeorm';
import { ClubSetup } from './entities/club.entity';
import { S3UploadService } from '../../common/upload/s3-upload.service';
import { ClubFieldQueryInput, ClubFilter } from './dto/club-query.input';
import { ClubFieldFilter } from './dto/club-multi-field-query.input';
import { DynamicFilterUtil } from '../../common/utils/dynamic-filter.util';
import {
  ClubFieldFilter as ClubFieldFilterType,
  ClubCreateData,
  ClubUpdateData,
  ClubCreateInput,
  ClubUpdateInput,
  ClubUploadFile,
  ClubFieldConfigs,
  ClubRelationFields,
} from './types/club.types';
import { SetupStatus, SetupStep } from './entities/club.entity';
import { CompleteClubSetupInput } from './dto/complete-club-setup.input';

@Injectable()
export class ClubSetupService {
  private readonly logger = new Logger(ClubSetupService.name);

  constructor(
    @InjectRepository(ClubSetup)
    private readonly clubRepository: Repository<ClubSetup>,
    private readonly s3UploadService: S3UploadService,
  ) {}

  /**
   * Secure query builder function that prevents SQL injection
   * @param qb - TypeORM SelectQueryBuilder instance
   * @param alias - Table alias (e.g., 'club')
   * @param field - Field name to query
   * @param operator - Comparison operator
   * @param paramName - Parameter name for binding
   * @param value - Value to compare against
   * @param isDate - Whether the field is a date field
   */
  private applyOperator(
    qb: SelectQueryBuilder<ClubSetup>,
    alias: string,
    field: string,
    operator: string,
    paramName: string,
    value: unknown,
    isDate: boolean = false,
  ): void {
    // Validate field name to prevent SQL injection
    const allowedFields = [
      'id',
      'title',
      'description',
      'typeOfClub',
      'chainId',
      'currency',
      'sports',
      'additionalServices',
      'isPartOfChain',
      'enableOnlineBookings',
      'enableClassBookings',
      'enableOpenMatches',
      'enableAcademyManagement',
      'enableEventManagement',
      'enableLeagueTournamentManagement',
      'onlinePayment',
      'onsitePayment',
      'byInvoice',
      'createdAt',
      'updatedAt',
    ];

    if (!allowedFields.includes(field)) {
      throw new Error(`Invalid field name: ${field}`);
    }

    // Validate operator to prevent SQL injection
    const allowedOperators = [
      'contains',
      'startsWith',
      'endsWith',
      'equals',
      'notEquals',
      'greaterThan',
      'lessThan',
    ];
    if (!allowedOperators.includes(operator)) {
      throw new Error(`Invalid operator: ${operator}`);
    }

    // Sanitize alias to prevent SQL injection
    const sanitizedAlias = alias.replace(/[^a-zA-Z0-9_]/g, '');
    const sanitizedField = field.replace(/[^a-zA-Z0-9_]/g, '');
    const sanitizedParamName = paramName.replace(/[^a-zA-Z0-9_]/g, '');

    const column = isDate
      ? `${sanitizedAlias}.${sanitizedField}::text`
      : `${sanitizedAlias}.${sanitizedField}`;

    switch (operator) {
      case 'contains':
        qb.andWhere(`${column} ILIKE :${sanitizedParamName}`, {
          [sanitizedParamName]: `%${value}%`,
        });
        break;
      case 'startsWith':
        qb.andWhere(`${column} ILIKE :${sanitizedParamName}`, {
          [sanitizedParamName]: `${value}%`,
        });
        break;
      case 'endsWith':
        qb.andWhere(`${column} ILIKE :${sanitizedParamName}`, {
          [sanitizedParamName]: `%${value}`,
        });
        break;
      case 'notEquals':
        qb.andWhere(`${column} != :${sanitizedParamName}`, { [sanitizedParamName]: value });
        break;
      case 'greaterThan':
        qb.andWhere(`${column} > :${sanitizedParamName}`, { [sanitizedParamName]: value });
        break;
      case 'lessThan':
        qb.andWhere(`${column} < :${sanitizedParamName}`, { [sanitizedParamName]: value });
        break;
      case 'equals':
      default:
        qb.andWhere(`${column} = :${sanitizedParamName}`, { [sanitizedParamName]: value });
        break;
    }
  }

  /**
   * Build secure query with multiple filters
   * @param filters - Array of filter conditions
   * @param relations - Array of relations to include
   * @returns SelectQueryBuilder instance
   */
  private buildSecureQuery(
    filters: ClubFieldFilterType[],
    relations: string[] = [],
  ): SelectQueryBuilder<ClubSetup> {
    const qb = this.clubRepository.createQueryBuilder('club');

    // Add relations safely
    relations.forEach((relation) => {
      const sanitizedRelation = relation.replace(/[^a-zA-Z0-9_]/g, '');
      qb.leftJoinAndSelect(`club.${sanitizedRelation}`, sanitizedRelation);
    });

    // Apply filters securely
    filters.forEach((filter, index) => {
      const { field, value, operator = 'equals' } = filter;
      const paramName = `param${index}`;

      // Handle array fields (sports, additionalServices, galleryImages)
      if (['sports', 'additionalServices', 'galleryImages'].includes(field)) {
        this.applyOperator(qb, 'club', field, operator, paramName, value);
      } else if (['createdAt', 'updatedAt'].includes(field)) {
        // Handle date fields
        this.applyOperator(qb, 'club', field, operator, paramName, value, true);
      } else {
        // Handle regular fields
        this.applyOperator(qb, 'club', field, operator, paramName, value);
      }
    });

    return qb;
  }

  /**
   * Public method to build secure queries with custom filters
   * @param filters - Array of filter conditions
   * @param relations - Array of relations to include
   * @returns Promise<ClubSetup[]> - Array of clubs matching the criteria
   */
  async findClubsWithSecureQuery(
    filters: ClubFieldFilterType[],
    relations: string[] = [],
  ): Promise<ClubSetup[]> {
    try {
      const queryBuilder = this.buildSecureQuery(filters, relations);
      return await queryBuilder.getMany();
    } catch (error) {
      this.logger.error(
        `Failed to find clubs with secure query: ${JSON.stringify(filters)}`,
        error,
      );
      throw error;
    }
  }

  /**
   * Public method to build secure queries with custom filters and get count
   * @param filters - Array of filter conditions
   * @param relations - Array of relations to include
   * @returns Promise<number> - Count of clubs matching the criteria
   */
  async countClubsWithSecureQuery(
    filters: ClubFieldFilterType[],
    relations: string[] = [],
  ): Promise<number> {
    try {
      const queryBuilder = this.buildSecureQuery(filters, relations);
      return await queryBuilder.getCount();
    } catch (error) {
      this.logger.error(
        `Failed to count clubs with secure query: ${JSON.stringify(filters)}`,
        error,
      );
      throw error;
    }
  }

  //Generic function to get a club by a field and value and relations
  async getValuesByFieldValueAndRelations(
    field: string,
    value: string,
    relations: string[],
  ): Promise<ClubSetup | null> {
    try {
      const whereCondition: any = {};
      whereCondition[field] = value;

      const club = await this.clubRepository.findOne({
        where: whereCondition,
        relations: relations,
      });
      return club;
    } catch (error) {
      this.logger.error(
        `Failed to get club by field ${field} and value ${value} and relations ${relations}:`,
        error,
      );
      throw error;
    }
  }

  // Enhanced function to get clubs by multiple field/value pairs
  async getClubsByMultipleFields(
    filters: ClubFieldFilterType[],
    relations: string[],
  ): Promise<ClubSetup[]> {
    try {
      const queryBuilder = this.buildSecureQuery(filters, relations);
      const clubs = await queryBuilder.getMany();
      return clubs;
    } catch (error) {
      this.logger.error(
        `Failed to get clubs by multiple fields ${JSON.stringify(
          filters,
        )} and relations ${relations}:`,
        error,
      );
      throw error;
    }
  }

  // // Enhanced function to get a single club by multiple field/value pairs (returns first match)
  async getClubByMultipleFields(
    filters: ClubFieldFilterType[],
    relations: string[],
  ): Promise<ClubSetup | null> {
    try {
      const clubs = await this.getClubsByMultipleFields(filters, relations);
      return clubs.length > 0 ? clubs[0] : null;
    } catch (error) {
      this.logger.error(
        `Failed to get club by multiple fields ${JSON.stringify(
          filters,
        )} and relations ${relations}:`,
        error,
      );
      throw error;
    }
  }

  // Enhanced function for more complex field queries (replaces JSON field queries)
  async getClubByJsonField(
    field: string,
    jsonPath: string, // This parameter is kept for backward compatibility but not used
    value: string | number | boolean,
    relations: string[],
  ): Promise<ClubSetup | null> {
    try {
      const queryBuilder = this.clubRepository.createQueryBuilder('club');

      // Add relations
      relations.forEach((relation) => {
        queryBuilder.leftJoinAndSelect(`club.${relation}`, relation);
      });

      // Use direct field query since we no longer have JSON fields
      queryBuilder.where(`club."${field}" = :value`, {
        value: value,
      });

      const club = await queryBuilder.getOne();
      return club;
    } catch (error) {
      this.logger.error(`Failed to get club by field ${field} with value ${value}:`, error);
      throw error;
    }
  }

  async create(input: ClubCreateInput): Promise<ClubSetup> {
    try {
      // Process logo upload if present
      const createData: ClubCreateData = { ...input } as ClubCreateData;

      if (input.logo) {
        const logoFile = await input.logo;
        if (logoFile && typeof logoFile.createReadStream === 'function') {
          const logoUrl = await this.processLogoUpload(logoFile);
          if (logoUrl) {
            createData.logo = logoUrl;
          }
        }
      }

      // Process gallery images uploads if present
      if (input.galleryImages && input.galleryImages.length > 0) {
        const imageUrls: string[] = [];
        for (const imagePromise of input.galleryImages) {
          const image = await imagePromise;
          if (image && typeof image.createReadStream === 'function') {
            const imageUrl = await this.processLogoUpload(image);
            if (imageUrl) {
              imageUrls.push(imageUrl);
            }
          }
        }
        if (imageUrls.length > 0) {
          createData.galleryImages = imageUrls;
        }
      }

      // Initialize setup tracking fields
      const clubSetup = await this.clubRepository.create({
        ...createData,
        setupStatus: SetupStatus.DRAFT,
        currentStep: SetupStep.CLUB_SETUP,
        completedSteps: [SetupStep.CLUB_SETUP],
        lastSavedAt: new Date(),
      } as any);
      const savedClub = await this.clubRepository.save(clubSetup);

      return Array.isArray(savedClub) ? savedClub[0] : savedClub;
    } catch (error) {
      this.logger.error('Failed to create club setup:', error);
      throw error;
    }
  }

  async findClubById(id: string): Promise<ClubSetup | null> {
    if (!id) {
      throw new Error('Club ID is required');
    }

    try {
      return await this.clubRepository.findOne({
        where: { id: id },
        relations: ['locationContact', 'workingHoursCalendar', 'resources', 'amenity'],
      });
      /*
      const query = this.clubRepository.createQueryBuilder('club')
        .leftJoinAndSelect('club.locationContact', 'locationContact')
        .leftJoinAndSelect('club.workingHoursCalendar', 'workingHoursCalendar')
        .leftJoinAndSelect('club.amenity', 'amenity')
        .where('club.id = :id', { id });
      return await query.getOne();
      */
    } catch (error) {
      this.logger.error(`Failed to find club setup for id ${id}:`, error);
      throw error;
    }
  }
  async findAll(filter: ClubFilter, relations: string[] = []): Promise<ClubSetup[]> {
    // Define field configurations for dynamic filtering
    const fieldConfigs = DynamicFilterUtil.createFieldConfigs({
      partialFields: ['title', 'description'],
      exactFields: ['id', 'typeOfClub', 'chainId', 'currency', 'setupStatus', 'currentStep'],
      arrayFields: ['sports', 'additionalServices', 'completedSteps'],
      booleanFields: [
        'isPartOfChain',
        'enableOnlineBookings',
        'enableClassBookings',
        'enableOpenMatches',
        'enableAcademyManagement',
        'enableEventManagement',
        'enableLeagueTournamentManagement',
        'onlinePayment',
        'onsitePayment',
        'byInvoice',
      ],
    });

    // Define relation field handlers
    const relationFields = {
      clubId: (value: string) => ({ id: value }), // Map clubId to id for filtering
      amenityId: (value: string) => ({ amenity: { id: value } }),
      locationContactId: (value: string) => ({ locationContact: { id: value } }),
      workingHoursCalendarId: (value: string) => ({ workingHoursCalendar: { id: value } }),
      resourceIds: (value: string[]) => ({ resources: { id: In(value) } }),
      coachId: (value: string) => ({ coaches: { id: value } }),
    };

    // Build where condition dynamically
    const whereCondition = DynamicFilterUtil.buildWhereCondition<ClubSetup>(
      filter,
      fieldConfigs,
      relationFields,
    );

    // Debug logging
    this.logger.log('Filter received:', JSON.stringify(filter));
    this.logger.log('Where condition built:', JSON.stringify(whereCondition));

    // Include all relations by default to get complete club setup data
    const defaultRelations = [
      'locationContact',
      'workingHoursCalendar',
      'resources',
      'amenity',
      'coaches',
      'teamMembers',
      'memberships',
      'pricing',
      'promocodes',
      'userGroups',
    ];

    const finalRelations = relations.length > 0 ? relations : defaultRelations;

    return await this.clubRepository.find({
      where: whereCondition,
      relations: finalRelations,
    });
  }

  async update(id: string, input: ClubUpdateInput): Promise<ClubSetup> {
    if (!id) {
      throw new Error('Club ID is required');
    }

    try {
      const clubSetup = await this.findClubById(id);
      if (!clubSetup) {
        throw new NotFoundException('Club not found');
      }

      // Process logo upload if present
      const updateData: ClubUpdateData = { ...input } as ClubUpdateData;

      if (input.appearance?.logo) {
        const logoFile = await input.appearance.logo;
        if (logoFile && typeof logoFile.createReadStream === 'function') {
          const logoUrl = await this.processLogoUpload(logoFile);
          if (logoUrl) {
            updateData.appearance = {
              ...input.appearance,
              logo: logoUrl,
            };
          }
        }
      }

      // Process gallery images uploads if present
      if (input.gallery?.images && input.gallery.images.length > 0) {
        const imageUrls: string[] = [];
        for (const imagePromise of input.gallery.images) {
          const image = await imagePromise;
          if (image && typeof image.createReadStream === 'function') {
            const imageUrl = await this.processLogoUpload(image);
            if (imageUrl) {
              imageUrls.push(imageUrl);
            }
          }
        }
        if (imageUrls.length > 0) {
          updateData.gallery = {
            ...input.gallery,
            images: imageUrls,
          };
        }
      }

      Object.assign(clubSetup, updateData);
      return await this.clubRepository.save(clubSetup);
    } catch (error) {
      this.logger.error(`Failed to update club setup for id ${id}:`, error);
      throw error;
    }
  }

  async delete(id: string): Promise<boolean> {
    if (!id) {
      throw new Error('Club ID is required');
    }

    try {
      const result = await this.clubRepository.delete({ id });
      if (result.affected > 0) {
        return true;
      } else {
        return false;
      }
    } catch (error) {
      this.logger.error(`Failed to delete club setup for id ${id}:`, error);
      throw error;
    }
  }

  async processLogoUpload(logoFile: ClubUploadFile): Promise<string | null> {
    try {
      if (!logoFile) {
        return null;
      }

      const uploadResult = await this.s3UploadService.uploadFile(logoFile);
      return uploadResult?.Location || null;
    } catch (error) {
      this.logger.error('Failed to upload logo:', error);
      throw new Error('Failed to upload logo');
    }
  }

  /**
   * Update club setup tracking when a step is completed
   * @param clubId - Club ID
   * @param step - The step that was completed
   * @returns Promise<ClubSetup> - Updated club setup
   */
  async updateSetupTracking(clubId: string, step: SetupStep): Promise<ClubSetup> {
    try {
      const club = await this.findClubById(clubId);
      if (!club) {
        throw new NotFoundException('Club not found');
      }

      // Add the step to completed steps if not already there
      const completedSteps = [...(club.completedSteps || [])];
      if (!completedSteps.includes(step)) {
        completedSteps.push(step);
      }

      // Update the club setup tracking
      Object.assign(club, {
        setupStatus: SetupStatus.IN_PROGRESS,
        currentStep: step,
        completedSteps: completedSteps,
        lastSavedAt: new Date(),
      });

      return await this.clubRepository.save(club);
    } catch (error) {
      this.logger.error(`Failed to update setup tracking for club ${clubId}:`, error);
      throw error;
    }
  }

  /**
   * Complete club setup process
   * @param input - Complete setup input
   * @returns Promise<ClubSetup> - Completed club setup
   */
  async completeClubSetup(input: CompleteClubSetupInput): Promise<ClubSetup> {
    try {
      const club = await this.findClubById(input.clubId);
      if (!club) {
        throw new NotFoundException('Club not found');
      }

      // Update setup status to completed
      const completedSteps = [...(club.completedSteps || []), input.finalStep];
      const uniqueCompletedSteps = [...new Set(completedSteps)];

      Object.assign(club, {
        setupStatus: SetupStatus.COMPLETED,
        currentStep: input.finalStep,
        completedSteps: uniqueCompletedSteps,
        lastSavedAt: new Date(),
      });

      const savedClub = await this.clubRepository.save(club);
      this.logger.log(`Completed club setup for club ${input.clubId}`);

      return savedClub;
    } catch (error) {
      this.logger.error(`Failed to complete club setup for club ${input.clubId}:`, error);
      throw error;
    }
  }

  /**
   * Get clubs by setup status
   * @param status - Setup status
   * @returns Promise<ClubSetup[]> - Clubs with specified status
   */
  async getClubsBySetupStatus(status: SetupStatus): Promise<ClubSetup[]> {
    try {
      const clubs = await this.clubRepository.find({
        where: { setupStatus: status },
        relations: ['locationContact', 'workingHoursCalendar', 'resources', 'amenity'],
      });

      return clubs;
    } catch (error) {
      this.logger.error(`Failed to get clubs by setup status ${status}:`, error);
      throw error;
    }
  }

  /**
   * Abandon club setup (mark as abandoned)
   * @param clubId - Club ID
   * @returns Promise<ClubSetup> - Updated club setup
   */
  async abandonClubSetup(clubId: string): Promise<ClubSetup> {
    try {
      const club = await this.findClubById(clubId);
      if (!club) {
        throw new NotFoundException('Club not found');
      }

      Object.assign(club, {
        setupStatus: SetupStatus.ABANDONED,
        lastSavedAt: new Date(),
      });

      const savedClub = await this.clubRepository.save(club);
      this.logger.log(`Abandoned club setup for club ${clubId}`);

      return savedClub;
    } catch (error) {
      this.logger.error(`Failed to abandon club setup for club ${clubId}:`, error);
      throw error;
    }
  }
}

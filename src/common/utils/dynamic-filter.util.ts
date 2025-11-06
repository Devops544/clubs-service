import { FindOptionsWhere, ILike, In } from 'typeorm';

export interface FieldConfig {
  type: 'partial' | 'exact' | 'array' | 'boolean' | 'date' | 'number';
  field: string;
  operator?: 'eq' | 'ne' | 'gt' | 'gte' | 'lt' | 'lte' | 'like' | 'ilike' | 'in' | 'notIn';
}

export interface FilterConfig {
  [key: string]: FieldConfig;
}

export class DynamicFilterUtil {
  /**
   * Builds dynamic where conditions based on filter object and field configurations
   * @param filter - The filter object containing field values
   * @param fieldConfigs - Configuration mapping filter keys to field types and operators
   * @param relationFields - Special handling for relation fields
   * @returns FindOptionsWhere object for TypeORM
   */
  static buildWhereCondition<T>(
    filter: any,
    fieldConfigs: FilterConfig,
    relationFields?: { [key: string]: (value: any) => any },
  ): FindOptionsWhere<T> {
    const whereCondition: FindOptionsWhere<T> = {};

    // Process each field dynamically
    Object.entries(fieldConfigs).forEach(([filterKey, config]) => {
      const value = filter[filterKey];

      if (value !== undefined && value !== null) {
        const fieldName = config.field as keyof T;

        switch (config.type) {
          case 'partial':
            whereCondition[fieldName] = ILike(`%${value}%`) as any;
            break;
          case 'exact':
            whereCondition[fieldName] = value as any;
            break;
          case 'array':
            whereCondition[fieldName] = In(value) as any;
            break;
          case 'boolean':
            whereCondition[fieldName] = value as any;
            break;
          case 'date':
            whereCondition[fieldName] = value as any;
            break;
          case 'number':
            whereCondition[fieldName] = value as any;
            break;
        }
      }
    });

    // Handle relation fields
    if (relationFields) {
      Object.entries(relationFields).forEach(([filterKey, handler]) => {
        const value = filter[filterKey];
        if (value !== undefined && value !== null) {
          Object.assign(whereCondition, handler(value));
        }
      });
    }

    return whereCondition;
  }

  /**
   * Creates a reusable filter configuration for common field types
   */
  static createFieldConfigs(config: {
    partialFields?: string[];
    exactFields?: string[];
    arrayFields?: string[];
    booleanFields?: string[];
    dateFields?: string[];
    numberFields?: string[];
  }): FilterConfig {
    const fieldConfigs: FilterConfig = {};

    // Partial match fields (ILIKE with %)
    config.partialFields?.forEach((field) => {
      fieldConfigs[field] = { type: 'partial', field };
    });

    // Exact match fields
    config.exactFields?.forEach((field) => {
      fieldConfigs[field] = { type: 'exact', field };
    });

    // Array fields (IN operator)
    config.arrayFields?.forEach((field) => {
      fieldConfigs[field] = { type: 'array', field };
    });

    // Boolean fields
    config.booleanFields?.forEach((field) => {
      fieldConfigs[field] = { type: 'boolean', field };
    });

    // Date fields
    config.dateFields?.forEach((field) => {
      fieldConfigs[field] = { type: 'date', field };
    });

    // Number fields
    config.numberFields?.forEach((field) => {
      fieldConfigs[field] = { type: 'number', field };
    });

    return fieldConfigs;
  }
}

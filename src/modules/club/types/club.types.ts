import { ClubSetup } from '../entities/club.entity';

export interface ClubFieldFilter {
  field: string;
  value: any;
  operator?: 'equals' | 'contains' | 'startsWith' | 'endsWith';
}

export interface ClubCreateData {
  title?: string;
  description?: string;
  typeOfClub?: string;
  chainId?: string;
  currency?: string;
  sports?: string[];
  additionalServices?: string[];
  isPartOfChain?: boolean;
  enableOnlineBookings?: boolean;
  enableClassBookings?: boolean;
  enableOpenMatches?: boolean;
  enableAcademyManagement?: boolean;
  enableEventManagement?: boolean;
  enableLeagueTournamentManagement?: boolean;
  onlinePayment?: boolean;
  onsitePayment?: boolean;
  byInvoice?: boolean;
  logo?: string | ClubUploadFile;
  galleryImages?: string[] | ClubUploadFile[];
  appearance?: ClubAppearance;
  gallery?: ClubGallery;
  amenityId?: string;
  locationContactId?: string;
  workingHoursCalendarId?: string;
  resourceIds?: string[];
}

export interface ClubUpdateData extends Partial<ClubCreateData> {
  id?: string;
}

export interface ClubAppearance {
  logo?: string | ClubUploadFile;
  primaryColor?: string;
  secondaryColor?: string;
  theme?: string;
}

export interface ClubGallery {
  images?: string[] | ClubUploadFile[];
  videos?: string[];
}

export interface ClubUploadFile {
  createReadStream: () => NodeJS.ReadableStream;
  filename: string;
  mimetype: string;
  encoding: string;
}

export interface ClubCreateInput {
  title: string;
  description?: string;
  typeOfClub: string;
  chainId?: string;
  currency?: string;
  sports?: string[];
  additionalServices?: string[];
  isPartOfChain?: boolean;
  enableOnlineBookings?: boolean;
  enableClassBookings?: boolean;
  enableOpenMatches?: boolean;
  enableAcademyManagement?: boolean;
  enableEventManagement?: boolean;
  enableLeagueTournamentManagement?: boolean;
  onlinePayment?: boolean;
  onsitePayment?: boolean;
  byInvoice?: boolean;
  logo?: ClubUploadFile;
  galleryImages?: ClubUploadFile[];
  appearance?: {
    logo?: ClubUploadFile;
    primaryColor?: string;
    secondaryColor?: string;
    theme?: string;
  };
  gallery?: {
    images?: ClubUploadFile[];
    videos?: string[];
  };
  amenityId?: string;
  locationContactId?: string;
  workingHoursCalendarId?: string;
  resourceIds?: string[];
}

export interface ClubUpdateInput extends Partial<ClubCreateInput> {
  id?: string;
}

export interface ClubFieldConfigs {
  partialFields: string[];
  exactFields: string[];
  arrayFields: string[];
  booleanFields: string[];
  [key: string]: any;
}

export interface ClubRelationFields {
  amenityId: (value: string) => { amenity: { id: string } };
  locationContactId: (value: string) => { locationContact: { id: string } };
  workingHoursCalendarId: (value: string) => { workingHoursCalendar: { id: string } };
  resourceIds: (value: string[]) => { resources: { id: any } };
}

export interface Address {
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

export interface BasicDetails {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  gender: string;
  address: Address;
}

export interface BankDetails {
  accountHolderName: string;
  bankName: string;
  accountNumber: string;
  ifscCode: string;
  branch: string;
  accountType: string;
}

export interface EducationalDetail {
  degree: string;
  fieldOfStudy: string;
  university: string;
  passingYear: string;
  grade: string;
}

export interface Profile {
  basicDetails: BasicDetails;
  bankDetails: BankDetails;
  educationalDetails: EducationalDetail[];
}

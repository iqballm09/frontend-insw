interface UserProfileDetails {
  full_name: string;
  id: string;
  username: string;
  position: string;
  photo_profile: string | null;
  employee_number: string | null;
  active: boolean;
  verified: boolean;
  kd_ga: string | null;
  ur_ga: string | null;
  kd_detail_ga: string | null;
  kd_level_ga: string | null;
  admin: boolean;
}

interface UserAddress {
  address: string;
  postal_code: string | null;
  city: string | null;
}

interface UserContact {
  mobile_phone: string;
  phone_number: string;
  email: string;
}

interface UserRole {
  id: number;
  uuid: string;
  kd_ga: string | null;
  name: string;
  level: number;
}

interface OrganizationDetails {
  name: string;
  id: string;
  active: boolean;
}

interface OrganizationAddress {
  address: string;
  postal_code: string;
  city: string;
  city_code: string | null;
}

interface OrganizationPic {
  identity_number: string | null;
}

interface OrganizationContact {
  phone_number: string;
  fax_number: string;
}

interface Organization {
  details: OrganizationDetails;
  address: OrganizationAddress;
  nib: string;
  npwp: string;
  pic: OrganizationPic;
  contact: OrganizationContact;
}

export interface UserProfileResponse {
  sub: string;
  profile: {
    details: UserProfileDetails;
    address: UserAddress;
    contact: UserContact;
    identity_number: string;
    email: string;
  };
  role: UserRole;
  organization: Organization;
  roleId: number;
}

export interface Address {
  id?: number;
  street: string;
  city: string;
  state: string;
  zip_code: string;
  country: string;
  created_at?: Date;
  updated_at?: Date;
}

export interface Location {
  id?: number;
  address_id: number;
  name: string;
  latitude?: number;
  longitude?: number;
  description?: string;
  is_active: boolean;
  created_at?: Date;
  updated_at?: Date;
}

export interface CreateAddressRequest {
  street: string;
  city: string;
  state: string;
  zip_code: string;
  country?: string;
}

export interface UpdateAddressRequest {
  street?: string;
  city?: string;
  state?: string;
  zip_code?: string;
  country?: string;
}

export interface CreateLocationRequest {
  address_id: number;
  name: string;
  latitude?: number;
  longitude?: number;
  description?: string;
  is_active?: boolean;
}

export interface UpdateLocationRequest {
  address_id?: number;
  name?: string;
  latitude?: number;
  longitude?: number;
  description?: string;
  is_active?: boolean;
}

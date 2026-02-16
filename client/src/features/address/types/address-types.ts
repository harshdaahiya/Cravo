import { IAddress } from '../../../types/domain-models';

export interface AddressState {
  list: IAddress[];
  loading: 'idle' | 'pending' | 'succeeded' | 'failed';
  error: string | null;
}

export interface AddressesResponse {
  addresses: IAddress[];
}

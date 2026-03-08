export interface UnlockNumberPaylod {
  phoneNumberIds: string[];
}

export interface AvilableNumbersResponse {
  numbers: NumberItem[];
}

export interface NumberItem {
  id: string;
  msisdn: string;
  selected: boolean;
}

export interface UpdateOrderPayload {
  msisdn?: string;
  msisdn_id?: string;
}

export interface OperatorsType {
  id: string;
  nc_order_number: string;
  original_name: string;
  name: string;
  operator_id: string;
  is_hidden: boolean;
  status: string;
  created_at: string;
  modified_at: string;
  mnp_id: string;
  sort_order: number;
  value: string;
  port_out_deactivation_type?: string;
}

type ApplePayRequestData = {
  data: any;
  signature: string;
  transactionId: string;
  ephemeralPublicKey: string;
  publicKeyHash: string;
  displayName: string;
  network: string;
  type: string;
};
export interface PaymentPayload {
	email?: string;
	orderId?: string; // it is optional for multiline renewal
	paymentOptionFlag?: string; // its free for FREE payment
	// The below params is required at the time of actual payment
	cardId?: string;
	cvv?: string;
	orderType?: string;
	signature?: string;
	applePayPayload?: ApplePayRequestData;
	payForNextRenewal?: boolean;
	// for bnpl
	national_id?: string;
	// multiline renew
	source?: string;
	groupOrderId?: string;
	linkId?: string;
	//auto renew subscription
	payForAutoRenewal?: boolean;
}
export interface PaymentCardsResponse {
  cards: CardResponse[];
  is_apple_pay_enabled: boolean;
  is_auto_renew_enabled_for_apple_pay: boolean;
  is_mokafaa_pay_enabled: boolean;
}
export interface AddCardPayload {
  cardHolderName: string;
  is_default_card: boolean;
}
export interface CardResponse {
  merchent_referance_tokenization: string;
  token_status: string;
  user_id: string;
  card_holder_name: string;
  is_default_card: boolean;
  to_be_default: boolean;
  is_temp: boolean;
  card_number: any;
  expiry_date: any;
  token_name: any;
  merchant_referance_authorization: any;
  card_nickname: any;
  card_type: any;
  user_transaction_id: any;
  token_name_enc: any;
  validation_method: any;
  validation_amount: any;
  agreement_id: any;
  temp_agreement_id: any;
  id: string;
  is_card_saved: boolean;
  is_apple_pay: boolean;
  created_at: string;
  modified_at: string;
}

export interface InstallmentMethodsResponse {
  name: string;
  payment_installment_method: string;
  payment_installment: number;
  image_url: string;
  feature_enabled: boolean;
  isMultiCartEnabled: boolean;
  installment_amount: string;
  minimum_value?: number;
  maximum_value?: number;
  info_url?: string;
}
export interface TamamOfferPayload {
  amount: number;
}

export interface TamamOfferResponse {
  emi_value: number;
  emi_start_date: string;
  interest: number;
  tenure: number;
  apr: number;
  total_value: number;
}
export interface MakeCardDefaultRequest {
	id: string;
}

export interface ApplePayPayload {
	data: string;
	signature: string;
	transactionId: string;
	ephemeralPublicKey: string;
	publicKeyHash: string;
	displayName: string;
	network: string;
	type: string;
}

export interface ApplePayRequest {
	applePayPayload: ApplePayPayload;
	isApplePay: boolean;
}

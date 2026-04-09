export const endpoints = {
  telcoProvision: {
    usermode: "/telco-provision/usermode",
    countyList: "/telco-provision/country/list",
    simOrderGuest: "/telco-provision/guest/simOrder",
    simOrder: "/telco-provision/simOrder",
    simOrderCart: "/telco-provision/simOrder/cart",
    simOrderPackageInfo: "/telco-provision/simOrder/packageInfo", // for Non telco only
    deliveryDetail: (userId: string) =>
      `/telco-provision/user/${userId}/deliveryDetails`,
    packageCart: "/telco-provision/telco/package/cart",
    addressAndContract: "/telco-provision/simOrder/addressAndContract",
    eSimDetails: "/telco-provision/simOrder/esim/details",
    enteredNumber: "/telco-provision/simOrder/number/entered",
    verifyEnteredNumber: "/telco-provision/simOrder/number/otp/verify",
    cancelPortIn: "/telco-provision/simOrder/cancel_port_in",
    simOrderMNPStart: "/telco-provision/simOrder/mnp/start",
    simOrderActivationStatus: (userId: string) =>
      `/telco-provision/simOrder/activationStatus/${userId}`,

    simOrderPackageInfoGuest: "/telco-provision/guest/simOrder/packageInfo",
    guestAccount: "/telco-provision/guest/user/accounts",
    accounts: "/telco-provision/user/accounts",

    mySubsctiptiionDetail: (userId: string) =>
      `/telco-provision/user/${userId}/subscription/mySubscriptionDetails`,
    appSubscription: (msisdn: string) =>
      `app-subscription-service/subscription/information?msisdn=${msisdn}`,
    addonDetails: "/telco-provision/telco/addon/parent",
    roamingCountries: "/telco-provision/roaming/countries",
    numberOfApps: "/telco-provision/zerorated/selection/number",
    updateApps: (userId: string) =>
      `/telco-provision/zerorated/${userId}/selection/update`,
    changeApp: (userId: string) =>
      `telco-provision/zerorated/${userId}/appreplace`,
    addOnCart: "/telco-provision/matrixx/addon/cart",
    requestedApps: (userId: string) =>
      `telco-provision/zerorated/${userId}/requestedapps`,
    addOnData: "/telco-provision/telco/addon",
    userApps: "/telco-provision/zerorated/userapps",
    cancelOrderReasons: (orderType: string) =>
      `/telco-provision/simOrder/cancel/reasons?simType=${orderType}`,
    cancelOrder: "/telco-provision/simOrder/cancel",
    cancelReplacementOrder: "/telco-provision/sim/replacementOrder/cancel",
    multilneExpiredPackages: (sku: string) =>
      `/telco-provision/multiline/renew?selectedPackage=${sku}`,
    multilineCreateCart: "/telco-provision/multiline/renew/createcart",
    mulitilineGroupOrderCreate: "/telco-provision/multiline/grouporder/create",
  },
  user: {
    verifyOTP: (userId: string) => `/user/${userId}/verifyOtp`,
    profile: (userId: string) => `/user/${userId}/profile`,
  },
  authentication: {
    login: "/authentication/login",
    resendLoginOTP: "/authentication/login/resendOtp",
    verfiyLogin: "/authentication/verifyLogin",
    resendOTP: (userId: string) => `/authentication/user/${userId}/resendOtp`,
    userIsTelco: "/authentication/user/isTelco",
    userTokens: "/authentication/user/tokens",
    shipmentOTP: "/authentication/shipment/sendOTP",
    verifyShimpentOTP: "/authentication/shipment/verifyOTP",
  },
  netcracker: {
    guestAvilableNumber:
      "/bff-service/inventory/msisdn/guest/getAvailableNumbers",
    telcoAvialableNumber: "/bff-service/inventory/msisdn/getAvailableNumbers",
    unlockNumber: "/bff-service/inventory/msisdn/unlocknumbers",
    updateOrder: "/netcracker-inventory-service/inventory/msisdn/updateOrder",
    operatorDictionary: "/bff-service/inventory/operatorDictionary",
    // guestAvilableNumber:
    // 	'/netcracker-inventory-service/inventory/msisdn/guest/getAvailableNumbers',
    // telcoAvialableNumber:
    // 	'/netcracker-inventory-service/inventory/msisdn/getAvailableNumbers',
    // unlockNumber:
    // 	'/netcracker-inventory-service/inventory/msisdn/unlocknumbers',
    // updateOrder: '/netcracker-inventory-service/inventory/msisdn/updateOrder',
    // operatorDictionary:
    // 	'netcracker-inventory-service/inventory/operatorDictionary',
  },
  identity: {
    nafathRequest: "/identity/nafath/sendNafathRequest",
    nafathStatusCheck: (nafathDetailId: string) =>
      `/identity/guest/nafath/nafathRequestStatus/${nafathDetailId}`,
    nafathStatusCheckAutenticateUser: (nafathDetailId: string) =>
      `/identity/nafath/nafathRequestStatus/${nafathDetailId}`,
  },
  bffService: {
    user: {
      register: "/bff-service/user/register",
    },
    store: {
      packages: "/bff-service/store/guest/packages",
      packagesAuthenticateUser: "/bff-service/store/packages",
      productDetail: (productSku: string) =>
        `bff-service/store/getproductDetails/${productSku}`,
      deviceList: "/bff-service/store/getDeviceList",
    },
    journey: {
      journeySteps: (journeyType: string, userType: string) =>
        `/bff-service/journey/steps/${journeyType}/${userType}`,
    },
    dashboard: {
      userMode: "/bff-service/dashboard/userMode",
    },
    activation: {
      //getNafathToken: '/bff-service/activation/getNafathToken',
      getNafathToken: "/telco-provision/simOrder/authorisation/getNafathToken",
      activateSIM: "/bff-service/activation/sim/activate",
    },
    usage: {
      balanceFetch: "/bff-service/usage/balance/fetch",
      availableApps: "/bff-service/usage/zerorated/availableapps",
    },
    order: {
      orders: (userId: string) => `/bff-service/delivery/orders/${userId}`,
      shipmentStatus: (userId: string, shipmentId: string) =>
        `/bff-service/store/getShipmentStatusByDeliveryId/${userId}/${shipmentId}`,
    },
    mokafaa: {
      rules: "/bff-service/mokafaa/rules/terms",
    },
  },
  delivery: {
    checkCoverage: "/delivery-gateway/delivery/checkCoverage",
    avialableSlotsGuest: "/delivery-gateway/delivery/guest/availableSlots",
    avilableSlots: "/delivery-gateway/delivery/availableSlots",
    scheduleShipment: "/delivery-gateway/delivery/scheduleShipment",
    orderDetails: "/delivery-gateway/delivery/orderDetails",
    deliveryDetails: (orderType: string) =>
      `/delivery-gateway/delivery/deliveryDetails?orderType=${orderType}`,
    updateSlot: "/delivery-gateway/delivery/updateSlot",
    // comment from current app for updateDeliverySlotDeviceOrder slot api
    // works for devices order with tamam option
    // to update the delivery slot from immediate to the next available slot
    updateDeliverySlotDeviceOrder:
      "/devices-inventory/store/order/updateDeliverySlots",
  },
  payment: {
    // payment: (orderID: string) => `/payment-v2/payment/orders/pay/${orderID}`,
    // cards: '/payment-v2/payment/cards',
    payment: (orderID: string) => `/bff-service/payment/orders/pay/${orderID}`,
    cards: "/bff-service/payment/cards",
    installmentsMethod: "/bff-service/payment/getInstallmentMethod",
    tamamOffers: "/bff-service/payment/cards/tamam/offers",
    redeemPoints: "/payment-v2/mokafaa/redeemPoints",
    multilineRenewPay: (groupOrderId: string) =>
      `/payment-v2/payment/guest/orders/groupPay/${groupOrderId}`,
    addApplePayCard: '/payment-v2/payment/cards/applepay',
  },
  orderManagement: {
    orderCart: (orderID: string) => `/order-management/carts/order/${orderID}`,
    country: "/order-management/country",
  },
  payfort: {
    tokenizationDev: "https://sbcheckout.payfort.com/FortAPI/paymentPage",
    addCardReturn: "/payment-v2/payment/cards/redirect",
  },
  invantory: {
    simOrderIccid: (iccid: string) =>
      `/inventory/sim/order/iccid/${iccid}?isDevice=false`,
  },
  devicesInventory: {
    itemStockCount: (sku: string) =>
      `/devices-inventory/item-stock/count/${sku}`,
    itemStockHoldCount: (sku: string) =>
      `/devices-inventory/item-stock/hold-count/${sku}`,
    deviceOrder: (sku: string) => `/devices-inventory/store/products/${sku}`,
    productContract: (sku: string) =>
      `/devices-inventory/products/${sku}/contract`,
    freeItemStockCount: (sku: string) => `/devices-inventory/item-stock/${sku}`,
  },
  mokafaa: {
    terms: "/mokafaa-integration-service/rules/terms",
    isWalletExists: "/mokafaa-integration-service/loyalty/wallet/exists",
    enroll: "/mokafaa-integration-service/loyalty/enroll",
    verifyEnrollOTP: "/mokafaa-integration-service/loyalty/verify/otp",
    resendEnrollOTP: "/mokafaa-integration-service/loyalty/resend/otp",
    defaultMobileNumber:
      "/mokafaa-integration-service/api/getDefaultMobileNumber",
    sendReddemOTP: "/mokafaa-integration-service/api/sendOTP",
  },
  tawakkalna: {
    validateToken: "/external-connect-service/api/auth/tawakkalna/validateToken"
  },
  wallet: {
		balance: '/wallet-integration-service/wallet/balance',
		transactions: '/wallet-integration-service/wallet/transactions', //?type=credit&&count=10&&startIndex=0
		scanVoucher: '/wallet-integration-service/wallet/scan/voucher',
	},
};

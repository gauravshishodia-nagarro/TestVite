import {
    useShipmentSendOTPMutation,
    useUserIsTelco,
    useVerifyShipmentMutation,
} from '../../apis/services/authentication';
import { useGetDeliveryDetailQuery } from '../../apis/services/delivery';
import {
    useAvialbaleNumberQuery,
    useUnlockNumber,
    useUpdateOrder,
} from '../../apis/services/netcracker';
import {
    useCountryList,
    useDeliveryDetail,
    useEnteredNumberMutation,
    useEnteredNumberVerifyOTP,
    usePostSimOrderRequest,
    useSimOrderPackageInfoMutation,
} from '../../apis/services/telcoProvision';
import { useRegister, useVerifyOTP } from '../../apis/services/user';
import { SendShipmentOTPResponse } from '../../apis/types/authentication';
import { NumberItem } from '../../apis/types/netcracker';
import { RegisterResponse } from '../../apis/types/user';
import CustomButton from '../../components/customButton';
import CustomFooter from '../../components/customFooter';
import CustomText from '../../components/customText';
import Loader from '../../components/loader';
import { isVisitPackage, packageType } from '../../components/packageDetails';
import PersonalInformationView, {
    PersonalInfoFormState,
} from '../../components/personalInformationView';
import PickNewNumberCard from '../../components/pickNewNumberCard';
import constants from '../../configs/constants';
import {
    getMsisdnTransitionType,
    getNumberForRegistration,
    getScreenTitle,
    performEligibilityCheck,
} from '../../helpers/journeyHelper';
import { IndentityVerificationSheetProps } from '../../sheets/identityVerificationSheet';
import { MobileNumberVerificationSheetProps } from '../../sheets/mobileNumberVerificationSheet';
import { useBottomSheetStore } from '../../stores/useBottomSheetStore';
import { useStepProgressStore } from '../../stores/useStepProgressStore';
import { userJourneyStore } from '../../stores/userJourneyStore';
import { useUserPreferenceStore } from '../../stores/userPreferencesStore';
import {
    MSISDN_TRANSITION_TYPE,
    ONBOARDING_JOURNEY_TYPES,
    ORDER_TYPE,
    SIM_TYPE,
} from '../../types';
import { formattedNumber } from '../../utils/formatter';
import { closeSheetModal, getPackageSKU } from '../../utils/util';
import { useIsFocused, useNavigation, useFocusEffect, StackActions } from '@react-navigation/native';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
    InteractionManager,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    View,
} from 'react-native';
import { useAppTranslation } from '../../hooks/useAppTranslation';
import i18n from '../../utils/i18n';

const PersonalInformation: React.FC = () => {
    const { NEW_ORDER } = constants;
    const [form, setForm] = useState<PersonalInfoFormState>({
        name: '',
        idValue: '',
        email: '',
        phoneNumber: '',
        selectedOperator: {
            id: '',
            name: '',
            operator_id: '',
            sort_id: 0,
        },
        emailError: '',
        idError: '',
        idType: 'NATIONAL_ID',
        phoneNumberError: '',
        nationality: {},
        countryCode: '+966',
    });
    const {
        setActiveSheet,
        setWebModalVisible,
        updateActiveSheetProps,
        activeSheet,
    } = useBottomSheetStore();
    const navigation = useNavigation();
    const { journeyName, simType, selectedPackage, setJourneyState } =
        userJourneyStore();
    console.log("Current language:", i18n.language);

    const { setProgress, totalSteps } = useStepProgressStore();
    const { language, updateUserPreferences, userId, fcmToken } =
        useUserPreferenceStore();

    const [suggestedNumber, setSuggestedNumber] = useState<NumberItem>();
    const [nationalityCode, setNationalityCode] = useState<string | null>(null);

    const [numbers, setNumbers] = useState<NumberItem[]>([]);
    const numbersRef = useRef<NumberItem[]>([]);

    const { data: countries = [] } = useCountryList();

    const subscriptionType = packageType(selectedPackage);

    const isVisitPackageSelected = isVisitPackage(
        selectedPackage?.esimPackage?.sku || '',
    );

    const isVisitPackageSelectedEsimVoice =
        isVisitPackageSelected &&
        journeyName === 'ORDER_SIM' &&
        simType === SIM_TYPE.ESIM &&
        subscriptionType === 'VOICE';

    const isEsimVoiceJourneyNewNumber =
        simType === SIM_TYPE.ESIM &&
        subscriptionType === 'VOICE' &&
        journeyName === 'ORDER_SIM' &&
        form.idType !== 'PASSPORT';

    const isPhoneOptional =
        (isEsimVoiceJourneyNewNumber || isVisitPackageSelectedEsimVoice) &&
        useUserPreferenceStore.getState().userType === 'GUEST';

    const isJourneyRequiringNewNumberCall =
        // journeyName !== 'SWITCH_NUMBER' &&
        // journeyName !== 'ORDER_DEVICE' &&
        // journeyName !== 'RESCHEDULE_ORDER';
        journeyName === 'ORDER_SIM';

    // we are showing the suggested number card only for order sim jourent and the package type is not data
    const showPickNumberCard =
        !!selectedPackage &&
        isJourneyRequiringNewNumberCall &&
        packageType(selectedPackage) === 'VOICE';

    const {
        data: availableNumbers,
        refetch: loadMoreAvailableNumbers,
        isLoading: isAvilableNumberLoading,
    } = useAvialbaleNumberQuery(showPickNumberCard);

    const { mutateAsync: unlockNumberMutation } = useUnlockNumber();
    const { mutateAsync: registerMutationAsync, isPending: isRegisterLoading } =
        useRegister();
    const { mutateAsync: verifyOtpMutationAsync, isPending: isVerifyOTPLoading } =
        useVerifyOTP();
    const { refetch: getDeliveryDetails, isLoading: isFetchingDeliveryDetails } =
        useGetDeliveryDetailQuery(ORDER_TYPE.DEVICE);
    const { mutateAsync: updateOrderMutation, isPending: updateOrderLoading } =
        useUpdateOrder();
    const {
        mutateAsync: enteredNumberMutation,
        isPending: isEnterredNumberPending,
    } = useEnteredNumberMutation();
    const {
        mutateAsync: verifyEnteredNumberMutation,
        isPending: isVerifyEnterredNumberPending,
    } = useEnteredNumberVerifyOTP();

    const {
        mutateAsync: deliveryDetailMutaion,
        isPending: isDeliveyDetailLoading,
    } = useDeliveryDetail();

    const { isPending: isPostSimOrderInProgress, mutateAsync: postSimOrder } =
        usePostSimOrderRequest();

    const {
        mutateAsync: postSimOrderPackageInfo,
        isPending: isSimOrderPackageInfoMutating,
    } = useSimOrderPackageInfoMutation();

    const { mutateAsync: userIsTelcoMutation, isPending: isUserIsTelcoPending } =
        useUserIsTelco();

    const {
        mutateAsync: sendShipmentOTPMutation,
        isPending: sendShipmentOTPLoading,
    } = useShipmentSendOTPMutation();

    const {
        mutateAsync: verifyShipmentOTPMutation,
        isPending: verifyShipmentOTPLoading,
    } = useVerifyShipmentMutation();


    const isFocused = useIsFocused();
    const hasFetched = useRef(false);
    const hasGuestEnteredTelcoNumberRef = useRef(false);

    useFocusEffect(
        useCallback(() => {
            const step = totalSteps === 5 ? 2 : 1;
            const total = totalSteps === 5 ? totalSteps : 4;
            setProgress(step, total);
        }, [setProgress, totalSteps]),
    );

    useEffect(() => {
        return () => {
            if (numbersRef.current.length > 0) {
                unlockNumberAPIcall();
            }
        };
    }, []);

    useEffect(() => {
        if (!isFocused) return; // screen not visible
        if (hasFetched.current) return; // already called once
        const userType = useUserPreferenceStore.getState().userType;

        if (userType !== 'NON_TELCO' || !selectedPackage?.sku) return;

        hasFetched.current = true; // mark as done

        postSimOrderPackageInfo({
            orderType:
                simType === SIM_TYPE.ESIM
                    ? ONBOARDING_JOURNEY_TYPES.ESIM
                    : ONBOARDING_JOURNEY_TYPES.NEW_SIM,
            package_sku: getPackageSKU(),
            subscription_type: packageType(selectedPackage),
        }).catch((error) => {
            //alert(error?.message);
            navigation.goBack();
        });
    }, [postSimOrderPackageInfo, selectedPackage, simType, isFocused, navigation]);

    const getSelectedCountry = useCallback(
        (nationalityCode: string) => {
            return countries.find(
                (country) => country.cournty_code === Number(nationalityCode),
            );
        },
        [countries],
    );

    const { t } = useAppTranslation();

    useEffect(() => {
        // call delivery details for fetching the user info. This we called only for TELCO and Non Telco
        // IN the old app we are passing orderType as DEVICE for telco, so we have used the same.
        const userType = useUserPreferenceStore.getState().userType;
        const journeyName = userJourneyStore.getState().journeyName;
        const subscriptionType = useUserPreferenceStore.getState().subscriptionType;

        if (userType !== 'GUEST') {
            getDeliveryDetails().then((response) => {
                const code = response?.data?.nationality ?? '0';
                const phoneNo =
                    journeyName === 'SWITCH_NUMBER'
                        ? ''
                        : userType === 'TELCO' && subscriptionType === 'DATA' // we are not sending phone in case of telco with data subscription
                            ? ''
                            : (response?.data?.phoneNo ?? '');

                setNationalityCode(code);
                setForm((prev) => ({
                    ...prev,
                    name: response?.data?.name ?? '',
                    countryCode: constants.saudiDialCode,
                    email: response?.data?.enteredEmail ?? '',
                    idType: response?.data?.idType === '3' ? 'PASSPORT' : 'NATIONAL_ID',
                    idValue: response?.data?.idValue ?? '',
                    phoneNumber: phoneNo,
                    idError: '',
                    emailError: '',
                    phoneNumberError: '',
                }));
            });
        }
    }, [getDeliveryDetails]);

    useEffect(() => {
        if (!nationalityCode || countries.length === 0) return;

        const selectedCountry = getSelectedCountry(nationalityCode);

        if (selectedCountry) {
            setForm((prev) => ({
                ...prev,
                nationality: selectedCountry,
            }));
        }
    }, [countries, nationalityCode, getSelectedCountry]);

    useEffect(() => {
        if (availableNumbers?.numbers) {
            setNumbers((prev) => {
                const updated = [...prev, ...availableNumbers.numbers];
                numbersRef.current = updated;
                return updated;
            });
        }
    }, [availableNumbers]);

    useEffect(() => {
        if (numbers?.length > 0 && activeSheet != null) {
            updateActiveSheetProps({ numbers: numbers });
        }
    }, [activeSheet, updateActiveSheetProps, numbers]);

    const loadNewNumber = () => {
        if (numbers.length < 15) loadMoreAvailableNumbers();
    };

    const isValidated = () => {
        if (journeyName === 'ORDER_DEVICE' || journeyName === 'RESCHEDULE_ORDER') {
            const userType = useUserPreferenceStore.getState().userType;
            if (userType === 'NON_TELCO' || userType === 'TELCO') {
                return (
                    form.phoneNumber.length > 0 && form.phoneNumberError.length === 0
                );
            }
            return (
                form.name.trim().length > 0 &&
                form.email.length > 0 &&
                form.emailError.length === 0 &&
                form.phoneNumber.length > 0 &&
                form.phoneNumberError.length === 0
            );
        } else {
            const isPhoneValid = isPhoneOptional
                ? form.phoneNumber.length === 0 || form.phoneNumberError.length === 0
                : form.phoneNumber.length > 0 && form.phoneNumberError.length === 0;

            const isSuggestedNumberConditionValid =
                journeyName !== 'ORDER_SIM' ||
                !showPickNumberCard ||
                suggestedNumber !== undefined;

            return (
                form.name.trim().length > 0 &&
                form.idValue.trim().length > 0 &&
                form.idError.length === 0 &&
                form.email.length > 0 &&
                form.emailError.length === 0 &&
                isPhoneValid &&
                form.idType !== 'UNKNOWN' &&
                form.nationality?.cournty_code !== undefined &&
                (journeyName === 'SWITCH_NUMBER' ? form.selectedOperator?.id : true) &&
                isSuggestedNumberConditionValid
            );
        }
    };
    const navigateToNafath = useCallback(() => {
        closeSheetModal();
        userJourneyStore.getState().setJourneyState({
            msisdntrnasitionType: MSISDN_TRANSITION_TYPE.NEW_NUMBER,
        });
        InteractionManager.runAfterInteractions(() => {
            navigation.dispatch(
                StackActions.replace('/nafath/verification',
                    { title: t('action.orderSIM') }
                ));
        });
    }, [navigation]);

    const navigateToAbsher = useCallback(() => {
        closeSheetModal();
        InteractionManager.runAfterInteractions(() => {
            navigation.dispatch(
                StackActions.replace('/absher/verification',
                    { title: t('action.orderSIM') }
                ));
        });
    }, [navigation]);

    const callVerifyOTPMutation = (
        otp?: string,
        registerData?: RegisterResponse,
    ) => {
        verifyOtpMutationAsync({
            otp: otp,
            phoneNo: formattedNumber(form.phoneNumber),
            isSimJourney: true, //Check for other flow
            subscriptionType:
                journeyName === 'ORDER_DEVICE' ? null : subscriptionType,
            userId: registerData?.userId ?? '',
            secureToken: registerData?.secureToken,
        }).then((response) => {
            closeSheetModal();
            InteractionManager.runAfterInteractions(() => {
                const userType = useUserPreferenceStore.getState().userType;
                if (journeyName === 'SWITCH_NUMBER' && userType === 'TELCO') {
                    setJourneyState({
                        childUserId: response.userId,
                        childToken: response.token,
                    });
                } else {
                    updateUserPreferences({
                        name: response.name,
                        //Not changing user type it may impact further order journey
                        // userType: registerData?.alreadyRegistered
                        // 	? registerData?.alreadyTelcoUser
                        // 		? 'TELCO'
                        // 		: 'NON_TELCO'
                        // 	: 'NON_TELCO',
                        phoneNumber: response.phoneNo,
                        accessToken: response.token,
                        userId: response.userId,
                        emailId: response.email,
                    });
                }
                if (hasGuestEnteredTelcoNumberRef.current) {
                    hasGuestEnteredTelcoNumberRef.current = false;
                    updateUserPreferences({ userType: 'TELCO' });
                    callRegisterAPI();
                } else {
                    handleNavigation();
                }
            });
        });
        // .catch((error) => {
        // 	alert(error?.message);
        // });
    };

    //Will be call only for guest in Physical SIM order Journey
    const handleOTPFilled = useCallback(
        (otp?: string, registerData?: RegisterResponse) => {
            const userType = useUserPreferenceStore.getState().userType;
            if (journeyName === 'SWITCH_NUMBER' && userType === 'NON_TELCO') {
                callVerifyEnteredNumberAPI(otp);
            } else {
                callVerifyOTPMutation(otp, registerData);
            }
        },
        [
            setActiveSheet,
            setWebModalVisible,
            verifyOtpMutationAsync,
            form,
            journeyName,
        ],
    );

    const callVerifyEnteredNumberAPI = (otp?: string) => {
        verifyEnteredNumberMutation({
            auth_code: otp || '',
            entered_msisdn: formattedNumber(form.phoneNumber),
        }).then(() => {
            closeSheetModal();
            InteractionManager.runAfterInteractions(() => {
                callDeliveryDetailAPI();
            });
        });
        // .catch((error) => alert(error?.message));
    };

    const openOTPBottomsheet = useCallback(
        (registerData?: RegisterResponse) => {
            setActiveSheet('otpBottomSheet', {
                keyboardBehavior: 'fillParent',
                snapPoints: ['80%', '100%'],
                title: t('common.verification'),
                props: {
                    identifier: form.phoneNumber,
                    onOTPFilled: (code: string) => handleOTPFilled(code, registerData),
                    numberOfInputs: registerData?.alreadyRegistered ? 6 : 4,
                    initialTimeInSecond: registerData?.initialTimeInSecond,
                },
            });
        },
        [setActiveSheet, handleOTPFilled, form.phoneNumber],
    );

    const unlockNumberAPIcall = (suggestedNumber?: NumberItem) => {
        const phoneNumberIds = numbersRef.current
            ?.filter((e: NumberItem) => e.id !== suggestedNumber?.id)
            ?.map((e: NumberItem) => e.id);
        if (phoneNumberIds?.length > 0) {
            unlockNumberMutation({
                phoneNumberIds,
            });
        }
        numbersRef.current = [];
    };
    const handleContinue = () => {
        const userType = useUserPreferenceStore.getState().userType;
        setJourneyState({
            idValue: form.idValue,
            name: form.name,
            phoneNumber: formattedNumber(form.phoneNumber),
            email: form.email,
            selectedOperator: form.selectedOperator,
        });
        if (journeyName === 'ORDER_DEVICE' || journeyName === 'RESCHEDULE_ORDER') {
            if (userType === 'TELCO' || userType === 'NON_TELCO') {
                callSendShipmentOTPAPI(false);
            } else {
                callRegisterAPI();
            }
            return;
        }
        if (journeyName === 'SWITCH_NUMBER') {
            if (userType === 'NON_TELCO') {
                callEnteredNumberAPI();
            } else {
                callRegisterAPI();
            }
            return;
        }
        if (showPickNumberCard) {
            unlockNumberAPIcall(suggestedNumber);
        }

        if (userType === 'NON_TELCO') {
            // for data package we are not calling the updateOrderMutation
            if (selectedPackage && packageType(selectedPackage) === 'DATA') {
                simType === SIM_TYPE.ESIM ? callDeliveryDetailAPI() : openSheet();
            } else {
                updateOrderMutation({
                    msisdn: suggestedNumber?.msisdn,
                    msisdn_id: suggestedNumber?.id,
                }).then(() => {
                    simType === SIM_TYPE.ESIM ? callDeliveryDetailAPI() : openSheet();
                });
            }
            // .catch((error) => alert(error?.message));
        } else if (userType === 'TELCO') {
            callRegisterAPI();
        } else {
            hasGuestEnteredTelcoNumberRef.current = false;
            userIsTelcoMutation({
                phoneNo: form.phoneNumber
                    ? formattedNumber(form.phoneNumber)
                    : suggestedNumber?.msisdn,
            }).then((response) => {
                if (response.isTelcoUser) {
                    hasGuestEnteredTelcoNumberRef.current = true;
                    callRegisterAPI();
                } else {
                    simType === SIM_TYPE.ESIM ? callRegisterAPI() : openSheet();
                }
            });
        }

        // if (simType === SIM_TYPE.ESIM) {
        // 	if (userType === 'NON_TELCO') {
        // 		updateOrderMutation({
        // 			msisdn: suggestedNumber?.msisdn,
        // 			msisdn_id: suggestedNumber?.id,
        // 		})
        // 			.then(() => {
        // 				handleSendCodePress();
        // 			})
        // 			.catch((error) => alert(error?.message));
        // 	}
        // 	callRegisterAPI();
        // } else {
        // 	if (userType === 'NON_TELCO') {
        // 		updateOrderMutation({
        // 			msisdn: suggestedNumber?.msisdn,
        // 			msisdn_id: suggestedNumber?.id,
        // 		})
        // 			.then(() => {
        // 				openSheet();
        // 			})
        // 			.catch((error) => alert(error?.message));
        // 	} else if (isTelcoUser) {
        // 		callRegisterAPI();
        // 	} else {
        // 		openSheet();
        // 	}
        // }
    };

    const callEnteredNumberAPI = () => {
        enteredNumberMutation({
            entered_msisdn: formattedNumber(form.phoneNumber),
            nationalId: form.idValue,
            operator_selected: form.selectedOperator?.id ?? '',
        }).then((response) => {
            openOTPBottomsheet(response);
        });
        // .catch((error) => alert(error?.message));
    };

    const callRegisterAPI = () => {
        const _userType = useUserPreferenceStore.getState().userType;
        const identityDetails =
            journeyName === 'ORDER_DEVICE'
                ? {}
                : {
                    idType: form.nationality.cournty_code === 113 ? 1 : 2,
                    idValue: form.idValue,
                    nationality: form.nationality.cournty_code?.toString() ?? '',
                };
        const isDataPackage =
            !!selectedPackage && packageType(selectedPackage) === 'DATA';

        const phone =
            getNumberForRegistration({
                journeyName,
                isTelcoUser: _userType === 'TELCO',
                msisdn: suggestedNumber?.msisdn,
                phoneNumber: form.phoneNumber,
                isDataPackage,
            }) || '';

        registerMutationAsync({
            name: form.name,
            email: form.email,
            //For OrderSIM If user is telco then send suggested number otherwise user input number
            phoneNo: phone,
            // Add new key
            phoneNoIsNewMSISDN: phone === suggestedNumber?.msisdn,
            allowNotification: '1',
            gcmId:
                fcmToken ||
                'e2t2E-4ORLesGwMn4rfRh7:APA91bG8knEQ81BISt_uDrT6BIJLMoyNootXycwQF7LZ2lgF9Se14u7rjqMTdRF',
            phoneType: Platform.OS,
            language: language,
            journey: NEW_ORDER,
            pass: 'GIFT',
            msisdnTransitionType: getMsisdnTransitionType(
                journeyName,
                form.selectedOperator,
            ),
            performEligibilityCheck: performEligibilityCheck(journeyName), //Need to  send true for other journey
            subscriptionType:
                journeyName === 'ORDER_DEVICE' ? null : subscriptionType,
            orderType:
                journeyName === 'ORDER_DEVICE' ? ORDER_TYPE.DEVICE : ORDER_TYPE.SIM,
            isBundleOrder: false,
            countryCode: form.countryCode,
            isTelcoOfflineActivation: false,

            // identityDetails: {
            // 	idType: form.nationality.cournty_code === 113 ? 1 : 2,
            // 	idValue: form.idValue,
            // 	nationality: form.nationality.cournty_code?.toString() ?? '',
            // },
            identityDetails,
            ...(journeyName === 'ORDER_SIM' && {
                newSimType:
                    simType === SIM_TYPE.ESIM
                        ? ONBOARDING_JOURNEY_TYPES.ESIM
                        : ONBOARDING_JOURNEY_TYPES.NEW_SIM,
            }),
            ...(form.selectedEmailByNationalId && {
                selectedEmailByNationalId: form.selectedEmailByNationalId,
            }),
            isForeignInvestor:
                form.idType === 'PASSPORT' ? (form.isForeignInvestor ?? false) : false,
        }).then((response) => {
            //If telco user then check eligibilityStatus and don't verify
            // if (response.eligibilityStatus) {
            // 	if (response?.eligibilityStatus?.eligible) {
            // 		setJourneyState({
            // 			childUserId: response.userId,
            // 			childToken: response.token,
            // 		});
            // 		handleNaviagation();
            // 	} else {
            // 		router.navigate({
            // 			pathname: '/[type]/error',
            // 			params: {
            // 				type: constants.errorType.somethingWentWrong,
            // 				title: t('action.orderSIM'),
            // 			},
            // 		});
            // 	}
            // }

            //For eSIM SKIP otp will be true
            // For telco user eSIM order we will directly call ordersim api instead of verifyOTP
            // For eSIM guest users, when the user does not enter a contact number, we check whether isRegistrationSkipOtp is true and then call the verify API in the background.
            if (
                (response.skipOTP || response.isRegistrationSkipOtp) &&
                _userType !== 'TELCO'
            ) {
                handleOTPFilled(undefined, response);
            }
            // if receiving token means telco user and don't verify him
            //While switching the number from Zain to Yaqoot, both token and user ID are received, so added a condition based on the journey name
            // for order journey as per our observation we are getting token and userID in of case of telco user only
            else if (
                response?.token &&
                journeyName !== 'SWITCH_NUMBER' &&
                journeyName !== 'ORDER_DEVICE'
            ) {
                setJourneyState({
                    childUserId: response.userId,
                    childToken: response.token,
                });
                handleNavigation();
            } else {
                openOTPBottomsheet(response);
            }
        });
        // .catch((error) => {
        // 	alert(error?.message);
        // });
    };

    //For Non Telco only
    const callDeliveryDetailAPI = () => {
        deliveryDetailMutaion({
            name: form.name,
            email: form.email,
            phoneNo: formattedNumber(
                useUserPreferenceStore.getState().phoneNumber || '',
            ),
            journey: NEW_ORDER,
            orderType:
                simType === SIM_TYPE.PHYSICAL
                    ? ONBOARDING_JOURNEY_TYPES.NEW_SIM
                    : ONBOARDING_JOURNEY_TYPES.ESIM,
            isBundleOrder: false,
            countryCode: form.countryCode,
            idType: form.nationality.cournty_code === 113 ? 1 : 2,
            idValue: form.idValue,
            nationality: form.nationality.cournty_code?.toString() ?? '',
            simNumber: '',
            cancelMnp: false,
            isMaskedEmail: false,
            selectedEmailByNationalId: null,
            reactivatedOrder: false,
            performEligibiltyCheck: false,
            userId: userId || '',
        }).then(() => {
            handleNavigation();
        });
        // .catch((error) => {
        // 	alert(error?.message);
        // });
    };

    const callSendShipmentOTPAPI = (isResend: boolean) => {
        sendShipmentOTPMutation({
            phone_no: formattedNumber(form.phoneNumber),
            user_id: '',
        }).then((res) => {
            if (!isResend) {
                handleSendShipmentOTPResponse(res);
            } else {
                updateActiveSheetProps({
                    initialTimeInSecond: res.initialTimeInSecond,
                });
            }
        });
        // .catch((err) => alert(err?.message));
    };
    console.log("Loader state: ", isAvilableNumberLoading ||
    isRegisterLoading ||
    isVerifyOTPLoading ||
    isFetchingDeliveryDetails ||
    updateOrderLoading ||
    isDeliveyDetailLoading ||
    isPostSimOrderInProgress ||
    isSimOrderPackageInfoMutating ||
    isEnterredNumberPending ||
    isVerifyEnterredNumberPending ||
    isUserIsTelcoPending ||
    sendShipmentOTPLoading ||
    verifyShipmentOTPLoading)
    console.log("isAvilableNumberLoading: ", isAvilableNumberLoading)
    console.log("isRegisterLoading: ", isRegisterLoading)
    console.log("isVerifyOTPLoading: ", isVerifyOTPLoading)
    console.log("isFetchingDeliveryDetails: ", isFetchingDeliveryDetails)
    console.log("updateOrderLoading: ", updateOrderLoading)
    console.log("isDeliveyDetailLoading: ", isDeliveyDetailLoading)
    console.log("isPostSimOrderInProgress: ", isPostSimOrderInProgress)
    console.log("isSimOrderPackageInfoMutating: ", isSimOrderPackageInfoMutating)
    console.log("isEnterredNumberPending: ", isEnterredNumberPending)
    console.log("isVerifyEnterredNumberPending: ", isVerifyEnterredNumberPending)
    console.log("isUserIsTelcoPending: ", isUserIsTelcoPending)
    console.log("sendShipmentOTPLoading: ", sendShipmentOTPLoading)
    console.log("verifyShipmentOTPLoading: ", verifyShipmentOTPLoading)
    const handleSendShipmentOTPResponse = (res: SendShipmentOTPResponse) => {
        setActiveSheet('otpBottomSheet', {
            keyboardBehavior: 'fillParent',
            snapPoints: ['80%', '100%'],
            title: t('common.verification'),
            props: {
                identifier: form.phoneNumber,
                onOTPFilled: (code: string) => {
                    verifyShipmentOTPMutation({
                        phone_no: formattedNumber(form.phoneNumber),
                        otp: code,
                        request_id: res.request_id,
                    }).then(() => {
                        closeSheetModal();
                        handleNavigation();
                    });
                    // .catch((err) => alert(err?.message));
                },
                numberOfInputs: 6,
                initialTimeInSecond: res?.initialTimeInSecond,
                resendOTP: () => {
                    callSendShipmentOTPAPI(true);
                },
            },
        });
    };
    const openNafathSheet = () => {
        setActiveSheet('identityVerificationSheet', {
            title: t('button.verifyWithNafath'),
            showBack: true,
            onBackPress: openSheet,
            props: {
                onPress: navigateToNafath,
                type: 'NAFATH',
            } as IndentityVerificationSheetProps,
            snapPoints: ['75%'],
        });
    };

    const openSheet = () => {
        if (form.idType === 'NATIONAL_ID') {
            setActiveSheet('mobileNumberVerificationSheet', {
                props: {
                    number: form.phoneNumber,
                    onVerifyWithNafathPress: openNafathSheet,
                    onSendCodePress: handleSendCodePress,
                } as MobileNumberVerificationSheetProps,
                snapPoints: ['70%', '80%'],
            });
        } else {
            setActiveSheet('identityVerificationSheet', {
                title: t('button.verifyWithAbsher'),
                showBack: true,
                onBackPress: closeSheetModal,
                props: {
                    onPress: navigateToAbsher,
                    type: 'ABSHER',
                } as IndentityVerificationSheetProps,
                snapPoints: ['75%'],
            });
        }
    };
    const handleSendCodePress = () => {
        // Platform.OS !== 'web' ? setActiveSheet(null) : setWebModalVisible(false);
        closeSheetModal();

        InteractionManager.runAfterInteractions(() => {
            const userType = useUserPreferenceStore.getState().userType;
            if (userType === 'NON_TELCO') {
                callDeliveryDetailAPI();
            } else {
                callRegisterAPI();
            }
        });
    };
    const handleNavigation = () => {
        const _userType = useUserPreferenceStore.getState().userType;
        if (
            simType === SIM_TYPE.PHYSICAL ||
            journeyName === 'ORDER_DEVICE' ||
            journeyName === 'RESCHEDULE_ORDER'
        ) {
            navigation.dispatch(
                StackActions.replace('/delivery/delivery-location')
            );
        } else {
            // for esim: navigate to review order screen which handles cart API + payment
            const title = getScreenTitle({ journeyName, simType, t });
            const navigateToReview = () => {
                navigation.dispatch(
                    StackActions.replace('reviewOrder', {
                        title,
                    }),
                );
            };

            if (_userType === 'NON_TELCO') {
                navigateToReview();
            } else {
                postSimOrder({
                    orderType: ONBOARDING_JOURNEY_TYPES.ESIM,
                    msisdn_transition_type: getMsisdnTransitionType(
                        journeyName,
                        form.selectedOperator,
                    ),
                    ...(_userType === 'GUEST' && { isGuestPortIn: true }),
                }).then(() => {
                    navigateToReview();
                });
            }
        }
    };

    const getTitle = () => {
        return journeyName === 'ORDER_SIM'
            ? t('label.chooseNumberAndInformation')
            : journeyName === 'SWITCH_NUMBER'
                ? t('label.switchNumberAndInformation')
                : 'Enter Information';
    };
    const getSubTitle = () => {
        switch (journeyName) {
            case 'ORDER_SIM':
                return t('common.orderSImSubtitle')
                    .replace('{packageName}', selectedPackage?.name ?? '')
                    .replace(
                        '{simType}',
                        simType === SIM_TYPE.ESIM
                            ? t('label.esim')
                            : t('label.psim'),
                    );
            case 'SWITCH_NUMBER':
                return t('label.switchNumberAndInformation');
            case 'ORDER_DEVICE':
                return t('common.orderDeviceSubtitle');

            default:
                return 'Enter Information';
        }
    };

    return (
        <>
            <View className="flex-1">
                <KeyboardAvoidingView className="flex-1" behavior={'padding'}>
                    <View className="flex-1">
                        <ScrollView
                            showsVerticalScrollIndicator={false}
                            contentContainerClassName="px-5 pb-[150px]"
                            keyboardShouldPersistTaps="handled"
                            keyboardDismissMode="interactive"
                        >
                            <CustomText
                                fontVarient="bold"
                                className={`text-lg text-secondary-gray mt-6 ${Platform.OS === 'web' ? 'text-start' : 'text-left'}`}
                            >
                                {getTitle()}
                            </CustomText>
                            <CustomText
                                fontVarient="regular"
                                className={`text-sm text-shades-gray-02 mb-6 ${Platform.OS === 'web' ? 'text-start' : 'text-left'}`}
                            >
                                {getSubTitle()}
                            </CustomText>
                            {showPickNumberCard && (
                                <PickNewNumberCard
                                    availableNumbers={numbers}
                                    suggestedNumber={suggestedNumber}
                                    setSuggestedNumber={setSuggestedNumber}
                                    loadNewNumber={loadNewNumber}
                                />
                            )}
                            <PersonalInformationView
                                className={showPickNumberCard ? 'mt-6' : ''}
                                form={form}
                                setForm={setForm}
                                isValidated={isValidated()}
                                isPhoneOptional={isPhoneOptional}
                                isPhoneDisbale={
                                    form.phoneNumber.length === 10 &&
                                    journeyName === 'ORDER_SIM' &&
                                    useUserPreferenceStore.getState().userType === 'NON_TELCO'
                                }
                            />
                        </ScrollView>
                    </View>
                    <CustomFooter containerClassName="!px-5 !pb-[40px]">
                        <CustomButton
                            disabled={!isValidated()}
                            label={t('button.continue')}
                            onPress={handleContinue}
                            // onPress={() => {
                            // 	setActiveSheet('otpBottomSheet', {
                            // 		keyboardBehavior: 'fillParent',
                            // 		snapPoints: ['80%', '100%'],
                            // 		props: {
                            // 			identifier: '09809809800',
                            // 			onOTPFilled: (code: string) =>
                            // 				handleOTPFilled(code, undefined),
                            // 			numberOfInputs: 6,
                            // 			initialTimeInSecond: 30,
                            // 		},
                            // 	});
                            // }}
                            filledBorderColor={
                                isValidated()
                                    ? 'border-secondary-gray'
                                    : 'border-shades-gray-04'
                            }
                        />
                    </CustomFooter>
                </KeyboardAvoidingView>
            </View>
            <Loader
                loading={
                    isAvilableNumberLoading ||
                    isRegisterLoading ||
                    isVerifyOTPLoading ||
                    isFetchingDeliveryDetails ||
                    updateOrderLoading ||
                    isDeliveyDetailLoading ||
                    isPostSimOrderInProgress ||
                    isEnterredNumberPending ||
                    isVerifyEnterredNumberPending ||
                    isUserIsTelcoPending ||
                    sendShipmentOTPLoading ||
                    verifyShipmentOTPLoading
                }
            />
        </>
    );
};

export default PersonalInformation;

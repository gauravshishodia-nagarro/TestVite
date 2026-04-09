import { OperatorsType } from '../apis/types/netcracker';
import constants from '../configs/constants';
import { UserJourneyType } from '../stores/userJourneyStore';
import { MSISDN_TRANSITION_TYPE, SIM_TYPE } from '../types';
import { formattedNumber } from '../utils/formatter';
import { useAppTranslation } from '../hooks/useAppTranslation';
type ScreenName = 'order-confirmed' | undefined;

const getMsisdnTransitionType = (
	journeyName?: UserJourneyType,
	operator?: OperatorsType,
) => {
	switch (journeyName) {
		case 'ORDER_SIM':
			return MSISDN_TRANSITION_TYPE.NEW_NUMBER;
		case 'SWITCH_NUMBER':
			return operator?.mnp_id === 'Zain'
				? MSISDN_TRANSITION_TYPE.ZAIN_TO_YAQOOT
				: MSISDN_TRANSITION_TYPE.PORT_IN;
		case 'ORDER_DEVICE':
			return '';
		default:
			return MSISDN_TRANSITION_TYPE.NEW_NUMBER;
	}
};

const performEligibilityCheck = (journeyName?: UserJourneyType) => {
	return journeyName === 'SWITCH_NUMBER';
};

const getNumberForRegistration = ({
	journeyName,
	isTelcoUser,
	msisdn,
	phoneNumber,
	isDataPackage,
}: {
	journeyName?: UserJourneyType;
	isTelcoUser: boolean;
	msisdn?: string;
	phoneNumber: string;
	isDataPackage: boolean;
}) => {
	switch (journeyName) {
		case 'SWITCH_NUMBER':
			return formattedNumber(phoneNumber);

		default: // for ORDER_SIM
			if (isDataPackage) {
				return isTelcoUser ? '' : formattedNumber(phoneNumber);
			}

			if (isTelcoUser || phoneNumber.length === 0) {
				return msisdn;
			}

			return formattedNumber(phoneNumber);
	}
};

const getScreenTitle = ({
	journeyName,
	simType,
	screenName,
	t
}: {
	journeyName?: UserJourneyType;
	simType?: SIM_TYPE;
	screenName?: ScreenName;
	t: ReturnType<typeof useAppTranslation>['t'];
}) => {
	// const {t} = useAppTranslation();
	switch (journeyName) {
		case 'SWITCH_NUMBER':
			if (screenName === 'order-confirmed') {
				return t('label.activateESIM');
			}
			return t('action.transferYaqoot');
		case 'ACTIVATE_SIM':
			if (simType === SIM_TYPE.PHYSICAL) {
				return t('common.activateSIM');
			}
			return t('label.activateESIM');
		case 'ORDER_DEVICE':
			return t('label.orderDevice');
		case 'RESCHEDULE_ORDER':
			return t('label.updatedeliveryInfo');
		case 'SIM_REPLACEMENT':
			return t('label.simReplacement2');
		case 'CHANGE_TO_SIM':
			return t('label.changeToSim');
		case 'CHANGE_TO_ESIM':
			return t('label.changeToEsim');
		case 'MOVE_ESIM_TO_ANOTHER_DEVICE':
			return t('action.moveToAnotherDevice');
		default:
			if (simType === SIM_TYPE.ESIM) {
				return t('label.orderESIM');
			}
			return t('action.orderSIM');
	}
};

const getNafathServiceType = (msisdnTransitionType: MSISDN_TRANSITION_TYPE) => {
	const {
		newNumber,
		transferMobileOwnershipBetweenNetworks,
		issueNewSimIndividual,
	} = constants.nafathJourneyServiceMap;
	switch (msisdnTransitionType) {
		case MSISDN_TRANSITION_TYPE.PORT_IN:
			return transferMobileOwnershipBetweenNetworks;
		case MSISDN_TRANSITION_TYPE.ZAIN_TO_YAQOOT:
			return issueNewSimIndividual;

		default:
			return newNumber;
	}
};

export {
	getMsisdnTransitionType,
	performEligibilityCheck,
	getNumberForRegistration,
	getScreenTitle,
	getNafathServiceType,
};

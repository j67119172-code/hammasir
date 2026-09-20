// core/state.js
import { carClassOf, plateParityFromBody } from './rules.js';

export const ACCOUNT_KEY = 'hammasir_v30_clean_account';

export function defaultState() {
  return {
    username: '', password: '', phone: '', otp: '',
    phoneVerified: false, loggedIn: false, registered: false,
    reviewStatus: 'approved', reviewMessage: '', reviewSubmittedAt: null,
    profileReviewRequired: false, profileChangedAt: null,
    name: '', gender: '', age: '', photo: null,
    sameGenderOnly: false, sameCarClassOnly: false,
    profileNotes: '', groupingPaused: false,
    originProvince: '', originCity: '', originRegion: '',
    originArea: '', originPoint: '', originMapX: null, originMapY: null,
    destinationProvince: '', destinationCity: '', destinationRegion: '',
    destinationArea: '', destinationPoint: '', destinationMapX: null, destinationMapY: null,
    departPeriod: 'morning', departStart: '07:00', departEnd: '07:30',
    returnPeriod: 'afternoon', returnStart: '05:00', returnEnd: '05:30',
    carModel: '', plateIran: '', plateBody: '', seats: '3',
    bankCard: '', iban: '', refundAccountVerified: false,
    groupMode: null, groupStatus: 'none',
    paid: false, isCreator: false,
    blocked: [], reports: [], groupMembers: [], messages: [], left: false,
    smartProposal: [], assistProposal: [],
    proposalRejectCount: 0, paidProposalCycles: 0, proposalResume: '',
    proposalStartedAt: null, proposalDeadlineAt: null,
    proposalResponses: {}, proposalFreeRetry: false,
    removalVote: null,
    pendingReplacementSlots: 0, replacementProposal: [],
    incompleteProposal: null, incompleteStage: '',
    incompleteGroupDeadlineAt: null, incompleteCandidateDeadlineAt: null,
    incompleteVotes: {}, incompleteRejectedCandidateIds: [],
    groupEventLog: [], smsLog: [],
    paymentResume: '', paymentLabel: '', profileEditMode: false,
  };
}

export const state = defaultState();

export function resetState() {
  Object.keys(state).forEach(k => delete state[k]);
  Object.assign(state, defaultState());
}

export function persist() {
  try { localStorage.setItem(ACCOUNT_KEY, JSON.stringify(state)); } catch (e) {}
}

export function restore() {
  try {
    const raw = localStorage.getItem(ACCOUNT_KEY);
    if (!raw) return;
    const saved = JSON.parse(raw);
    if (saved && saved.registered) {
      Object.assign(state, { ...defaultState(), ...saved });
    }
  } catch (e) {}
}

export function clearPersisted() {
  try { localStorage.removeItem(ACCOUNT_KEY); } catch (e) {}
}

export function selfMember() {
  return {
    id: 'me',
    name: state.name,
    phone: state.phone,
    photo: state.photo,
    car: state.carModel,
    carClass: carClassOf(state.carModel),
    gender: state.gender,
    age: state.age,
    notes: state.profileNotes || '',
    sameGenderOnly: !!state.sameGenderOnly,
    sameCarClassOnly: !!state.sameCarClassOnly,
    source: 'self',
    plateBody: state.plateBody,
    plateParity: plateParityFromBody(state.plateBody),
    originProvince: state.originProvince,
    originCity: state.originCity,
    originRegion: state.originRegion,
    originAddress: state.originPoint,
    originDistanceKm: 0,
    destinationProvince: state.destinationProvince,
    destinationCity: state.destinationCity,
    destinationRegion: state.destinationRegion,
    destinationAddress: state.destinationPoint,
    destinationDistanceKm: 0,
    departPeriod: state.departPeriod,
    departStart: state.departStart,
    departEnd: state.departEnd,
    returnPeriod: state.returnPeriod,
    returnStart: state.returnStart,
    returnEnd: state.returnEnd,
  };
}

export function canStartNewGroup() {
  return state.reviewStatus === 'approved' && !state.profileReviewRequired;
}

export function hasActiveGroup() {
  return ['active', 'replacement_pending', 'friend_replacement_pending'].includes(state.groupStatus);
}

export function pushMessage(from, text) {
  state.messages.push({ from, text });
}

export function pushSms(to, text) {
  state.smsLog = state.smsLog || [];
  state.smsLog.push({ to, text, time: Date.now() });
}

(() => {
  var __defProp = Object.defineProperty;
  var __export = (target, all) => {
    for (var name in all)
      __defProp(target, name, { get: all[name], enumerable: true });
  };

  // core/index.js
  var core_exports = {};
  __export(core_exports, {
    ACCOUNT_KEY: () => ACCOUNT_KEY,
    CAR_CLASS_INFO: () => CAR_CLASS_INFO,
    CAR_MODELS_BY_CLASS: () => CAR_MODELS_BY_CLASS,
    CAR_MODEL_CLASS: () => CAR_MODEL_CLASS,
    CAR_MODEL_OPTIONS: () => CAR_MODEL_OPTIONS,
    CFG: () => CFG,
    CITY_GEO: () => CITY_GEO,
    IRAN_LOCATIONS: () => IRAN_LOCATIONS,
    METRO_REGIONS: () => METRO_REGIONS,
    PROVINCE_CAPITAL: () => PROVINCE_CAPITAL,
    PROVINCE_GEO: () => PROVINCE_GEO,
    TRAFFIC_PARITY_CITIES: () => TRAFFIC_PARITY_CITIES,
    allPairwiseHardCompatible: () => allPairwiseHardCompatible,
    balancedParitySelection: () => balancedParitySelection,
    bestGroupCompletion: () => bestGroupCompletion,
    canStartNewGroup: () => canStartNewGroup,
    candidateCity: () => candidateCity,
    candidateGroupDistanceScore: () => candidateGroupDistanceScore,
    candidateProvince: () => candidateProvince,
    carClassAffinity: () => carClassAffinity,
    carClassCompatiblePair: () => carClassCompatiblePair,
    carClassLabel: () => carClassLabel,
    carClassOf: () => carClassOf,
    clearPersisted: () => clearPersisted,
    defaultState: () => defaultState,
    display12: () => display12,
    effectiveDistanceKm: () => effectiveDistanceKm,
    effectiveInviteLimit: () => effectiveInviteLimit,
    esc: () => esc,
    faNum: () => faNum,
    femaleRule: () => femaleRule,
    firstName: () => firstName,
    genderCompatiblePair: () => genderCompatiblePair,
    genderFa: () => genderFa,
    groupCombinationScore: () => groupCombinationScore,
    hardCompatiblePair: () => hardCompatiblePair,
    hasActiveGroup: () => hasActiveGroup,
    haversineCoords: () => haversineCoords,
    inferCityFromAddress: () => inferCityFromAddress,
    isTrafficParityCity: () => isTrafficParityCity,
    levenshteinDistance: () => levenshteinDistance,
    locationCoords: () => locationCoords,
    makeSmartProposal: () => makeSmartProposal,
    memberCar: () => memberCar,
    memberGender: () => memberGender,
    memberSameCarClassOnly: () => memberSameCarClassOnly,
    memberSameGenderOnly: () => memberSameGenderOnly,
    memberTime: () => memberTime,
    money: () => money,
    normalizeCarModel: () => normalizeCarModel,
    normalizeDigits: () => normalizeDigits,
    normalizePersonName: () => normalizePersonName,
    normalizePhone: () => normalizePhone,
    onlyDigits: () => onlyDigits,
    overlapMinutes: () => overlapMinutes,
    pairDistanceKm: () => pairDistanceKm,
    parityFa: () => parityFa,
    parse12Clock: () => parse12Clock,
    periodFa: () => periodFa,
    persist: () => persist,
    personNameSimilarity: () => personNameSimilarity,
    plateParityFromBody: () => plateParityFromBody,
    provinceForCity: () => provinceForCity,
    pushMessage: () => pushMessage,
    pushSms: () => pushSms,
    rankCandidatesForGroup: () => rankCandidatesForGroup,
    resetState: () => resetState,
    restore: () => restore,
    selfMember: () => selfMember,
    state: () => state,
    targetGroupSize: () => targetGroupSize,
    timeCompatiblePair: () => timeCompatiblePair,
    toAbsoluteMinutes: () => toAbsoluteMinutes,
    trafficParityRule: () => trafficParityRule,
    validateAge: () => validateAge,
    validateArea: () => validateArea,
    validateBankCard: () => validateBankCard,
    validateCarModel: () => validateCarModel,
    validateIban: () => validateIban,
    validateLocation: () => validateLocation,
    validateName: () => validateName,
    validatePassword: () => validatePassword,
    validatePhone: () => validatePhone,
    validatePlate: () => validatePlate,
    validateSeats: () => validateSeats,
    validateTimeWindow: () => validateTimeWindow,
    validateUsername: () => validateUsername
  });

  // core/constants.js
  var CFG = {
    fee: 5e4,
    repeatProposalFee: 15e3,
    proposalRejectBatch: 5,
    groupApprovalHours: 24,
    incompleteApprovalHours: 10,
    closeDistanceKm: 5,
    minAge: 18,
    maxAge: 80,
    maxGroup: 4,
    maxInvites: 3,
    maxSeats: 3,
    minUsername: 4,
    maxUsername: 20,
    minPassword: 8,
    maxPassword: 64,
    minName: 5,
    maxName: 60,
    minLocation: 4,
    maxLocation: 120,
    minCarModel: 2,
    maxCarModel: 50,
    minTimeWindowMinutes: 5,
    maxTimeWindowMinutes: 30,
    phoneDigits: 11,
    otpDigits: 6,
    bankCardDigits: 16,
    ibanDigits: 24
  };
  var TRAFFIC_PARITY_CITIES = /* @__PURE__ */ new Set(["\u062A\u0647\u0631\u0627\u0646"]);
  var METRO_REGIONS = {
    "\u062A\u0647\u0631\u0627\u0646": Array.from({ length: 22 }, (_, i) => "\u0645\u0646\u0637\u0642\u0647 " + (i + 1)),
    "\u0645\u0634\u0647\u062F": Array.from({ length: 13 }, (_, i) => "\u0645\u0646\u0637\u0642\u0647 " + (i + 1)),
    "\u0627\u0635\u0641\u0647\u0627\u0646": Array.from({ length: 15 }, (_, i) => "\u0645\u0646\u0637\u0642\u0647 " + (i + 1)),
    "\u0634\u06CC\u0631\u0627\u0632": Array.from({ length: 11 }, (_, i) => "\u0645\u0646\u0637\u0642\u0647 " + (i + 1))
  };
  var CITY_GEO = {
    "\u062A\u0647\u0631\u0627\u0646": [35.6892, 51.389],
    "\u06A9\u0631\u062C": [35.84, 50.9391],
    "\u0645\u0634\u0647\u062F": [36.2605, 59.6168],
    "\u0627\u0635\u0641\u0647\u0627\u0646": [32.6546, 51.668],
    "\u0634\u06CC\u0631\u0627\u0632": [29.5918, 52.5837],
    "\u062A\u0628\u0631\u06CC\u0632": [38.08, 46.2919],
    "\u0627\u0647\u0648\u0627\u0632": [31.3183, 48.6706],
    "\u0642\u0645": [34.6416, 50.8746],
    "\u0631\u0634\u062A": [37.2808, 49.5832],
    "\u0642\u0632\u0648\u06CC\u0646": [36.2688, 50.0041],
    "\u0628\u0646\u062F\u0631\u0639\u0628\u0627\u0633": [27.1832, 56.2666],
    "\u06CC\u0632\u062F": [31.8974, 54.3569],
    "\u06A9\u0631\u0645\u0627\u0646": [30.2839, 57.0834],
    "\u0627\u0631\u0627\u06A9": [34.0954, 49.7013],
    "\u0647\u0645\u062F\u0627\u0646": [34.7992, 48.5146],
    "\u0633\u0646\u0646\u062F\u062C": [35.3219, 46.9862],
    "\u06A9\u0631\u0645\u0627\u0646\u0634\u0627\u0647": [34.3142, 47.065],
    "\u0627\u0631\u062F\u0628\u06CC\u0644": [38.2465, 48.2951],
    "\u0632\u0646\u062C\u0627\u0646": [36.6736, 48.4787],
    "\u0633\u0627\u0631\u06CC": [36.5633, 53.0601],
    "\u06AF\u0631\u06AF\u0627\u0646": [36.8427, 54.4439],
    "\u0628\u0648\u0634\u0647\u0631": [28.9234, 50.8203],
    "\u0628\u06CC\u0631\u062C\u0646\u062F": [32.8663, 59.2211],
    "\u0628\u062C\u0646\u0648\u0631\u062F": [37.4747, 57.329],
    "\u0632\u0627\u0647\u062F\u0627\u0646": [29.4963, 60.8629],
    "\u0627\u06CC\u0644\u0627\u0645": [33.6374, 46.4227],
    "\u062E\u0631\u0645 \u0622\u0628\u0627\u062F": [33.4878, 48.3558],
    "\u06CC\u0627\u0633\u0648\u062C": [30.6682, 51.5879],
    "\u0634\u0647\u0631\u06A9\u0631\u062F": [32.3256, 50.8644],
    "\u0633\u0645\u0646\u0627\u0646": [35.5769, 53.3921],
    "\u0627\u0631\u0648\u0645\u06CC\u0647": [37.5527, 45.0761]
  };
  var IRAN_LOCATIONS = {
    "\u062A\u0647\u0631\u0627\u0646": ["\u062A\u0647\u0631\u0627\u0646", "\u0627\u0633\u0644\u0627\u0645\u0634\u0647\u0631", "\u067E\u0627\u06A9\u062F\u0634\u062A", "\u067E\u0631\u062F\u06CC\u0633", "\u067E\u06CC\u0634\u0648\u0627", "\u0634\u0647\u0631\u06CC\u0627\u0631", "\u0648\u0631\u0627\u0645\u06CC\u0646", "\u0631\u0628\u0627\u0637 \u06A9\u0631\u06CC\u0645", "\u0641\u06CC\u0631\u0648\u0632\u06A9\u0648\u0647", "\u062F\u0645\u0627\u0648\u0646\u062F", "\u0644\u0648\u0627\u0633\u0627\u0646", "\u0645\u0644\u0627\u0631\u062F", "\u0642\u062F\u0633", "\u0642\u0631\u0686\u06A9"],
    "\u0627\u0644\u0628\u0631\u0632": ["\u06A9\u0631\u062C", "\u0641\u0631\u062F\u06CC\u0633", "\u0646\u0638\u0631\u0622\u0628\u0627\u062F", "\u0647\u0634\u062A\u06AF\u0631\u062F", "\u0627\u0634\u062A\u0647\u0627\u0631\u062F", "\u0637\u0627\u0644\u0642\u0627\u0646"],
    "\u0627\u0635\u0641\u0647\u0627\u0646": ["\u0627\u0635\u0641\u0647\u0627\u0646", "\u06A9\u0627\u0634\u0627\u0646", "\u062E\u0645\u06CC\u0646\u06CC \u0634\u0647\u0631", "\u0646\u062C\u0641 \u0622\u0628\u0627\u062F", "\u0634\u0627\u0647\u06CC\u0646 \u0634\u0647\u0631", "\u0645\u0628\u0627\u0631\u06A9\u0647", "\u0634\u0647\u0631\u0636\u0627", "\u06AF\u0644\u067E\u0627\u06CC\u06AF\u0627\u0646", "\u0646\u0637\u0646\u0632", "\u0641\u0644\u0627\u0648\u0631\u062C\u0627\u0646"],
    "\u0641\u0627\u0631\u0633": ["\u0634\u06CC\u0631\u0627\u0632", "\u0645\u0631\u0648\u062F\u0634\u062A", "\u062C\u0647\u0631\u0645", "\u0641\u0633\u0627", "\u06A9\u0627\u0632\u0631\u0648\u0646", "\u0644\u0627\u0631", "\u062F\u0627\u0631\u0627\u0628", "\u0641\u06CC\u0631\u0648\u0632\u0622\u0628\u0627\u062F", "\u0622\u0628\u0627\u062F\u0647"],
    "\u062E\u0631\u0627\u0633\u0627\u0646 \u0631\u0636\u0648\u06CC": ["\u0645\u0634\u0647\u062F", "\u0646\u06CC\u0634\u0627\u0628\u0648\u0631", "\u0633\u0628\u0632\u0648\u0627\u0631", "\u062A\u0631\u0628\u062A \u062D\u06CC\u062F\u0631\u06CC\u0647", "\u06A9\u0627\u0634\u0645\u0631", "\u0642\u0648\u0686\u0627\u0646", "\u062A\u0631\u0628\u062A \u062C\u0627\u0645", "\u0686\u0646\u0627\u0631\u0627\u0646", "\u06AF\u0646\u0627\u0628\u0627\u062F"],
    "\u0622\u0630\u0631\u0628\u0627\u06CC\u062C\u0627\u0646 \u0634\u0631\u0642\u06CC": ["\u062A\u0628\u0631\u06CC\u0632", "\u0645\u0631\u0627\u063A\u0647", "\u0645\u0631\u0646\u062F", "\u0645\u06CC\u0627\u0646\u0647", "\u0627\u0647\u0631", "\u0628\u0646\u0627\u0628", "\u0633\u0631\u0627\u0628"],
    "\u0622\u0630\u0631\u0628\u0627\u06CC\u062C\u0627\u0646 \u063A\u0631\u0628\u06CC": ["\u0627\u0631\u0648\u0645\u06CC\u0647", "\u062E\u0648\u06CC", "\u0645\u0647\u0627\u0628\u0627\u062F", "\u0628\u0648\u06A9\u0627\u0646", "\u0645\u06CC\u0627\u0646\u062F\u0648\u0622\u0628", "\u0633\u0644\u0645\u0627\u0633", "\u0645\u0627\u06A9\u0648"],
    "\u062E\u0648\u0632\u0633\u062A\u0627\u0646": ["\u0627\u0647\u0648\u0627\u0632", "\u0622\u0628\u0627\u062F\u0627\u0646", "\u062E\u0631\u0645\u0634\u0647\u0631", "\u062F\u0632\u0641\u0648\u0644", "\u0627\u0646\u062F\u06CC\u0645\u0634\u06A9", "\u0645\u0627\u0647\u0634\u0647\u0631", "\u0628\u0647\u0628\u0647\u0627\u0646", "\u0634\u0648\u0634\u062A\u0631"],
    "\u06AF\u06CC\u0644\u0627\u0646": ["\u0631\u0634\u062A", "\u0628\u0646\u062F\u0631 \u0627\u0646\u0632\u0644\u06CC", "\u0644\u0627\u0647\u06CC\u062C\u0627\u0646", "\u0644\u0646\u06AF\u0631\u0648\u062F", "\u0622\u0633\u062A\u0627\u0631\u0627", "\u0631\u0648\u062F\u0633\u0631", "\u062A\u0627\u0644\u0634", "\u0641\u0648\u0645\u0646"],
    "\u0645\u0627\u0632\u0646\u062F\u0631\u0627\u0646": ["\u0633\u0627\u0631\u06CC", "\u0628\u0627\u0628\u0644", "\u0622\u0645\u0644", "\u0642\u0627\u0626\u0645 \u0634\u0647\u0631", "\u0628\u0647\u0634\u0647\u0631", "\u0646\u06A9\u0627", "\u0628\u0627\u0628\u0644\u0633\u0631", "\u0686\u0627\u0644\u0648\u0633", "\u062A\u0646\u06A9\u0627\u0628\u0646", "\u0631\u0627\u0645\u0633\u0631", "\u0646\u0648\u0634\u0647\u0631"],
    "\u06A9\u0631\u0645\u0627\u0646": ["\u06A9\u0631\u0645\u0627\u0646", "\u0631\u0641\u0633\u0646\u062C\u0627\u0646", "\u0633\u06CC\u0631\u062C\u0627\u0646", "\u062C\u06CC\u0631\u0641\u062A", "\u0628\u0645", "\u0632\u0631\u0646\u062F", "\u0628\u0631\u062F\u0633\u06CC\u0631"],
    "\u0642\u0645": ["\u0642\u0645"],
    "\u0642\u0632\u0648\u06CC\u0646": ["\u0642\u0632\u0648\u06CC\u0646", "\u062A\u0627\u06A9\u0633\u062A\u0627\u0646", "\u0622\u0628\u06CC\u06A9", "\u0628\u0648\u0626\u06CC\u0646 \u0632\u0647\u0631\u0627"],
    "\u0645\u0631\u06A9\u0632\u06CC": ["\u0627\u0631\u0627\u06A9", "\u0633\u0627\u0648\u0647", "\u062E\u0645\u06CC\u0646", "\u0645\u062D\u0644\u0627\u062A", "\u062F\u0644\u06CC\u062C\u0627\u0646", "\u0634\u0627\u0632\u0646\u062F"],
    "\u0647\u0645\u062F\u0627\u0646": ["\u0647\u0645\u062F\u0627\u0646", "\u0645\u0644\u0627\u06CC\u0631", "\u0646\u0647\u0627\u0648\u0646\u062F", "\u062A\u0648\u06CC\u0633\u0631\u06A9\u0627\u0646", "\u0627\u0633\u062F\u0622\u0628\u0627\u062F", "\u0628\u0647\u0627\u0631"],
    "\u06A9\u0631\u0645\u0627\u0646\u0634\u0627\u0647": ["\u06A9\u0631\u0645\u0627\u0646\u0634\u0627\u0647", "\u0627\u0633\u0644\u0627\u0645 \u0622\u0628\u0627\u062F \u063A\u0631\u0628", "\u06A9\u0646\u06AF\u0627\u0648\u0631", "\u067E\u0627\u0648\u0647", "\u0633\u0646\u0642\u0631"],
    "\u06AF\u0644\u0633\u062A\u0627\u0646": ["\u06AF\u0631\u06AF\u0627\u0646", "\u06AF\u0646\u0628\u062F \u06A9\u0627\u0648\u0648\u0633", "\u0639\u0644\u06CC \u0622\u0628\u0627\u062F", "\u0622\u0642 \u0642\u0644\u0627", "\u0628\u0646\u062F\u0631 \u062A\u0631\u06A9\u0645\u0646"],
    "\u0627\u0631\u062F\u0628\u06CC\u0644": ["\u0627\u0631\u062F\u0628\u06CC\u0644", "\u067E\u0627\u0631\u0633 \u0622\u0628\u0627\u062F", "\u0645\u0634\u06AF\u06CC\u0646 \u0634\u0647\u0631", "\u062E\u0644\u062E\u0627\u0644", "\u06AF\u0631\u0645\u06CC"],
    "\u0628\u0648\u0634\u0647\u0631": ["\u0628\u0648\u0634\u0647\u0631", "\u0628\u0631\u0627\u0632\u062C\u0627\u0646", "\u06AF\u0646\u0627\u0648\u0647", "\u06A9\u0646\u06AF\u0627\u0646", "\u062F\u06CC\u0631", "\u0639\u0633\u0644\u0648\u06CC\u0647"],
    "\u0647\u0631\u0645\u0632\u06AF\u0627\u0646": ["\u0628\u0646\u062F\u0631\u0639\u0628\u0627\u0633", "\u0645\u06CC\u0646\u0627\u0628", "\u0642\u0634\u0645", "\u0628\u0646\u062F\u0631 \u0644\u0646\u06AF\u0647", "\u06A9\u06CC\u0634", "\u062C\u0627\u0633\u06A9"],
    "\u06CC\u0632\u062F": ["\u06CC\u0632\u062F", "\u0645\u06CC\u0628\u062F", "\u0627\u0631\u062F\u06A9\u0627\u0646", "\u0628\u0627\u0641\u0642", "\u0645\u0647\u0631\u06CC\u0632\u06CC", "\u0627\u0628\u0631\u06A9\u0648\u0647", "\u062A\u0641\u062A"],
    "\u06A9\u0631\u062F\u0633\u062A\u0627\u0646": ["\u0633\u0646\u0646\u062F\u062C", "\u0633\u0642\u0632", "\u0645\u0631\u06CC\u0648\u0627\u0646", "\u0628\u0627\u0646\u0647", "\u0642\u0631\u0648\u0647", "\u0628\u06CC\u062C\u0627\u0631"],
    "\u0644\u0631\u0633\u062A\u0627\u0646": ["\u062E\u0631\u0645 \u0622\u0628\u0627\u062F", "\u0628\u0631\u0648\u062C\u0631\u062F", "\u062F\u0648\u0631\u0648\u062F", "\u06A9\u0648\u0647\u062F\u0634\u062A", "\u0627\u0644\u06CC\u06AF\u0648\u062F\u0631\u0632"],
    "\u0632\u0646\u062C\u0627\u0646": ["\u0632\u0646\u062C\u0627\u0646", "\u0627\u0628\u0647\u0631", "\u062E\u0631\u0645\u062F\u0631\u0647", "\u0642\u06CC\u062F\u0627\u0631"],
    "\u0633\u0645\u0646\u0627\u0646": ["\u0633\u0645\u0646\u0627\u0646", "\u0634\u0627\u0647\u0631\u0648\u062F", "\u062F\u0627\u0645\u063A\u0627\u0646", "\u06AF\u0631\u0645\u0633\u0627\u0631"],
    "\u0686\u0647\u0627\u0631\u0645\u062D\u0627\u0644 \u0648 \u0628\u062E\u062A\u06CC\u0627\u0631\u06CC": ["\u0634\u0647\u0631\u06A9\u0631\u062F", "\u0628\u0631\u0648\u062C\u0646", "\u0641\u0627\u0631\u0633\u0627\u0646", "\u0644\u0631\u062F\u06AF\u0627\u0646"],
    "\u062E\u0631\u0627\u0633\u0627\u0646 \u0634\u0645\u0627\u0644\u06CC": ["\u0628\u062C\u0646\u0648\u0631\u062F", "\u0634\u06CC\u0631\u0648\u0627\u0646", "\u0627\u0633\u0641\u0631\u0627\u06CC\u0646"],
    "\u062E\u0631\u0627\u0633\u0627\u0646 \u062C\u0646\u0648\u0628\u06CC": ["\u0628\u06CC\u0631\u062C\u0646\u062F", "\u0642\u0627\u0626\u0646", "\u0637\u0628\u0633", "\u0641\u0631\u062F\u0648\u0633"],
    "\u0633\u06CC\u0633\u062A\u0627\u0646 \u0648 \u0628\u0644\u0648\u0686\u0633\u062A\u0627\u0646": ["\u0632\u0627\u0647\u062F\u0627\u0646", "\u0632\u0627\u0628\u0644", "\u0627\u06CC\u0631\u0627\u0646\u0634\u0647\u0631", "\u0686\u0627\u0628\u0647\u0627\u0631"],
    "\u0627\u06CC\u0644\u0627\u0645": ["\u0627\u06CC\u0644\u0627\u0645", "\u062F\u0647\u0644\u0631\u0627\u0646", "\u0627\u06CC\u0648\u0627\u0646", "\u0622\u0628\u062F\u0627\u0646\u0627\u0646"],
    "\u06A9\u0647\u06AF\u06CC\u0644\u0648\u06CC\u0647 \u0648 \u0628\u0648\u06CC\u0631\u0627\u062D\u0645\u062F": ["\u06CC\u0627\u0633\u0648\u062C", "\u062F\u0648\u06AF\u0646\u0628\u062F\u0627\u0646", "\u062F\u0647\u062F\u0634\u062A"]
  };
  var PROVINCE_CAPITAL = {
    "\u0622\u0630\u0631\u0628\u0627\u06CC\u062C\u0627\u0646 \u0634\u0631\u0642\u06CC": "\u062A\u0628\u0631\u06CC\u0632",
    "\u0622\u0630\u0631\u0628\u0627\u06CC\u062C\u0627\u0646 \u063A\u0631\u0628\u06CC": "\u0627\u0631\u0648\u0645\u06CC\u0647",
    "\u0627\u0631\u062F\u0628\u06CC\u0644": "\u0627\u0631\u062F\u0628\u06CC\u0644",
    "\u0627\u0635\u0641\u0647\u0627\u0646": "\u0627\u0635\u0641\u0647\u0627\u0646",
    "\u0627\u0644\u0628\u0631\u0632": "\u06A9\u0631\u062C",
    "\u0627\u06CC\u0644\u0627\u0645": "\u0627\u06CC\u0644\u0627\u0645",
    "\u0628\u0648\u0634\u0647\u0631": "\u0628\u0648\u0634\u0647\u0631",
    "\u062A\u0647\u0631\u0627\u0646": "\u062A\u0647\u0631\u0627\u0646",
    "\u0686\u0647\u0627\u0631\u0645\u062D\u0627\u0644 \u0648 \u0628\u062E\u062A\u06CC\u0627\u0631\u06CC": "\u0634\u0647\u0631\u06A9\u0631\u062F",
    "\u062E\u0631\u0627\u0633\u0627\u0646 \u062C\u0646\u0648\u0628\u06CC": "\u0628\u06CC\u0631\u062C\u0646\u062F",
    "\u062E\u0631\u0627\u0633\u0627\u0646 \u0631\u0636\u0648\u06CC": "\u0645\u0634\u0647\u062F",
    "\u062E\u0631\u0627\u0633\u0627\u0646 \u0634\u0645\u0627\u0644\u06CC": "\u0628\u062C\u0646\u0648\u0631\u062F",
    "\u062E\u0648\u0632\u0633\u062A\u0627\u0646": "\u0627\u0647\u0648\u0627\u0632",
    "\u0632\u0646\u062C\u0627\u0646": "\u0632\u0646\u062C\u0627\u0646",
    "\u0633\u0645\u0646\u0627\u0646": "\u0633\u0645\u0646\u0627\u0646",
    "\u0633\u06CC\u0633\u062A\u0627\u0646 \u0648 \u0628\u0644\u0648\u0686\u0633\u062A\u0627\u0646": "\u0632\u0627\u0647\u062F\u0627\u0646",
    "\u0641\u0627\u0631\u0633": "\u0634\u06CC\u0631\u0627\u0632",
    "\u0642\u0632\u0648\u06CC\u0646": "\u0642\u0632\u0648\u06CC\u0646",
    "\u0642\u0645": "\u0642\u0645",
    "\u06A9\u0631\u062F\u0633\u062A\u0627\u0646": "\u0633\u0646\u0646\u062F\u062C",
    "\u06A9\u0631\u0645\u0627\u0646": "\u06A9\u0631\u0645\u0627\u0646",
    "\u06A9\u0631\u0645\u0627\u0646\u0634\u0627\u0647": "\u06A9\u0631\u0645\u0627\u0646\u0634\u0627\u0647",
    "\u06A9\u0647\u06AF\u06CC\u0644\u0648\u06CC\u0647 \u0648 \u0628\u0648\u06CC\u0631\u0627\u062D\u0645\u062F": "\u06CC\u0627\u0633\u0648\u062C",
    "\u06AF\u0644\u0633\u062A\u0627\u0646": "\u06AF\u0631\u06AF\u0627\u0646",
    "\u06AF\u06CC\u0644\u0627\u0646": "\u0631\u0634\u062A",
    "\u0644\u0631\u0633\u062A\u0627\u0646": "\u062E\u0631\u0645 \u0622\u0628\u0627\u062F",
    "\u0645\u0627\u0632\u0646\u062F\u0631\u0627\u0646": "\u0633\u0627\u0631\u06CC",
    "\u0645\u0631\u06A9\u0632\u06CC": "\u0627\u0631\u0627\u06A9",
    "\u0647\u0631\u0645\u0632\u06AF\u0627\u0646": "\u0628\u0646\u062F\u0631\u0639\u0628\u0627\u0633",
    "\u0647\u0645\u062F\u0627\u0646": "\u0647\u0645\u062F\u0627\u0646",
    "\u06CC\u0632\u062F": "\u06CC\u0632\u062F"
  };
  var PROVINCE_GEO = Object.fromEntries(
    Object.entries(PROVINCE_CAPITAL).map(([p, c]) => [p, CITY_GEO[c]]).filter(([_, g]) => Array.isArray(g))
  );
  var CAR_CLASS_INFO = {
    economy: { label: "\u0627\u0642\u062A\u0635\u0627\u062F\u06CC", examples: "\u067E\u0631\u0627\u06CC\u062F\u060C \u062A\u06CC\u0628\u0627\u060C \u0633\u0627\u06CC\u0646\u0627\u060C \u06A9\u0648\u06CC\u06CC\u06A9" },
    compact: { label: "\u06A9\u0627\u0645\u067E\u06A9\u062A", examples: "\u067E\u0698\u0648 \u06F2\u06F0\u06F6\u060C \u06F2\u06F0\u06F7\u060C \u0631\u0627\u0646\u0627" },
    sedan: { label: "\u0633\u062F\u0627\u0646", examples: "\u0633\u0645\u0646\u062F\u060C \u062F\u0646\u0627\u060C \u062A\u0627\u0631\u0627\u060C \u0634\u0627\u0647\u06CC\u0646" },
    suv: { label: "\u0634\u0627\u0633\u06CC\u200C\u0628\u0644\u0646\u062F", examples: "\u0647\u0627\u06CC\u0645\u0627\u060C \u062A\u06CC\u06AF\u0648\u060C \u062C\u06A9 S5" }
  };
  var CAR_MODELS_BY_CLASS = {
    economy: ["\u067E\u0631\u0627\u06CC\u062F 131", "\u067E\u0631\u0627\u06CC\u062F 111", "\u062A\u06CC\u0628\u0627", "\u0633\u0627\u06CC\u0646\u0627", "\u06A9\u0648\u06CC\u06CC\u06A9", "\u06A9\u0648\u06CC\u06CC\u06A9 R", "\u0627\u0645 \u0648\u06CC \u0627\u0645 110"],
    compact: ["\u067E\u0698\u0648 206", "\u067E\u0698\u0648 207", "\u0631\u0627\u0646\u0627", "\u0631\u0627\u0646\u0627 \u067E\u0644\u0627\u0633", "\u0631\u0646\u0648 \u0633\u0627\u0646\u062F\u0631\u0648", "\u0647\u06CC\u0648\u0646\u062F\u0627\u06CC i20"],
    sedan: ["\u0633\u0645\u0646\u062F", "\u0633\u0645\u0646\u062F \u0633\u0648\u0631\u0646", "\u062F\u0646\u0627", "\u062F\u0646\u0627 \u067E\u0644\u0627\u0633", "\u062A\u0627\u0631\u0627", "\u0634\u0627\u0647\u06CC\u0646", "\u0634\u0627\u0647\u06CC\u0646 \u067E\u0644\u0627\u0633", "\u067E\u0698\u0648 \u067E\u0627\u0631\u0633", "\u0631\u0646\u0648 L90", "\u06A9\u06CC\u0627 \u0633\u0631\u0627\u062A\u0648", "\u062A\u0648\u06CC\u0648\u062A\u0627 \u06A9\u0631\u0648\u0644\u0627"],
    suv: ["\u0647\u0627\u06CC\u0645\u0627 S5", "\u0647\u0627\u06CC\u0645\u0627 S7", "\u0686\u0631\u06CC \u062A\u06CC\u06AF\u0648 5", "\u0686\u0631\u06CC \u062A\u06CC\u06AF\u0648 7", "\u062C\u06A9 S5", "\u0627\u0645 \u0648\u06CC \u0627\u0645 X22", "\u0627\u0645 \u0648\u06CC \u0627\u0645 X33", "\u06A9\u06CC\u0627 \u0627\u0633\u067E\u0648\u0631\u062A\u06CC\u062C", "\u0647\u06CC\u0648\u0646\u062F\u0627\u06CC \u062A\u0648\u0633\u0627\u0646"]
  };
  var CAR_MODEL_CLASS = {};
  for (const [cls, list] of Object.entries(CAR_MODELS_BY_CLASS))
    for (const m of list) CAR_MODEL_CLASS[m] = cls;
  var CAR_MODEL_OPTIONS = Object.values(CAR_MODELS_BY_CLASS).flat();

  // core/utils.js
  var FA_DIGITS = "\u06F0\u06F1\u06F2\u06F3\u06F4\u06F5\u06F6\u06F7\u06F8\u06F9";
  var AR_DIGITS = "\u0660\u0661\u0662\u0663\u0664\u0665\u0666\u0667\u0668\u0669";
  function normalizeDigits(v) {
    return String(v ?? "").replace(/[۰-۹]/g, (d) => FA_DIGITS.indexOf(d)).replace(/[٠-٩]/g, (d) => AR_DIGITS.indexOf(d));
  }
  function onlyDigits(v) {
    return normalizeDigits(v).replace(/\D/g, "");
  }
  function normalizePhone(v) {
    v = normalizeDigits(v).replace(/[\s\-()]/g, "");
    if (v.startsWith("+98")) v = "0" + v.slice(3);
    else if (v.startsWith("0098")) v = "0" + v.slice(4);
    else if (v.startsWith("98") && v.length === 12) v = "0" + v.slice(2);
    return v;
  }
  function esc(s) {
    return String(s ?? "").replace(/[&<>"']/g, (m) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[m]);
  }
  function faNum(n) {
    return new Intl.NumberFormat("fa-IR").format(n);
  }
  function money(n) {
    return faNum(n) + " \u062A\u0648\u0645\u0627\u0646";
  }
  function normalizePersonName(name) {
    return String(name ?? "").trim().replace(/\s+/g, " ").replace(/ي/g, "\u06CC").replace(/ك/g, "\u06A9").replace(/[\u064B-\u065F\u0670]/g, "").toLowerCase();
  }
  function levenshteinDistance(a, b) {
    a = normalizePersonName(a);
    b = normalizePersonName(b);
    const n = a.length, m = b.length;
    if (!n) return m;
    if (!m) return n;
    let prev = Array.from({ length: m + 1 }, (_, j) => j);
    let cur = new Array(m + 1);
    for (let i = 1; i <= n; i++) {
      cur[0] = i;
      for (let j = 1; j <= m; j++) {
        cur[j] = Math.min(
          cur[j - 1] + 1,
          prev[j] + 1,
          prev[j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1)
        );
      }
      [prev, cur] = [cur, prev];
    }
    return prev[m];
  }
  function personNameSimilarity(a, b) {
    const x = normalizePersonName(a);
    const y = normalizePersonName(b);
    const maxLen = Math.max(x.length, y.length);
    if (!maxLen) return 1;
    return Math.max(0, 1 - levenshteinDistance(x, y) / maxLen);
  }
  var genderFa = (g) => g === "female" ? "\u062E\u0627\u0646\u0645" : "\u0622\u0642\u0627";
  var periodFa = (p) => p === "morning" ? "\u0635\u0628\u062D" : "\u0628\u0639\u062F\u0627\u0632\u0638\u0647\u0631";
  var parityFa = (p) => p === "even" ? "\u0632\u0648\u062C" : p === "odd" ? "\u0641\u0631\u062F" : "\u0646\u0627\u0645\u0634\u062E\u0635";
  var firstName = (n) => String(n || "").trim().split(/\s+/)[0] || "\u0639\u0636\u0648";

  // core/rules.js
  function normalizeCarModel(v = "") {
    return String(v || "").trim().replace(/\s+/g, " ");
  }
  function carClassOf(model = "") {
    const m = normalizeCarModel(model);
    if (CAR_MODEL_CLASS[m]) return CAR_MODEL_CLASS[m];
    const s = m.toLowerCase();
    if (/(پراید|پیکان|تیبا|ساینا|کوییک|ماتیز|سیلو|ام وی ام 110)/iu.test(s)) return "economy";
    if (/(206|۲۰۶|207|۲۰۷|رانا|ساندرو|h220|h230|h320|315|rio|ریو|i20|i30|مزدا\s*2)/iu.test(s)) return "compact";
    if (/(شاسی|suv|کراس|هایما|تیگو|جک|kmc|x22|x33|x55|فیدلیتی|دیگنیتی|اسپورتیج|توسان|سانتافه|کپچر|داستر|جوک|ایکس تریل|راو4|پرادو|ویتارا|asx|اوتلندر)/iu.test(s)) return "suv";
    return "sedan";
  }
  function carClassLabel(model = "") {
    return CAR_CLASS_INFO[carClassOf(model)]?.label || "\u0633\u062F\u0627\u0646";
  }
  function plateParityFromBody(body) {
    const digits = onlyDigits(body);
    if (!digits) return "";
    return Number(digits.slice(-1)) % 2 === 0 ? "even" : "odd";
  }
  function isTrafficParityCity(city) {
    return TRAFFIC_PARITY_CITIES.has(city);
  }
  function trafficParityRule(members, originCity) {
    if (!isTrafficParityCity(originCity)) return { ok: true };
    const known = members.map((m) => m.plateParity || plateParityFromBody(m.plateBody)).filter(Boolean);
    const e = known.filter((x) => x === "even").length;
    const o = known.filter((x) => x === "odd").length;
    if (known.length < members.length) return { ok: false, msg: "\u0627\u0637\u0644\u0627\u0639\u0627\u062A \u0632\u0648\u062C/\u0641\u0631\u062F \u067E\u0644\u0627\u06A9 \u0647\u0645\u0647 \u0627\u0639\u0636\u0627 \u0628\u0627\u06CC\u062F \u0645\u0634\u062E\u0635 \u0628\u0627\u0634\u062F." };
    if (members.length === 4 && !(e === 2 && o === 2)) return { ok: false, msg: "\u06AF\u0631\u0648\u0647 \u06F4 \u0646\u0641\u0631\u0647 \u0628\u0627\u06CC\u062F \u06F2 \u067E\u0644\u0627\u06A9 \u0632\u0648\u062C \u0648 \u06F2 \u067E\u0644\u0627\u06A9 \u0641\u0631\u062F \u0628\u0627\u0634\u062F." };
    if (members.length === 2 && !(e === 1 && o === 1)) return { ok: false, msg: "\u06AF\u0631\u0648\u0647 \u06F2 \u0646\u0641\u0631\u0647 \u0646\u06CC\u0627\u0632 \u0628\u0647 \u06CC\u06A9 \u067E\u0644\u0627\u06A9 \u0632\u0648\u062C \u0648 \u06CC\u06A9 \u067E\u0644\u0627\u06A9 \u0641\u0631\u062F \u062F\u0627\u0631\u062F." };
    if (members.length === 3 && Math.abs(e - o) > 1) return { ok: false, msg: "\u062A\u0648\u0632\u06CC\u0639 \u067E\u0644\u0627\u06A9 \u0628\u0627\u06CC\u062F \u0645\u062A\u0648\u0627\u0632\u0646 \u0628\u0627\u0634\u062F." };
    return { ok: true };
  }
  function femaleRule(members) {
    const females = members.filter((m) => m.gender === "female").length;
    return { ok: females !== 1, females };
  }
  function memberGender(m, state3) {
    return m?.id === "me" ? state3.gender : m?.gender;
  }
  function memberCar(m, state3) {
    return m?.id === "me" ? state3.carModel : m?.car || "";
  }
  function memberSameGenderOnly(m, state3) {
    return m?.id === "me" ? !!state3.sameGenderOnly : !!m?.sameGenderOnly;
  }
  function memberSameCarClassOnly(m, state3) {
    return m?.id === "me" ? !!state3.sameCarClassOnly : !!m?.sameCarClassOnly;
  }
  function memberTime(m, prefix, state3) {
    if (m?.id === "me") return { period: state3[prefix + "Period"], start: state3[prefix + "Start"], end: state3[prefix + "End"] };
    return {
      period: m?.[prefix + "Period"] || (prefix === "depart" ? "morning" : "afternoon"),
      start: m?.[prefix + "Start"] || (prefix === "depart" ? "07:00" : "05:00"),
      end: m?.[prefix + "End"] || (prefix === "depart" ? "07:30" : "05:30")
    };
  }
  function parse12Clock(t) {
    const m = /^(0?[1-9]|1[0-2]):([0-5]\d)$/.exec(t || "");
    return m ? { h: +m[1], m: +m[2] } : null;
  }
  function toAbsoluteMinutes(period, t) {
    const x = parse12Clock(t);
    if (!x) return NaN;
    let h = x.h;
    if (period === "morning") {
      if (h === 12) h = 0;
    } else {
      if (h !== 12) h += 12;
    }
    return h * 60 + x.m;
  }
  function overlapMinutes(a, b) {
    if (!a || !b || a.period !== b.period) return 0;
    const s = Math.max(toAbsoluteMinutes(a.period, a.start), toAbsoluteMinutes(b.period, b.start));
    const e = Math.min(toAbsoluteMinutes(a.period, a.end), toAbsoluteMinutes(b.period, b.end));
    return Number.isFinite(s) && Number.isFinite(e) ? Math.max(0, e - s) : 0;
  }
  function display12(t) {
    const x = parse12Clock(t);
    return x ? `${x.h}:${String(x.m).padStart(2, "0")}` : "\u2014";
  }
  function timeCompatiblePair(a, b, state3) {
    return overlapMinutes(memberTime(a, "depart", state3), memberTime(b, "depart", state3)) > 0 && overlapMinutes(memberTime(a, "return", state3), memberTime(b, "return", state3)) > 0;
  }
  function genderCompatiblePair(a, b, state3) {
    if (!memberSameGenderOnly(a, state3) && !memberSameGenderOnly(b, state3)) return true;
    return memberGender(a, state3) === memberGender(b, state3);
  }
  function carClassCompatiblePair(a, b, state3) {
    if (!memberSameCarClassOnly(a, state3) && !memberSameCarClassOnly(b, state3)) return true;
    return carClassOf(memberCar(a, state3)) === carClassOf(memberCar(b, state3));
  }
  function hardCompatiblePair(a, b, state3) {
    return timeCompatiblePair(a, b, state3) && genderCompatiblePair(a, b, state3) && carClassCompatiblePair(a, b, state3);
  }
  function allPairwiseHardCompatible(members, state3) {
    for (let i = 0; i < members.length; i++)
      for (let j = i + 1; j < members.length; j++)
        if (!hardCompatiblePair(members[i], members[j], state3)) return false;
    return true;
  }
  function targetGroupSize(state3) {
    return Math.max(2, Math.min(CFG.maxGroup, 1 + Number(state3.seats || CFG.maxSeats)));
  }
  function effectiveInviteLimit(state3) {
    return Math.max(1, Math.min(CFG.maxInvites, targetGroupSize(state3) - 1));
  }

  // core/location.js
  function provinceForCity(city = "") {
    if (!city) return "";
    for (const [province, cities] of Object.entries(IRAN_LOCATIONS))
      if (cities.includes(city)) return province;
    return "";
  }
  function inferCityFromAddress(address = "") {
    const s = String(address || "");
    for (const cities of Object.values(IRAN_LOCATIONS)) {
      const hit = cities.find((city) => s.includes(city));
      if (hit) return hit;
    }
    return "";
  }
  function candidateCity(m, kind) {
    const key = kind === "origin" ? "originCity" : "destinationCity";
    const addrKey = kind === "origin" ? "originAddress" : "destinationAddress";
    return m?.[key] || inferCityFromAddress(m?.[addrKey]) || "";
  }
  function candidateProvince(m, kind) {
    const key = kind === "origin" ? "originProvince" : "destinationProvince";
    return m?.[key] || provinceForCity(candidateCity(m, kind)) || "";
  }
  function haversineCoords(a, b) {
    if (!Array.isArray(a) || !Array.isArray(b)) return NaN;
    const R = 6371;
    const toRad = (d) => d * Math.PI / 180;
    const dLat = toRad(b[0] - a[0]);
    const dLon = toRad(b[1] - a[1]);
    const lat1 = toRad(a[0]);
    const lat2 = toRad(b[0]);
    const h = Math.sin(dLat / 2) ** 2 + Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLon / 2) ** 2;
    return 2 * R * Math.asin(Math.sqrt(h));
  }
  function locationCoords(city, province) {
    return CITY_GEO[city] || PROVINCE_GEO[province] || null;
  }
  function effectiveDistanceKm(m, kind, state3) {
    if (!m || m.id === "me") return 0;
    const userCity = kind === "origin" ? state3.originCity : state3.destinationCity;
    const userProvince = kind === "origin" ? state3.originProvince : state3.destinationProvince;
    const memberCity = candidateCity(m, kind);
    const memberProvince = candidateProvince(m, kind);
    const raw = Number(kind === "origin" ? m.originDistanceKm : m.destinationDistanceKm);
    if (userCity && memberCity && userCity === memberCity)
      return Number.isFinite(raw) && raw >= 0 ? raw : 0;
    if (userCity || memberCity || userProvince || memberProvince) {
      const d = haversineCoords(
        locationCoords(userCity, userProvince),
        locationCoords(memberCity, memberProvince)
      );
      if (Number.isFinite(d)) {
        if (userProvince && memberProvince && userProvince !== memberProvince) return Math.max(25, d);
        if (userCity && memberCity && userCity !== memberCity) return Math.max(12, d);
        return Math.max(12, d);
      }
      if (userProvince && memberProvince && userProvince !== memberProvince) return 80;
      if (userCity && memberCity && userCity !== memberCity) return 25;
    }
    return Number.isFinite(raw) && raw >= 0 ? raw : 99;
  }
  function pairDistanceKm(a, b, kind, state3) {
    if (a?.id === "me") return effectiveDistanceKm(b, kind, state3);
    if (b?.id === "me") return effectiveDistanceKm(a, kind, state3);
    const ac = candidateCity(a, kind), bc = candidateCity(b, kind);
    const ap = candidateProvince(a, kind), bp = candidateProvince(b, kind);
    if (ac && bc && ac !== bc) {
      const d = haversineCoords(locationCoords(ac, ap), locationCoords(bc, bp));
      if (Number.isFinite(d)) return Math.max(12, d);
    }
    if (ap && bp && ap !== bp) {
      const d = haversineCoords(locationCoords(ac, ap), locationCoords(bc, bp));
      if (Number.isFinite(d)) return Math.max(25, d);
      return 80;
    }
    const ar = Number(kind === "origin" ? a?.originDistanceKm : a?.destinationDistanceKm);
    const br = Number(kind === "origin" ? b?.originDistanceKm : b?.destinationDistanceKm);
    if (Number.isFinite(ar) && Number.isFinite(br)) return Math.max(0.2, Math.abs(ar - br));
    return 2;
  }
  function candidateGroupDistanceScore(c, existing, state3) {
    const me = {
      id: "me",
      gender: state3.gender,
      car: state3.carModel,
      sameGenderOnly: !!state3.sameGenderOnly,
      sameCarClassOnly: !!state3.sameCarClassOnly,
      plateParity: plateParityFromBody(state3.plateBody),
      originProvince: state3.originProvince,
      originCity: state3.originCity,
      destinationProvince: state3.destinationProvince,
      destinationCity: state3.destinationCity,
      departPeriod: state3.departPeriod,
      departStart: state3.departStart,
      departEnd: state3.departEnd,
      returnPeriod: state3.returnPeriod,
      returnStart: state3.returnStart,
      returnEnd: state3.returnEnd
    };
    const peers = existing.length ? existing : [me];
    const totals = peers.map(
      (m) => pairDistanceKm(c, m, "origin", state3) + pairDistanceKm(c, m, "destination", state3)
    );
    const avg = totals.reduce((a, b) => a + b, 0) / totals.length;
    const worst = Math.max(...totals);
    return avg + 0.35 * worst;
  }

  // core/matching.js
  function carClassAffinity(c, existing, state3) {
    const k = carClassOf(memberCar(c, state3));
    const me = {
      id: "me",
      car: state3.carModel,
      gender: state3.gender,
      sameGenderOnly: !!state3.sameGenderOnly,
      sameCarClassOnly: !!state3.sameCarClassOnly
    };
    const peers = existing.length ? existing : [me];
    const same = peers.filter((m) => carClassOf(memberCar(m, state3)) === k).length;
    return same / peers.length;
  }
  function rankCandidatesForGroup(existing, list, state3, rejected = []) {
    const excluded = /* @__PURE__ */ new Set([...rejected, ...existing.map((m) => m.id)]);
    const pool = list.filter((c) => c.registered !== false).filter((c) => !c.groupingPaused).filter((c) => !excluded.has(c.id)).filter((c) => existing.every((m) => hardCompatiblePair(c, m, state3)));
    return pool.sort((a, b) => {
      const da = candidateGroupDistanceScore(a, existing, state3);
      const db = candidateGroupDistanceScore(b, existing, state3);
      const diff = da - db;
      if (Math.abs(diff) > CFG.closeDistanceKm) return diff;
      const ca = carClassAffinity(a, existing, state3);
      const cb = carClassAffinity(b, existing, state3);
      if (cb !== ca) return cb - ca;
      return diff;
    });
  }
  function groupCombinationScore(picks, existing, state3) {
    const members = [...existing, ...picks];
    let d = 0, n = 0;
    for (let i = 0; i < members.length; i++) {
      for (let j = i + 1; j < members.length; j++) {
        d += pairDistanceKm(members[i], members[j], "origin", state3) + pairDistanceKm(members[i], members[j], "destination", state3);
        n++;
      }
    }
    const avg = n ? d / n : 0;
    let matched = 0, total = 0;
    for (const p of picks) {
      for (const e of existing) {
        total++;
        if (carClassOf(memberCar(p, state3)) === carClassOf(memberCar(e, state3))) matched++;
      }
    }
    if (!total) {
      for (let i = 0; i < members.length; i++) {
        for (let j = i + 1; j < members.length; j++) {
          total++;
          if (carClassOf(memberCar(members[i], state3)) === carClassOf(memberCar(members[j], state3))) matched++;
        }
      }
    }
    return { distance: avg, classAffinity: total ? matched / total : 0 };
  }
  function bestGroupCompletion(existing, missing, pool, state3, rejected = []) {
    if (missing <= 0) return [];
    const ranked = rankCandidatesForGroup(existing, pool, state3, rejected).slice(0, 28);
    const valid = [];
    function rec(start, pick) {
      if (pick.length === missing) {
        const all = [...existing, ...pick];
        if (!allPairwiseHardCompatible(all, state3)) return;
        if (!femaleRule(all).ok) return;
        if (!trafficParityRule(all, state3.originCity).ok) return;
        valid.push([...pick]);
        return;
      }
      for (let i = start; i < ranked.length; i++) {
        const next = [...pick, ranked[i]];
        const all = [...existing, ...next];
        if (allPairwiseHardCompatible(all, state3)) rec(i + 1, next);
      }
    }
    rec(0, []);
    valid.sort((a, b) => {
      const A = groupCombinationScore(a, existing, state3);
      const B = groupCombinationScore(b, existing, state3);
      const diff = A.distance - B.distance;
      if (Math.abs(diff) > CFG.closeDistanceKm) return diff;
      if (B.classAffinity !== A.classAffinity) return B.classAffinity - A.classAffinity;
      return diff;
    });
    return valid[0] || [];
  }
  function makeSmartProposal(pool, state3, rejected = []) {
    const me = {
      id: "me",
      name: state3.name || "\u0634\u0645\u0627",
      gender: state3.gender,
      car: state3.carModel,
      plateBody: state3.plateBody,
      plateParity: (function(b) {
        const d = String(b || "").replace(/\D/g, "");
        return d ? Number(d.slice(-1)) % 2 === 0 ? "even" : "odd" : "";
      })(state3.plateBody),
      sameGenderOnly: !!state3.sameGenderOnly,
      sameCarClassOnly: !!state3.sameCarClassOnly,
      originProvince: state3.originProvince,
      originCity: state3.originCity,
      destinationProvince: state3.destinationProvince,
      destinationCity: state3.destinationCity,
      departPeriod: state3.departPeriod,
      departStart: state3.departStart,
      departEnd: state3.departEnd,
      returnPeriod: state3.returnPeriod,
      returnStart: state3.returnStart,
      returnEnd: state3.returnEnd
    };
    const missing = targetGroupSize(state3) - 1;
    const picks = bestGroupCompletion([me], missing, pool, state3, rejected);
    return [me, ...picks];
  }
  function balancedParitySelection(pool, needed, existing, state3) {
    if (!state3.originCity || state3.originCity !== "\u062A\u0647\u0631\u0627\u0646" || needed <= 0) {
      return pool.slice(0, needed);
    }
    const finalSize = existing.length + needed;
    const evenTarget = Math.ceil(finalSize / 2);
    const oddTarget = Math.floor(finalSize / 2);
    let evenNow = existing.filter((m) => (m.plateParity || "") === "even").length;
    let oddNow = existing.filter((m) => (m.plateParity || "") === "odd").length;
    const picks = [];
    for (const parity of ["even", "odd"]) {
      const target = parity === "even" ? evenTarget : oddTarget;
      const now = parity === "even" ? evenNow : oddNow;
      let need = Math.max(0, target - now);
      for (const c of pool.filter((x) => x.plateParity === parity)) {
        if (need <= 0 || picks.length >= needed) break;
        if (!picks.some((p) => p.id === c.id)) {
          picks.push(c);
          need--;
        }
      }
    }
    for (const c of pool) {
      if (picks.length >= needed) break;
      if (!picks.some((p) => p.id === c.id)) picks.push(c);
    }
    return picks.slice(0, needed);
  }

  // core/validation.js
  function validatePhone(raw) {
    const v = normalizePhone(raw);
    const re = new RegExp("^09\\d{" + Math.max(0, CFG.phoneDigits - 2) + "}$");
    if (!re.test(v))
      return { ok: false, msg: `\u0634\u0645\u0627\u0631\u0647 \u0645\u0648\u0628\u0627\u06CC\u0644 \u0628\u0627\u06CC\u062F ${faNum(CFG.phoneDigits)} \u0631\u0642\u0645 \u0648 \u0628\u0627 09 \u0634\u0631\u0648\u0639 \u0634\u0648\u062F.` };
    if (new RegExp("^09(\\d)\\1{" + Math.max(1, CFG.phoneDigits - 3) + "}$").test(v))
      return { ok: false, msg: "\u0634\u0645\u0627\u0631\u0647 \u0628\u0627 \u0627\u0644\u06AF\u0648\u06CC \u062A\u06A9\u0631\u0627\u0631\u06CC \u063A\u06CC\u0631\u0648\u0627\u0642\u0639\u06CC \u067E\u0630\u06CC\u0631\u0641\u062A\u0647 \u0646\u0645\u06CC\u200C\u0634\u0648\u062F." };
    return { ok: true, value: v };
  }
  function validateName(raw) {
    const v = String(raw ?? "").replace(/\s+/g, " ").trim();
    if (v.length < CFG.minName || v.length > CFG.maxName)
      return { ok: false, msg: `\u0646\u0627\u0645 \u0628\u0627\u06CC\u062F \u0628\u06CC\u0646 ${faNum(CFG.minName)} \u062A\u0627 ${faNum(CFG.maxName)} \u06A9\u0627\u0631\u0627\u06A9\u062A\u0631 \u0628\u0627\u0634\u062F.` };
    if (/[0-9۰-۹٠-٩]/.test(v))
      return { ok: false, msg: "\u0646\u0627\u0645 \u0646\u0628\u0627\u06CC\u062F \u0634\u0627\u0645\u0644 \u0639\u062F\u062F \u0628\u0627\u0634\u062F." };
    if (/[<>{}\[\]@#$%^&*_+=\\|\/~`]/.test(v))
      return { ok: false, msg: "\u0646\u0627\u0645 \u0634\u0627\u0645\u0644 \u06A9\u0627\u0631\u0627\u06A9\u062A\u0631 \u063A\u06CC\u0631\u0645\u062C\u0627\u0632 \u0627\u0633\u062A." };
    const parts = v.split(" ").filter(Boolean);
    if (parts.length < 2 || parts.some((x) => x.length < 2))
      return { ok: false, msg: "\u062D\u062F\u0627\u0642\u0644 \u0646\u0627\u0645 \u0648 \u0646\u0627\u0645 \u062E\u0627\u0646\u0648\u0627\u062F\u06AF\u06CC \u0645\u0639\u062A\u0628\u0631 \u0648\u0627\u0631\u062F \u06A9\u0646\u06CC\u062F." };
    const isFa = /^[آ-یءئؤإأاۀة\s‌\-'.]+$/u.test(v);
    const isEn = /^[A-Za-z\s\-'.]+$/.test(v);
    if (!isFa && !isEn)
      return { ok: false, msg: "\u0646\u0627\u0645 \u0631\u0627 \u0641\u0642\u0637 \u0628\u0627 \u062D\u0631\u0648\u0641 \u0641\u0627\u0631\u0633\u06CC \u06CC\u0627 \u0644\u0627\u062A\u06CC\u0646 \u0648\u0627\u0631\u062F \u06A9\u0646\u06CC\u062F." };
    return { ok: true, value: v };
  }
  function validateUsername(raw) {
    const v = String(raw ?? "").trim();
    if (v.length < CFG.minUsername || v.length > CFG.maxUsername || !/^[A-Za-z][A-Za-z0-9_.]*$/.test(v))
      return { ok: false, msg: `\u0646\u0627\u0645 \u06A9\u0627\u0631\u0628\u0631\u06CC \u0628\u0627\u06CC\u062F ${faNum(CFG.minUsername)} \u062A\u0627 ${faNum(CFG.maxUsername)} \u06A9\u0627\u0631\u0627\u06A9\u062A\u0631 \u0628\u0627\u0634\u062F \u0648 \u0628\u0627 \u062D\u0631\u0641 \u0644\u0627\u062A\u06CC\u0646 \u0634\u0631\u0648\u0639 \u0634\u0648\u062F.` };
    return { ok: true, value: v };
  }
  function validatePassword(v) {
    v = String(v ?? "");
    if (v.length < CFG.minPassword || v.length > CFG.maxPassword)
      return { ok: false, msg: `\u0631\u0645\u0632 \u0639\u0628\u0648\u0631 \u0628\u0627\u06CC\u062F \u0628\u06CC\u0646 ${faNum(CFG.minPassword)} \u062A\u0627 ${faNum(CFG.maxPassword)} \u06A9\u0627\u0631\u0627\u06A9\u062A\u0631 \u0628\u0627\u0634\u062F.` };
    if (!/[A-Za-z]/.test(v) || !/[0-9]/.test(v))
      return { ok: false, msg: "\u0631\u0645\u0632 \u0639\u0628\u0648\u0631 \u0628\u0627\u06CC\u062F \u062D\u062F\u0627\u0642\u0644 \u06CC\u06A9 \u062D\u0631\u0641 \u0648 \u06CC\u06A9 \u0639\u062F\u062F \u062F\u0627\u0634\u062A\u0647 \u0628\u0627\u0634\u062F." };
    return { ok: true, value: v };
  }
  function validateBankCard(raw) {
    const v = onlyDigits(raw);
    if (v.length !== CFG.bankCardDigits)
      return { ok: false, msg: `\u0634\u0645\u0627\u0631\u0647 \u06A9\u0627\u0631\u062A \u0628\u0627\u06CC\u062F ${faNum(CFG.bankCardDigits)} \u0631\u0642\u0645 \u0628\u0627\u0634\u062F.` };
    if (/^(\d)\1+$/.test(v))
      return { ok: false, msg: "\u0634\u0645\u0627\u0631\u0647 \u06A9\u0627\u0631\u062A \u0646\u0627\u0645\u0639\u062A\u0628\u0631 \u0627\u0633\u062A." };
    return { ok: true, value: v };
  }
  function validateIban(raw) {
    const v = normalizeDigits(String(raw ?? "").toUpperCase()).replace(/[\s-]/g, "");
    const re = new RegExp("^IR\\d{" + CFG.ibanDigits + "}$");
    if (!re.test(v))
      return { ok: false, msg: `\u0634\u0645\u0627\u0631\u0647 \u0634\u0628\u0627 \u0628\u0627\u06CC\u062F \u0628\u0627 IR \u0634\u0631\u0648\u0639 \u0634\u0648\u062F \u0648 \u067E\u0633 \u0627\u0632 \u0622\u0646 ${faNum(CFG.ibanDigits)} \u0631\u0642\u0645 \u062F\u0627\u0634\u062A\u0647 \u0628\u0627\u0634\u062F.` };
    if (new RegExp("^IR0{" + CFG.ibanDigits + "}$").test(v))
      return { ok: false, msg: "\u0634\u0645\u0627\u0631\u0647 \u0634\u0628\u0627 \u0646\u0627\u0645\u0639\u062A\u0628\u0631 \u0627\u0633\u062A." };
    return { ok: true, value: v };
  }
  function validateLocation(raw, label) {
    const v = String(raw ?? "").replace(/\s+/g, " ").trim();
    if (v.length < CFG.minLocation || v.length > CFG.maxLocation)
      return { ok: false, msg: `${label} \u0628\u0627\u06CC\u062F \u0628\u06CC\u0646 ${faNum(CFG.minLocation)} \u062A\u0627 ${faNum(CFG.maxLocation)} \u06A9\u0627\u0631\u0627\u06A9\u062A\u0631 \u0628\u0627\u0634\u062F.` };
    if (/[<>{}\[\]@$%^*_+=\\|~`]/.test(v))
      return { ok: false, msg: `${label} \u062F\u0627\u0631\u0627\u06CC \u06A9\u0627\u0631\u0627\u06A9\u062A\u0631 \u0646\u0627\u0645\u0639\u062A\u0628\u0631 \u0627\u0633\u062A.` };
    if (/(پلاک\s*\d+|واحد\s*\d+|طبقه\s*\d+)/u.test(v))
      return { ok: false, msg: `\u0628\u0631\u0627\u06CC ${label} \u0646\u0634\u0627\u0646\u06CC \u062F\u0642\u06CC\u0642 \u0648\u0627\u0631\u062F \u0646\u06A9\u0646\u06CC\u062F.` };
    return { ok: true, value: v };
  }
  function validateArea(raw, label) {
    const v = String(raw ?? "").replace(/\s+/g, " ").trim();
    if (v.length < 2 || v.length > 60)
      return { ok: false, msg: `${label} \u0631\u0627 \u0628\u0647\u200C\u0635\u0648\u0631\u062A \u0645\u062D\u062F\u0648\u062F\u0647 \u06CC\u0627 \u0645\u062D\u0644\u0647 \u0648\u0627\u0631\u062F \u06A9\u0646\u06CC\u062F.` };
    return { ok: true, value: v };
  }
  function validateCarModel(raw) {
    const v = String(raw ?? "").replace(/\s+/g, " ").trim();
    if (v.length < CFG.minCarModel || v.length > CFG.maxCarModel || !/[A-Za-zآ-ی]/u.test(v))
      return { ok: false, msg: `\u0645\u062F\u0644 \u062E\u0648\u062F\u0631\u0648 \u0628\u0627\u06CC\u062F \u0628\u06CC\u0646 ${faNum(CFG.minCarModel)} \u062A\u0627 ${faNum(CFG.maxCarModel)} \u06A9\u0627\u0631\u0627\u06A9\u062A\u0631 \u0628\u0627\u0634\u062F.` };
    return { ok: true, value: v };
  }
  function validatePlate(iranRaw, bodyRaw) {
    const iran = onlyDigits(iranRaw);
    const body = normalizeDigits(String(bodyRaw ?? "")).replace(/[\s\-]/g, "");
    if (iran.length !== CFG.plateIranDigits)
      return { ok: false, msg: `\u06A9\u062F \u0627\u06CC\u0631\u0627\u0646 \u067E\u0644\u0627\u06A9 \u0628\u0627\u06CC\u062F ${faNum(CFG.plateIranDigits)} \u0631\u0642\u0645 \u0628\u0627\u0634\u062F.` };
    const re = new RegExp(
      "^(\\d{" + CFG.plateLeftDigits + "})([\u0622-\u06CC])(\\d{" + CFG.plateRightDigits + "})$",
      "u"
    );
    if (!re.test(body))
      return { ok: false, msg: `\u0634\u0645\u0627\u0631\u0647 \u0627\u0635\u0644\u06CC \u067E\u0644\u0627\u06A9 \u0646\u0627\u0645\u0639\u062A\u0628\u0631 \u0627\u0633\u062A (\u0645\u0627\u0646\u0646\u062F \u06F1\u06F2\u0628\u06F3\u06F4\u06F5).` };
    return { ok: true, iran, body };
  }
  function validateTimeWindow(period, start, end, label) {
    const a = parse12Clock(start);
    const b = parse12Clock(end);
    if (!a || !b)
      return { ok: false, msg: `\u0627\u0628\u062A\u062F\u0627 \u0648 \u0627\u0646\u062A\u0647\u0627\u06CC \u0628\u0627\u0632\u0647 ${label} \u0631\u0627 \u06A9\u0627\u0645\u0644 \u0627\u0646\u062A\u062E\u0627\u0628 \u06A9\u0646\u06CC\u062F.` };
    const s = toAbsoluteMinutes(period, start);
    const e = toAbsoluteMinutes(period, end);
    if (period === "morning" && (s < 240 || e > 720))
      return { ok: false, msg: `\u0628\u0631\u0627\u06CC ${label} \xAB\u0635\u0628\u062D\xBB\u060C \u0633\u0627\u0639\u062A \u0628\u0627\u06CC\u062F \u0628\u06CC\u0646 \u06F4:\u06F0\u06F0 \u062A\u0627 \u06F1\u06F2:\u06F0\u06F0 \u0628\u0627\u0634\u062F.` };
    if (period === "afternoon" && (s < 720 || e > 1439))
      return { ok: false, msg: `\u0628\u0631\u0627\u06CC ${label} \xAB\u0628\u0639\u062F\u0627\u0632\u0638\u0647\u0631\xBB\u060C \u0633\u0627\u0639\u062A \u0631\u0627 \u0628\u0647 \u0642\u0627\u0644\u0628 \u06F1\u06F2\u0633\u0627\u0639\u062A\u0647 \u0648\u0627\u0631\u062F \u06A9\u0646\u06CC\u062F.` };
    if (e <= s)
      return { ok: false, msg: `\u0627\u0646\u062A\u0647\u0627\u06CC \u0628\u0627\u0632\u0647 ${label} \u0628\u0627\u06CC\u062F \u0628\u0639\u062F \u0627\u0632 \u0627\u0628\u062A\u062F\u0627\u06CC \u0622\u0646 \u0628\u0627\u0634\u062F.` };
    const dur = e - s;
    if (dur < CFG.minTimeWindowMinutes || dur > CFG.maxTimeWindowMinutes)
      return { ok: false, msg: `\u0628\u0627\u0632\u0647 ${label} \u0628\u0627\u06CC\u062F \u0628\u06CC\u0646 ${faNum(CFG.minTimeWindowMinutes)} \u062A\u0627 ${faNum(CFG.maxTimeWindowMinutes)} \u062F\u0642\u06CC\u0642\u0647 \u0628\u0627\u0634\u062F.` };
    return { ok: true, start: start.padStart(5, "0"), end: end.padStart(5, "0"), duration: dur };
  }
  function validateAge(raw) {
    const n = Number(normalizeDigits(raw));
    if (!Number.isFinite(n) || n < CFG.minAge || n > CFG.maxAge)
      return { ok: false, msg: `\u0633\u0646 \u0628\u0627\u06CC\u062F \u0628\u06CC\u0646 ${faNum(CFG.minAge)} \u062A\u0627 ${faNum(CFG.maxAge)} \u0633\u0627\u0644 \u0628\u0627\u0634\u062F.` };
    return { ok: true, value: String(n) };
  }
  function validateSeats(raw) {
    const n = Number(normalizeDigits(raw));
    if (!Number.isInteger(n) || n < 1 || n > CFG.maxSeats)
      return { ok: false, msg: `\u0638\u0631\u0641\u06CC\u062A \u062E\u0648\u062F\u0631\u0648 \u0628\u0627\u06CC\u062F \u0628\u06CC\u0646 \u06F1 \u062A\u0627 ${faNum(CFG.maxSeats)} \u0646\u0641\u0631 \u0628\u0627\u0634\u062F.` };
    return { ok: true, value: String(n) };
  }

  // core/state.js
  var ACCOUNT_KEY = "hammasir_v30_clean_account";
  function defaultState() {
    return {
      username: "",
      password: "",
      phone: "",
      otp: "",
      phoneVerified: false,
      loggedIn: false,
      registered: false,
      reviewStatus: "approved",
      reviewMessage: "",
      reviewSubmittedAt: null,
      profileReviewRequired: false,
      profileChangedAt: null,
      name: "",
      gender: "",
      age: "",
      photo: null,
      sameGenderOnly: false,
      sameCarClassOnly: false,
      profileNotes: "",
      groupingPaused: false,
      originProvince: "",
      originCity: "",
      originRegion: "",
      originArea: "",
      originPoint: "",
      originMapX: null,
      originMapY: null,
      destinationProvince: "",
      destinationCity: "",
      destinationRegion: "",
      destinationArea: "",
      destinationPoint: "",
      destinationMapX: null,
      destinationMapY: null,
      departPeriod: "morning",
      departStart: "07:00",
      departEnd: "07:30",
      returnPeriod: "afternoon",
      returnStart: "05:00",
      returnEnd: "05:30",
      carModel: "",
      plateIran: "",
      plateBody: "",
      seats: "3",
      bankCard: "",
      iban: "",
      refundAccountVerified: false,
      groupMode: null,
      groupStatus: "none",
      paid: false,
      isCreator: false,
      blocked: [],
      reports: [],
      groupMembers: [],
      messages: [],
      left: false,
      smartProposal: [],
      assistProposal: [],
      proposalRejectCount: 0,
      paidProposalCycles: 0,
      proposalResume: "",
      proposalStartedAt: null,
      proposalDeadlineAt: null,
      proposalResponses: {},
      proposalFreeRetry: false,
      removalVote: null,
      pendingReplacementSlots: 0,
      replacementProposal: [],
      incompleteProposal: null,
      incompleteStage: "",
      incompleteGroupDeadlineAt: null,
      incompleteCandidateDeadlineAt: null,
      incompleteVotes: {},
      incompleteRejectedCandidateIds: [],
      groupEventLog: [],
      smsLog: [],
      paymentResume: "",
      paymentLabel: "",
      profileEditMode: false
    };
  }
  var state = defaultState();
  function resetState() {
    Object.keys(state).forEach((k) => delete state[k]);
    Object.assign(state, defaultState());
  }
  function persist() {
    try {
      localStorage.setItem(ACCOUNT_KEY, JSON.stringify(state));
    } catch (e) {
    }
  }
  function restore() {
    try {
      const raw = localStorage.getItem(ACCOUNT_KEY);
      if (!raw) return;
      const saved = JSON.parse(raw);
      if (saved && saved.registered) {
        Object.assign(state, { ...defaultState(), ...saved });
      }
    } catch (e) {
    }
  }
  function clearPersisted() {
    try {
      localStorage.removeItem(ACCOUNT_KEY);
    } catch (e) {
    }
  }
  function selfMember() {
    return {
      id: "me",
      name: state.name,
      phone: state.phone,
      photo: state.photo,
      car: state.carModel,
      carClass: carClassOf(state.carModel),
      gender: state.gender,
      age: state.age,
      notes: state.profileNotes || "",
      sameGenderOnly: !!state.sameGenderOnly,
      sameCarClassOnly: !!state.sameCarClassOnly,
      source: "self",
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
      returnEnd: state.returnEnd
    };
  }
  function canStartNewGroup() {
    return state.reviewStatus === "approved" && !state.profileReviewRequired;
  }
  function hasActiveGroup() {
    return ["active", "replacement_pending", "friend_replacement_pending"].includes(state.groupStatus);
  }
  function pushMessage(from, text) {
    state.messages.push({ from, text });
  }
  function pushSms(to, text) {
    state.smsLog = state.smsLog || [];
    state.smsLog.push({ to, text, time: Date.now() });
  }

  // app/api.js
  var BASE_URL = window.HAMMASIR_API_URL || "https://hammasir-1.onrender.com";
  var TOKEN_KEY = "hammasir_access";
  var REFRESH_KEY = "hammasir_refresh";
  var tokens = {
    get access() {
      return localStorage.getItem(TOKEN_KEY);
    },
    get refresh() {
      return localStorage.getItem(REFRESH_KEY);
    },
    set(access, refresh) {
      localStorage.setItem(TOKEN_KEY, access || "");
      if (refresh) localStorage.setItem(REFRESH_KEY, refresh);
    },
    clear() {
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(REFRESH_KEY);
    }
  };
  var refreshPromise = null;
  async function refreshTokens() {
    if (refreshPromise) return refreshPromise;
    refreshPromise = (async () => {
      const refresh = tokens.refresh;
      if (!refresh) throw new Error("NO_REFRESH");
      const res = await fetch(`${BASE_URL}/auth/refresh`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refreshToken: refresh })
      });
      if (!res.ok) {
        tokens.clear();
        throw new Error("REFRESH_FAILED");
      }
      const data = await res.json();
      tokens.set(data.accessToken, data.refreshToken);
      return data.accessToken;
    })().finally(() => {
      refreshPromise = null;
    });
    return refreshPromise;
  }
  async function request(path, { method = "GET", body, auth = true, retry = true } = {}) {
    const headers = { "Accept": "application/json" };
    if (body !== void 0) headers["Content-Type"] = "application/json";
    if (auth && tokens.access) headers["Authorization"] = `Bearer ${tokens.access}`;
    const res = await fetch(`${BASE_URL}${path}`, {
      method,
      headers,
      body: body !== void 0 ? JSON.stringify(body) : void 0
    });
    if (res.status === 401 && auth && retry && tokens.refresh) {
      try {
        await refreshTokens();
        return request(path, { method, body, auth, retry: false });
      } catch (_) {
        tokens.clear();
      }
    }
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      const err = new Error(data?.error?.message || `\u062E\u0637\u0627\u06CC \u0633\u0631\u0648\u0631 (${res.status})`);
      err.code = data?.error?.code;
      err.status = res.status;
      throw err;
    }
    return data;
  }
  var api = {
    requestOtp: (phone) => request("/auth/request-otp", { method: "POST", body: { phone }, auth: false }),
    signup: (payload) => request("/auth/signup", { method: "POST", body: payload, auth: false }),
    login: (username, password) => request("/auth/login", { method: "POST", body: { username, password }, auth: false }),
    getMe: () => request("/me"),
    updateMe: (payload) => request("/me", { method: "PUT", body: payload }),
    togglePause: () => request("/me/pause", { method: "POST" }),
    createSmartGroup: () => request("/groups/smart", { method: "POST" }),
    getGroup: (id) => request(`/groups/${id}`),
    acceptGroup: (id) => request(`/groups/${id}/accept`, { method: "POST" }),
    rejectGroup: (id) => request(`/groups/${id}/reject`, { method: "POST" }),
    leaveGroup: (id) => request(`/groups/${id}/leave`, { method: "POST" }),
    getPendingProposals: () => request("/proposals/pending"),
    getReplacements: () => request("/proposals/replacements"),
    getReplacementFlow: (flowId) => request(`/proposals/replacement/${flowId}`),
    castReplacementVote: (flowId, choice) => request(`/proposals/replacement/${flowId}/vote`, { method: "POST", body: { choice } }),
    candidateRespondToReplacement: (flowId, accept) => request(`/proposals/replacement/${flowId}/candidate-respond`, { method: "POST", body: { accept } }),
    getMessages: (groupId) => request(`/messages/${groupId}`),
    sendMessage: (groupId, text) => request(`/messages/${groupId}`, { method: "POST", body: { text } }),
    initPayment: (purpose) => request("/payments/init", { method: "POST", body: { purpose } })
  };

  // app/app.js
  window.Core = core_exports;
  var appEl = document.getElementById("app");
  var stepEl = document.getElementById("step");
  var footerEl = document.getElementById("footer");
  var state2 = {
    user: null,
    route: null,
    car: null,
    group: null,
    members: [],
    messages: [],
    screen: "loading",
    signup: { phone: "", code: "" }
  };
  window.__state = state2;
  function setStep(t) {
    if (stepEl) stepEl.textContent = t;
  }
  function showFooter(v) {
    footerEl?.classList.toggle("hidden", !v);
  }
  function toast(msg) {
    alert(msg);
  }
  async function callApi(fn, opts = {}) {
    try {
      return await fn();
    } catch (err) {
      if (!opts.silent) toast(err.message || "\u062E\u0637\u0627\u06CC \u063A\u06CC\u0631\u0645\u0646\u062A\u0638\u0631\u0647");
      if (err.status === 401) {
        tokens.clear();
        state2.user = null;
        renderStart();
      }
      return null;
    }
  }
  function renderStart() {
    state2.screen = "start";
    showFooter(false);
    setStep("\u0634\u0631\u0648\u0639");
    appEl.innerHTML = `
    <section class="hero">
      <h1>\u0647\u0645\u200C\u0645\u0633\u06CC\u0631 \u0645\u0646\u0627\u0633\u0628 \u062E\u0648\u062F\u062A \u0631\u0627 \u067E\u06CC\u062F\u0627 \u06A9\u0646</h1>
      <p>\u0647\u0645\u0627\u0647\u0646\u06AF\u06CC \u06AF\u0631\u0648\u0647\u06CC \u0645\u06CC\u0627\u0646 \u062F\u0627\u0631\u0646\u062F\u06AF\u0627\u0646 \u062E\u0648\u062F\u0631\u0648 \u0628\u0631\u0627\u06CC \u0645\u0633\u06CC\u0631\u0647\u0627\u06CC \u0631\u0641\u062A\u200C\u0648\u0628\u0631\u06AF\u0634\u062A \u0645\u0646\u0638\u0645.</p>
    </section>
    <div class="card">
      <div class="notice blue"><b>\u0645\u062F\u0644 \u062E\u062F\u0645\u062A:</b> \u0641\u0642\u0637 \u062F\u0627\u0631\u0646\u062F\u06AF\u0627\u0646 \u062E\u0648\u062F\u0631\u0648 \u0645\u06CC\u200C\u062A\u0648\u0627\u0646\u0646\u062F \u062D\u0633\u0627\u0628 \u06A9\u0627\u0645\u0644 \u0628\u0633\u0627\u0632\u0646\u062F.</div>
      <button class="btn" onclick="app.showLogin()">\u0648\u0631\u0648\u062F</button>
      <button class="btn secondary" onclick="app.showSignup()">\u062B\u0628\u062A\u200C\u0646\u0627\u0645</button>
    </div>`;
  }
  function renderLogin() {
    state2.screen = "login";
    showFooter(false);
    setStep("\u0648\u0631\u0648\u062F");
    appEl.innerHTML = `
    <button class="back" onclick="app.home()">\u2190</button>
    <section class="hero"><h1>\u0648\u0631\u0648\u062F</h1><p>\u0646\u0627\u0645 \u06A9\u0627\u0631\u0628\u0631\u06CC \u0648 \u0631\u0645\u0632 \u0639\u0628\u0648\u0631 \u062E\u0648\u062F \u0631\u0627 \u0648\u0627\u0631\u062F \u06A9\u0646\u06CC\u062F.</p></section>
    <div class="card">
      <label>\u0646\u0627\u0645 \u06A9\u0627\u0631\u0628\u0631\u06CC</label>
      <input id="lgUser" class="input" autocomplete="username">
      <label>\u0631\u0645\u0632 \u0639\u0628\u0648\u0631</label>
      <input id="lgPass" class="input" type="password" autocomplete="current-password">
      <button class="btn" onclick="app.doLogin()">\u0648\u0631\u0648\u062F</button>
    </div>`;
  }
  async function doLogin() {
    const username = document.getElementById("lgUser").value.trim();
    const password = document.getElementById("lgPass").value;
    if (!username || !password) return toast("\u0647\u0645\u0647 \u0641\u06CC\u0644\u062F\u0647\u0627 \u0631\u0627 \u067E\u0631 \u06A9\u0646\u06CC\u062F.");
    const res = await callApi(() => api.login(username, password));
    if (!res) return;
    tokens.set(res.accessToken, res.refreshToken);
    await bootstrap();
  }
  function renderSignup() {
    state2.screen = "signup";
    showFooter(false);
    setStep("\u062B\u0628\u062A\u200C\u0646\u0627\u0645");
    appEl.innerHTML = `
    <button class="back" onclick="app.home()">\u2190</button>
    <section class="hero"><h1>\u062B\u0628\u062A\u200C\u0646\u0627\u0645</h1><p>\u06AF\u0627\u0645 \u06F1 \u0627\u0632 \u06F2 \u2014 \u0634\u0645\u0627\u0631\u0647 \u0645\u0648\u0628\u0627\u06CC\u0644</p></section>
    <div class="card">
      <label>\u0634\u0645\u0627\u0631\u0647 \u0645\u0648\u0628\u0627\u06CC\u0644</label>
      <div class="row">
        <input id="suPhone" class="input" style="flex:1" inputmode="numeric" maxlength="11" placeholder="09xxxxxxxxx">
        <button class="btn small secondary" style="margin:0" onclick="app.requestOtp()">\u0627\u0631\u0633\u0627\u0644 \u06A9\u062F</button>
      </div>
      <div id="otpBox"></div>
    </div>`;
  }
  async function requestOtp() {
    const phone = document.getElementById("suPhone").value.trim();
    if (!/^09\d{9}$/.test(phone)) return toast("\u0634\u0645\u0627\u0631\u0647 \u0645\u0648\u0628\u0627\u06CC\u0644 \u0646\u0627\u0645\u0639\u062A\u0628\u0631.");
    state2.signup.phone = phone;
    const res = await callApi(() => api.requestOtp(phone));
    if (!res) return;
    document.getElementById("otpBox").innerHTML = `
    <div class="notice orange">\u06A9\u062F \u06F6 \u0631\u0642\u0645\u06CC \u067E\u06CC\u0627\u0645\u06A9 \u0634\u062F.</div>
    <div class="otp">
      ${Array.from({ length: 6 }, (_, i) => `<input id="o${i}" maxlength="1" inputmode="numeric" oninput="app.otpNext(${i})">`).join("")}
    </div>
    <button class="btn" onclick="app.continueSignup()">\u062A\u0623\u06CC\u06CC\u062F \u0648 \u0627\u062F\u0627\u0645\u0647</button>`;
  }
  function otpNext(i) {
    const el = document.getElementById("o" + i);
    el.value = onlyDigits(el.value).slice(0, 1);
    if (el.value && i < 5) document.getElementById("o" + (i + 1)).focus();
  }
  function continueSignup() {
    let code = "";
    for (let i = 0; i < 6; i++) code += document.getElementById("o" + i)?.value || "";
    if (code.length !== 6) return toast("\u06A9\u062F \u06F6 \u0631\u0642\u0645\u06CC \u06A9\u0627\u0645\u0644 \u0646\u06CC\u0633\u062A.");
    state2.signup.code = code;
    renderSignupProfile();
  }
  function renderSignupProfile() {
    state2.screen = "signup-profile";
    setStep("\u062A\u06A9\u0645\u06CC\u0644 \u067E\u0631\u0648\u0641\u0627\u06CC\u0644");
    appEl.innerHTML = `
    <button class="back" onclick="app.showSignup()">\u2190</button>
    <section class="hero"><h1>\u062A\u06A9\u0645\u06CC\u0644 \u067E\u0631\u0648\u0641\u0627\u06CC\u0644</h1><p>\u06AF\u0627\u0645 \u06F2 \u0627\u0632 \u06F2</p></section>
    <div class="card">
      <label>\u0646\u0627\u0645 \u06A9\u0627\u0631\u0628\u0631\u06CC (\u0644\u0627\u062A\u06CC\u0646\u060C \u0628\u0627 \u062D\u0631\u0641 \u0634\u0631\u0648\u0639 \u0634\u0648\u062F)</label>
      <input id="suUser" class="input" placeholder="ali_rezaei">
      <label>\u0631\u0645\u0632 \u0639\u0628\u0648\u0631 (\u062D\u062F\u0627\u0642\u0644 \u06F8 \u06A9\u0627\u0631\u0627\u06A9\u062A\u0631\u060C \u0634\u0627\u0645\u0644 \u062D\u0631\u0641 \u0648 \u0639\u062F\u062F)</label>
      <input id="suPass" class="input" type="password">
      <label>\u0646\u0627\u0645 \u0648 \u0646\u0627\u0645 \u062E\u0627\u0646\u0648\u0627\u062F\u06AF\u06CC</label>
      <input id="suName" class="input" placeholder="\u0639\u0644\u06CC \u0631\u0636\u0627\u06CC\u06CC">
      <label>\u062C\u0646\u0633\u06CC\u062A</label>
      <select id="suGender">
        <option value="">\u0627\u0646\u062A\u062E\u0627\u0628 \u06A9\u0646\u06CC\u062F</option>
        <option value="male">\u0622\u0642\u0627</option>
        <option value="female">\u062E\u0627\u0646\u0645</option>
      </select>
      <label>\u0633\u0646</label>
      <input id="suAge" class="input" inputmode="numeric" maxlength="2">
      <button class="btn" onclick="app.finishSignup()">\u062B\u0628\u062A\u200C\u0646\u0627\u0645</button>
    </div>`;
  }
  async function finishSignup() {
    const payload = {
      username: document.getElementById("suUser").value.trim(),
      password: document.getElementById("suPass").value,
      phone: state2.signup.phone,
      code: state2.signup.code,
      name: document.getElementById("suName").value.trim(),
      gender: document.getElementById("suGender").value,
      age: Number(document.getElementById("suAge").value),
      sameGenderOnly: false,
      sameCarClassOnly: false
    };
    if (!payload.username || !payload.password || !payload.name || !payload.gender || !payload.age)
      return toast("\u0647\u0645\u0647 \u0641\u06CC\u0644\u062F\u0647\u0627 \u0631\u0627 \u067E\u0631 \u06A9\u0646\u06CC\u062F.");
    const res = await callApi(() => api.signup(payload));
    if (!res) return;
    tokens.set(res.accessToken, res.refreshToken);
    await bootstrap();
  }
  async function renderHome() {
    state2.screen = "home";
    showFooter(true);
    setStep("\u062E\u0627\u0646\u0647");
    activeNav("nHome");
    if (!state2.user) {
      const me = await callApi(() => api.getMe(), { silent: true });
      if (!me) return renderStart();
      state2.user = me.user;
      state2.route = me.route;
      state2.car = me.car;
    }
    const missingProfile = !state2.route || !state2.car;
    appEl.innerHTML = `
    <section class="hero"><h1>\u0633\u0644\u0627\u0645 ${esc(state2.user.name)}</h1>
      <p>\u0631\u0648\u0634 \u062A\u0634\u06A9\u06CC\u0644 \u06AF\u0631\u0648\u0647 \u0631\u0627 \u0627\u0646\u062A\u062E\u0627\u0628 \u06A9\u0646.</p></section>
    ${missingProfile ? '<div class="notice orange">\u0628\u0631\u0627\u06CC \u062A\u0634\u06A9\u06CC\u0644 \u06AF\u0631\u0648\u0647 \u0627\u0628\u062A\u062F\u0627 \u067E\u0631\u0648\u0641\u0627\u06CC\u0644 \u0648 \u0645\u0633\u06CC\u0631 \u062E\u0648\u062F \u0631\u0627 \u062A\u06A9\u0645\u06CC\u0644 \u06A9\u0646\u06CC\u062F.</div>' : ""}
    <div class="card" onclick="app.completeProfile()">
      <h3>\u{1F464} \u067E\u0631\u0648\u0641\u0627\u06CC\u0644 \u0645\u0646</h3>
      <p>${state2.car ? esc(state2.car.model) : "\u062E\u0648\u062F\u0631\u0648 \u062B\u0628\u062A \u0646\u0634\u062F\u0647"} \u2014 \u0648\u06CC\u0631\u0627\u06CC\u0634 \u0627\u0637\u0644\u0627\u0639\u0627\u062A</p>
    </div>
    <div class="card" onclick="app.smartGroup()">
      <h3>\u{1F699} \u062F\u0631\u06CC\u0627\u0641\u062A \u067E\u06CC\u0634\u0646\u0647\u0627\u062F \u0647\u0645\u200C\u0645\u0633\u06CC\u0631</h3>
      <p>\u0633\u0627\u0645\u0627\u0646\u0647 \u0646\u0632\u062F\u06CC\u06A9\u200C\u062A\u0631\u06CC\u0646 \u0627\u0641\u0631\u0627\u062F \u0631\u0627 \u0628\u0631 \u0627\u0633\u0627\u0633 \u0645\u0648\u0642\u0639\u06CC\u062A\u060C \u0632\u0645\u0627\u0646 \u0648 \u0638\u0631\u0641\u06CC\u062A \u067E\u06CC\u0634\u0646\u0647\u0627\u062F \u0645\u06CC\u200C\u062F\u0647\u062F.</p>
    </div>`;
  }
  function activeNav(id) {
    ["nHome", "nGroup", "nMsg", "nProfile"].forEach((x) => {
      document.getElementById(x)?.classList.toggle("active", x === id);
    });
  }
  function renderCompleteProfile() {
    state2.screen = "profile-edit";
    setStep("\u062A\u06A9\u0645\u06CC\u0644 \u067E\u0631\u0648\u0641\u0627\u06CC\u0644");
    appEl.innerHTML = `
    <button class="back" onclick="app.home()">\u2190</button>
    <section class="hero"><h1>\u062A\u06A9\u0645\u06CC\u0644 \u067E\u0631\u0648\u0641\u0627\u06CC\u0644</h1><p>\u0627\u0637\u0644\u0627\u0639\u0627\u062A \u0645\u0633\u06CC\u0631 \u0648 \u062E\u0648\u062F\u0631\u0648</p></section>
    <div class="card">
      <h3>\u0645\u0628\u062F\u0623</h3>
      <label>\u0627\u0633\u062A\u0627\u0646</label>
      <input id="oProv" class="input" value="${esc(state2.route?.origin?.province || "\u062A\u0647\u0631\u0627\u0646")}">
      <label>\u0634\u0647\u0631</label>
      <input id="oCity" class="input" value="${esc(state2.route?.origin?.city || "\u062A\u0647\u0631\u0627\u0646")}">
      <label>\u0645\u062D\u062F\u0648\u062F\u0647 / \u0645\u062D\u0644\u0647</label>
      <input id="oArea" class="input" value="${esc(state2.route?.origin?.area || "")}" placeholder="\u0635\u0627\u062F\u0642\u06CC\u0647">
      <label>\u0646\u0642\u0637\u0647 \u0633\u0648\u0627\u0631 \u0634\u062F\u0646</label>
      <input id="oPoint" class="input" value="${esc(state2.route?.origin?.point || "")}" placeholder="\u0645\u06CC\u062F\u0627\u0646 \u0635\u0627\u062F\u0642\u06CC\u0647">

      <div class="sep"></div>
      <h3>\u0645\u0642\u0635\u062F</h3>
      <label>\u0627\u0633\u062A\u0627\u0646</label>
      <input id="dProv" class="input" value="${esc(state2.route?.destination?.province || "\u062A\u0647\u0631\u0627\u0646")}">
      <label>\u0634\u0647\u0631</label>
      <input id="dCity" class="input" value="${esc(state2.route?.destination?.city || "\u062A\u0647\u0631\u0627\u0646")}">
      <label>\u0645\u062D\u062F\u0648\u062F\u0647 / \u0645\u062D\u0644\u0647</label>
      <input id="dArea" class="input" value="${esc(state2.route?.destination?.area || "")}" placeholder="\u0648\u0646\u06A9">
      <label>\u0646\u0642\u0637\u0647 \u067E\u06CC\u0627\u062F\u0647 \u0634\u062F\u0646</label>
      <input id="dPoint" class="input" value="${esc(state2.route?.destination?.point || "")}" placeholder="\u0645\u06CC\u062F\u0627\u0646 \u0648\u0646\u06A9">

      <div class="sep"></div>
      <h3>\u062E\u0648\u062F\u0631\u0648</h3>
      <label>\u0645\u062F\u0644 \u062E\u0648\u062F\u0631\u0648</label>
      <input id="carModel" class="input" value="${esc(state2.car?.model || "")}" placeholder="\u062A\u0627\u0631\u0627">
      <label>\u067E\u0644\u0627\u06A9 (\u0634\u0645\u0627\u0631\u0647 \u0627\u0635\u0644\u06CC)</label>
      <input id="plateBody" class="input" value="${esc(state2.car?.plateBody || "")}" placeholder="\u06F1\u06F2\u0628\u06F3\u06F4\u06F5">
      <label>\u06A9\u062F \u0627\u06CC\u0631\u0627\u0646</label>
      <input id="plateIran" class="input" value="${esc(state2.car?.plateIran || "")}" placeholder="\u06F1\u06F2">
      <label>\u0638\u0631\u0641\u06CC\u062A</label>
      <select id="seats">
        <option value="1">\u06F1 \u0646\u0641\u0631</option>
        <option value="2">\u06F2 \u0646\u0641\u0631</option>
        <option value="3" selected>\u06F3 \u0646\u0641\u0631</option>
      </select>

      <button class="btn" onclick="app.saveProfile()">\u0630\u062E\u06CC\u0631\u0647</button>
    </div>`;
  }
  async function saveProfile() {
    const payload = {
      origin: {
        province: document.getElementById("oProv").value.trim(),
        city: document.getElementById("oCity").value.trim(),
        area: document.getElementById("oArea").value.trim() || "\u0646\u0627\u0645\u0634\u062E\u0635",
        point: document.getElementById("oPoint").value.trim()
      },
      destination: {
        province: document.getElementById("dProv").value.trim(),
        city: document.getElementById("dCity").value.trim(),
        area: document.getElementById("dArea").value.trim() || "\u0646\u0627\u0645\u0634\u062E\u0635",
        point: document.getElementById("dPoint").value.trim()
      },
      departWindow: { period: "morning", start: "07:00", end: "07:30" },
      returnWindow: { period: "afternoon", start: "05:00", end: "05:30" },
      car: {
        model: document.getElementById("carModel").value.trim(),
        plateIran: document.getElementById("plateIran").value.trim(),
        plateBody: document.getElementById("plateBody").value.trim(),
        seats: Number(document.getElementById("seats").value)
      }
    };
    const res = await callApi(() => api.updateMe(payload));
    if (!res) return;
    toast("\u067E\u0631\u0648\u0641\u0627\u06CC\u0644 \u0630\u062E\u06CC\u0631\u0647 \u0634\u062F.");
    state2.user = null;
    renderHome();
  }
  async function smartGroup() {
    const res = await callApi(() => api.createSmartGroup());
    if (!res) return;
    if (!res.ok) return toast(res.message || "\u06AF\u0631\u0648\u0647\u06CC \u06CC\u0627\u0641\u062A \u0646\u0634\u062F.");
    openGroup(res.groupId);
  }
  async function openGroup(groupId) {
    const data = await callApi(() => api.getGroup(groupId));
    if (!data) return;
    state2.group = data.group;
    state2.members = data.members;
    renderGroup();
  }
  function renderGroup() {
    state2.screen = "group";
    showFooter(true);
    activeNav("nGroup");
    setStep(`\u06AF\u0631\u0648\u0647 ${faNum(state2.members.length)} \u0646\u0641\u0631\u0647`);
    const membersHtml = state2.members.map((m) => `
    <div class="member">
      <div class="avatar">${m.photoUrl ? `<img src="${m.photoUrl}" style="width:100%;height:100%;object-fit:cover">` : "\u{1F464}"}</div>
      <div class="meta">
        <b>${m.isMe ? "\u0634\u0645\u0627" : esc(m.name || "\u0639\u0636\u0648")}</b>
        <small>${genderFa(m.gender)}${m.age ? " \u2022 " + faNum(m.age) + " \u0633\u0627\u0644\u0647" : ""}${m.car ? " \u2022 " + esc(m.car) : ""}</small>
      </div>
      <span class="badge ${m.response === "accepted" ? "ok" : "pending"}">
        ${m.response === "accepted" ? "\u062A\u0623\u06CC\u06CC\u062F" : m.response === "declined" ? "\u0631\u062F" : "\u0645\u0646\u062A\u0638\u0631"}
      </span>
    </div>`).join("");
    appEl.innerHTML = `
    <section class="hero"><h1>\u06AF\u0631\u0648\u0647 \u0645\u0646</h1>
      <p>\u0648\u0636\u0639\u06CC\u062A: ${state2.group.status === "active" ? "\u0641\u0639\u0627\u0644" : state2.group.status === "pending" ? "\u062F\u0631 \u0627\u0646\u062A\u0638\u0627\u0631 \u062A\u0623\u06CC\u06CC\u062F" : "\u062F\u0631 \u062D\u0627\u0644 \u062A\u06A9\u0645\u06CC\u0644"}</p></section>
    <div class="card">${membersHtml}</div>
    <div class="card">
      <h3>\u0627\u0631\u062A\u0628\u0627\u0637</h3>
      <button class="btn secondary" onclick="app.openMessages()">\u067E\u06CC\u0627\u0645\u200C\u0647\u0627\u06CC \u06AF\u0631\u0648\u0647</button>
      <button class="btn danger" onclick="app.leaveGroup()">\u062A\u0631\u06A9 \u06AF\u0631\u0648\u0647</button>
    </div>`;
  }
  async function openMessages() {
    if (!state2.group) return toast("\u0627\u0628\u062A\u062F\u0627 \u06AF\u0631\u0648\u0647 \u0628\u0633\u0627\u0632.");
    const data = await callApi(() => api.getMessages(state2.group.id));
    if (!data) return;
    state2.messages = data.messages || [];
    state2.screen = "messages";
    showFooter(true);
    activeNav("nMsg");
    setStep("\u067E\u06CC\u0627\u0645\u200C\u0647\u0627");
    const msgs = state2.messages.length ? state2.messages.map((m) => `
        <div class="member">
          <div class="avatar">\u{1F4AC}</div>
          <div class="meta"><b>${esc(m.sender_name || m.sender_label || "\u0633\u06CC\u0633\u062A\u0645")}</b>
            <small>${esc(m.text)}</small></div>
        </div>`).join("") : '<div class="notice gray">\u0647\u0646\u0648\u0632 \u067E\u06CC\u0627\u0645\u06CC \u0646\u06CC\u0633\u062A.</div>';
    appEl.innerHTML = `
    <button class="back" onclick="app.home()">\u2190</button>
    <section class="hero"><h1>\u067E\u06CC\u0627\u0645\u200C\u0647\u0627</h1></section>
    <div class="card">${msgs}</div>
    <div class="card">
      <input id="msgInput" class="input" maxlength="300" placeholder="\u067E\u06CC\u0627\u0645...">
      <button class="btn" onclick="app.sendMessage()">\u0627\u0631\u0633\u0627\u0644</button>
    </div>`;
  }
  async function sendMessage() {
    const text = document.getElementById("msgInput").value.trim();
    if (!text || !state2.group) return;
    await callApi(() => api.sendMessage(state2.group.id, text));
    document.getElementById("msgInput").value = "";
    openMessages();
  }
  async function leaveGroup() {
    if (!state2.group) return;
    if (!confirm("\u06AF\u0631\u0648\u0647 \u0631\u0627 \u062A\u0631\u06A9 \u0645\u06CC\u200C\u06A9\u0646\u06CC\u061F")) return;
    await callApi(() => api.leaveGroup(state2.group.id));
    state2.group = null;
    renderHome();
  }
  function renderProfile() {
    if (!state2.user) return renderStart();
    state2.screen = "profile";
    showFooter(true);
    activeNav("nProfile");
    setStep("\u067E\u0631\u0648\u0641\u0627\u06CC\u0644");
    appEl.innerHTML = `
    <section class="hero"><h1>\u067E\u0631\u0648\u0641\u0627\u06CC\u0644 \u0645\u0646</h1></section>
    <div class="card">
      <div class="member">
        <div class="avatar">\u{1F464}</div>
        <div class="meta"><b>${esc(state2.user.name)}</b>
          <small>@${esc(state2.user.username)} \u2022 ${esc(state2.user.phone)}</small></div>
      </div>
      <div class="sep"></div>
      <p><b>\u0645\u0628\u062F\u0623:</b> ${esc(state2.route?.origin?.city || "\u2014")} \u2014 ${esc(state2.route?.origin?.area || "")}</p>
      <p><b>\u0645\u0642\u0635\u062F:</b> ${esc(state2.route?.destination?.city || "\u2014")} \u2014 ${esc(state2.route?.destination?.area || "")}</p>
      <p><b>\u062E\u0648\u062F\u0631\u0648:</b> ${esc(state2.car?.model || "\u2014")}</p>
      <div class="sep"></div>
      <button class="btn secondary" onclick="app.completeProfile()">\u0648\u06CC\u0631\u0627\u06CC\u0634 \u067E\u0631\u0648\u0641\u0627\u06CC\u0644</button>
      <button class="btn ghost" onclick="app.logout()">\u062E\u0631\u0648\u062C \u0627\u0632 \u062D\u0633\u0627\u0628</button>
    </div>`;
  }
  function logout() {
    tokens.clear();
    state2.user = null;
    state2.route = null;
    state2.car = null;
    state2.group = null;
    renderStart();
  }
  function nav(section) {
    if (section === "home") return renderHome();
    if (section === "group") return state2.group ? openGroup(state2.group.id) : renderHome();
    if (section === "msg") return state2.group ? openMessages() : toast("\u0627\u0628\u062A\u062F\u0627 \u06AF\u0631\u0648\u0647 \u0628\u0633\u0627\u0632.");
    if (section === "profile") return renderProfile();
  }
  async function bootstrap() {
    if (!tokens.access) return renderStart();
    const me = await callApi(() => api.getMe(), { silent: true });
    if (!me) return renderStart();
    state2.user = me.user;
    state2.route = me.route;
    state2.car = me.car;
    renderHome();
  }
  window.app = {
    home: renderStart,
    showLogin: renderLogin,
    doLogin,
    showSignup: renderSignup,
    requestOtp,
    otpNext,
    continueSignup,
    finishSignup,
    completeProfile: renderCompleteProfile,
    saveProfile,
    smartGroup,
    openGroup,
    openMessages,
    sendMessage,
    leaveGroup,
    nav,
    logout
  };
  bootstrap();
})();

export const initialSundayProgramme: SundayProgrammeProps = {
  date: '',
  theme: '',
  topic: '',
  lesson: '',
  callToWorship: '',
  callToWorshipText:
    'ENITORINA: EJE KI A FI OTITO OKAN SUMBO TOSI NI EKUN IGBAGBO, KI A SI WE OKAN WA MO KURO NINU ERI OKAN BUBURU KI A SI FI OMI MIMO WE ARA WAN NU. E JE KI A DI IJEWO IRETI WA MU SINSIN NI AISIYEMEJI; (NITORIPE OLOOTO NI ENI TI O SE ILERI) HEB 10:22-23',
  openingPrayer: [51, 19, 24],
  officiating: {
    lesson: '',
    band: [],
    preacher: '',
    worshipLeader: '',
    intercessoryPrayer1: '',
    intercessoryPrayer2: '',
    intercessoryPrayer3: '',
    workersPrayerLeader: '',
    prayerMinistration: '',
    thanksgivingPrayer: '',
    alternateWorshipLeader: '',
    sundaySchoolTeacher: '',
    ministers: [],
  },
  hymns: {
    processional: '',
    introit: '',
    opening: '',
    thanksgiving: [],
    sermon: '',
    vesper: '',
    recessional: '',
  },
};

// Shilo Programme initial data
export const initialShilohProgramme: ShilohProgrammeProps = {
  date: '',
  theme: '',
  topic: '',
  lesson: '',
  openingPrayer: [],
  officiating: {
    revivalist: '',
    preparatoryPrayer: '',
    lesson: '',
    preacher: '',
    worshipLeader: '',
    prayerMinistration: '',
  },
  hynms: {
    opening: '',
    sermon: '',
    prayer: '',
    thanksgiving: '',
  },
};

// Vigil Programme initial data
export const initialVigilProgramme: VigilProgrammeProps = {
  date: '',
  theme: '',
  topic: '',
  lesson: '',
  openingPrayer: [],
  officiating: {
    lesson: '',
    preacher: '',
    worshipLeader: '',
    prayerMinistration: '',
  },
  hynms: {
    opening: '',
    sermon: '',
    prayer: '',
    thanksgiving: '',
  },
};

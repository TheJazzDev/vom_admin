export const initialSundayProgramme: SundayProgrammeProps = {
  date: "",
  theme: "",
  topic: "",
  lesson: "",
  callToWorship: "",
  callToWorshipText: "",
  openingPrayer: [],
  officiating: {
    lesson: "",
    band: [],
    preacher: "",
    worshipLeader: "",
    intercessoryPrayer1: "",
    intercessoryPrayer2: "",
    intercessoryPrayer3: "",
    workersPrayerLeader: "",
    prayerMinistration: "",
    thanksgivingPrayer: "",
    alternateWorshipLeader: "",
    sundaySchoolTeacher: "",
    ministers: [],
  },
  hymns: {
    processional: "",
    introit: "",
    opening: "",
    thanksgiving: [],
    sermon: "",
    vesper: "",
    recessional: "",
  },
};

// Shilo Programme initial data
export const initialShilohProgramme: ShilohProgrammeProps = {
  date: "",
  theme: "",
  topic: "",
  lesson: "",
  openingPrayer: [],
  officiating: {
    revivalist: "",
    preparatoryPrayer: "",
    lesson: "",
    preacher: "",
    worshipLeader: "",
    prayerMinistration: "",
  },
  hynms: {
    opening: "",
    sermon: "",
    prayer: "",
    thanksgiving: "",
  },
};

// Vigil Programme initial data
export const initialVigilProgramme: VigilProgrammeProps = {
  date: "",
  theme: "",
  topic: "",
  lesson: "",
  openingPrayer: [],
  officiating: {
    lesson: "",
    preacher: "",
    worshipLeader: "",
    prayerMinistration: "",
  },
  hynms: {
    opening: "",
    sermon: "",
    prayer: "",
    thanksgiving: "",
  },
};

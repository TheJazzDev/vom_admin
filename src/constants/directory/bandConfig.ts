import {
  IoHeartOutline,
  IoHelpCircleOutline,
  IoMusicalNoteOutline,
  IoPersonAddOutline,
  IoShieldHalfOutline,
  IoShieldOutline,
  IoSparklesOutline,
  IoStarOutline,
  IoWomanOutline,
} from "react-icons/io5";
import { BandKeys } from "@/enums";
import type { BandConfigRecord } from "@/enums/bands";

export const BAND_CONFIG: BandConfigRecord = {
  [BandKeys.CHOIR]: {
    id: BandKeys.CHOIR,
    name: "Choir",
    icon: IoMusicalNoteOutline,
    gradient: ["#8B5CF6", "#A855F7"],
    description: "Leading worship through songs and hymns.",
  },
  [BandKeys.LOVE_DIVINE]: {
    id: BandKeys.LOVE_DIVINE,
    name: "Love Divine",
    icon: IoHeartOutline,
    gradient: ["#EC4899", "#BE185D"],
    description: "Spreading God's love through service and fellowship.",
  },
  [BandKeys.DANIEL]: {
    id: BandKeys.DANIEL,
    name: "Daniel",
    icon: IoShieldOutline,
    gradient: ["#3B82F6", "#1E40AF"],
    description: "Standing firm in faith and righteousness.",
  },
  [BandKeys.DEBORAH]: {
    id: BandKeys.DEBORAH,
    name: "Deborah",
    icon: IoSparklesOutline,
    gradient: ["#10B981", "#047857"],
    description: "Women of strength and wisdom in leadership.",
  },
  [BandKeys.QUEEN_ESTHER]: {
    id: BandKeys.QUEEN_ESTHER,
    name: "Queen Esther",
    icon: IoWomanOutline,
    gradient: ["#F59E0B", "#D97706"],
    description: "For such a time as this — serving with purpose.",
  },
  [BandKeys.GOOD_WOMEN]: {
    id: BandKeys.GOOD_WOMEN,
    name: "Good Women",
    icon: IoWomanOutline,
    gradient: ["#EF4444", "#DC2626"],
    description: "Virtuous women building the kingdom.",
  },
  [BandKeys.WARDEN]: {
    id: BandKeys.WARDEN,
    name: "Warden",
    icon: IoShieldHalfOutline,
    gradient: ["#6B7280", "#374151"],
    description: "Guardians of the church and its values.",
  },
  [BandKeys.JOHN_BELOVED]: {
    id: BandKeys.JOHN_BELOVED,
    name: "John Beloved",
    icon: IoPersonAddOutline,
    gradient: ["#06B6D4", "#0891B2"],
    description: "Beloved disciples walking in love and truth.",
  },
  [BandKeys.FAITH]: {
    id: BandKeys.FAITH,
    name: "Faith",
    icon: IoStarOutline,
    gradient: ["#8B5CF6", "#7C3AED"],
    description: "Walking by faith, not by sight.",
  },
  [BandKeys.HOLY_MARY]: {
    id: BandKeys.HOLY_MARY,
    name: "Holy Mary",
    icon: IoStarOutline,
    gradient: ["#3B82F6", "#1D4ED8"],
    description: "Blessed among women, serving with humility.",
  },
  [BandKeys.UNASSIGNED]: {
    id: BandKeys.UNASSIGNED,
    name: "Unassigned",
    icon: IoHelpCircleOutline,
    gradient: ["#9CA3AF", "#6B7280"],
    description: "Members not assigned to any band",
  },
};

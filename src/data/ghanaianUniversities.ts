export interface GhanaianUniversity {
  name: string;
  shortName: string;
  category: "Public" | "Technical" | "Private" | "College";
  location: string;
}

export const GHANAIAN_UNIVERSITIES: GhanaianUniversity[] = [
  // Public Universities
  { name: "University of Ghana (UG)", shortName: "UG Legon", category: "Public", location: "Legon, Accra" },
  { name: "Kwame Nkrumah University of Science and Technology (KNUST)", shortName: "KNUST", category: "Public", location: "Kumasi" },
  { name: "University of Cape Coast (UCC)", shortName: "UCC", category: "Public", location: "Cape Coast" },
  { name: "University of Education, Winneba (UEW)", shortName: "UEW", category: "Public", location: "Winneba" },
  { name: "University for Development Studies (UDS)", shortName: "UDS", category: "Public", location: "Tamale" },
  { name: "Ghana Institute of Management and Public Administration (GIMPA)", shortName: "GIMPA", category: "Public", location: "Greenhill, Accra" },
  { name: "University of Mines and Technology (UMaT)", shortName: "UMaT", category: "Public", location: "Tarkwa" },
  { name: "University of Health and Allied Sciences (UHAS)", shortName: "UHAS", category: "Public", location: "Ho" },
  { name: "University of Energy and Natural Resources (UENR)", shortName: "UENR", category: "Public", location: "Sunyani" },
  { name: "Ghana Communication Technology University (GCTU)", shortName: "GCTU", category: "Public", location: "Tesano, Accra" },
  { name: "University of Media, Arts and Communication (UniMAC)", shortName: "UniMAC (GIJ/NAFTI/GIL)", category: "Public", location: "Accra" },
  { name: "C.K. Tedam University of Technology and Applied Sciences (CKT-UTAS)", shortName: "CKT-UTAS", category: "Public", location: "Navrongo" },
  { name: "S.D. Dombo University of Business and Integrated Development Studies (SDD-UBIDS)", shortName: "SDD-UBIDS", category: "Public", location: "Wa" },
  { name: "Akenten Appiah-Menka University of Skills Training and Entrepreneurial Development (AAMUSTED)", shortName: "AAMUSTED", category: "Public", location: "Kumasi" },

  // Technical Universities
  { name: "Accra Technical University (ATU)", shortName: "ATU", category: "Technical", location: "Accra" },
  { name: "Kumasi Technical University (KsTU)", shortName: "KsTU", category: "Technical", location: "Kumasi" },
  { name: "Cape Coast Technical University (CCTU)", shortName: "CCTU", category: "Technical", location: "Cape Coast" },
  { name: "Takoradi Technical University (TTU)", shortName: "TTU", category: "Technical", location: "Takoradi" },
  { name: "Ho Technical University (HTU)", shortName: "HTU", category: "Technical", location: "Ho" },
  { name: "Koforidua Technical University (KTU)", shortName: "KTU", category: "Technical", location: "Koforidua" },
  { name: "Sunyani Technical University (STU)", shortName: "STU", category: "Technical", location: "Sunyani" },
  { name: "Tamale Technical University (TaTU)", shortName: "TaTU", category: "Technical", location: "Tamale" },
  { name: "Bolgatanga Technical University (BTU)", shortName: "BTU", category: "Technical", location: "Bolgatanga" },
  { name: "Wa Technical University (WaTU)", shortName: "WaTU", category: "Technical", location: "Wa" },

  // Private Universities
  { name: "Ashesi University", shortName: "Ashesi", category: "Private", location: "Berekuso" },
  { name: "Academic City University College", shortName: "Academic City", category: "Private", location: "Haatso, Accra" },
  { name: "Central University", shortName: "Central Uni", category: "Private", location: "Miotso / Accra" },
  { name: "Valley View University (VVU)", shortName: "VVU", category: "Private", location: "Oyibi, Accra" },
  { name: "Pentecost University", shortName: "Pentecost Uni", category: "Private", location: "Sowutuom, Accra" },
  { name: "Wisconsin International University College, Ghana", shortName: "Wisconsin", category: "Private", location: "Accra" },
  { name: "Methodist University Ghana", shortName: "Methodist Uni", category: "Private", location: "Dansoman, Accra" },
  { name: "Presbyterian University, Ghana (PUG)", shortName: "PUG", category: "Private", location: "Abetifi" },
  { name: "Catholic University of Ghana", shortName: "Catholic Uni", category: "Private", location: "Fiapre, Sunyani" },
  { name: "Regent University College of Science and Technology", shortName: "Regent Uni", category: "Private", location: "Accra" },
  { name: "Accra Institute of Technology (AIT)", shortName: "AIT", category: "Private", location: "Accra" },
  { name: "Lancaster University Ghana", shortName: "Lancaster", category: "Private", location: "Accra" },
  { name: "BlueCrest College Ghana", shortName: "BlueCrest", category: "Private", location: "Accra" },
  { name: "Garden City University College", shortName: "GCUC", category: "Private", location: "Kenyase, Kumasi" },
  { name: "All Nations University", shortName: "ANU", category: "Private", location: "Koforidua" },
  { name: "Knutsford University College", shortName: "Knutsford", category: "Private", location: "East Legon, Accra" },
  { name: "Islamic University College, Ghana", shortName: "IUCG", category: "Private", location: "East Legon, Accra" },
  { name: "Accra Business School", shortName: "ABS", category: "Private", location: "Spintex, Accra" },
  { name: "Marshalls University College", shortName: "Marshalls", category: "Private", location: "Accra" },
  { name: "Radford University College", shortName: "Radford", category: "Private", location: "East Legon, Accra" },

  // Colleges & Specialized Institutions
  { name: "Accra College of Education", shortName: "AcCE", category: "College", location: "Accra" },
  { name: "Wesley College of Education", shortName: "WESCO", category: "College", location: "Kumasi" },
  { name: "Presbyterian College of Education", shortName: "PCE", category: "College", location: "Akropong" },
  { name: "Korle Bu Nursing and Midwifery Training College", shortName: "Korle Bu NMTC", category: "College", location: "Accra" },
  { name: "37 Military Hospital Nursing Training College", shortName: "37 NTC", category: "College", location: "Accra" },
];

export const TOP_GHANAIAN_UNIVERSITIES = [
  "University of Ghana (UG)",
  "Kwame Nkrumah University of Science and Technology (KNUST)",
  "University of Cape Coast (UCC)",
  "University of Education, Winneba (UEW)",
  "University for Development Studies (UDS)",
  "Accra Technical University (ATU)",
  "Kumasi Technical University (KsTU)",
  "Ashesi University",
  "GIMPA",
];

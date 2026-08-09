import React from "react";
import { ResumeData, PersonalInfo } from "../../types";

interface StepProps {
  resume: ResumeData;
  onChange: (updated: ResumeData) => void;
}

const GHANA_REGIONS = [
  "Greater Accra Region",
  "Ashanti Region",
  "Western Region",
  "Eastern Region",
  "Central Region",
  "Northern Region",
  "Volta Region",
  "Upper East Region",
  "Upper West Region",
  "Bono Region",
  "Bono East Region",
  "Ahafo Region",
  "Oti Region",
  "Savannah Region",
  "North East Region",
  "Western North Region",
];

const GHANA_DISTRICTS_BY_REGION: Record<string, string[]> = {
  "Greater Accra Region": [
    "Accra Metropolitan Assembly (AMA)",
    "Ayawaso West Municipal (East Legon, Airport)",
    "Ayawaso East Municipal",
    "Ayawaso North Municipal",
    "Ayawaso Central Municipal",
    "Ablekuma Central Municipal",
    "Ablekuma North Municipal",
    "Ablekuma West Municipal",
    "Ashaiman Municipal",
    "Adentan Municipal",
    "Ga East Municipal (Dome, Kwabenya)",
    "Ga West Municipal (Amasaman)",
    "Ga South Municipal (Weija)",
    "Ga Central Municipal (Sowutuom)",
    "Ga North Municipal",
    "La Dade-Kotopon Municipal (Labadi)",
    "La Nkwantanang Madina Municipal",
    "Ledzokuku Municipal (Teshie)",
    "Krowor Municipal (Nungua)",
    "Tema Metropolitan Assembly",
    "Tema West Municipal",
    "Kpone Katamanso Municipal",
    "Ningo Prampram District",
    "Shai Osudoku District",
    "Ada East District",
    "Ada West District",
  ],
  "Ashanti Region": [
    "Kumasi Metropolitan Assembly (KMA)",
    "Asokwa Municipal",
    "Suame Municipal",
    "Oforikrom Municipal",
    "Kwadaso Municipal",
    "Old Tafo Municipal",
    "Asokore Mampong Municipal",
    "Ejisu Municipal",
    "Obuasi Municipal",
    "Obuasi East District",
    "Mampong Municipal",
    "Bekwai Municipal",
    "Offinso Municipal",
    "Offinso North District",
    "Bosomtwe District",
    "Atwima Nwabiagya Municipal",
    "Atwima Nwabiagya South",
    "Atwima Kwanwoma District",
    "Ahafo Ano North Municipal",
    "Ahafo Ano South East / West",
    "Sekyere South District",
    "Sekyere East District",
    "Sekyere Central District",
    "Asante Akim Central Municipal",
    "Asante Akim North / South",
  ],
  "Western Region": [
    "Sekondi-Takoradi Metropolitan Assembly",
    "Effia-Kwesimintsim Municipal",
    "Tarkwa-Nsuaem Municipal",
    "Prestea-Huni Valley Municipal",
    "Nzema East Municipal",
    "Jomoro Municipal",
    "Ellembelle District",
    "Ahanta West Municipal",
    "Mpohor District",
    "Wassa East District",
    "Wassa Amenfi East / West / Central",
  ],
  "Eastern Region": [
    "New Juaben South Municipal (Koforidua)",
    "New Juaben North Municipal",
    "Akwapim South District (Aburi)",
    "Akwapim North Municipal (Akropong)",
    "Nsawam Adoagyiri Municipal",
    "Birim Central Municipal (Akim Oda)",
    "Birim North / South District",
    "Kwahu West Municipal (Nkawkaw)",
    "Kwahu East / South District",
    "Abuakwa South Municipal (Kibi)",
    "Abuakwa North Municipal",
    "Yilo Krobo Municipal (Somanya)",
    "Lower Manya Krobo Municipal",
    "Upper Manya Krobo District",
    "Denkyembour District",
  ],
  "Central Region": [
    "Cape Coast Metropolitan Assembly",
    "Effutu Municipal (Winneba)",
    "Awutu Senya East Municipal (Kasoa)",
    "Awutu Senya West District",
    "Agona West Municipal (Swedru)",
    "Agona East District",
    "Komenda-Edina-Eguafo-Abirem Municipal",
    "Mfantsiman Municipal (Saltpond)",
    "Abura-Asebu-Kwamankese District",
    "Gomoa East / West / Central",
    "Asikuma Odoben Brakwa District",
    "Twifo Atti-Morkwa District",
  ],
  "Northern Region": [
    "Tamale Metropolitan Assembly",
    "Sagnarigu Municipal",
    "Yendi Municipal",
    "Savelugu Municipal",
    "Nanton District",
    "Tolon District",
    "Kumbungu District",
    "Karaga District",
    "Gushiegu Municipal",
    "Tatale Sanguli District",
    "Nanumba North Municipal / South",
  ],
  "Volta Region": [
    "Ho Municipal",
    "Hohoe Municipal",
    "Keta Municipal",
    "Ketu South Municipal (Aflao)",
    "Ketu North Municipal",
    "South Tongu District (Sogakope)",
    "North Tongu District (Bator)",
    "Central Tongu District (Adidome)",
    "Akatsi South Municipal",
    "Akatsi North District",
    "Anloga District",
    "Afadzato South District",
    "Agotime Ziope District",
  ],
  "Upper East Region": [
    "Bolgatanga Municipal",
    "Bolgatanga East District",
    "Kassena Nankana Municipal (Navrongo)",
    "Kassena Nankana West District",
    "Bawku Municipal",
    "Bawku West District",
    "Builsa North Municipal / South",
    "Bongo District",
    "Nabdam District",
    "Talensi District",
    "Garu District",
  ],
  "Upper West Region": [
    "Wa Municipal",
    "Wa East District",
    "Wa West District",
    "Jirapa Municipal",
    "Lawra Municipal",
    "Nadowli-Kaleo District",
    "Sissala East Municipal",
    "Sissala West District",
    "Daffiama Bussie Issa District",
    "Lambussie Karni District",
  ],
  "Bono Region": [
    "Sunyani Municipal",
    "Sunyani West Municipal",
    "Berekum East Municipal",
    "Berekum West District",
    "Dormaa Central Municipal",
    "Dormaa East / West District",
    "Wenchi Municipal",
    "Jaman North / South Municipal",
    "Tain District",
    "Banda District",
  ],
  "Bono East Region": [
    "Techiman Municipal",
    "Techiman North District",
    "Kintampo North Municipal",
    "Kintampo South District",
    "Atebubu-Amantin Municipal",
    "Nkoranza South Municipal",
    "Nkoranza North District",
    "Pru East / West District",
    "Sene East / West District",
  ],
  "Ahafo Region": [
    "Asunafo North Municipal (Goaso)",
    "Asunafo South District",
    "Asutifi North District (Kenyasi)",
    "Asutifi South District",
    "Tano North Municipal",
    "Tano South Municipal",
  ],
  "Oti Region": [
    "Krachi East Municipal (Dambai)",
    "Krachi West District",
    "Krachi Nchumuru District",
    "Nkwanta South Municipal",
    "Nkwanta North District",
    "Jasikan District",
    "Kadjebi District",
    "Biakoye District",
    "Guan District",
  ],
  "Savannah Region": [
    "West Gonja Municipal (Damongo)",
    "East Gonja Municipal (Salaga)",
    "Central Gonja District",
    "North Gonja District",
    "Bole District",
    "Sawla-Tuna-Kalba District",
    "North East Gonja District",
  ],
  "North East Region": [
    "East Mamprusi Municipal (Gambaga / Nalerigu)",
    "West Mamprusi Municipal (Walewale)",
    "Bunkpurugu Nyankpanduri District",
    "Chereponi District",
    "Yagaba-Kubori District",
    "Yunyoo-Nasuan District",
  ],
  "Western North Region": [
    "Sefwi Wiawso Municipal",
    "Bibiani-Anhwiaso-Bekwai Municipal",
    "Aowin Municipal (Enchi)",
    "Suaman District",
    "Juaboso District",
    "Bia East District",
    "Bia West District",
    "Bodi District",
  ],
};

export const PersonalInfoStep: React.FC<StepProps> = ({ resume, onChange }) => {
  const p = resume.personalInfo;

  const handleInfoChange = (field: keyof PersonalInfo, value: string) => {
    onChange({
      ...resume,
      personalInfo: {
        ...resume.personalInfo,
        [field]: value,
      },
    });
  };

  const handleRegionChange = (newRegion: string) => {
    const districts = GHANA_DISTRICTS_BY_REGION[newRegion] || [];
    const currentDistrictValid = districts.includes(p.district || "");
    const updatedDistrict = currentDistrictValid ? p.district : (districts[0] || "");

    onChange({
      ...resume,
      personalInfo: {
        ...resume.personalInfo,
        region: newRegion,
        district: updatedDistrict,
      },
    });
  };

  const availableDistricts = p.region ? (GHANA_DISTRICTS_BY_REGION[p.region] || []) : [];

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-xl font-bold text-slate-900">Personal Information</h3>
        <p className="text-sm text-slate-600">Provide your contact info and Ghana address details so recruiters and ATS systems can contact you.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-tighter mb-1">First Name *</label>
          <input
            type="text"
            value={p.firstName || ""}
            onChange={(e) => handleInfoChange("firstName", e.target.value)}
            className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 outline-none bg-white text-slate-900"
            placeholder="Kwame"
          />
        </div>

        <div>
          <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-tighter mb-1">Middle Name</label>
          <input
            type="text"
            value={p.middleName || ""}
            onChange={(e) => handleInfoChange("middleName", e.target.value)}
            className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 outline-none bg-white text-slate-900"
            placeholder="Kojo"
          />
        </div>

        <div>
          <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-tighter mb-1">Last Name *</label>
          <input
            type="text"
            value={p.lastName || ""}
            onChange={(e) => handleInfoChange("lastName", e.target.value)}
            className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 outline-none bg-white text-slate-900"
            placeholder="Mensah"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-tighter mb-1">Target Job Title *</label>
          <input
            type="text"
            value={p.jobTitle || resume.targetJobTitle || ""}
            onChange={(e) => {
              handleInfoChange("jobTitle", e.target.value);
              onChange({ ...resume, targetJobTitle: e.target.value, personalInfo: { ...p, jobTitle: e.target.value } });
            }}
            className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 outline-none bg-white text-slate-900"
            placeholder="e.g., Senior Software Developer / Data Analyst"
          />
        </div>

        <div>
          <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-tighter mb-1">Field of Study / Career Field</label>
          <input
            type="text"
            value={resume.fieldOfStudy || ""}
            onChange={(e) => onChange({ ...resume, fieldOfStudy: e.target.value })}
            className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 outline-none bg-white text-slate-900"
            placeholder="e.g., Computer Engineering, Accounting, Nursing"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-tighter mb-1">Email Address *</label>
          <input
            type="email"
            value={p.email || ""}
            onChange={(e) => handleInfoChange("email", e.target.value)}
            className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 outline-none bg-white text-slate-900"
            placeholder="kwame.mensah@gmail.com"
          />
        </div>

        <div>
          <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-tighter mb-1">Phone Number *</label>
          <input
            type="text"
            value={p.phoneNumber || ""}
            onChange={(e) => handleInfoChange("phoneNumber", e.target.value)}
            className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 outline-none bg-white text-slate-900"
            placeholder="+233 24 123 4567"
          />
        </div>

        <div>
          <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-tighter mb-1">Alternative Phone</label>
          <input
            type="text"
            value={p.altPhoneNumber || ""}
            onChange={(e) => handleInfoChange("altPhoneNumber", e.target.value)}
            className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 outline-none bg-white text-slate-900"
            placeholder="+233 50 987 6543"
          />
        </div>
      </div>

      {/* Ghana Location & Address Section */}
      <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-4">
        <div className="flex items-center justify-between">
          <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">Ghana Address & Administrative Location</h4>
          <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">Ghana Specifics</span>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-tighter mb-1">
              Region (Ghana) <span className="text-red-500">*</span>
            </label>
            <select
              value={p.region || ""}
              onChange={(e) => handleRegionChange(e.target.value)}
              required
              className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 outline-none bg-white text-slate-900 font-medium"
            >
              <option value="">-- Select Administrative Region * --</option>
              {GHANA_REGIONS.map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-tighter mb-1">
              District / Municipality / Metro
            </label>
            <select
              value={p.district || ""}
              onChange={(e) => handleInfoChange("district", e.target.value)}
              disabled={!p.region}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 outline-none bg-white text-slate-900 disabled:opacity-50 disabled:bg-slate-100"
            >
              {!p.region ? (
                <option value="">-- Select Region First --</option>
              ) : availableDistricts.length === 0 ? (
                <option value="">-- No Districts Found --</option>
              ) : (
                <>
                  <option value="">-- Select District / Municipality --</option>
                  {availableDistricts.map((d) => (
                    <option key={d} value={d}>
                      {d}
                    </option>
                  ))}
                </>
              )}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-tighter mb-1">Residential Area / City / Town</label>
            <input
              type="text"
              value={p.address || ""}
              onChange={(e) => handleInfoChange("address", e.target.value)}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 outline-none bg-white text-slate-900"
              placeholder="e.g. East Legon, Accra"
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-tighter mb-1">Digital Address (GPS Address)</label>
            <input
              type="text"
              value={p.digitalAddress || ""}
              onChange={(e) => handleInfoChange("digitalAddress", e.target.value)}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 outline-none bg-white text-slate-900"
              placeholder="e.g. GA-183-9021"
            />
            <p className="text-[10px] text-slate-500 mt-1">GhanaPost GPS (e.g. GA-183-9021)</p>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-tighter mb-1">Nationality</label>
            <input
              type="text"
              value={p.nationality || ""}
              onChange={(e) => handleInfoChange("nationality", e.target.value)}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 outline-none bg-white text-slate-900"
              placeholder="Ghanaian"
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-tighter mb-1">LinkedIn Profile</label>
          <input
            type="text"
            value={p.linkedin || ""}
            onChange={(e) => handleInfoChange("linkedin", e.target.value)}
            className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 outline-none bg-white text-slate-900"
            placeholder="linkedin.com/in/kwamemensah"
          />
        </div>

        <div>
          <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-tighter mb-1">GitHub Profile</label>
          <input
            type="text"
            value={p.github || ""}
            onChange={(e) => handleInfoChange("github", e.target.value)}
            className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 outline-none bg-white text-slate-900"
            placeholder="github.com/kwamemensah"
          />
        </div>

        <div>
          <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-tighter mb-1">Portfolio / Website</label>
          <input
            type="text"
            value={p.portfolio || p.website || ""}
            onChange={(e) => {
              handleInfoChange("portfolio", e.target.value);
              handleInfoChange("website", e.target.value);
            }}
            className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 outline-none bg-white text-slate-900"
            placeholder="kwamemensah.dev"
          />
        </div>
      </div>
    </div>
  );
};

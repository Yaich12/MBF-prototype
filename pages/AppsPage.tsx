
import React, { useState } from 'react';
import { 
    UsersIcon, 
    PlusCircleIcon, 
    MobilePayIcon, 
    LinkIcon, 
    ShoppingCartIcon, 
    ClipboardCheckIcon, 
    SparklesIcon,
    StarIcon
} from '../components/icons';

interface AppCardProps {
  title: string;
  description: string;
  price: string;
  isNew?: boolean;
  isBeta?: boolean;
  icon: React.ReactNode;
  promo?: string;
}

const AppCard: React.FC<AppCardProps> = ({ title, description, price, isNew, isBeta, icon, promo }) => (
  <div className="bg-white border border-gray-200 rounded-lg p-6 flex flex-col justify-between min-h-[360px]">
    <div>
      <div className="flex items-start justify-between">
        <div className="w-12 h-12 flex items-center justify-center rounded-lg bg-blue-50 text-blue-600">
          {icon}
        </div>
        <div className="text-right">
          {isNew && <span className="inline-block bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-md">Ny!</span>}
          {isBeta && <span className="inline-block bg-yellow-400 text-yellow-900 text-xs font-bold px-2 py-1 rounded-md">BETA</span>}
        </div>
      </div>
      <h3 className="text-lg font-semibold text-gray-800 mt-4">{title}</h3>
      <p className="text-sm text-gray-500 mt-2 h-20">{description}</p>
    </div>
    <div className="mt-6">
      <p className="text-sm text-gray-500 mb-2">{price}</p>
      {promo && (
        <p className="text-sm text-green-700 font-medium mb-3 flex items-center">
            <StarIcon className="w-4 h-4 mr-1.5 text-green-600" />
            {promo}
        </p>
      )}
      <button className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700">
        Aktiver
      </button>
    </div>
  </div>
);


const AppsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState("Nye apps");

  const filterTabs = ["Nye apps", "Extra tjenester", "Essentielle apps", "Kalender", "Klienter", "Sikkerhed / GDPR", "Ydelser", "Online Booking", "Regnskab", "Din klinik", "Avanceret"];
  
  const nyeApps = [
    { title: "Behandlingsforløb", description: "Opret og administrer dine klienters behandlingsforløb.", price: "Gratis", isNew: true, icon: <PlusCircleIcon /> },
    { title: "MobilePay", description: "Send betalingsanmodninger direkte til dine klienter og modtag betalinger via Mobilepay.", price: "Gratis for abonnerende", isNew: true, icon: <MobilePayIcon /> },
    { title: "Par- og gruppeterapi", description: "Gruppér dine klienter sammen og lav gruppeaftaler.", price: "Gratis for abonnerende", isNew: true, icon: <UsersIcon /> },
    { title: "EXORlive", description: "Opret forbindelse til MBF system gennem ExorLive for at aktivere automatisk login og nemt forbinde kunder mellem systemerne.", price: "Gratis for abonnerende", isNew: true, icon: <LinkIcon /> },
    { title: "Salg", description: "Opret og sælg fysiske produkter til dine klienter.", price: "Gratis for abonnerende", isNew: true, icon: <ShoppingCartIcon /> },
    { title: "Opgaver", description: "Daglige igangværende opgaver i din klinik.", price: "Gratis", isBeta: true, icon: <ClipboardCheckIcon /> },
    { title: "Personalemøder", description: "Personalemøder giver dig og dine medarbejdere mulighed for problemfrit at oprette, planlægge og administrere personalemøder i din MBF system-konto.", price: "Gratis for abonnerende", isNew: true, icon: <UsersIcon /> },
    { title: "AI-assistent", description: "Spar tid med AI-drevet journaltransskription og resume.", price: "DKK 299,00 per måned", isNew: true, icon: <SparklesIcon />, promo: "14 dages gratis prøveperiode" },
  ];

  const extraTjenester = [
    {
      title: "AI transkribering",
      description: "Spar tid med automatisk transskription af dine journalsamtaler.",
      price: "Gratis for abonnerende",
      isNew: true,
      icon: <SparklesIcon />
    },
    {
      title: "AI klinisk ræssonering assistent",
      description: "Få hjælp til klinisk ræssonering og diagnoseforslag baseret på klientdata.",
      price: "Gratis for abonnerende",
      isNew: true,
      icon: <SparklesIcon />
    },
    {
      title: "AI Manuel væv makker",
      description: "Analyser og få feedback på manuelle vævsbehandlingsteknikker.",
      price: "Gratis for abonnerende",
      isNew: true,
      icon: <SparklesIcon />
    },
    {
      title: "AI Sekretæren",
      description: "Automatiser booking, påmindelser og administrative opgaver for at frigøre din tid.",
      price: "Gratis for abonnerende",
      isNew: true,
      icon: <SparklesIcon />
    },
    {
      title: "AI tekst sammenfatter",
      description: "Få hurtige og præcise resuméer af lange journalnotater og forskningsartikler.",
      price: "Gratis for abonnerende",
      isNew: true,
      icon: <SparklesIcon />
    }
  ];
  
  const appsByTab: { [key: string]: AppCardProps[] } = {
    "Nye apps": nyeApps,
    "Extra tjenester": extraTjenester,
  };

  const currentApps = appsByTab[activeTab] || [];
  
  const descriptions: { [key: string]: string } = {
      "Nye apps": "De nyeste apps vi har tilføjet.",
      "Extra tjenester": "Opgrader din praksis med kraftfulde AI-drevne værktøjer.",
  };
  
  return (
    <div className="p-8 bg-gray-50 h-full overflow-y-auto">
      <header className="mb-6">
        <div className="flex flex-wrap gap-2">
            {filterTabs.map((tab) => (
                <button 
                    key={tab} 
                    onClick={() => setActiveTab(tab)}
                    className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                        activeTab === tab 
                        ? 'bg-blue-100 text-blue-700' 
                        : 'bg-white text-gray-700 hover:bg-gray-100 border'
                    }`}
                >
                    {tab}
                </button>
            ))}
        </div>
      </header>

      {currentApps.length > 0 ? (
          <>
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-gray-800">{activeTab}</h2>
              <p className="text-sm text-gray-500">{descriptions[activeTab] || ''}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {currentApps.map((app) => (
                <AppCard key={app.title} {...app} />
              ))}
            </div>
          </>
      ) : (
          <div className="text-center py-20 bg-white rounded-lg border">
              <h3 className="text-lg font-medium text-gray-800">Ingen apps fundet</h3>
              <p className="mt-2 text-gray-500">Der er i øjeblikket ingen apps i denne kategori.</p>
          </div>
      )}
    </div>
  );
};

export default AppsPage;
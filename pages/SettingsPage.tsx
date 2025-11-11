
import React, { useState } from 'react';
import { DownloadIcon } from '../components/icons';

const SettingsPage: React.FC = () => {
  const [activeSetting, setActiveSetting] = useState("Din profil");
  const settingsNav = ["Din profil", "Sikkerhed", "Faktura", "Abonnement", "E-mail og SMS", "Klientaftaler", "Andre Indstillinger", "Import / Eksport"];

  return (
    <div className="p-8 bg-gray-50 h-full overflow-y-auto">
      <header className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold text-gray-800">Indstillinger</h1>
        <button className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700">
          Gem indstillinger
        </button>
      </header>

      <div className="grid grid-cols-12 gap-8">
        <div className="col-span-3">
          <nav className="space-y-1">
            {settingsNav.map((item) => (
              <a
                key={item}
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  setActiveSetting(item);
                }}
                className={`block px-4 py-2 text-sm font-medium rounded-md ${
                  activeSetting === item ? 'bg-blue-100 text-blue-700' : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                {item}
              </a>
            ))}
          </nav>
        </div>

        <div className="col-span-9">
          {activeSetting === 'Din profil' && (
            <div className="grid grid-cols-3 gap-8">
              <div className="col-span-2 space-y-8">
                {/* Din profil Card */}
                <div className="bg-white p-6 rounded-lg border border-gray-200">
                  <h2 className="text-lg font-semibold text-gray-900 mb-1">Din profil</h2>
                  <p className="text-sm text-gray-500 mb-6">Her kan du angive information omkring dig selv og din praksis. Informationerne bliver brugt forskellige steder i systemet, som f.eks. dine fakturaer og Online Booking sider.</p>
                  
                  <div className="flex space-x-6">
                    <div className="flex-shrink-0">
                        <p className="text-sm font-medium text-gray-700 mb-2">Billede</p>
                        <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center text-center text-xs text-gray-500 p-2 cursor-pointer border-2 border-dashed">
                            Klik for at tilføje et billede
                        </div>
                    </div>
                    <div className="flex-grow space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Fornavn</label>
                          <input type="text" defaultValue="Jonas" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3" />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Efternavn</label>
                          <input type="text" defaultValue="Yaich" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3" />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">E-mail</label>
                        <input type="email" defaultValue="Jona223@gmail.com" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3" />
                      </div>
                       <div>
                          <label className="block text-sm font-medium text-gray-700">Telefon</label>
                          <input type="text" defaultValue="+45" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3" />
                          <p className="text-xs text-gray-500 mt-1">Dit telefonnummer skal være 8 cifre</p>
                        </div>
                    </div>
                  </div>
                </div>

                {/* Virksomhedsoplysninger Card */}
                <div className="bg-white p-6 rounded-lg border border-gray-200">
                  <h2 className="text-lg font-semibold text-gray-900 mb-1">Virksomhedsoplysninger</h2>
                  <p className="text-sm text-gray-500 mb-6">Her kan du angive oplysninger om din virksomhed. Oplysningerne vil blive brugt på tværs af systemet, f.eks. på dine fakturaer og på din online bookingside.</p>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Praksisnavn</label>
                    <input type="text" defaultValue="Klinik Selma" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3" />
                  </div>
                  <div className="mt-4">
                    <label className="block text-sm font-medium text-gray-700">Hjemmeside</label>
                    <input type="url" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3" />
                  </div>
                </div>

              </div>

              <div className="col-span-1 space-y-6">
                {/* Vilkår & Databehandleraftale Card */}
                <div className="bg-white p-6 rounded-lg border border-gray-200">
                  <h3 className="text-base font-semibold text-gray-900 mb-2">Vilkår & Databehandleraftale</h3>
                  <p className="text-sm text-gray-500 mb-4">Vores databehandleraftale imødekommer de nye EU-regler om personoplysninger og er en skriftlig garanti til dig, som dataansvarlig, om at vi, som din databehandler, opbevarer dine personoplysninger på forsvarlig vis.</p>
                  <button className="w-full flex items-center justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700">
                    Hent databehandleraftale
                  </button>
                  <p className="text-xs text-gray-500 mt-2">Accepteret 2025-11-11</p>
                  <button className="w-full flex items-center justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 mt-2">
                    <DownloadIcon className="w-4 h-4 mr-2" />
                    Download vilkår og betingelser
                  </button>
                </div>
                
                {/* Sprog Card */}
                 <div className="bg-white p-6 rounded-lg border border-gray-200">
                    <h3 className="text-base font-semibold text-gray-900 mb-2">Sprog</h3>
                    <p className="text-sm text-gray-500 mb-4">Det sprog som MBF system vises i. Sproget der har valgt her er også det sprog som din Online Booking vises i, hvis du har det aktivereret.</p>
                    <select className="w-full p-2 border border-gray-300 rounded-md">
                        <option>Dansk</option>
                        <option>English</option>
                    </select>
                 </div>
              </div>
            </div>
          )}
          {activeSetting !== 'Din profil' && (
            <div className="bg-white p-6 rounded-lg border border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900 mb-1">{activeSetting}</h2>
              <p>Indstillinger for {activeSetting.toLowerCase()} kommer snart.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;

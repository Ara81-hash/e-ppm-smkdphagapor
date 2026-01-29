
import React, { useState, useCallback, useRef } from 'react';
import { 
  AppState, 
  INITIAL_PPM_LIST, 
  INITIAL_WEEKS, 
  INITIAL_DAYS, 
  INITIAL_TIMESLOTS,
  TaskCategory
} from './types';
import { generateTaskSummary } from './services/geminiService';

const App: React.FC = () => {
  const [state, setState] = useState<AppState>({
    week: INITIAL_WEEKS[0],
    day: INITIAL_DAYS[0],
    timeSlot: INITIAL_TIMESLOTS[0],
    preparedBy: INITIAL_PPM_LIST[0],
    generalTasks: '',
    notes: '',
    image: null,
    reviewedBy: '',
    categories: {
      hem: {
        title: "PENGURUSAN HAL EHWAL MURID",
        tasks: [
          { id: 'hem1', label: 'Memastikan murid sentiasa berada dalam keadaan bersih dan kemas', checked: false },
          { id: 'hem2', label: 'Menghantar atau menyambut kedatangan murid semasa menghadiri kelas/stesen', checked: false },
          { id: 'hem3', label: 'Menguruskan MBPK yang tidak terurus atau tidak tahu menyalin pakaian', checked: false },
          { id: 'hem4', label: 'Mengawal tingkah laku MBPK semasa perhimpunan rasmi sekolah', checked: false },
          { id: 'hem5', label: 'Membawa MBPK ke tempat perhimpunan', checked: false },
          { id: 'hem6', label: 'Mengiringi MBPK ke tandas', checked: false },
          { id: 'hem7', label: 'Membimbing MBPK cara menggunakan tandas serta membersihkan diri dengan betul', checked: false },
          { id: 'hem8', label: 'Memastikan MBPK membasuh tangan sebelum dan selepas makan', checked: false },
          { id: 'hem9', label: 'Mengambil bekal makanan bantuan khas utk pelajar yang kurang pendapatan', checked: false },
          { id: 'hem10', label: 'Menjadi contoh teladan yang baik (tingkah laku, tutur bahasa, kekemasan)', checked: false },
          { id: 'hem11', label: 'Membantu guru bagi menghadiri aktiviti sukan dan ko-kurikulum', checked: false },
        ]
      },
      class: {
        title: "PENGURUSAN KELAS / BILIK PENDIDIKAN KHAS",
        tasks: [
          { id: 'c1', label: 'Membuka dan menutup kelas (bersih, kemas, teratur sebelum/selepas PdP)', checked: false },
          { id: 'c2', label: 'Mengemas dan membersihkan kelas/bilik/bengkel masakan', checked: false },
          { id: 'c3', label: 'Menyapu lantai setiap hari dan mop (jika perlu)', checked: false },
          { id: 'c4', label: 'Memastikan sampah dibuang', checked: false },
          { id: 'c5', label: 'Membantu mewujudkan suasana bilik darjah yang kondusif', checked: false },
          { id: 'c6', label: 'Menjaga keselamatan alatan di dalam dan di luar kelas/bangunan', checked: false },
        ]
      },
      doc: {
        title: "PENGURUSAN DOKUMEN DAN STOK PENDIDIKAN KHAS",
        tasks: [
          { id: 'd1', label: 'Membantu pengurusan pentadbiran am, rekod, dokumen, stok dan aset', checked: false },
          { id: 'd2', label: 'Mengemas kini data dan maklumat MBPK secara berkala', checked: false },
          { id: 'd3', label: 'Membantu dalam pengurusan fail dan rekod', checked: false },
          { id: 'd4', label: 'Merekod pembelian bahan dan peralatan', checked: false },
          { id: 'd5', label: 'Membantu melabel peralatan dan barang', checked: false },
          { id: 'd6', label: 'Membantu menyusun perabot dan peralatan serta barang', checked: false },
        ]
      },
      pdp: {
        title: "PENGURUSAN PENGAJARAN DAN PEMBELAJARAN",
        tasks: [
          { id: 'p1', label: 'Membantu pengurusan perjalanan sebelum, semasa dan selepas PdP', checked: false },
          { id: 'p2', label: 'Membimbing dan mengawal tingkah laku MBPK semasa PdP', checked: false },
          { id: 'p3', label: 'Membantu guru menyediakan bahan sumber sebelum sesi PdP', checked: false },
          { id: 'p4', label: 'Membantu guru membuat salinan (photocopy)', checked: false },
          { id: 'p5', label: 'Membantu pelajar yang lemah mengeluarkan buku dan alat tulis', checked: false },
          { id: 'p6', label: 'Membantu psikomotor kasar/halus (contoh: memegang tangan MBPK)', checked: false },
          { id: 'p7', label: 'Mengawasi keselamatan, kesihatan dan keselesaan MBPK di dalam/luar sekolah', checked: false },
        ]
      },
      mobility: {
        title: "PENGURUSAN PERGERAKAN DAN AKTIVITI MURID (MOBILITI)",
        tasks: [
          { id: 'm1', label: 'Membantu pengurusan mobiliti dan penglibatan aktiviti luar/dalam sekolah', checked: false },
          { id: 'm2', label: 'Mengurus MBPK yang tidak mampu berjalan/bergerak sendiri', checked: false },
          { id: 'm3', label: 'Mengurus MBPK yang menggunakan alatan khas untuk bergerak', checked: false },
          { id: 'm4', label: 'Memastikan MBPK mengamalkan teknik orientasi dan mobiliti dengan betul', checked: false },
          { id: 'm5', label: 'Mengiringi dan memimpin pelajar ke tandas', checked: false },
        ]
      },
      holiday: {
        title: "TUGAS SEWAKTU CUTI PERSEKOLAHAN",
        tasks: [
          { id: 'h1', label: 'Menyapu/mop lantai, memastikan bilik/tandas bersih, ceria, selamat', checked: false },
          { id: 'h2', label: 'Mencuci dan mengganti langsir dan sarung sofa (jika perlu)', checked: false },
          { id: 'h3', label: 'Memastikan peralatan elektrik tidak berhabuk, selamat dan sedia digunakan', checked: false },
          { id: 'h4', label: 'Menyusun semula peralatan dan perabot', checked: false },
          { id: 'h5', label: 'Menyemak stok, aset bernilai rendah dan harta modal', checked: false },
        ]
      }
    }
  });

  const [aiSummary, setAiSummary] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const toggleTask = (categoryKey: string, taskId: string) => {
    setState(prev => ({
      ...prev,
      categories: {
        ...prev.categories,
        [categoryKey]: {
          ...prev.categories[categoryKey],
          tasks: prev.categories[categoryKey].tasks.map(t => 
            t.id === taskId ? { ...t, checked: !t.checked } : t
          )
        }
      }
    }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setState(prev => ({ ...prev, image: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleGenerateSummary = async () => {
    setIsGenerating(true);
    const summary = await generateTaskSummary(state);
    setAiSummary(summary);
    setIsGenerating(false);
  };

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-8">
      {/* Header Section */}
      <header className="bg-blue-600 text-white p-6 rounded-t-xl shadow-lg mb-6">
        <h1 className="text-2xl md:text-3xl font-bold text-center">Catatan Harian Tugas PPM</h1>
        <p className="text-center opacity-90 mt-2">SMK DPHA Gapor, Kuching</p>
      </header>

      <div className="bg-white p-6 rounded-b-xl shadow-md space-y-8">
        {/* Dropdown Meta Data */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-6 border-b">
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-700">Minggu</label>
            <select 
              className="w-full p-2.5 bg-gray-50 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
              value={state.week}
              onChange={(e) => setState(prev => ({ ...prev, week: e.target.value }))}
            >
              {INITIAL_WEEKS.map(w => <option key={w} value={w}>{w}</option>)}
            </select>
          </div>
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-700">Hari</label>
            <select 
              className="w-full p-2.5 bg-gray-50 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
              value={state.day}
              onChange={(e) => setState(prev => ({ ...prev, day: e.target.value }))}
            >
              {INITIAL_DAYS.map(d => <option key={d} value={d}>{d}</option>)}
            </select>
          </div>
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-700">Masa Bertugas</label>
            <select 
              className="w-full p-2.5 bg-gray-50 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
              value={state.timeSlot}
              onChange={(e) => setState(prev => ({ ...prev, timeSlot: e.target.value }))}
            >
              {INITIAL_TIMESLOTS.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-700">Disediakan Oleh (PPM)</label>
            <select 
              className="w-full p-2.5 bg-gray-50 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
              value={state.preparedBy}
              onChange={(e) => setState(prev => ({ ...prev, preparedBy: e.target.value }))}
            >
              {INITIAL_PPM_LIST.map(p => <option key={p} value={p}>{p}</option>)}
            </select>
          </div>
        </section>

        {/* Task Categories */}
        {/* Fix: Cast Object.entries to explicit types to avoid 'unknown' errors for cat.title and cat.tasks */}
        {(Object.entries(state.categories) as [string, TaskCategory][]).map(([key, cat]) => (
          <section key={key} className="space-y-3">
            <h3 className="text-lg font-bold text-blue-800 border-l-4 border-blue-600 pl-3 py-1 bg-blue-50">
              {cat.title}
            </h3>
            <div className="grid grid-cols-1 gap-2">
              {cat.tasks.map(task => (
                <label key={task.id} className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer border border-transparent hover:border-gray-200">
                  <input 
                    type="checkbox" 
                    checked={task.checked}
                    onChange={() => toggleTask(key, task.id)}
                    className="mt-1 w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <span className="text-gray-700 text-sm md:text-base leading-snug">{task.label}</span>
                </label>
              ))}
            </div>
          </section>
        ))}

        {/* Text Areas */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-700">Tugas Umum</label>
            <textarea 
              className="w-full p-3 bg-gray-50 border border-gray-300 rounded-lg h-32 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Masukkan tugas lain di sini..."
              value={state.generalTasks}
              onChange={(e) => setState(prev => ({ ...prev, generalTasks: e.target.value }))}
            />
          </div>
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-700">Catatan</label>
            <textarea 
              className="w-full p-3 bg-gray-50 border border-gray-300 rounded-lg h-32 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Nota atau pemerhatian tambahan..."
              value={state.notes}
              onChange={(e) => setState(prev => ({ ...prev, notes: e.target.value }))}
            />
          </div>
        </section>

        {/* Image Upload */}
        <section className="space-y-4">
          <h3 className="text-lg font-bold text-gray-800">Ruang Gambar</h3>
          <div className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-xl p-6 bg-gray-50">
            {state.image ? (
              <div className="relative group w-full max-w-md">
                <img src={state.image} alt="Upload" className="w-full h-64 object-cover rounded-lg shadow-sm" />
                <button 
                  onClick={() => setState(prev => ({ ...prev, image: null }))}
                  className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full shadow-md hover:bg-red-600 transition-colors"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
            ) : (
              <div className="text-center">
                <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                  <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <div className="flex text-sm text-gray-600 mt-2">
                  <label className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500">
                    <span>Muat naik gambar</span>
                    <input ref={fileInputRef} type="file" className="sr-only" accept="image/*" onChange={handleImageUpload} />
                  </label>
                  <p className="pl-1">atau tangkap foto</p>
                </div>
                <p className="text-xs text-gray-500 mt-1">PNG, JPG, GIF up to 10MB</p>
              </div>
            )}
          </div>
        </section>

        {/* AI Generator Button */}
        <section className="flex flex-col items-center pt-6 border-t no-print">
          <button
            onClick={handleGenerateSummary}
            disabled={isGenerating}
            className={`flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold rounded-full shadow-lg hover:shadow-xl transform transition-all active:scale-95 ${isGenerating ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105'}`}
          >
            {isGenerating ? (
              <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            )}
            {isGenerating ? 'Menjana Ringkasan...' : 'Jana Ringkasan AI (Antigravity)'}
          </button>
          
          {aiSummary && (
            <div className="mt-6 w-full p-5 bg-indigo-50 border border-indigo-200 rounded-xl animate-fade-in">
              <h4 className="font-bold text-indigo-800 mb-2 flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
                Ringkasan Tugas Automatik
              </h4>
              <p className="text-gray-800 whitespace-pre-wrap leading-relaxed">{aiSummary}</p>
            </div>
          )}
        </section>

        {/* Verification Section */}
        <section className="pt-8 grid grid-cols-1 md:grid-cols-2 gap-8 text-center border-t border-gray-100">
          <div className="space-y-12">
            <p className="text-sm text-gray-500 uppercase tracking-widest font-semibold">Disediakan Oleh</p>
            <div className="pt-4">
               <p className="font-bold border-b-2 border-gray-200 inline-block px-8 pb-2">{state.preparedBy}</p>
               <p className="text-xs text-gray-400 mt-1">Pembantu Pengurusan Murid</p>
            </div>
          </div>
          <div className="space-y-4">
            <p className="text-sm text-gray-500 uppercase tracking-widest font-semibold">Disemak Oleh</p>
            <div className="space-y-2 no-print">
              <label className="block text-xs font-medium text-gray-500">Maklum Balas:</label>
              <textarea 
                className="w-full p-3 bg-white border border-gray-300 rounded-lg h-24 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Guru Penyelamat / Pentadbir..."
                value={state.reviewedBy}
                onChange={(e) => setState(prev => ({ ...prev, reviewedBy: e.target.value }))}
              />
            </div>
            <div className="pt-4">
               <p className="font-bold border-b-2 border-gray-200 inline-block px-8 pb-2 min-w-[200px] h-10"></p>
               <p className="text-xs text-gray-400 mt-1">Cop & Tandatangan Rasmi</p>
            </div>
          </div>
        </section>

        {/* Final Actions */}
        <footer className="flex justify-center gap-4 pt-8 no-print">
          <button 
            onClick={() => window.print()}
            className="flex items-center gap-2 px-8 py-3 bg-gray-800 text-white font-bold rounded-lg hover:bg-gray-700 transition-colors shadow-md"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M5 4v3H4a2 2 0 00-2 2v3a2 2 0 002 2h1v2a2 2 0 002 2h6a2 2 0 002-2v-2h1a2 2 0 002-2V9a2 2 0 00-2-2h-1V4a2 2 0 00-2-2H7a2 2 0 00-2 2zm8 0H7v3h6V4zm0 8H7v4h6v-4z" clipRule="evenodd" />
            </svg>
            Cetak Laporan (PDF)
          </button>
        </footer>
      </div>
      
      <p className="text-center text-gray-400 text-xs mt-8 no-print">
        Dibangunkan dengan ❤️ menggunakan GitHub & Google AI untuk SMK DPHA Gapor.
      </p>
    </div>
  );
};

export default App;

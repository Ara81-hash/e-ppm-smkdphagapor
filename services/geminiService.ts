
import { GoogleGenAI } from "@google/genai";
import { AppState } from "../types";

export const generateTaskSummary = async (state: AppState): Promise<string> => {
  // Fix: Initializing GoogleGenAI with the correct named parameter and directly using process.env.API_KEY as per guidelines
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const checkedTasks = Object.values(state.categories)
    .flatMap(cat => cat.tasks)
    .filter(t => t.checked)
    .map(t => t.label)
    .join(", ");

  const prompt = `
    Bertindak sebagai Pembantu Pengurusan Murid (PPM) profesional di SMK DPHA Gapor.
    Tuliskan laporan ringkasan harian berdasarkan data berikut:
    
    Nama PPM: ${state.preparedBy}
    Minggu: ${state.week}
    Hari: ${state.day}
    Waktu Bertugas: ${state.timeSlot}
    Tugas yang dilakukan: ${checkedTasks}
    Tugas Umum: ${state.generalTasks}
    Catatan Tambahan: ${state.notes}
    
    Sila hasilkan laporan yang kemas, profesional dalam Bahasa Melayu. Jangan gunakan format JSON.
  `;

  try {
    // Fix: Using the recommended model for text generation and accessing the .text property directly (not as a method)
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
    });
    return response.text || "Gagal menjana ringkasan.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Maaf, sistem AI sedang sibuk. Sila cuba sebentar lagi.";
  }
};

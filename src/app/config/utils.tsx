// src/config/utils.ts

/**
 * Backenddan kelgan ichma-ich (nested) JSON struktura va joriy terminal yo'liga (path) qarab
 * Tab bosilganda avto-to'ldirish (auto-complete) uchun variantlar ro'yxatini qaytaradi.
 */
export const getSuggestionsFromStructure = (structureObj: any, currentPath: string): string[] => {
  if (!structureObj || typeof structureObj !== 'object') return [];

  // 1. Agar joriy yo'l bosh katalog "~" yoki "/" bo'lsa, obyektning eng birinchi qatlamidagi kalitlarni qaytaramiz
  if (currentPath === '~' || currentPath === '/') {
    return Object.keys(structureObj).map(k => k.replace('/', ''));
  }

  // 2. Yo'lakni tozalaymiz (masalan: "~/task_36_papkasi/project/backend" -> "project/backend")
  // Bu muntazam ifoda (regex) "task_36_papkasi" kabi dinamik sandbox root papkalarini olib tashlaydi
  const cleanPath = currentPath.replace(/^~?\/?task_\d+_[a-zA-Z0-9_.]+\/?/, '').replace(/^~?\/?/, '');
  
  // Agar root papkadan tozalangandan keyin yo'l bo'sh bo'lib qolsa, yana eng yuqori qatlamni beramiz
  if (!cleanPath) {
    return Object.keys(structureObj).map(k => k.replace('/', ''));
  }

  // 3. Yo'lni massivga ajratamiz: "project/backend" -> ["project", "backend"]
  const parts = cleanPath.split('/').filter(Boolean);
  let currentLevel = structureObj;

  // 4. Obyekt iyerarxiyasi bo'ylab qadam-baqadam ichkariga kiramiz
  for (const part of parts) {
    // Kalitlarni project/ (papkalar uchun) yoki project (fayllar uchun) formatida qidiramiz
    const exactKey = Object.keys(currentLevel).find(k => k.replace('/', '') === part);
    
    if (exactKey && currentLevel[exactKey]) {
      currentLevel = currentLevel[exactKey];
    } else {
      // Agar yo'l noto'g'ri bo'lsa yoki bunday papka obyekt ichida topilmasa
      return [];
    }
  }

  // 5. Agar topilgan yakuniy nuqta obyekt bo'lsa (ya'ni ichida yana fayllari bor papka bo'lsa)
  if (typeof currentLevel === 'object' && currentLevel !== null) {
    return Object.keys(currentLevel).map(k => k.replace('/', ''));
  }

  return [];
};
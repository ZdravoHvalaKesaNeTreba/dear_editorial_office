export function EditIcon() {
  return (
    <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Документ */}
      <rect x="6" y="4" width="16" height="24" rx="2" fill="currentColor"/>
      
      {/* Загнутый уголок */}
      <path d="M22 4 L22 8 L18 8 L22 4Z" fill="white" opacity="0.3"/>
      
      {/* Строки текста */}
      <line x1="9" y1="10" x2="16" y2="10" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
      <line x1="9" y1="14" x2="19" y2="14" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
      <line x1="9" y1="18" x2="16" y2="18" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
      
      {/* Стрелка влево */}
      <path d="M2 16 L8 12 L8 15 L12 15 L12 17 L8 17 L8 20 Z" fill="currentColor"/>
      
      {/* Стрелка вправо */}
      <path d="M30 16 L24 20 L24 17 L20 17 L20 15 L24 15 L24 12 Z" fill="currentColor"/>
    </svg>
  );
}

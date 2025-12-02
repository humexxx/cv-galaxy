interface MessageContentProps {
  content: string;
}

const HIGHLIGHT_WORDS = [
  // English
  "amazing", "excellent", "outstanding", "exceptional", "impressive",
  "remarkable", "fantastic", "wonderful", "incredible", "brilliant",
  "superb", "magnificent", "phenomenal", "extraordinary", "spectacular",
  // Spanish
  "asombroso", "excelente", "excepcional", "impresionante", "notable",
  "fantástico", "maravilloso", "increíble", "brillante", "magnífico",
  "fenomenal", "extraordinario", "espectacular", "sobresaliente",
];

export function MessageContent({ content }: MessageContentProps) {
  const parts: React.ReactNode[] = [];
  let lastIndex = 0;
  const backtickRegex = /`([^`]+)`/g;
  let match;
  let key = 0;

  while ((match = backtickRegex.exec(content)) !== null) {
    if (match.index > lastIndex) {
      const textBefore = content.slice(lastIndex, match.index);
      parts.push(highlightWords(textBefore, key));
      key += 100;
    }

    parts.push(
      <span key={key++} className="italic font-medium text-primary">
        {match[1]}
      </span>
    );

    lastIndex = match.index + match[0].length;
  }

  if (lastIndex < content.length) {
    const textAfter = content.slice(lastIndex);
    parts.push(highlightWords(textAfter, key));
  }

  return (
    <p className="text-sm whitespace-pre-wrap leading-relaxed">
      {parts.length > 0 ? parts : content}
    </p>
  );
}

function highlightWords(text: string, startKey: number): React.ReactNode[] {
  const parts: React.ReactNode[] = [];
  const words = text.split(/(\s+)/);
  let key = startKey;

  words.forEach((word) => {
    const cleanWord = word.toLowerCase().replace(/[.,!?;:]/g, "");
    
    if (HIGHLIGHT_WORDS.includes(cleanWord)) {
      parts.push(
        <span
          key={key++}
          className="inline-block font-semibold text-primary animate-pulse animation-duration-[2s] bg-linear-to-r from-yellow-300/50 via-green-300/50 to-blue-300/50 dark:from-yellow-400/40 dark:via-green-400/40 dark:to-blue-400/40 px-1 rounded"
        >
          {word}
        </span>
      );
    } else {
      parts.push(word);
    }
  });

  return parts;
}

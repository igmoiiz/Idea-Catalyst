// Utility to format Gemini AI responses (markdown) into readable React elements
export const formatAIResponse = (text: string) => {
    if (!text) return text;

    let formatted = text;

    // Convert **bold** to <strong>
    formatted = formatted.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');

    // Convert *italic* to <em>
    formatted = formatted.replace(/\*([^*]+?)\*/g, '<em>$1</em>');

    // Convert bullet points (* item or - item) to proper bullets
    formatted = formatted.replace(/^[\*\-]\s+(.+)$/gm, '• $1');

    // Convert numbered lists (1. item)
    formatted = formatted.replace(/^(\d+)\.\s+(.+)$/gm, '$1. $2');

    // Add spacing between paragraphs (double line breaks)
    formatted = formatted.replace(/\n\n/g, '\n\n');

    return formatted;
};

// Parse markdown-like text and return JSX elements
export const parseMarkdownToJSX = (text: string): JSX.Element[] => {
    if (!text) return [];

    const lines = text.split('\n');
    const elements: JSX.Element[] = [];
    let currentParagraph: string[] = [];
    let key = 0;

    const flushParagraph = () => {
        if (currentParagraph.length > 0) {
            const content = currentParagraph.join(' ');
            elements.push(
                <p key={`p-${key++}`} className="mb-4 last:mb-0">
                    {parseInlineMarkdown(content)}
                </p>
            );
            currentParagraph = [];
        }
    };

    lines.forEach((line) => {
        const trimmed = line.trim();

        // Empty line - flush paragraph
        if (!trimmed) {
            flushParagraph();
            return;
        }

        // Bullet point
        if (trimmed.match(/^[\*\-]\s+/)) {
            flushParagraph();
            const content = trimmed.replace(/^[\*\-]\s+/, '');
            elements.push(
                <li key={`li-${key++}`} className="ml-4 mb-2 flex items-start">
                    <span className="text-[#FFBA00] mr-2 flex-shrink-0">•</span>
                    <span>{parseInlineMarkdown(content)}</span>
                </li>
            );
            return;
        }

        // Numbered list
        if (trimmed.match(/^\d+\.\s+/)) {
            flushParagraph();
            const content = trimmed;
            elements.push(
                <li key={`num-${key++}`} className="ml-4 mb-2">
                    {parseInlineMarkdown(content)}
                </li>
            );
            return;
        }

        // Heading (## or ###)
        if (trimmed.startsWith('##')) {
            flushParagraph();
            const content = trimmed.replace(/^#+\s*/, '');
            elements.push(
                <h3 key={`h-${key++}`} className="font-bold text-[#FFBA00] mt-4 mb-2 first:mt-0">
                    {parseInlineMarkdown(content)}
                </h3>
            );
            return;
        }

        // Regular line - add to current paragraph
        currentParagraph.push(trimmed);
    });

    // Flush any remaining paragraph
    flushParagraph();

    return elements;
};

// Parse inline markdown (bold, italic) within text
const parseInlineMarkdown = (text: string): (string | JSX.Element)[] => {
    const parts: (string | JSX.Element)[] = [];
    let key = 0;
    let remaining = text;

    // Process **bold**
    let match;
    const boldRegex = /\*\*(.+?)\*\*/g;
    let lastIndex = 0;

    while ((match = boldRegex.exec(text)) !== null) {
        // Add text before match
        if (match.index > lastIndex) {
            parts.push(text.substring(lastIndex, match.index));
        }
        // Add bold element
        parts.push(
            <strong key={`b-${key++}`} className="font-bold text-white">
                {match[1]}
            </strong>
        );
        lastIndex = match.index + match[0].length;
    }

    // Add remaining text
    if (lastIndex < text.length) {
        remaining = text.substring(lastIndex);
    } else {
        return parts;
    }

    // Process *italic* on the remaining text
    const italicRegex = /\*([^*]+?)\*/g;
    lastIndex = 0;
    const tempParts: (string | JSX.Element)[] = [];

    while ((match = italicRegex.exec(remaining)) !== null) {
        if (match.index > lastIndex) {
            tempParts.push(remaining.substring(lastIndex, match.index));
        }
        tempParts.push(
            <em key={`i-${key++}`} className="italic text-white/90">
                {match[1]}
            </em>
        );
        lastIndex = match.index + match[0].length;
    }

    if (lastIndex < remaining.length) {
        tempParts.push(remaining.substring(lastIndex));
    }

    return parts.length > 0 ? [...parts, ...tempParts] : tempParts.length > 0 ? tempParts : [text];
};

export interface ClipboardItem {
    id: string;
    content: string;
    createdAt: string;
    updatedAt: string;
    favorite: boolean;
    usageCount: number;
    isTextHidden?: boolean;
    source?: 'button' | 'mouse';
    isCopied?: boolean;
  }
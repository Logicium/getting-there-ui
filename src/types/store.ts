// Store/Book-related TypeScript interfaces

export interface CartItem {
  id: string;
  bookId: string;
  title: string;
  format: string;
  price: number;
  imageUrl?: string;
  documentId?: string;
  pdfUrl?: string;
}

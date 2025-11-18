// API Types
export interface GenerateVideoRequest {
  facePath: string;
  templateId: string;
  userId: string;
  watermark?: boolean;
}

export interface GenerateVideoResponse {
  videoUrl: string;
  resultId: string;
  templateId: string;
}

export interface ApiError {
  error: string;
  details?: string;
  status?: number;
}

// Template Types
export interface Template {
  id: string;
  title: string;
  thumbnail: string;
  description?: string;
  category?: string;
}

// User Types
export interface VideoResult {
  id: string;
  userId: string;
  templateId: string;
  videoUrl: string;
  createdAt: string;
  isPaid: boolean;
}

// Stripe Types
export interface CheckoutSession {
  priceId: string;
  mode: "payment" | "subscription";
  successUrl: string;
  cancelUrl: string;
}

export interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice?: number; // For discounted price display
  description: string;
  longDescription: string;
  category: string;
  images: string[];
  isCustomizable: boolean;
  features: string[];
}

export interface CartItem extends Product {
  cartItemId: string; // Unique ID for the item in cart (to handle duplicates)
  quantity: number;
  customizationFile?: File | null; // For the checkout upload process
  customizationFileUrl?: string; // S3 URL after upload
}

export interface UserDetails {
  email: string;
  firstName: string;
  lastName: string;
  address: string;
  city: string;
  zip: string;
  country: string;
}

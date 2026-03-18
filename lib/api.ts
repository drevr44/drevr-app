import axios from "axios";

// قراءة عنوان السيرفر من ملف .env
const API_BASE = process.env.EXPO_PUBLIC_API_URL;

const api = axios.create({
  baseURL: API_BASE,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000,
});

// Log requests (للتصحيح أثناء التطوير)
api.interceptors.request.use((config) => {
  console.log("API REQUEST:", config.method?.toUpperCase(), config.url, config.data);
  return config;
});

// Log responses + errors
api.interceptors.response.use(
  (response) => {
    console.log("API RESPONSE:", response.config.url, response.data);
    return response;
  },
  (error) => {
    console.log("API ERROR:", error.response?.data || error.message);
    return Promise.reject(error);
  }
);

// Types

export interface Booking {
  id: string;
  pickupLocation: string;
  dropoffLocation: string;
  tripType: "ONE_WAY" | "ROUND_TRIP";
  carType: "ECONOMY" | "COMFORT" | "PREMIUM";
  status: "PENDING" | "CONFIRMED" | "ACTIVE" | "COMPLETED" | "CANCELLED";
  createdAt: string;
}

export interface Offer {
  id: string;
  driverId: string;
  price: number;
  createdAt: string;
}

export interface DriverChangeRequest {
  id: string;
  bookingId: string;
  reason: string;
  status: "PENDING" | "APPROVED" | "REJECTED";
  createdAt: string;
}

export interface BookingDetails {
  booking: Booking;
  offers: Offer[];
  offersClosed: boolean;
  selectedOffer: Offer | null;
  driverChangeHistory: DriverChangeRequest[];
}

// API Functions

export const createBooking = async (data: {
  pickupLocation: string;
  dropoffLocation: string;
  tripType: "ONE_WAY" | "ROUND_TRIP";
  carType: "ECONOMY" | "COMFORT" | "PREMIUM";
}): Promise<Booking> => {
  const response = await api.post("/bookings", data);
  return response.data;
};

export const getBookingDetails = async (
  bookingId: string
): Promise<BookingDetails> => {
  const response = await api.get(`/bookings/${bookingId}`);
  return response.data;
};

export const selectOffer = async (
  bookingId: string,
  offerId: string
): Promise<void> => {
  await api.post(`/bookings/${bookingId}/select-offer/${offerId}`);
};

export const requestDriverChange = async (
  bookingId: string,
  reason: string
): Promise<void> => {
  await api.post(`/bookings/${bookingId}/driver-change`, { reason });
};

export const submitOffer = async (
  bookingId: string,
  driverId: string,
  price: number
): Promise<void> => {
  await api.post(`/bookings/${bookingId}/offers`, { driverId, price });
};

export default api;
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL;

// Create axios instance with default config
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const gameService = {
  // Get all games
  async getAllGames(search = '') {
    const params = search ? { search } : {};
    const response = await apiClient.get('/games', { params });
    return response.data;
  },

  // Get hot deals
  async getHotDeals() {
    const response = await apiClient.get('/games/hot-deals');
    return response.data;
  },

  // Get single game by ID
  async getGameById(id) {
    const response = await apiClient.get(`/games/${id}`);
    return response.data;
  },

  // Create new game
  async createGame(game) {
    const response = await apiClient.post('/games', game);
    return response.data;
  },

  // Update game
  async updateGame(id, game) {
    const response = await apiClient.put(`/games/${id}`, game);
    return response.data;
  },

  // Delete game
  async deleteGame(id) {
    const response = await apiClient.delete(`/games/${id}`);
    return response.data;
  },
};

export const categoryService = {
  // Get all categories
  async getAllCategories() {
    const response = await apiClient.get('/categories');
    return response.data;
  },
};

export const platformService = {
  // Get all platforms
  async getAllPlatforms() {
    const response = await apiClient.get('/platforms');
    return response.data;
  },

  // Get single platform by ID
  async getPlatformById(id) {
    const response = await apiClient.get(`/platforms/${id}`);
    return response.data;
  },
};

export const reviewService = {
  // Get all reviews or filter by game
  async getAllReviews(gameId = null) {
    const params = gameId ? { gameId } : {};
    const response = await apiClient.get('/reviews', { params });
    return response.data;
  },

  // Get single review by ID
  async getReviewById(id) {
    const response = await apiClient.get(`/reviews/${id}`);
    return response.data;
  },

  // Create new review
  async createReview(review) {
    const response = await apiClient.post('/reviews', review);
    return response.data;
  },

  // Update review
  async updateReview(id, review) {
    const response = await apiClient.put(`/reviews/${id}`, review);
    return response.data;
  },

  // Delete review
  async deleteReview(id) {
    const response = await apiClient.delete(`/reviews/${id}`);
    return response.data;
  },
};

export const orderService = {
  // Get all orders or filter by user
  async getAllOrders(userId = null) {
    const params = userId ? { userId } : {};
    const response = await apiClient.get('/orders', { params });
    return response.data;
  },

  // Get single order by ID
  async getOrderById(id) {
    const response = await apiClient.get(`/orders/${id}`);
    return response.data;
  },

  // Create new order
  async createOrder(orderData) {
    const response = await apiClient.post('/orders', orderData);
    return response.data;
  },

  // Update order
  async updateOrder(id, order) {
    const response = await apiClient.put(`/orders/${id}`, order);
    return response.data;
  },
};

export default apiClient;

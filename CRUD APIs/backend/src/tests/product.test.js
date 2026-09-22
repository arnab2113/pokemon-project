const request = require('supertest');
const app = require('../app');

describe('Product API Endpoints', () => {
  let user1Token, user2Token, createdProductId;

  const sampleProduct = {
    name: 'Wireless Gaming Mouse',
    description: 'Ergonomic high precision RGB gaming mouse',
    price: 49.99,
    stock: 15,
    category: 'Electronics',
    image: 'https://example.com/mouse.jpg',
  };

  beforeEach(async () => {
    // Register & login User 1
    await request(app).post('/api/auth/register').send({
      name: 'User One',
      email: 'user1@example.com',
      password: 'Password123!',
      confirmPassword: 'Password123!',
    });
    const login1 = await request(app).post('/api/auth/login').send({
      email: 'user1@example.com',
      password: 'Password123!',
    });
    user1Token = login1.body.data.accessToken;

    // Register & login User 2
    await request(app).post('/api/auth/register').send({
      name: 'User Two',
      email: 'user2@example.com',
      password: 'Password123!',
      confirmPassword: 'Password123!',
    });
    const login2 = await request(app).post('/api/auth/login').send({
      email: 'user2@example.com',
      password: 'Password123!',
    });
    user2Token = login2.body.data.accessToken;
  });

  describe('POST /api/products', () => {
    it('should reject unauthenticated request with 401', async () => {
      const res = await request(app).post('/api/products').send(sampleProduct);
      expect(res.status).toBe(401);
    });

    it('should create product when authenticated', async () => {
      const res = await request(app)
        .post('/api/products')
        .set('Authorization', `Bearer ${user1Token}`)
        .send(sampleProduct);

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data.product.name).toBe(sampleProduct.name);
      expect(res.body.data.product.createdBy.name).toBe('User One');

      createdProductId = res.body.data.product.id;
    });

    it('should return 400 validation error when price is negative', async () => {
      const res = await request(app)
        .post('/api/products')
        .set('Authorization', `Bearer ${user1Token}`)
        .send({ ...sampleProduct, price: -10 });

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.errors).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ field: 'price' }),
        ])
      );
    });
  });

  describe('GET /api/products', () => {
    it('should retrieve list of products with pagination metadata', async () => {
      await request(app)
        .post('/api/products')
        .set('Authorization', `Bearer ${user1Token}`)
        .send(sampleProduct);

      const res = await request(app).get('/api/products?page=1&limit=5');

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(Array.isArray(res.body.data.products)).toBe(true);
      expect(res.body.data.pagination).toBeDefined();
      expect(res.body.data.pagination.page).toBe(1);
    });
  });

  describe('GET /api/products/:id', () => {
    it('should return 400 for malformed MongoDB ObjectId', async () => {
      const res = await request(app).get('/api/products/invalid-id-123');
      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
    });

    it('should return 404 for valid ObjectId that does not exist', async () => {
      const res = await request(app).get('/api/products/507f1f77bcf86cd799439011');
      expect(res.status).toBe(404);
    });
  });

  describe('PUT & DELETE Authorization checks', () => {
    it('should allow owner to update product', async () => {
      const createRes = await request(app)
        .post('/api/products')
        .set('Authorization', `Bearer ${user1Token}`)
        .send(sampleProduct);

      const prodId = createRes.body.data.product.id;

      const updateRes = await request(app)
        .put(`/api/products/${prodId}`)
        .set('Authorization', `Bearer ${user1Token}`)
        .send({ price: 39.99 });

      expect(updateRes.status).toBe(200);
      expect(updateRes.body.data.product.price).toBe(39.99);
    });

    it('should return 403 Forbidden when a different user attempts to update product', async () => {
      const createRes = await request(app)
        .post('/api/products')
        .set('Authorization', `Bearer ${user1Token}`)
        .send(sampleProduct);

      const prodId = createRes.body.data.product.id;

      const updateRes = await request(app)
        .put(`/api/products/${prodId}`)
        .set('Authorization', `Bearer ${user2Token}`)
        .send({ price: 1.00 });

      expect(updateRes.status).toBe(403);
      expect(updateRes.body.success).toBe(false);
    });

    it('should return 403 Forbidden when a different user attempts to delete product', async () => {
      const createRes = await request(app)
        .post('/api/products')
        .set('Authorization', `Bearer ${user1Token}`)
        .send(sampleProduct);

      const prodId = createRes.body.data.product.id;

      const deleteRes = await request(app)
        .delete(`/api/products/${prodId}`)
        .set('Authorization', `Bearer ${user2Token}`);

      expect(deleteRes.status).toBe(403);
    });

    it('should allow owner to delete product', async () => {
      const createRes = await request(app)
        .post('/api/products')
        .set('Authorization', `Bearer ${user1Token}`)
        .send(sampleProduct);

      const prodId = createRes.body.data.product.id;

      const deleteRes = await request(app)
        .delete(`/api/products/${prodId}`)
        .set('Authorization', `Bearer ${user1Token}`);

      expect(deleteRes.status).toBe(200);
    });
  });
});

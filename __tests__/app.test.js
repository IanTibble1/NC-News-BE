const app = require("../app");
const db = require("../db/connection");
const request = require("supertest");
const seed = require("../db/seeds/seed");
const data = require("../db/data/test-data");
const apiList = require("../endpoints.json");

afterAll(() => {
  return db.end();
});

beforeAll(() => {
  return seed(data);
});

describe("app()", () => {
  describe("/api/topics", () => {
    test("GET 200: /api/topics returns a 200 status ", () => {
      return request(app).get("/api/topics").expect(200);
    });

    test("GET 200: /api/topics should return an array of topic objects which has the slug and description properties ", () => {
      return request(app)
        .get("/api/topics")
        .expect(200)
        .then((data) => {
          const { body } = data;
          const topics = body.topics;
          topics.forEach((topic) => {
            expect(topic).toHaveProperty("description", expect.any(String));
            expect(topic).toHaveProperty("slug", expect.any(String));
          });
          expect(topics).toHaveLength(3);
        });
    });

    test("GET 404: /api/topics returns a 404 message when there is an error in the request ", () => {
      return request(app)
        .get("/api/topicsa")
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).toBe("page not found");
        });
    });
  });

  describe("/api/", () => {
    test("GET 200: /api/ should return a 200 status", () => {
      return request(app).get("/api/").expect(200);
    });

    test("GET 200: /api/ should return an object describing all available endpoints of api", () => {
      return request(app)
        .get("/api/")
        .expect(200)
        .then(({ body }) => {
          expect(body).toEqual(apiList);
        });
    });

    test("GET 404: /api/ should return a 404 message when there is an error in the request ", () => {
      return request(app)
        .get("/apio/")
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).toBe("page not found");
        });
    });
  });
  describe("/api/articles/:article_id", () => {
    test("GET 200: /api/articles/:article_id returns a 200 status ", () => {
      return request(app).get("/api/articles/1").expect(200);
    });

    test("GET 200: /api/articles/:article_id should return an article object with all required properties ", () => {
      return request(app)
        .get("/api/articles/1")
        .expect(200)
        .then((data) => {
          const { body } = data;
          const article = body.articles;
          console.log(data);
          expect(article).toHaveProperty("author", expect.any(String));
          expect(article).toHaveProperty("title", expect.any(String));
          expect(article).toHaveProperty("article_id", expect.any(Number));
          expect(article).toHaveProperty("body", expect.any(String));
          expect(article).toHaveProperty("topic", expect.any(String));
          expect(article).toHaveProperty("created_at", expect.any(String));
          expect(article).toHaveProperty("votes", expect.any(Number));
          expect(article).toHaveProperty("article_img_url", expect.any(String));
        });
    });
  });
});

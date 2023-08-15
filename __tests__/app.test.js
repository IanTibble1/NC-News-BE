const app = require("../app");
const db = require("../db/connection");
const request = require("supertest");
const seed = require("../db/seeds/seed");
const data = require("../db/data/test-data");
const apiList = require("../endpoints.json");
const articles = require("../db/data/test-data/articles");

afterAll(() => {
  return db.end();
});

beforeAll(() => {
  return seed(data);
});

describe("app()", () => {
  describe("ALL if endpoint does not exist", () => {
    test("404: should return a 404 status with the message, not found if endpoint does not exist ", () => {
      return request(app)
        .get("/api/doesnt-exist")
        .expect(404)
        .then(({ body }) => {
          const { msg } = body;
          expect(msg).toBe("No path found");
        });
    });
  });
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
          expect(article).toMatchObject({
            article_id: 1,
            title: "Living in the shadow of a great man",
            topic: "mitch",
            author: "butter_bridge",
            body: "I find this existence challenging",
            created_at: "2020-07-09T20:11:00.000Z",
            votes: 100,
            article_img_url:
              "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
          });
        });
    });

    test("GET 404: /api/articles/:article_id should return a 404 message when there is not a matching request ", () => {
      return request(app)
        .get("/api/articles/999")
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).toBe("Not found");
        });
    });

    test("GET 400: /api/articles/:article_id should return a 400 message if bad request made  ", () => {
      return request(app)
        .get("/api/articles/hello")
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe("bad request");
        });
    });
  });

  describe("/api/articles", () => {
    test("GET 200: /api/articles should return a 200 status ", () => {
      return request(app).get("/api/articles").expect(200);
    });

    test("GET 200: /api/articles should return all articles as an object with appropriate properties ", () => {
      return request(app)
        .get("/api/articles")
        .then((data) => {
          const { body } = data;
          const articles = body.articles.rows;
          expect(articles[0]).toMatchObject({
            author: "icellusedkars",
            title: "Eight pug gifs that remind me of mitch",
            article_id: 3,
            topic: "mitch",
            created_at: "2020-11-03T09:12:00.000Z",
            votes: 0,
            article_img_url:
              "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
            comment_count: 2,
          });
        });
    });

    test("GET 200: /api/articles should be sorted in descending order by date ", () => {
      return request(app)
        .get("/api/articles")
        .then((data) => {
          const { body } = data;
          const articles = body.articles.rows;
          expect(articles).toBeSortedBy("created_at", { descending: true });
        });
    });
  });

  describe("/api/articles/:article_id/comments", () => {
    test("GET 200: /api/articles/:article_id/comments returns a 200 status", () => {
      return request(app).get("/api/articles/1/comments").expect(200);
    });

    test("GET 200: /api/articles/:article_id/comments should be sorted return an array of comments for the given id ", () => {
      return request(app)
        .get("/api/articles/6/comments")
        .then((data) => {
          const { body } = data;
          const comments = body.comments.rows;
          console.log(comments);
          expect(comments).toMatchObject([
            {
              comment_id: 16,
              votes: 1,
              created_at: "2020-10-11T15:23:00.000Z",
              author: "butter_bridge",
              body: "This is a bad article name",
              article_id: 6,
            },
          ]);
        });
    });
  });
});

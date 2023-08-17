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
          expect(body.msg).toBe("article_id 999 does not exist");
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

    test("GET 200: /api/articles/:article_id/comments should return an empty array if article is valid but has no comments", () => {
      return request(app)
        .get("/api/articles/2/comments")
        .then((data) => {
          const { body } = data;
          const comments = body.comments.rows;
          expect(comments).toEqual([]);
        });
    });
    test("GET 404: /api/articles/:article_id/comments should return a 404 message when there is not a matching request ", () => {
      return request(app)
        .get("/api/articles/999/comments")
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).toBe("article_id 999 does not exist");
        });
    });

    test("GET 400: /api/articles/:article_id should return a 400 message if bad request made  ", () => {
      return request(app)
        .get("/api/articles/hello/comments")
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe("bad request");
        });
    });
  });

  describe("POST /api/articles/:article_id/comments", () => {
    test("POST 201: /api/articles/:article_id/comments should return a 201 status code", () => {
      const newComment = {
        username: "butter_bridge",
        body: "I love this article",
      };
      return request(app)
        .post("/api/articles/3/comments")
        .send(newComment)
        .expect(201)
        .then((data) => {
          const { body } = data;
          const comment = body.comments;
          expect(comment).toMatchObject({
            comment_id: 19,
            body: "I love this article",
            article_id: 3,
            author: "butter_bridge",
            votes: 0,
            created_at: expect.any(String),
          });
        });
    });

    test("POST 201: /api/articles/:article_id/comments should return a 201 status code with additional request properties ignored", () => {
      const newComment = {
        username: "butter_bridge",
        body: "I love this article",
        extraProperty: "to be ignored",
      };
      return request(app)
        .post("/api/articles/3/comments")
        .send(newComment)
        .expect(201)
        .then((data) => {
          const { body } = data;
          const comment = body.comments;
          expect(comment).toMatchObject({
            comment_id: 20,
            body: "I love this article",
            article_id: 3,
            author: "butter_bridge",
            votes: 0,
            created_at: expect.any(String),
          });
          expect(comment).not.toHaveProperty("extraProperty");
        });
    });

    test("POST 400: /api/articles/:article_id/comments should return a 400 status code 'missing required field' if missing required fields", () => {
      const newComment = {
        body: "I love this article",
      };
      return request(app)
        .post("/api/articles/3/comments")
        .send(newComment)
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe("missing required field");
        });
    });

    test("POST 400: /api/articles/:article_id/comments should return a 400 'bad request' if id wrong datatype", () => {
      const newComment = {
        username: "butter_bridge",
        body: "I love this article",
      };
      return request(app)
        .post("/api/articles/hello/comments")
        .send(newComment)
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe("bad request");
        });
    });

    test("POST 404: /api/articles/:article_id/comments should return a 404 'Not found' if username does not exist", () => {
      const newComment = {
        username: "doesnt_exist",
        body: "I love this article",
      };
      return request(app)
        .post("/api/articles/1/comments")
        .send(newComment)
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).toBe("username doesnt_exist does not exist");
        });
    });

    test("POST 404: /api/articles/:article_id/comments should return a 404 'Not found' if no matching id", () => {
      const newComment = {
        username: "butter_bridge",
        body: "I love this article",
      };
      return request(app)
        .post("/api/articles/999/comments")
        .send(newComment)
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).toBe("article_id 999 does not exist");
        });
    });
  });

  describe("PATCH /api/articles/:article_id", () => {
    test("PATCH 200: /api/articles/:article_id should increase the vote count of an article via its article_id", () => {
      const changeVotes = { inc_vote: 1 };
      return request(app)
        .patch("/api/articles/1")
        .expect(200)
        .send(changeVotes)
        .then((data) => {
          const { body } = data;
          const article = body.updatedArticle;
          expect(article).toEqual({
            article_id: 1,
            title: "Living in the shadow of a great man",
            topic: "mitch",
            author: "butter_bridge",
            body: "I find this existence challenging",
            created_at: "2020-07-09T20:11:00.000Z",
            votes: 101,
            article_img_url:
              "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
          });
        });
    });

    test("PATCH 200: /api/articles/:article_id should reduce the vote count if negative number used", () => {
      const changeVotes = { inc_vote: -10 };
      return request(app)
        .patch("/api/articles/1")
        .expect(200)
        .send(changeVotes)
        .then((data) => {
          const { body } = data;
          const article = body.updatedArticle;
          expect(article).toEqual({
            article_id: 1,
            title: "Living in the shadow of a great man",
            topic: "mitch",
            author: "butter_bridge",
            body: "I find this existence challenging",
            created_at: "2020-07-09T20:11:00.000Z",
            votes: 91,
            article_img_url:
              "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
          });
        });
    });

    test("PATCH 200: /api/articles/:article_id should not reduce the vote count below 0", () => {
      const changeVotes = { inc_vote: -200 };
      return request(app)
        .patch("/api/articles/1")
        .expect(200)
        .send(changeVotes)
        .then((data) => {
          const { body } = data;
          const article = body.updatedArticle;
          expect(article).toEqual({
            article_id: 1,
            title: "Living in the shadow of a great man",
            topic: "mitch",
            author: "butter_bridge",
            body: "I find this existence challenging",
            created_at: "2020-07-09T20:11:00.000Z",
            votes: 0,
            article_img_url:
              "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
          });
        });
    });

    test("PATCH 404: /api/articles/:article_id should return 404 not found if no matching article_id", () => {
      const changeVotes = { inc_vote: 1 };
      return request(app)
        .patch("/api/articles/999")
        .expect(404)
        .send(changeVotes)
        .then(({ body }) => {
          expect(body.msg).toBe("article_id 999 does not exist");
        });
    });

    test("PATCH 400: /api/articles/:article_id should return 400 required field missing if inc_vote missing", () => {
      return request(app)
        .patch("/api/articles/1")
        .expect(400)
        .send({})
        .then(({ body }) => {
          expect(body.msg).toBe("required field missing");
        });
    });

    test("PATCH 400: /api/articles/:article_id should return 400 votes should be a number if inc_vote value is not a number", () => {
      const changeVotes = { inc_vote: "1" };
      return request(app)
        .patch("/api/articles/1")
        .expect(400)
        .send(changeVotes)
        .then(({ body }) => {
          expect(body.msg).toBe("votes should be a number");
        });
    });
  });

  describe("DELETE /api/comments/:comment_id", () => {
    test("DELETE 204: /api/comments/:comment_id should return a 204 status and no content", () => {
      return request(app).delete("/api/comments/1").expect(204);
    });

    test("DELETE 404: /api/comments/:comment_id should return a 404 No comment with id exists if comment id does not exist", () => {
      return request(app)
        .delete("/api/comments/999")
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).toBe("no comment with id 999 exists");
        });
    });

    test("DELETE 400: /api/comments/:comment_id should return 404 bad request if id wrong datatype", () => {
      return request(app)
        .delete("/api/comments/hello")
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe("bad request");
        });
    });
  });

  describe("GET 200: /api/users should return 200", () => {
    test("GET 200: /api/users should return a 200 status and an array of user objects with the appropriate properties", () => {
      return request(app)
        .get("/api/users")
        .expect(200)
        .then((data) => {
          const { body } = data;
          const users = body.users.rows;
          expect(users[0]).toEqual({
            username: "butter_bridge",
            name: "jonny",
            avatar_url:
              "https://www.healthytherapies.com/wp-content/uploads/2016/06/Lime3.jpg",
          });
        });
    });
  });
});

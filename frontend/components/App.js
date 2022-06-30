import React, { useState, useEffect } from "react";
import { NavLink, Routes, Route, useNavigate } from "react-router-dom";
import axios from "axios";
import Articles from "./Articles";
import LoginForm from "./LoginForm";
import Message from "./Message";
import ArticleForm from "./ArticleForm";
import Spinner from "./Spinner";

const articlesUrl = "http://localhost:9000/api/articles";
const loginUrl = "http://localhost:9000/api/login";

const axiosWithAuth = () => {
  const token = localStorage.getItem("token");

  return axios.create({
    headers: {
      authorization: token,
    },
  });
};

export default function App() {
  const [message, setMessage] = useState("");
  const [articles, setArticles] = useState([]);
  const [currentArticleId, setCurrentArticleId] = useState();
  const [spinnerOn, setSpinnerOn] = useState(false);
  const [currentArticle, setCurrentArticle] = useState(null);

  useEffect(() => {
    setCurrentArticle(
      articles.filter((article) => {
        return article.article_id === currentArticleId;
      })[0]
    );
  }, [currentArticleId]);

  const navigate = useNavigate();

  const logout = () => {
    setMessage("Goodbye!");
    if (!!localStorage.getItem("token")) localStorage.removeItem("token");
    navigate("/");
  };

  const login = ({ username, password }) => {
    setMessage("");
    setSpinnerOn(true);
    axios
      .post("http://localhost:9000/api/login", { username, password })
      .then((res) => {
        setSpinnerOn(false);
        localStorage.setItem("token", res.data.token);
        setMessage(res.data.message);
        navigate("/articles");
      })
      .catch((err) => console.log(err));
  };

  const getArticles = () => {
    setSpinnerOn(true);
    axiosWithAuth()
      .get("http://localhost:9000/api/articles")
      .then((res) => {
        setSpinnerOn(false);
        setMessage(res.data.message);
        setArticles(res.data.articles);
      })
      .catch((err) => console.log(err));
  };

  const postArticle = (article) => {
    console.log(article);
    axiosWithAuth()
      .post("http://localhost:9000/api/articles", article)
      .then((res) => {
        setMessage(res.data.message);
        setArticles([...articles, res.data.article]);
      })
      .catch((err) => console.log(err));
  };

  const updateArticle = ({ article_id, article }) => {
    axiosWithAuth()
      .put(`http://localhost:9000/api/articles/${article_id}`, article)
      .then((res) => {
        setMessage(res.data.message);
        setArticles(
          articles.map((art) => {
            return art.article_id === res.data.article.article_id
              ? res.data.article
              : art;
          })
        );
      })
      .catch((err) => console.log(err));
  };

  const deleteArticle = (article_id) => {
    axiosWithAuth()
      .delete(`http://localhost:9000/api/articles/${article_id}`)
      .then((res) => {
        setMessage(res.data.message);
        setArticles(
          articles.filter((article) => {
            return article.article_id !== article_id;
          })
        );
      })
      .catch((err) => console.log(err));
  };

  console.log(currentArticle);
  return (
    <>
      <Spinner on={spinnerOn} />
      <Message message={message} />
      <button id="logout" onClick={logout}>
        Logout from app
      </button>
      <div id="wrapper" style={{ opacity: spinnerOn ? "0.25" : "1" }}>
        {" "}
        {/* <-- do not change this line */}
        <h1>Advanced Web Applications</h1>
        <nav>
          <NavLink id="loginScreen" to="/">
            Login
          </NavLink>
          <NavLink id="articlesScreen" to="/articles">
            Articles
          </NavLink>
        </nav>
        <Routes>
          <Route path="/" element={<LoginForm login={login} />} />
          <Route
            path="articles"
            element={
              <>
                <ArticleForm
                  postArticle={postArticle}
                  updateArticle={updateArticle}
                  setCurrentArticleId={setCurrentArticleId}
                  currentArticle={currentArticle}
                />
                <Articles
                  articles={articles}
                  getArticles={getArticles}
                  setMessage={setMessage}
                  deleteArticle={deleteArticle}
                  setCurrentArticleId={setCurrentArticleId}
                />
              </>
            }
          />
        </Routes>
        <footer>Bloom Institute of Technology 2022</footer>
      </div>
    </>
  );
}

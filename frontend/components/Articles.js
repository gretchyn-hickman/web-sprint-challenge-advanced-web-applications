import React, { useEffect, useState } from "react";
import axios from "axios";
import { Navigate } from "react-router-dom";
import PT from "prop-types";

export default function Articles(props) {
  const { articles, setCurrentArticleId, getArticles, deleteArticle } = props;

  useEffect(() => {
    getArticles();
  }, []);

  const handleEdit = (id) => {
    console.log(id);
    setCurrentArticleId(id);
  };

  if (!localStorage.getItem("token")) return <Navigate to="/" />;
  return (
    <div className="articles">
      <h2>Articles</h2>
      {!articles.length
        ? "No articles yet"
        : articles.map((art) => {
            return (
              <div className="article" key={art.article_id}>
                <div>
                  <h3>{art.title}</h3>
                  <p>{art.text}</p>
                  <p>Topic: {art.topic}</p>
                </div>
                <div>
                  <button onClick={() => handleEdit(art.article_id)}>
                    Edit
                  </button>
                  <button onClick={() => deleteArticle(art.article_id)}>
                    Delete
                  </button>
                </div>
              </div>
            );
          })}
    </div>
  );
}

Articles.propTypes = {
  articles: PT.arrayOf(
    PT.shape({
      article_id: PT.number.isRequired,
      title: PT.string.isRequired,
      text: PT.string.isRequired,
      topic: PT.string.isRequired,
    })
  ).isRequired,
  getArticles: PT.func.isRequired,
  deleteArticle: PT.func.isRequired,
  setCurrentArticleId: PT.func.isRequired,
  currentArticleId: PT.number,
};

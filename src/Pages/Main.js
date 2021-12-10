import React from 'react';
import { BrowserRouter, Routes, Route, Outlet } from "react-router-dom";
// import App from '../App';
import AdminIndex from './AdminIndex';
import AddArticle from './AddArticle'
import ArticleList from './ArticleList'
import Login from './Login'

function Main() {
  return (
    <BrowserRouter>
      <Routes>

        {/* <Route path="/list" element={<ArticleList />} />
        <Route path="/article" element={<AddArticle />} /> */}
        <Route path="/login" exact element={<Login />} />
        {/* <Route path="/" element={<AdminIndex />} >
        </Route> */}
        <Route path="/article" element={<AdminIndex><Outlet /></AdminIndex>} >
          <Route path="list" element={<ArticleList />} />
          <Route path="add" element={<AddArticle />} />
          <Route path="add/:id" element={<AddArticle />} />
        </Route>
        {/* <Route path="/article/list" exact element={<ArticleList />} />
        <Route path="/article/add" exact element={<AddArticle />} />
        <Route path="/article/add/:id" exact element={<AddArticle />} /> */}
        {/* <Route path="list" exact element={<ArticleList />} />
        <Route path="add" exact element={<AddArticle />} />
        <Route path="add/:id" exact element={<AddArticle />} /> */}
      </Routes>
    </BrowserRouter>

  )
}
export default Main

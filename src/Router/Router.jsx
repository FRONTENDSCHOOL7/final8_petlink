import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import HomePage from '../Pages/HomePage/Home';
import LoginPage from '../Pages/LoginPage/Login';
import JoinPage from '../Pages/JoinPage/Join';
import ChatPage from '../Pages/ChatPage/Chat';
import CommunityPage from '../Pages/CommunityPage/Community';
import CommunityUpload from '../Pages/CommunityPage/CommunityUpload'
import MarketPage from '../Pages/MarketPage/Market';
import ProductDetail from '../Components/Product/ProductDetail';
import ProfilePage from '../Pages/ProfilePage/Profile';
import FollowPage from '../Pages/FollowPage/FollowList';
import ErrorPage from '../Pages/ErrorPage/Error404';
import SplashPage from '../Pages/Splashpage/Splash';
import PostDetail from '../Components/Home/PostDetail';
import ProfileEdit from '../Components/Profile/ProfileEdit'

export default function Router() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<SplashPage />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/post/detail" element={<PostDetail />} />
        <Route path="/chat" element={<ChatPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/join" element={<JoinPage />} />
        <Route path="/community" element={<CommunityPage />} />
        <Route path="/community/upload" element={<CommunityUpload />} />
        <Route path="/market" element={<MarketPage />} />
        <Route path="/market/detail" element={<ProductDetail />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/profile/edit" element={<ProfileEdit />} />
        <Route path="/follow" element={<FollowPage />} />
        <Route path="*" element={<ErrorPage />} />
      </Routes>
    </BrowserRouter>
  );
}

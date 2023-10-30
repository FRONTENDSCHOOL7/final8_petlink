import React, { useEffect, useState } from 'react'
import { Container } from '../../Styles/reset.style'
import { IconMore, UserInfo, UserName, UserProfile } from '../../Components/Home/PostList.style'
import profileIcon from '../../assets/image/icon-basic-profile.png'
import backIcon from '../../assets/image/icon-arrow-left.png'
import moreIcon from '../../assets/image/icon- more-vertical.png'
import { Link, useNavigate } from 'react-router-dom'
import HeaderLayouts from '../../Components/Common/Header/Header'
import styled from 'styled-components'
import { PostUserInfo } from '../../Components/Home/PostList'
import { HeaderButton, HeaderLayout, SearchInput } from '../../Components/Common/Header/Header.style'


export default function Search() { 
  const navigate = useNavigate()
  const handleBack = ()=>{
 navigate(-1)
   }

   const [keyword, setKeyword] = useState('')
   const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      // Enter 키를 누르면 검색 함수 호출
      performSearch();
    }
  };

  //  API 통신
  const [data, setData] = useState(null); 
   const [accountname, setAccountName] = useState('');
   const [username, setUserName] = useState('');
   const [imgUrl, setImgUrl] = useState(null)
   const url = `https://api.mandarin.weniv.co.kr/user/searchuser/?keyword=${keyword}`

   useEffect(() => {
    performSearch();
  }, [keyword]);


  const performSearch = async()=>{
    try{
const res = await fetch(url,{
  method: 'GET',
  headers: {
    "Authorization" :  `Bearer ${localStorage.getItem('token')}`,
    "Content-type" : "application/json"
  }
})
const apidata = await res.json()
console.log("API 응답" , apidata)

if (apidata.user) {
  setUserName(apidata.user.username || '');
  setAccountName(apidata.user.accountname || '');
  setImgUrl(apidata.user.image || 'https://api.mandarin.weniv.co.kr/Ellipse.png'); 
}
    }
    catch(error){
      console.error('에러:', error);
    }
  }


  return (

    <Container>
    <HeaderLayout>
      <HeaderButton onClick={handleBack}><img src={backIcon} alt="'뒤로가기'" /></HeaderButton>
      <SearchInput type="keyword" placeholder='계정 검색'value={keyword} onChange={(e)=>setKeyword(e.target.value)} onKeyUp={handleKeyPress}/>
    </HeaderLayout>
        <SearchResultBox>
          <UserInfo>
            {data&&data.user &&<UserProfile>
              <Link to="#"><img src={imgUrl} alt='프로필 이미지'/></Link>
              <UserName >
                  <p >{username}</p>
                  <span>{accountname}</span>
              </UserName> 
          </UserProfile>}
            </UserInfo>
        </SearchResultBox>
    </Container>

 
  )
}



export const SearchResultBox = styled.div`
  padding: 20px 16px;
`


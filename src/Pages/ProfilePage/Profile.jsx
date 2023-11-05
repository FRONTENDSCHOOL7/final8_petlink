import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link, useParams, useNavigate } from 'react-router-dom';
import HeaderLayouts from '../../Components/Common/Header/Header'
import { Container, GlobalStyle } from '../../Styles/reset.style'
import TabMenu from '../../Components/Common/TabMenu/TabMenu'
import {
    ProfileImage,
    ProfileUsername,
    ProfileAccountname,
    FollowInfo,
    FollowGroup,
    FollowCount,
    FollowLabel,
    ProfileImageContainer,
    Button,
    BtnGroup,
    ProfileContainer,
    ProfilePet,
    GenderIcon,
    Intro,
} from '../../Components/Profile/Profile.style';
import MyFeed from '../../Components/Profile/MyFeed';
import MyMarket from '../../Components/Profile/MyMarket';

const ProfilePage = () => {
    const [profileData, setProfileData] = useState(null);
    const [error, setError] = useState(null);
    const { accountname } = useParams();
    const [followers, setFollowers] = useState([]);
    const [following, setFollowing] = useState([]);
    const [showFollowList, setShowFollowList] = useState(null);
    const [myAccountname, setMyAccountname] = useState(null);
    const navigate = useNavigate();
    
    const handleFollowClick = (type) => {
        const targetAccountname = accountname || accountnameFromMyInfo;
        if (targetAccountname) {
            navigate(`/profile/${targetAccountname}/${type === 'follower' ? 'following' :'follower '}`);
        } else {
            console.error('Account name is undefined');
        }
    };
    

    useEffect(() => {
        console.log('Account Name:', accountname);
        const fetchData = async () => {
          try {
            const token = localStorage.getItem('token');
            let url = 'https://api.mandarin.weniv.co.kr/';
            // 기본 엔드포인트를 'user/myinfo'로 설정하여 나의 정보를 가져옵니다.
            let profileEndPoint = 'user/myinfo';
      
            const response = await axios.get(url + profileEndPoint, {
              headers: {
                Authorization: `Bearer ${token}`,
                'Content-type': 'application/json',
              },
            });
      
            let profile;
            if (response.data.user) { // 나의 프로필 데이터
              profile = response.data.user;
              setMyAccountname(profile.accountname); // 로그인한 사용자의 accountname 상태를 저장합니다.
              if (!accountname) {
                setAccountname(profile.accountname); // URL에 accountname이 없는 경우(즉, 내 프로필을 보는 경우)
              }
            }
      
            if (accountname) { // URL에 accountname이 있는 경우, 다른 사용자의 프로필 데이터를 가져옵니다.
              profileEndPoint = `profile/${accountname}`;
              const profileResponse = await axios.get(url + profileEndPoint, {
                headers: {
                  Authorization: `Bearer ${token}`,
                  'Content-type': 'application/json',
                },
              });
      
              profile = profileResponse.data.profile;
            }
      
            const parsedIntro = parseIntro(profile.intro);
      
            setProfileData({
              ...profile,
              ...parsedIntro
            });
          } catch (error) {
            setError(error);
          }
        };
      
        fetchData();
      }, [accountname]);

    const [accountnameFromMyInfo, setAccountname] = useState(null);
    
    function parseIntro(intro) {
        const tags = ['intro', 'pet', 'gender', 'birthdate', 'location'];
        const info = {};
        
        tags.forEach(tag => {
            const match = intro.match(new RegExp(`#${tag}:(.*?)(?=#|$)`));
            if (match && match[1]) {
                info[tag] = match[1].trim();
            }
        });
        
        return info;
    }
    
    if (error) {
        return <div>Error occurred: {error.message}</div>;
    }

    if (!profileData) {
        return <div>로딩...</div>;
    }
    
    // intro 정보 추출
    function Tag({ label, value }) {
        return value ? <p>{label}: {value}</p> : null;
    }
    
    function ProfileDetails({ intro }) {
        const info = parseIntro(intro);
    
        return (
            <div>
                {Object.entries(info).map(([key, value]) => <Tag key={key} label={capitalizeFirstLetter(key)} value={value} />)}
            </div>
        );
    }
    
    function parseIntro(intro) {
        const tags = ['intro', 'pet', 'gender', 'birthdate', 'location'];
        const info = {};
    
        tags.forEach(tag => {
            const match = intro.match(new RegExp(`#${tag}:(.*?)(?=#|$)`));
            if (match && match[1]) {
                info[tag] = match[1].trim();
            }
        });
    
        return info;
    }
    
    function capitalizeFirstLetter(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }
    // 팔로우 언팔 기능

    const handleFollow = async () => {
        try {
            const response = await axios.post(`https://api.mandarin.weniv.co.kr/profile/${profileData.accountname}/follow`, {}, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                    'Content-type': 'application/json',
                },
            });
            if (response.data.profile) {
                setProfileData(prevData => ({
                    ...prevData, // 기존 데이터 유지
                    ...response.data.profile, // 새로운 데이터로 업데이트
                    isfollow: true // 팔로우 상태 업데이트
                }));
            }
        } catch (error) {
            console.error(error);
        }
    };
    
    const handleUnfollow = async () => {
        try {
            const response = await axios.delete(`https://api.mandarin.weniv.co.kr/profile/${profileData.accountname}/unfollow`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                    'Content-type': 'application/json',
                },
            });
            if (response.data.profile) {
                setProfileData(prevData => ({
                    ...prevData, // 기존 데이터 유지
                    ...response.data.profile, // 새로운 데이터로 업데이트
                    isfollow: false // 언팔로우 상태 업데이트
                }));
            }
        } catch (error) {
            console.error(error);
        }
    };
    // 팔로우 팔로잉 리스트 이동
    const fetchFollowList = async (type) => { // type: 'followers' or 'following'
        try {
            const token = localStorage.getItem('token');
            const url = `https://api.mandarin.weniv.co.kr/profile/${accountname}/${type}`;
            const response = await axios.get(url, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-type': 'application/json',
                },
            });
            
            if (type === 'followers') {
                setFollowers(response.data);
            } else {
                setFollowing(response.data);
            }
            
            setShowFollowList(type);
        } catch (error) {
            console.error(error);
        }
    };

    // birthdate를 개월 또는 일자로 변환
    function calculateAge(birthdateStr) {
        const birthdate = new Date(birthdateStr);
        const today = new Date();

        let months = (today.getFullYear() - birthdate.getFullYear()) * 12;
        months -= birthdate.getMonth();
        months += today.getMonth();
        
        if (months <= 0) {
            const oneDay = 24 * 60 * 60 * 1000; // hours*minutes*seconds*milliseconds
            const diffDays = Math.round(Math.abs((today - birthdate) / oneDay));
            return `${diffDays}일`;
        }
        
        return `${months}개월`;
    }
    // gender 아이콘 변경
    function genderUnicode(gender) {
        return gender === '남아' ? '♂' : gender === '여아' ? '♀' : null;
    }

    // intro: #intro 없을때
    function renderIntro(introText) {
        console.log("introText:", introText); // 로그를 출력하여 introText 값을 확인합니다.
    
        const introMatch = introText.match(/#intro:(.*?)(?=#|$)/);
        console.log("introMatch:", introMatch); // 로그를 출력하여 매치된 값을 확인합니다.
    
        // #intro 태그가 있으면 해당 부분만, 없으면 전체 introText를 반환합니다.
        return introMatch ? introMatch[1].trim() : introText;
    }
    
    const introContent = renderIntro(profileData.intro);

    return (
        <>
            <GlobalStyle />
            <Container>
            <HeaderLayouts title="프로필" logo />
                <ProfileContainer>
                    <FollowInfo>
                        <FollowGroup onClick={() => handleFollowClick('follower')}>
                            <FollowCount>{profileData.followingCount}</FollowCount>
                            <FollowLabel>Following</FollowLabel>
                        </FollowGroup>
                        
                        <ProfileImageContainer>
                            <ProfileImage src={profileData.image} alt="Profile" />
                            <ProfileUsername>{profileData.username}</ProfileUsername>
                            <ProfileAccountname>@{profileData.accountname}</ProfileAccountname>
                            <ProfilePet>
                                {profileData.gender && (
                                    <GenderIcon gender={profileData.gender}>
                                        {genderUnicode(profileData.gender)}
                                    </GenderIcon>)}
                                {profileData.pet && <span>{`${profileData.pet} `}</span>}
                                {profileData.birthdate && <span>{`${calculateAge(profileData.birthdate)} `}</span>}
                                {profileData.location && <span>{`${profileData.location} `}</span>}
                            </ProfilePet>
                            {introContent && (<Intro>{introContent}</Intro>)}
                        </ProfileImageContainer>
                        
                        <FollowGroup onClick={() => handleFollowClick('following')}>
                            <FollowCount>{profileData.followerCount}</FollowCount>
                            <FollowLabel>Followers</FollowLabel>
                        </FollowGroup>
                    </FollowInfo>
                    
                    {/* accountname 구분하여 버튼 전환 */}
                    {accountname && accountname !== myAccountname ? (
                        profileData.isfollow ? (
                            <BtnGroup style={{
                                marginRight: "10px"
                            }}>
                                <Button onClick={handleUnfollow}>언팔로우</Button>
                            </BtnGroup>
                        ) : (
                            <BtnGroup style={{
                                marginRight: "10px"
                            }}>
                                <Button onClick={handleFollow}>팔로우</Button>
                            </BtnGroup>
                        )
                    ) : (
                        <BtnGroup>
                            <Link to="/profile/edit">
                                <Button>프로필 수정</Button>
                            </Link>
                            <Link to={`/market/add-product/`}>
                                <Button>상품 등록</Button>
                            </Link>
                        </BtnGroup>
                    )}
                </ProfileContainer>
                <MyMarket accountname={accountname || accountnameFromMyInfo} />
                <MyFeed accountname={accountname || accountnameFromMyInfo} />
            <TabMenu />
        </Container>
        </>
    );
};

export default ProfilePage;
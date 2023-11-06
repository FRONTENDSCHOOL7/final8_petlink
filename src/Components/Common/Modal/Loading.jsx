import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { isLoggedIn } from '../../../authService';
import { LogoIcon, LogoText, SplashContainer, SplashContent, SubText } from '../../../Components/Splash/Splash.styles';
import logoPetlink from '../../../assets/image/logo-petlink.png';

function Loading() {
  const navigate = useNavigate();
  const [isVisible, setIsVisible] = useState(true); // isVisible 상태 변수 추가

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false); // 상태를 false로 설정하여 스플래시 화면을 숨깁니다.
      console.log('Checking login status...');
      if (isLoggedIn()) {
        console.log('User is logged in, redirecting to /home');
        navigate('/home');
      } else {
        console.log('User is not logged in, redirecting to /login');
        navigate('/login')
      }
    }, 3000); // 3초 후

    return () => {
      clearTimeout(timer);
    };
  }, [navigate]);

  return (
    isVisible && (
      <SplashContainer style={{backgroundColor: "white", height: "auto"}}>
        <SplashContent>
          <LogoIcon src={logoPetlink} alt="반결고리 로고" />
          <LogoText style={{color: "#6C9BD1"}}>
            {"로딩중".split("").map((char, index) => (
              <span key={index}>{char}</span>
            ))}
          </LogoText>
        </SplashContent>
      </SplashContainer>
    )
  );
}

export default Loading;
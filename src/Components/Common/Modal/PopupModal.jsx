import React, { useState } from 'react';
import { ModalOverlay, ModalContainer, ModalAlertText, ModalButtonContainer, ModalButton } from './Modal.style';

function PopupModal({ 
    isVisible, // 외부에서 받아오는 모달의 상태 (true or false)
    setIsVisible, // 외부에서 받아오는 상태 설정 함수
    alertText,  // 기본 알림 텍스트
    cancelText,  // 기본 취소 텍스트
    confirmText,  // 기본 확인 텍스트
    onConfirm,  // 확인 버튼 클릭 시 호출될 함수
    onCancel  // 취소 버튼 클릭 시 호출될 함수
}) {
  const handleConfirm = () => {
    if(onConfirm) onConfirm();
    setIsVisible(false);
  };

  const handleCancel = () => {
    if(onCancel) onCancel();
    setIsVisible(false);
  };

  return isVisible ? (
    <ModalOverlay>
      <ModalContainer>
        <ModalAlertText>{alertText}</ModalAlertText>
        <ModalButtonContainer>
          <ModalButton onClick={handleCancel}>{cancelText}</ModalButton>
          <ModalButton $isConfirm onClick={handleConfirm}>{confirmText}</ModalButton>
        </ModalButtonContainer>
      </ModalContainer>
    </ModalOverlay>
  ) : null;
}

export default PopupModal;

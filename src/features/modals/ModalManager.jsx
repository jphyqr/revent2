import React from 'react'
import { connect } from 'react-redux'
import TestModal from './TestModal'
import LoginModal from './LoginModal';
import RegisterModal from './RegisterModal'
import MessageModal from './MessageModal'
import PaymentModal from './PaymentModal'
import ConnectBankAccountModal from './ConnectBankAccountModal/ConnectBankAccountModal'

const modalLookup = {
  TestModal,
  LoginModal,
  RegisterModal,
  MessageModal,
  PaymentModal,
  ConnectBankAccountModal
}

const mapState = (state) => ({
  currentModal: state.modals
})

const ModalManager = ({currentModal}) => {
  let renderedModal;

  if (currentModal) {
    const {modalType, modalProps} = currentModal;
    const ModalComponent = modalLookup[modalType];

    renderedModal = <ModalComponent {...modalProps}/>
  }
  return <span>{renderedModal}</span>
}

export default connect(mapState)(ModalManager)

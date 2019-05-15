import React from 'react'
import { connect } from 'react-redux'
import TestModal from './TestModal'
import LoginModal from './LoginModal';
import RegisterModal from './RegisterModal'
import MessageModal from './MessageModal'
import NewFieldModal from './NewFieldModal/NewFieldModal'
import PaymentModal from './PaymentModal'
import TaskModal from './TaskModal/TaskModal'
import CreateJobModal from './CreateJobModal/CreateJobModal'
import ConnectBankAccountModal from './ConnectBankAccountModal/ConnectBankAccountModal'
import CategoryModal from './CategoryModal/CategoryModal'
import QuoteJobModal from './QuoteJobModal/QuoteJobModal'
import ViewQuoteModal from './ViewQuoteModal/ViewQuoteModal'
import ProfileModal from './ProfileModal/ProfileModal'
import LabourProfileModal from './LabourProfileModal/LabourProfileModal'
import JoinBetaModal from './JoinBetaModal/JoinBetaModal'
import BuildModal from './MobileModals/BuildModal/BuildModal'
import OnboardingModal from './OnboardingModal/OnboardingModal'
import VideoModal from './VideoModal/VideoModal'
const modalLookup = {
  TestModal,
  LoginModal,
  RegisterModal,
  MessageModal,
  PaymentModal,
  ConnectBankAccountModal,
  CreateJobModal,
  CategoryModal,
  TaskModal,
  NewFieldModal,
  QuoteJobModal,
  ViewQuoteModal,
  ProfileModal,
  LabourProfileModal,
  JoinBetaModal,
  BuildModal,
  OnboardingModal,
  VideoModal
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

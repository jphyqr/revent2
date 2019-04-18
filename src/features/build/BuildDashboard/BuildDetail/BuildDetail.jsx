import React, { Component } from "react";
import BuildCarousel from "./BuildCarousel/BuildCarousel";
//import { categories } from "../../../../app/data/buildData";
import scrollToComponent from "react-scroll-to-component";
import { withFirestore, isLoaded } from "react-redux-firebase";
import { firestoreConnect } from "react-redux-firebase"; //even though we using firestore this gives our binding
import { connect } from "react-redux";
import LoadingComponent from "../../../../app/layout/LoadingComponent";
import MyJobsCarousel from "./MyJobsCarousel/MyJobsCarousel";
import ExclusiveJobsCarousel from "./ExclusiveJobsCarousel/ExclusiveJobsCarousel";
import { selectDraftToEdit, postToggle } from "../../draftActions";
import { selectQuoteToEdit } from "../../../modals/QuoteJobModal/quoteActions";
import { newChat } from "../../../user/userActions";
import { openModal } from "../../../modals/modalActions";

const query = ({ auth }) => {
  const authenticated = auth.isLoaded && !auth.isEmpty;
  if (authenticated) {
    return [
      {
        collection: "tasks",
        where: [["exclusive", "==", true]],

        storeAs: "exclusive_jobs"
      },
      {
        collection: "job_attendee",
        where: [["userUid", "==", `${auth.uid}`]],

        orderBy: ["date", "desc"],
        storeAs: "jobs_attended"
      },
      {
        collection: "users",
        doc: auth.uid,
        subcollections: [{ collection: "contracts" }],
        storeAs: "contracts"
      }
    ];
  } else {
    return [
      {
        collection: "tasks",
        where: [["exclusive", "==", true]],

        storeAs: "exclusive_jobs"
      },
      {
        collection: "job_attendee",
        where: [["userUid", "==", `${auth.uid}`]],

        orderBy: ["date", "desc"],
        storeAs: "jobs_attended"
      }
    ];
  }
};

const actions = {
  selectDraftToEdit,
  postToggle,
  openModal,
  selectQuoteToEdit,
  newChat
};

const mapState = state => {
  return {
    auth: state.firebase.auth,
    categories: state.firestore.ordered.categories,
    loading: state.async.loading,
    myJobs: state.firestore.ordered.jobs_attended,
    myContracts: state.firestore.ordered.contracts,
    exclusiveJobs: state.firestore.ordered.exclusive_jobs,
    draft: state.draft,
    contract: state.contract
  };
};

class BuildDetail extends Component {
  async componentDidMount() {
    const { firestore } = this.props;
    await firestore.setListener(`categories`);
  }

  componentWillReceiveProps = nextProps => {
    if (nextProps.draft !== this.state.draft) {
      this.setState({ draft: nextProps.draft });
      console.log("updated draft State");
    }
  };

  async componentWillUnmount() {
    const { firestore } = this.props;
    await firestore.unsetListener(`categories`);
  }

  state = {
    contextRef: {},
    selectedJob: "",
    draft: {},
    pauseButtonLoading: false
  };

  handleEditDraft = async jobId => {
    await this.props.selectDraftToEdit(jobId);
    this.props.openModal("CreateJobModal");
  };

  handleViewQuote = quote => {
    this.props.selectQuoteToEdit(quote.quoteId);
    this.props.openModal("ViewQuoteModal");
  };

  handlePostJob = async (posted, jobId) => {
    await this.setState({ pauseButtonLoading: true });
    await this.props.postToggle(posted, jobId);
    await this.setState({ pauseButtonLoading: false });
  };

  handleNewChat = async receiver => {
    this.props.newChat(receiver);
  };

  handleContextRef = contextRef =>
    this.setState({
      contextRef
    });

  scrollToMyRef = (eChild, offset) => {
    scrollToComponent(eChild.currentTarget, {
      offset: -110 + offset,
      align: "top",
      duration: 600
    });
  };

  render() {
    const {
      categories,
      selectDraftToEdit,
      auth,
      loading,
      exclusiveJobs,
      REGULAR_EXCLUSIVE_HEIGHT,
      REGULAR_EXCLUSIVE_WIDTH,
      COMPACT_EXCLUSIVE_HEIGHT,
      COMPACT_EXCLUSIVE_WIDTH,
      compactDisplayMode,
      COMPACT_ITEM_HEIGHT,
      COMPACT_ITEM_WIDTH,
      REGULAR_ITEM_HEIGHT,
      REGULAR_ITEM_WIDTH
    } = this.props;
    const authenticated = auth.isLoaded && !auth.isEmpty;
    return (
      <div style={{ marginTop: 10,  paddingBottom: "900px" }}>
        {authenticated && (
          <MyJobsCarousel
            loading={loading}
            handleNewChat={this.handleNewChat}
            handleViewQuote={this.handleViewQuote}
            pauseButtonLoading={this.state.pauseButtonLoading}
            handlePostJob={this.handlePostJob}
            handleEditDraft={this.handleEditDraft}
            draft={this.state.draft}
            scrollToMyRef={this.scrollToMyRef}
            myJobs={this.props.myJobs}
            myContracts={this.props.myContracts}
            selectDraftToEdit={selectDraftToEdit}
            compactDisplayMode={compactDisplayMode}
            REGULAR_ITEM_WIDTH={REGULAR_ITEM_WIDTH}
            REGULAR_ITEM_HEIGHT={REGULAR_ITEM_HEIGHT}
            COMPACT_ITEM_WIDTH={COMPACT_ITEM_WIDTH}
            COMPACT_ITEM_HEIGHT={COMPACT_ITEM_HEIGHT}
          />
        )}
        <ExclusiveJobsCarousel
          selectDraftToEdit={selectDraftToEdit}
          scrollToMyRef={this.scrollToMyRef}
          exclusiveJobs={exclusiveJobs}
          REGULAR_EXCLUSIVE_HEIGHT={REGULAR_EXCLUSIVE_HEIGHT}
          REGULAR_EXCLUSIVE_WIDTH={REGULAR_EXCLUSIVE_WIDTH}
          COMPACT_EXCLUSIVE_HEIGHT={COMPACT_EXCLUSIVE_HEIGHT}
          COMPACT_EXCLUSIVE_WIDTH={COMPACT_EXCLUSIVE_WIDTH}
          compactDisplayMode={compactDisplayMode}
        />
        {!isLoaded(categories) ? (
          <LoadingComponent />
        ) : (
          categories &&
          categories.map(category => (
            <BuildCarousel
              key={category.id}
              category={category}
              scrollToMyRef={this.scrollToMyRef}
              handleContextRef={this.handleContextRef}
              compactDisplayMode={compactDisplayMode}
              REGULAR_ITEM_WIDTH={REGULAR_ITEM_WIDTH}
              REGULAR_ITEM_HEIGHT={REGULAR_ITEM_HEIGHT}
              COMPACT_ITEM_WIDTH={COMPACT_ITEM_WIDTH}
              COMPACT_ITEM_HEIGHT={COMPACT_ITEM_HEIGHT}
            />
          ))
        )}
      </div>
    );
  }
}

export default connect(
  mapState,
  actions
)(firestoreConnect(props => query(props))(BuildDetail));

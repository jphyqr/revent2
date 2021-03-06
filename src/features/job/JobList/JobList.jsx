import React, { Component } from "react";
import JobListItem from "./JobListItem";
import InfiniteScroll from "react-infinite-scroller";


class JobList extends Component {


//   scrollToMyRef = (eChild, category) => {
  
//     console.log({ eChild });
//     console.log({ category });

//     scrollToComponent(eChild.currentTarget, {
//       offset: -110,
//       align: "top",
//       duration: 600
//     });
  
// };

state = {
  scrollToId : ""
}




  render() {
    const { jobs, getNextJobs, loading, moreJobs } = this.props;
    return (
      <div>
        {jobs && jobs.length !== 0 && (
          // <InfiniteScroll
          //   style={{maxHeight:300}}
          //   pageStart={0}
          //   loadMore={getNextJobs}
          //   hasMore={!loading && moreJobs}
          //   initialLoad={false}
          // >
          <div style={{maxHeight:500, minHeight:500, overflowY:"auto"}}>
            {jobs &&
              jobs.map(job => (
                <JobListItem key={job.id} job={job} scrollToId={this.props.scrollToId} />
              ))}
              </div>
        //  </InfiniteScroll>
        )}
      </div>
    );
  }
}

export default JobList;
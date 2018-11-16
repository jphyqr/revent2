import React, { Component } from "react";
import JobListItem from "./JobListItem";
import InfiniteScroll from "react-infinite-scroller";

class JobList extends Component {
  render() {
    const { jobs, getNextJobs, loading, moreJobs } = this.props;
    return (
      <div>
        {jobs && jobs.length !== 0 && (
          <InfiniteScroll
            pageStart={0}
            loadMore={getNextJobs}
            hasMore={!loading && moreJobs}
            initialLoad={false}
          >
            {jobs &&
              jobs.map(job => (
                <JobListItem key={job.id} job={job} />
              ))}
          </InfiniteScroll>
        )}
      </div>
    );
  }
}

export default JobList;
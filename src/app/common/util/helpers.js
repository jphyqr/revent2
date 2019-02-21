import moment from "moment";


export const objectToArray = (object) => {
    if(object){
        return Object.entries(object).map(e=>Object.assign(e[1], {id: e[0]}))
    }
}


export const createSchedule = scheduleStartDate => {
  var days = [];
  var labels = ["8-10", "10-12", "12-1", "1-3", "3-5", "5-7", "7-9"];

  console.log('1. createSchedule.. scheduleStartDate', scheduleStartDate)
  for (var i = 0; i < 6; i++) {
    // let nextDay = moment(scheduleStartDate)
    //   .add(i, "days")
    //   .toDate();
    // should be \

   
    console.log('loop . createSchedule.. index', i)
    console.log('loop . createSchedule.. scheduleStartDate', scheduleStartDate)

    let nextDayStamp =  ((scheduleStartDate+(i*(24*60*60))))
    console.log('loop . createSchedule.. nextDayStamp', nextDayStamp)

    let timeSlots = [];
    for (var j = 0; j < labels.length; j++) {
      timeSlots.push({ label: labels[j], selected: false });
    }
    days.push({ timeStamp: nextDayStamp, timeSlots: timeSlots });

  
  }
  return days;
};
export const createNewJob  =  (user, photoURL, job, taskID) => {
  job.date = moment(job.date).toDate();


  let startDate = moment().unix()
  //let scheduleStartDate = Date(Date.now()).toString()
  console.log('start date createNewJob moment.unix()', startDate)
  let timesSelected = createSchedule(startDate)
  let showState = {showPhotos:false, showCustom:false, showBasic:true, showContract:false, showConfirm:false, showOverview:false, showSchedule:false}
console.log({showState})
  return {
    ...job,
    showState: showState,
    timesSelected: timesSelected,
    startDate: moment().toDate(),
    taskID: taskID.taskID,
    ownerUid: user.uid,
    inDraft: true,
    title: `${user.displayName}'s ${job.name} job`,
    owneredBy: user.displayName,
    ownerPhotoURL: photoURL || "/assets/user.png",
    created: Date.now(),

  };
};


export const createNewCategory  = (category) => {
  return {
    ...category,
    created: Date.now(),

  };
};


export const createNewJournalEntry  = (user,photoURL,entry) => {
  return {
    ...entry,
    photoURL:photoURL,
    author: user.displayName,
    authorUid: user.uid,
    created: Date.now(),

  };
};



export const createNewField  = (field, icon, example, selectItems) => {
  return {
    ...field,
    icon:icon,
    example:example,
    selectItems: selectItems,
    created: Date.now(),

  };
};

export const createNewTask  = (user, photoURL, task, displayURL) => {
  return {
    ...task,
    managerUid: user.uid,
    managedBy: user.displayName,
    displayURL: displayURL || 'https://firebasestorage.googleapis.com/v0/b/revents-99d5b.appspot.com/o/pVBFKV5Sp2giwswxvj7mpsJa4Bj1%2Fuser_images%2Fcjqeg4nnu000d3g5u6giajkoa?alt=media&token=e5adabbe-fb7c-4bf2-ac3d-e43d18da14bf',
    inDraft: true,
    title: "Untitled",
    managerPhotoURL: photoURL || "/assets/user.png",
    created: Date.now(),
    subscribers: {
      //nested object inside event [key]
      [user.uid]: {
        subscribed: true,
        joinDate: Date.now(),
        photoURL: photoURL || "./assets/user.png",
        displayName: user.displayName,
        manager: true
      }
    }

  };
};




export const createNewEvent = (user, photoURL, event) => {
  event.date = moment(event.date).toDate();
  return {
    ...event,
    hostUid: user.uid,
    hostedBy: user.displayName,
    hostPhotoURL: photoURL || "/assets/user.png",
    created: Date.now(),
    attendees: {
      //nested object inside event [key]
      [user.uid]: {
        going: true,
        joinDate: Date.now(),
        photoURL: photoURL || "./assets/user.png",
        displayName: user.displayName,
        host: true
      }
    }
  };
};


export const createDataTree = dataset => {
    let hashTable = Object.create(null);
    dataset.forEach(a => hashTable[a.id] = {...a, childNodes: []});
    let dataTree = [];
    dataset.forEach(a => {
        if (a.parentId) hashTable[a.parentId].childNodes.push(hashTable[a.id]);
        else dataTree.push(hashTable[a.id])
    });
    return dataTree
};
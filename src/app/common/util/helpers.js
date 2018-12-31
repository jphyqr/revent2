import moment from "moment";


export const objectToArray = (object) => {
    if(object){
        return Object.entries(object).map(e=>Object.assign(e[1], {id: e[0]}))
    }
}

export const createNewJob  = (user, photoURL, job) => {
  job.date = moment(job.date).toDate();
  return {
    ...job,
    ownerUid: user.uid,
    inDraft: true,
    title: "Untitled",
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

export const createNewTask  = (user, photoURL, task) => {
  return {
    ...task,
    managerUid: user.uid,
    managedBy: user.displayName,
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
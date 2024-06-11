window.helpers.azure = {};

window.helpers.azure.createTask = ({
  parentStoryNumber,
  taskTitle,
  iterationValue,
  organization,
  project,
  accessToken,
}) => {
  /**
   Creates a task on Azure using the Azure api. It's uses the multi step patch json to define the fields that it will be filled in via api
    Arguments: {
        parentStoryNumber: the story number where the Task will be added to
        taskTitle: the title of the Task
        iterationValue: the interation field value where the Task will land
        organization: the organization name (url reference)
        project: the project name (url reference)
        accessToken: the user access token to be authenticated to the Azure api
    }
   */
  jQuery.ajax({
    url: `https://dev.azure.com/${organization}/${project}/_apis/wit/workitems/$task?api-version=7.1-preview.3`,
    type: "POST",
    Headers: {
      Authorization: `Basic ${btoa(accessToken)}`,
    },
    success: function (result) {
      console.info("Task created!", result);
    },
    async: false,
    contentType: "application/json-patch+json",
    data: JSON.stringify([
      {
        op: "add",
        path: "/fields/System.Title",
        value: taskTitle,
      },
      {
        op: "add",
        path: "/relations/-",
        value: {
          rel: "System.LinkTypes.Hierarchy-Reverse",
          url: `https://dev.azure.com/${organization}/${project}/_apis/wit/workItems/${parentStoryNumber}`,
        },
      },
      {
        op: "add",
        path: "/fields/System.IterationPath",
        value: iterationValue,
      },
    ]),
  });
};

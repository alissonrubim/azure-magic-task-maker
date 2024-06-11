async function processTasks(storyNumber, topModal, accessToken, iteration) {
  /*
    Process a list of string into a task creation method
 */
  try {
    const items = window.helpers
      .getSelectionText()
      .split("\n")
      .filter((x) => x);
    console.info(`📍 Found ${items.length} line that are selected!`);
    if (items.length > 0) {
      console.info("📍 Items to be added as tasks: ", items);

      for (let i = 0; i < items.length; i++) {
        console.info("\t📍 Adding item", items[i]);
        window.helpers.azure.createTask({
          parentStoryNumber: storyNumber,
          taskTitle: items[i],
          iterationValue: iteration,
          organization: location.pathname.split("/")[1],
          project: location.pathname.split("/")[2],
          accessToken: accessToken,
        });
      }

      alert("Done!");
    } else {
      console.info("📍 No selected items to be processed");
    }
  } catch (e) {
    alert("❌ Ops, something went wrong! Check console for more information!");
    console.info(e);
  }
}

function appendCreateTaskButton(accessToken) {
  /**
   * Append the Create Task button to the story
   */

  // Scan the html until it find a dialog that is open.
  window.helpers.scanForQuery({
    query: ".work-item-form-dialog",
    infiniteLoop: true,
    maxTries: -1, //Run it infinitelly
    onSuccess: (elements) => {
      // Get the modal that is on top
      const topModal = elements[elements.length - 1];

      // Check if the modal is already modified with the custom tag
      if (
        !topModal.attributes[CUSTOM_TAG] ||
        topModal.attributes[CUSTOM_TAG].value === false
      ) {
        console.info("📍 Found a new modal that is not tagged: ", topModal);

        // If not, then add the custom tag
        topModal.setAttribute(CUSTOM_TAG, true);
        console.info("📍 Modal is now tagged");

        // Wait for loading the modal header
        window.helpers.scanForQuery({
          query: ".work-item-header-command-bar",
          parent: topModal,
          onSuccess: (header) => {
            console.info("📍 Modal header is loaded!");
            // Get the modal title and check if starts with User Story
            const ariaLabel = topModal.querySelector(
              ".bolt-dialog-focus-element"
            ).attributes["aria-label"].value;
            if (ariaLabel.startsWith("User Story")) {
              const userStoryNumber = ariaLabel
                .split("User Story")[1]
                .split(" ")[1]
                .trim();

              const iteration = topModal
                .querySelector("label[accesskey='r']")
                .parentNode.parentNode.querySelector(
                  "input[role='combobox']"
                ).value;

              console.info("📍 Modal is a user story!");

              // Add the button to the modal
              const button = document.createElement("button");
              button.style.border = 0;
              button.style.padding = "7px";
              button.style.background = "#0078d4";
              button.style.color = "white";
              button.style.fontWeight = "800";
              button.style.float = "right";
              button.style.marginRight = "6px";
              button.style.cursor = "pointer";
              button.innerHTML = "Create Tasks";
              button.onclick = () => {
                processTasks(userStoryNumber, topModal, patToken, iteration);
              };
              header[0].appendChild(button);
              console.info("📍 Button added to modal!");
            }
          },
        });
      }
    },
  });
}

const CUSTOM_TAG = "ado-magic-tasker-managed";

function main() {
  try {
    console.info("~~~~~ 📍 Azure Magic Task Maker is loaded! 📍 ~~~~~");

    // Get the Azure path_token from the system
    chrome.storage.sync.get("pat_token", function (items) {
      const pat_token = items.pat_token;

      if (!pat_token)
        throw new Error(
          "Azure Personal Access Token not defined or not found! Please provide a valid token via options page."
        );

      appendCreateTaskButton(pat_token);
    });
  } catch (e) {
    console.info("❌ Something went wrong:", e);
  }
}
main();

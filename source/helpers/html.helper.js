window.helpers.scanForQuery = (args) => {
  /*
    This method scans for a query and executes a handler when the query if finally fullfilled.
    args = {
      query:
      parent?: (default = document)
      onSuccess: 
      maxTries?: (default = 10)
      infinitLoop?: (default = false)
    }
  */
  const query = args.query;
  const parent = args.parent ?? document;
  const onSuccess = args.onSuccess;
  const maxTries = args.maxTries ?? 10;
  const infiniteLoop = args.infiniteLoop ?? false;

  let tries = 0;
  const check = () => {
    const elements = parent.querySelectorAll(query);
    if (elements.length > 0) {
      onSuccess(elements);
      if (infiniteLoop) {
        setTimeout(() => {
          check();
        }, 1000);
      }
    } else {
      tries++;
      if (maxTries < 0 || tries < maxTries) {
        setTimeout(() => {
          check();
        }, 1000);
      }
    }
  };
  check();
};

// This function sleep the window for x amout os ms
window.helpers.sleep = (ms) => new Promise((r) => setTimeout(r, ms));

window.helpers.getSelectionText = () => {
  /* This function returns the selected text on the screen */
  var text = "";
  if (window.getSelection) {
    text = window.getSelection().toString();
  } else if (document.selection && document.selection.type != "Control") {
    text = document.selection.createRange().text;
  }
  return text;
};

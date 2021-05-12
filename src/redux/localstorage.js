export const loadstate = () => {
  try {
    const serializeState = localStorage.getItem("playlist");
    if (serializeState === null) {
      return undefined;
    }
    return JSON.parse(serializeState);
  } catch (err) {
    console.log("error in load");
    return undefined;
  }
};

export const saveState = (state) => {
  try {
    const serializeState = JSON.stringify(state);
    localStorage.setItem("playlist", serializeState);
  } catch (err) {}
};

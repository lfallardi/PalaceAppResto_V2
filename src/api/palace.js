const palace = () => {
  login: () => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve(true);
      }, 3000);
    });
  };
};

export default palace;

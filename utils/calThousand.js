const calThousand = (num) => {
  if (num > 999) {
    return (num / 1000).toFixed(1) + "k";
  }

  return num;
};

export default calThousand;

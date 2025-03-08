axios
  .get("/api/v1/dinos")
  .then((res) => {
    const { data } = res;
    console.log(data);
  })
  .catch((error) => {
    console.log(error);
  });

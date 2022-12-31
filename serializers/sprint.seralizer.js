const createSprint = async (req, res, next) => {
  const data = res.data || null;
  console.log(data, "===-=-=-=-=-");
  const response = {
    id: data.id,
    workspaceId: data.workspaceId,
    name: data.name,
    description: data.description,
    deadline: data.deadline,
  };
  res.data = response;
  next();
};

module.exports = {
  createSprint,
};

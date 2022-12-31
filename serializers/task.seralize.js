const createTask = async (req, res, next) => {
  const data = res.data || null;
  const response = {
    id: data.id,
    sprintId: data.sprintId,
    userId: data.userId,
    task: data.task,
    description: data.description,
    pointer: data.description,
    deadline: data.description,
  };
  res.data = response;
  next();
};

module.exports = {
  createTask,
};

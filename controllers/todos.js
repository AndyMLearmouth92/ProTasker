const Todo = require("../models/Todo");

module.exports = {
  getTodos: async (req, res) => {
    try {
      const todoItems = await Todo.find({ userId: req.user.id });
      const itemsLeft = await Todo.countDocuments({
        userId: req.user.id,
        completed: false,
      });
      //Removes duplicates from the projects list and sorts them in alphabetical order.
      const projects = [...new Set(todoItems.map((e) => e.project).sort())];
      console.log(projects);
      // Extracts the date from the Todos array of objects, changes the format and removes duplicates.
      const dates = [
        ...new Set(
          todoItems.map(
            (e) =>
              `${e.date.getDate()}/${
                e.date.getMonth() + 1
              }/${e.date.getFullYear()}`
          )
        ),
      ];
      res.render("todos.ejs", {
        todos: todoItems,
        left: itemsLeft,
        user: req.user,
        date: dates,
        project: projects,
      });
    } catch (err) {
      console.log(err);
    }
  },

  createTodo: async (req, res) => {
    try {
      await Todo.create({
        todo: req.body.todoItem,
        completed: false,
        userId: req.user.id,
        project:
          req.body.projectItem[0].toUpperCase() +
          req.body.projectItem.slice(1).toLowerCase(),
        date: req.body.deadline,
      });
      console.log("Todo has been added!");
      res.redirect("/todos");
    } catch (err) {
      console.log(err);
    }
  },
  markComplete: async (req, res) => {
    try {
      await Todo.findOneAndUpdate(
        { _id: req.body.todoIdFromJSFile },
        {
          completed: true,
        }
      );
      console.log("Marked Complete");
      res.json("Marked Complete");
    } catch (err) {
      console.log(err);
    }
  },
  markIncomplete: async (req, res) => {
    try {
      await Todo.findOneAndUpdate(
        { _id: req.body.todoIdFromJSFile },
        {
          completed: false,
        }
      );
      console.log("Marked Incomplete");
      res.json("Marked Incomplete");
    } catch (err) {
      console.log(err);
    }
  },
  deleteTodo: async (req, res) => {
    console.log(req.body.todoIdFromJSFile);
    try {
      await Todo.findOneAndDelete({ _id: req.body.todoIdFromJSFile });
      console.log("Deleted Todo");
      res.json("Deleted It");
    } catch (err) {
      console.log(err);
    }
  },
};

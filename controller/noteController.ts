var store = require("../services/noteStore");

module.exports = {
  showIndex: function (req, res) {
    const sort: string = req.query.sort || req.cookies.sort || "duedate";
    let order: number = req.query.order || req.cookies.order || 1;
    const tempFilter: string = req.query.filter || req.cookies.filter;
    const theme: string = req.query.style || req.cookies.style || "light";

    let filter: boolean = tempFilter === "true";

    if (req.query.sort === req.cookies.sort) {
      order = order == 1 ? -1 : 1;
    } else {
      order = 1;
    }

    res.cookie("sort", sort);
    res.cookie("order", order);
    res.cookie("filter", filter);
    res.cookie("style", theme);

    const style: string = theme === "light" ? "dark" : "light";

    store.all(sort, order, filter, function (err, data) {
      res.render("index", {
        list: data,
        filter: filter,
        theme: theme,
        style: style,
      });
    });
  },

  showNew: function (req, res) {
    const theme = req.cookies.style;
    res.render("createview", {
      item: { createdate: new Date().toISOString().substring(0, 10) },
      theme: theme,
    });
  },

  createNew: function (req, res) {
    store.add(req.body, function (err, data) {
      res.redirect("/");
    });
  },

  showEdit: function (req, res) {
    const theme = req.cookies.style;
    store.get(req.params.id, function (err, data) {
      res.render("editview", { item: data, theme: theme });
    });
  },

  updateEdit: function (req, res) {
    store.update(req.params.id, req.body, function (err, data) {
      res.redirect("/");
    });
  },
};

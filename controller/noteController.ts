var store = require("../services/noteStore");

class Options {
  sort: string;
  filter: boolean;
  order: number;
  theme;

  constructor() {
    this.sort = "duedate";
    this.filter = false;
    this.order = 1;
    this.theme = "light";
  }

  setOptions(req) {
    this.sort = req.query.sort || req.cookies.sort || "duedate";
    this.filter =
      (req.query.filter || req.cookies.filter || "false") === "true";
    this.theme = req.query.style || req.cookies.style || "light";
  }

  setCookies(res) {
    res.cookie("sort", this.sort);
    res.cookie("order", this.order);
    res.cookie("filter", this.filter);
    res.cookie("style", this.theme);
  }
}

module.exports = {
  showIndex: function (req, res) {
    let options: Options = new Options();

    if (Object.keys(req.cookies).length > 1) {
      if (Object.keys(req.query).length < 1) {
        options.setOptions(req);
        options.setCookies(res);

        options.theme = options.theme === "light" ? "true" : "false";

        store.all(options.sort, options.order, options.filter, function (
          err,
          data
        ) {
          res.render("index", {
            list: data,
            options,
          });
        });
      } else {
        let order = options.order;
        if (req.query.sort === req.cookies.sort) {
          order = order == 1 ? -1 : 1;
        } else {
          order = 1;
        }

        options.setOptions(req);
        options.order = order;
        options.setCookies(res);
        res.redirect("/");
      }
    } else {
      options.setOptions(req);
      options.setCookies(res);
      res.redirect("/");
    }
  },

  showNew: function (req, res) {
    let options: Options = new Options();
    options.setOptions(req);
    res.render("createview", {
      options,
    });
  },

  createNew: function (req, res) {
    store.add(req.body, function (err, data) {
      res.redirect("/");
    });
  },

  showEdit: function (req, res) {
    let options: Options = new Options();
    options.setOptions(req);
    store.get(req.params.id, function (err, data) {
      res.render("editview", { item: data, options });
    });
  },

  updateEdit: function (req, res) {
    store.update(req.params.id, req.body, function (err, data) {
      res.redirect("/");
    });
  },
};

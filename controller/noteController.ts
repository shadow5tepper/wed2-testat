var store = require("../services/noteStore");

class Options {
  sort: string;
  filter: boolean;
  order: boolean;
  theme: boolean;

  constructor() {
    this.sort = "duedate";
    this.filter = false;
    this.order = true;
    this.theme = true;
  }

  setOptions(req) {
    this.sort = req.query.sort || req.cookies.sort || "duedate";
    this.filter =
      (req.query.filter || req.cookies.filter || "false") === "true";
    this.theme = (req.query.style || req.cookies.style || "true") === "true";
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

    options.order = req.cookies.order === "true";
    if (Object.keys(req.cookies).length > 1) {
      if (Object.keys(req.query).length < 1) {
        options.setOptions(req);
        options.setCookies(res);

        store.all(
          options.sort,
          options.order ? 1 : -1,
          options.filter,
          function (err, data) {
            res.render("index", {
              list: data,
              options,
            });
          }
        );
      } else {
        options.order =
          req.query.sort !== req.cookies.sort
            ? true
            : !(req.cookies.order === "true");
        options.setOptions(req);
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
